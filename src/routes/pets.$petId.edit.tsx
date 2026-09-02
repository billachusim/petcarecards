import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AboutStep } from "@/features/care-card/components/about-step";
import { EmergencyStep } from "@/features/care-card/components/emergency-step";
import { FeedingStep } from "@/features/care-card/components/feeding-step";
import { MedicationStep } from "@/features/care-card/components/medication-step";
import { RoutineStep } from "@/features/care-card/components/routine-step";
import { useCareStore } from "@/features/pets/hooks/use-care-store";

export const Route = createFileRoute("/pets/$petId/edit")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Edit care details — Pet Care Card" },
      {
        name: "description",
        content:
          "Fill in feeding, routine, medication and emergency details step by step. Every step is optional and saves as you type.",
      },
      { property: "og:title", content: "Edit care details — Pet Care Card" },
      { property: "og:description", content: "Build your pet's care card step by step." },
    ],
  }),
  component: EditPet,
});

const STEPS = ["Pet", "Feeding", "Routine", "Medication", "Emergency", "Done"] as const;

function EditPet() {
  const { petId } = Route.useParams();
  const navigate = useNavigate();
  const { ready, getPet } = useCareStore();
  const [step, setStep] = useState(0);
  const pet = getPet(petId);

  if (!ready) {
    return (
      <AppShell>
        <div className="h-64 animate-pulse rounded-3xl bg-card" aria-label="Loading" />
      </AppShell>
    );
  }

  if (!pet) {
    return (
      <AppShell>
        <h1 className="font-display text-2xl font-semibold">We couldn&apos;t find that pet.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The card may have been deleted on this device.
        </p>
        <Button className="mt-6 rounded-xl" onClick={() => void navigate({ to: "/" })}>
          Go home
        </Button>
      </AppShell>
    );
  }

  const isLast = step === STEPS.length - 1;

  return (
    <AppShell>
      <Button
        variant="ghost"
        className="mb-4 -ml-2 rounded-xl"
        onClick={() => void navigate({ to: "/" })}
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back
      </Button>

      <div className="mb-6">
        <p className="text-sm font-medium text-primary">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold">{pet.name}&apos;s care card</h1>
        <Progress
          value={((step + 1) / STEPS.length) * 100}
          className="mt-4 h-2"
          aria-label="Care card progress"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Everything saves automatically. Skip anything you don&apos;t need.
        </p>
      </div>

      {step === 0 && <AboutStep petId={petId} />}
      {step === 1 && <FeedingStep petId={petId} />}
      {step === 2 && <RoutineStep petId={petId} />}
      {step === 3 && <MedicationStep petId={petId} />}
      {step === 4 && <EmergencyStep petId={petId} />}
      {step === 5 && (
        <div className="rounded-3xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Check className="size-7" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-semibold">
            {pet.name}&apos;s card is ready.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You can come back and add more at any time.
          </p>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <Button
            variant="outline"
            className="h-13 flex-1 rounded-2xl py-3.5"
            onClick={() => setStep(step - 1)}
          >
            Back
          </Button>
        )}
        <Button
          size="lg"
          className="h-14 flex-1 rounded-2xl text-base"
          onClick={() => {
            if (isLast) {
              toast.success("Care card saved.");
              void navigate({ to: "/care/$petId", params: { petId } });
            } else {
              setStep(step + 1);
            }
          }}
        >
          {isLast ? "View Care Card" : "Continue"}
        </Button>
      </div>

      {!isLast && (
        <Button
          variant="ghost"
          className="mt-3 w-full rounded-xl text-muted-foreground"
          onClick={() => void navigate({ to: "/care/$petId", params: { petId } })}
        >
          Save and finish later
        </Button>
      )}
    </AppShell>
  );
}
