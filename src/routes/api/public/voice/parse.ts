import { createFileRoute } from "@tanstack/react-router";

/**
 * Voice fill for the Pet Care Card mobile apps (Android and iOS).
 *
 * The phone turns speech into text on the device, then posts the transcript
 * here. We run the same parser the website uses (same prompt, same schema,
 * same clean-up), so a voice fill gives the same result everywhere and the
 * AI key never leaves the server. Audio is never sent and nothing is stored.
 *
 * Request:  POST { "transcript": "This is Milo, a four-year-old beagle..." }
 * Response: 200 ParsedCareDetails JSON, or { "error": "friendly message" }.
 */
const MIN_LENGTH = 4;
const MAX_LENGTH = 6000;

// Light per-instance throttle so a single client can't run up AI costs.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function throttled(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function error(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

export const Route = createFileRoute("/api/public/voice/parse")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const client =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "unknown";
        if (throttled(client)) {
          return error("Too many voice fills in a row. Please wait a minute and try again.", 429);
        }

        let transcript = "";
        try {
          const body = (await request.json()) as { transcript?: unknown } | null;
          transcript = typeof body?.transcript === "string" ? body.transcript.trim() : "";
        } catch {
          return error('Send JSON like { "transcript": "..." }.', 400);
        }

        if (transcript.length < MIN_LENGTH) {
          return error("We didn't hear enough to fill anything in.", 400);
        }
        if (transcript.length > MAX_LENGTH) {
          return error("That was a long one. Try a shorter description.", 413);
        }

        try {
          const [{ parseTranscript }, { normalizeParsedDetails }, { EMPTY_PARSED }] =
            await Promise.all([
              import("@/lib/voice-ai.server"),
              import("@/features/voice/voice-normalize"),
              import("@/features/voice/voice-types"),
            ]);
          const raw = await parseTranscript(transcript);
          return Response.json({ ...EMPTY_PARSED, ...normalizeParsedDetails(raw) });
        } catch (caught) {
          const status =
            typeof (caught as { status?: unknown })?.status === "number"
              ? (caught as { status: number }).status
              : 500;
          const message =
            caught instanceof Error && caught.message.length < 180
              ? caught.message
              : "We couldn't read those notes. Please try again or type the details.";
          console.error("Mobile voice parse failed:", caught);
          return error(message, status >= 400 && status < 600 ? status : 500);
        }
      },
    },
  },
});
