import { useServerFn } from "@tanstack/react-start";
import { Loader2, Mic, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useSpeechRecognition } from "./use-speech-recognition";
import { parseCareTranscript, transcribeRecording } from "./voice.functions";
import { EMPTY_PARSED, type ParsedCareDetails } from "./voice-types";
import { FREE_VOICE_FILLS, recordVoiceFill, voiceFillsLeft } from "./voice-usage";
import { WavRecorder } from "./wav-recorder";

interface VoiceFillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** True once the lifetime unlock has been verified. */
  isPremium: boolean;
  /** Called with the reviewed details after the user confirms. */
  onConfirm: (details: ParsedCareDetails) => void;
}

type Stage = "record" | "working" | "review";

const PROMPT_HINT =
  "Try: “This is Milo, a four-year-old beagle. He eats one cup of dry food at 7am and 6pm, walks twice a day, takes half a tablet of Apoquel each morning, and our vet is Green Lane Clinic on 555 0134.”";

function friendly(error: unknown): string {
  const message = error instanceof Error ? error.message.trim() : "";
  if (message && message.length < 180 && !message.startsWith("{")) return message;
  return "Something went wrong. Please try again, or type the details instead.";
}

export function VoiceFillDialog({
  open,
  onOpenChange,
  isPremium,
  onConfirm,
}: VoiceFillDialogProps) {
  const speech = useSpeechRecognition();
  const transcribe = useServerFn(transcribeRecording);
  const parse = useServerFn(parseCareTranscript);

  const [stage, setStage] = useState<Stage>("record");
  const [transcript, setTranscript] = useState("");
  const [details, setDetails] = useState<ParsedCareDetails>(EMPTY_PARSED);
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<WavRecorder | null>(null);

  const liveText = `${speech.finalTranscript} ${speech.interimTranscript}`.trim();

  useEffect(() => {
    if (!open) {
      recorderRef.current?.cancel();
      recorderRef.current = null;
      setStage("record");
      setTranscript("");
      setDetails(EMPTY_PARSED);
      setRecording(false);
      speech.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const startRecording = useCallback(async () => {
    if (speech.supported) {
      speech.reset();
      speech.start();
      setRecording(true);
      return;
    }
    try {
      const recorder = new WavRecorder();
      await recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      toast.error("Microphone access is needed to speak. You can still type the details.");
    }
  }, [speech]);

  const runParse = useCallback(
    async (text: string) => {
      setStage("working");
      try {
        const parsed = await parse({ data: { transcript: text } });
        setDetails(parsed);
        setStage("review");
      } catch (error) {
        toast.error(friendly(error));
        setStage("record");
      }
    },
    [parse],
  );

  const stopRecording = useCallback(async () => {
    setRecording(false);
    if (speech.supported) {
      speech.stop();
      const text = `${speech.finalTranscript} ${speech.interimTranscript}`.trim();
      setTranscript(text);
      if (text.length < 8) {
        toast.error("We didn't hear enough. Try again, or type the details instead.");
        return;
      }
      await runParse(text);
      return;
    }

    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (!recorder) return;
    setStage("working");
    try {
      const audioBase64 = await recorder.stop();
      const result = await transcribe({ data: { audioBase64 } });
      setTranscript(result.transcript);
      await runParse(result.transcript);
    } catch (error) {
      toast.error(friendly(error));
      setStage("record");
    }
  }, [runParse, speech, transcribe]);

  const confirm = () => {
    if (!isPremium) recordVoiceFill();
    onConfirm(details);
    onOpenChange(false);
  };

  const setPet = (key: keyof ParsedCareDetails["pet"], value: string) =>
    setDetails((current) => ({
      ...current,
      pet: { ...current.pet, [key]: value ? value : null },
    }));

  const remaining = isPremium ? Infinity : voiceFillsLeft();

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Talk about your pet</DialogTitle>
            <DialogDescription>
              Say everything a caregiver should know. Nothing is saved until you check it.
            </DialogDescription>
          </DialogHeader>

          {stage === "record" && (
            <div className="space-y-4">
              <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                {PROMPT_HINT}
              </p>

              <div
                className="min-h-24 rounded-2xl border border-border p-4 text-sm"
                aria-live="polite"
                aria-label="Live transcript"
              >
                {liveText || transcript || (
                  <span className="text-muted-foreground">
                    {recording ? "Listening…" : "Your words appear here."}
                  </span>
                )}
              </div>

              {speech.error && <p className="text-sm text-destructive">{speech.error}</p>}

              <Button
                type="button"
                size="lg"
                className="h-13 w-full rounded-2xl"
                onClick={() => void (recording ? stopRecording() : startRecording())}
              >
                {recording ? (
                  <>
                    <Square className="size-4" aria-hidden="true" /> Done — fill in my card
                  </>
                ) : (
                  <>
                    <Mic className="size-4" aria-hidden="true" /> Start speaking
                  </>
                )}
              </Button>

              {!isPremium && (
                <p className="text-center text-xs text-muted-foreground">
                  {remaining} of {FREE_VOICE_FILLS} free voice fills left.
                </p>
              )}
            </div>
          )}

          {stage === "working" && (
            <div className="flex flex-col items-center gap-3 py-10 text-sm text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
              <p aria-live="polite">Writing up what you said…</p>
            </div>
          )}

          {stage === "review" && (
            <div className="space-y-4">
              <p className="rounded-2xl bg-accent/40 p-3 text-sm">
                Please check everything — especially medication names and doses.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="voice-name">Name</Label>
                  <Input
                    id="voice-name"
                    className="mt-1 rounded-xl"
                    value={details.pet.name ?? ""}
                    onChange={(event) => setPet("name", event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="voice-breed">Breed</Label>
                  <Input
                    id="voice-breed"
                    className="mt-1 rounded-xl"
                    value={details.pet.breed ?? ""}
                    onChange={(event) => setPet("breed", event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="voice-age">Age</Label>
                  <Input
                    id="voice-age"
                    className="mt-1 rounded-xl"
                    value={details.pet.approximateAge ?? ""}
                    onChange={(event) => setPet("approximateAge", event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="voice-weight">Weight</Label>
                  <Input
                    id="voice-weight"
                    className="mt-1 rounded-xl"
                    value={details.pet.weight ?? ""}
                    onChange={(event) => setPet("weight", event.target.value)}
                  />
                </div>
              </div>

              <ReviewSummary details={details} />

              <div>
                <Label htmlFor="voice-transcript">What we heard</Label>
                <Textarea
                  id="voice-transcript"
                  className="mt-1 rounded-xl"
                  rows={3}
                  value={transcript}
                  onChange={(event) => setTranscript(event.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-2 rounded-xl"
                  onClick={() => void runParse(transcript)}
                >
                  Read it again
                </Button>
              </div>
            </div>
          )}

          {stage === "review" && (
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                type="button"
                size="lg"
                className="h-12 w-full rounded-xl"
                disabled={!details.pet.name}
                onClick={confirm}
              >
                Use these details
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full rounded-xl"
                onClick={() => setStage("record")}
              >
                Start over
              </Button>
              {!details.pet.name && (
                <p className="text-center text-xs text-muted-foreground">
                  Add your pet&apos;s name to continue.
                </p>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

    </>
  );
}

function ReviewSummary({ details }: { details: ParsedCareDetails }) {
  const rows: Array<[string, string]> = [];
  const push = (label: string, value: string | null) => {
    if (value) rows.push([label, value]);
  };

  push("Food", details.feeding.foodName);
  push("Amount", details.feeding.amount);
  push("Meal times", details.feeding.times);
  push("Treats", details.feeding.treats);
  push("Avoid", details.feeding.foodsToAvoid);
  push("Walks", details.routine.walkSchedule);
  push("Playtime", details.routine.playtime);
  push("Sleep", details.routine.sleepRoutine);
  push("Bathroom", details.routine.bathroomRoutine);
  push("Emergency contact", details.emergency.primaryName);
  push("Emergency phone", details.emergency.primaryPhone);
  push("Vet", details.veterinarian.vetName ?? details.veterinarian.clinicName);
  push("Vet phone", details.veterinarian.phone);
  push("Personality", details.pet.personality);
  push("Good to know", details.pet.thingsToKnow);

  return (
    <div className="space-y-3">
      {details.medications.length > 0 && (
        <div className="rounded-2xl border border-border p-4">
          <p className="text-sm font-medium">Medication</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {details.medications.map((med) => (
              <li key={med.name}>
                {med.name}
                {med.dosage ? ` — ${med.dosage}` : ""}
                {med.time ? ` · ${med.time}` : ""}
                {med.frequency ? ` · ${med.frequency}` : ""}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            Double-check doses against the label. We never suggest or change a dose.
          </p>
        </div>
      )}

      {rows.length > 0 && (
        <dl className="rounded-2xl border border-border p-4 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex gap-3 py-1">
              <dt className="w-32 shrink-0 text-muted-foreground">{label}</dt>
              <dd className="min-w-0 flex-1">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
