import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { normalizeParsedDetails } from "./voice-normalize";
import { EMPTY_PARSED, type ParsedCareDetails } from "./voice-types";

const transcribeInput = z.object({
  /** base64-encoded complete WAV file (16 kHz mono). */
  audioBase64: z.string().min(100, "That recording was empty — please try again."),
});

const parseInput = z.object({
  transcript: z.string().trim().min(4, "We didn't hear enough to fill anything in."),
});

function decodeBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Fallback transcription for browsers without built-in dictation. */
export const transcribeRecording = createServerFn({ method: "POST" })
  .inputValidator((data: { audioBase64: string }) => transcribeInput.parse(data))
  .handler(async ({ data }): Promise<{ transcript: string }> => {
    const { transcribeWav } = await import("@/lib/voice-ai.server");
    const transcript = await transcribeWav(decodeBase64(data.audioBase64));
    return { transcript };
  });

/** Turns a spoken description into care-card fields for user review. */
export const parseCareTranscript = createServerFn({ method: "POST" })
  .inputValidator((data: { transcript: string }) => parseInput.parse(data))
  .handler(async ({ data }): Promise<ParsedCareDetails> => {
    const { parseTranscript } = await import("@/lib/voice-ai.server");
    const raw = await parseTranscript(data.transcript);
    return { ...EMPTY_PARSED, ...normalizeParsedDetails(raw) };
  });
