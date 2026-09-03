import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

const str = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const oneOf = <T extends string>(value: unknown, allowed: readonly T[]): T | null => {
  const text = str(value);
  return text && (allowed as readonly string[]).includes(text) ? (text as T) : null;
};

/** Normalizes the model output so the UI always receives a complete shape. */
function normalize(raw: unknown): ParsedCareDetails {
  const source = (raw ?? {}) as Record<string, Record<string, unknown> | undefined>;
  const pick = <K extends keyof ParsedCareDetails>(
    group: K,
    keys: readonly string[],
  ): Record<string, string | null> => {
    const from = source[group as string] ?? {};
    return Object.fromEntries(keys.map((key) => [key, str(from[key])]));
  };

  const medsRaw = Array.isArray((source["medications"] as unknown) ?? [])
    ? ((source["medications"] as unknown) as Array<Record<string, unknown>>)
    : [];

  return {
    pet: {
      ...(pick("pet", [
        "name",
        "breed",
        "approximateAge",
        "weight",
        "personality",
        "thingsToKnow",
      ]) as ParsedCareDetails["pet"]),
      species: oneOf(source["pet"]?.["species"], ["Dog", "Cat", "Bird", "Rabbit", "Other"] as const),
      sex: oneOf(source["pet"]?.["sex"], ["Male", "Female", "Unknown"] as const),
    },
    feeding: pick("feeding", [
      "foodName",
      "amount",
      "times",
      "mealsPerDay",
      "treats",
      "foodsToAvoid",
      "notes",
    ]) as ParsedCareDetails["feeding"],
    routine: pick("routine", [
      "walkSchedule",
      "playtime",
      "sleepRoutine",
      "bathroomRoutine",
      "crateInstructions",
      "indoorOutdoorNotes",
      "other",
    ]) as ParsedCareDetails["routine"],
    medications: medsRaw
      .map((med) => ({
        name: str(med["name"]) ?? "",
        dosage: str(med["dosage"]),
        time: str(med["time"]),
        frequency: str(med["frequency"]),
        notes: str(med["notes"]),
      }))
      .filter((med) => med.name.length > 0),
    emergency: pick("emergency", [
      "primaryName",
      "primaryPhone",
      "secondaryName",
      "secondaryPhone",
      "specialInstructions",
    ]) as ParsedCareDetails["emergency"],
    veterinarian: pick("veterinarian", [
      "vetName",
      "clinicName",
      "phone",
      "address",
    ]) as ParsedCareDetails["veterinarian"],
  };
}

/** Turns a spoken description into care-card fields for user review. */
export const parseCareTranscript = createServerFn({ method: "POST" })
  .inputValidator((data: { transcript: string }) => parseInput.parse(data))
  .handler(async ({ data }): Promise<ParsedCareDetails> => {
    const { parseTranscript } = await import("@/lib/voice-ai.server");
    const raw = await parseTranscript(data.transcript);
    return { ...EMPTY_PARSED, ...normalize(raw) };
  });
