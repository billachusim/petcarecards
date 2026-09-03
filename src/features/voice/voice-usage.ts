import { readJson, writeJson } from "@/lib/storage/local-store";

const KEY = "pcc.voice-fills";
export const FREE_VOICE_FILLS = 2;

interface VoiceUsage {
  used: number;
}

export function voiceFillsUsed(): number {
  return readJson<VoiceUsage>(KEY, { used: 0 }).used;
}

export function voiceFillsLeft(): number {
  return Math.max(0, FREE_VOICE_FILLS - voiceFillsUsed());
}

export function recordVoiceFill(): void {
  writeJson<VoiceUsage>(KEY, { used: voiceFillsUsed() + 1 });
}
