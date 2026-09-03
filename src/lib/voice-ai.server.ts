/**
 * Server-only helpers for the voice-fill feature.
 * All Lovable AI Gateway calls happen here; the API key never leaves the server.
 */

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const TRANSCRIBE_MODEL = "openai/gpt-4o-transcribe";
const PARSE_MODEL = "openai/gpt-5.6-sol";

export class VoiceServiceError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "VoiceServiceError";
    this.status = status;
  }
}

function apiKey(): string {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new VoiceServiceError("Voice fill isn't configured on this site.", 500);
  return key;
}

function friendly(status: number, fallback: string): VoiceServiceError {
  if (status === 429 || status >= 500) {
    return new VoiceServiceError(
      "The voice service is busy right now. Please try again in a moment.",
      status,
    );
  }
  if (status === 402 || status === 403 || status === 404) {
    return new VoiceServiceError(
      "Voice fill is temporarily unavailable — you can still type the details.",
      status,
    );
  }
  return new VoiceServiceError(fallback, status);
}

/** Transcribes a complete WAV recording. Audio is never stored. */
export async function transcribeWav(bytes: Uint8Array): Promise<string> {
  if (bytes.byteLength < 2048) {
    throw new VoiceServiceError("That recording was empty — please try again.", 400);
  }
  if (bytes.byteLength > 20 * 1024 * 1024) {
    throw new VoiceServiceError("That recording is too long. Try a shorter one.", 413);
  }

  const form = new FormData();
  form.append("model", TRANSCRIBE_MODEL);
  form.append("file", new Blob([bytes as BlobPart], { type: "audio/wav" }), "recording.wav");
  form.append("language", "en");

  const response = await fetch(`${GATEWAY}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey()}` },
    body: form,
  });

  if (!response.ok) {
    throw friendly(
      response.status,
      "We couldn't understand that recording. Please try again or type the details.",
    );
  }

  const result = (await response.json()) as { text?: string };
  const text = (result.text ?? "").trim();
  if (!text) {
    throw new VoiceServiceError("We didn't hear anything in that recording.", 400);
  }
  return text;
}

const nullableString = { type: ["string", "null"] } as const;

function objectSchema(properties: Record<string, unknown>) {
  return {
    type: "object",
    additionalProperties: false,
    required: Object.keys(properties),
    properties,
  };
}

const CARE_SCHEMA = objectSchema({
  pet: objectSchema({
    name: nullableString,
    species: { type: ["string", "null"], enum: ["Dog", "Cat", "Bird", "Rabbit", "Other", null] },
    breed: nullableString,
    sex: { type: ["string", "null"], enum: ["Male", "Female", "Unknown", null] },
    approximateAge: nullableString,
    weight: nullableString,
    personality: nullableString,
    thingsToKnow: nullableString,
  }),
  feeding: objectSchema({
    foodName: nullableString,
    amount: nullableString,
    times: nullableString,
    mealsPerDay: nullableString,
    treats: nullableString,
    foodsToAvoid: nullableString,
    notes: nullableString,
  }),
  routine: objectSchema({
    walkSchedule: nullableString,
    playtime: nullableString,
    sleepRoutine: nullableString,
    bathroomRoutine: nullableString,
    crateInstructions: nullableString,
    indoorOutdoorNotes: nullableString,
    other: nullableString,
  }),
  medications: {
    type: "array",
    items: objectSchema({
      name: { type: "string" },
      dosage: nullableString,
      time: nullableString,
      frequency: nullableString,
      notes: nullableString,
    }),
  },
  emergency: objectSchema({
    primaryName: nullableString,
    primaryPhone: nullableString,
    secondaryName: nullableString,
    secondaryPhone: nullableString,
    specialInstructions: nullableString,
  }),
  veterinarian: objectSchema({
    vetName: nullableString,
    clinicName: nullableString,
    phone: nullableString,
    address: nullableString,
  }),
});

const SYSTEM_PROMPT = `You turn a pet owner's spoken description into structured care-card fields.

Rules:
- Extract only what the speaker actually said. If a detail was not mentioned, return null (or an empty medications array).
- Never invent, infer, or "helpfully" complete names, phone numbers, dosages, ages, or weights.
- Copy medication names and dosages exactly as spoken; do not convert units or suggest doses.
- Never add diagnoses, medical advice, or veterinary recommendations.
- Keep the speaker's wording where possible, lightly cleaned up (proper capitalisation, no filler words).
- Times may stay conversational, e.g. "7am and 6pm".
- The input is English.`;

/** Parses an English transcript into care-card fields. Streaming per gateway rules. */
export async function parseTranscript(transcript: string): Promise<unknown> {
  const response = await fetch(`${GATEWAY}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey()}`,
      "Lovable-API-Key": apiKey(),
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: PARSE_MODEL,
      stream: true,
      instructions: SYSTEM_PROMPT,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Transcript of the owner describing their pet:\n\n${transcript}`,
            },
          ],
        },
      ],
      reasoning: { effort: "low", summary: "auto" },
      text: {
        format: {
          type: "json_schema",
          name: "care_details",
          strict: true,
          schema: CARE_SCHEMA,
        },
      },
    }),
  });

  if (!response.ok || !response.body) {
    throw friendly(
      response.status || 500,
      "We couldn't read those notes. Please try again or type the details.",
    );
  }

  let text = "";
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const event = JSON.parse(payload) as {
          type?: string;
          delta?: string;
          response?: { output_text?: string };
        };
        if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
          text += event.delta;
        } else if (event.type === "response.completed" && event.response?.output_text) {
          if (!text) text = event.response.output_text;
        }
      } catch {
        /* ignore malformed keepalive lines */
      }
    }
  }

  const trimmed = text.trim();
  if (!trimmed) {
    throw new VoiceServiceError(
      "We couldn't pull any details out of that. Please try again or type them in.",
      502,
    );
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new VoiceServiceError(
      "We couldn't read those notes. Please try again or type the details.",
      502,
    );
  }
}
