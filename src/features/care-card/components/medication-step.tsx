import { Info, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/app/empty-state";
import { TextField } from "@/components/app/form-field";
import { Button } from "@/components/ui/button";
import { useCareStore } from "@/features/pets/hooks/use-care-store";
import { PaywallDialog } from "@/features/premium/components/paywall-dialog";
import { firstError, medicationSchema } from "@/lib/validation";

export const MEDICATION_DISCLAIMER =
  "The app does not provide medical advice or recommend medications or dosages. It only helps owners organize instructions they provide.";

export function MedicationStep({ petId }: { petId: string }) {
  const { medicationsFor, saveMedication, deleteMedication, isPremium } = useCareStore();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const medications = medicationsFor(petId);

  const validate = (id: string, values: { name: string; startDate?: string | undefined; endDate?: string | undefined }) => {
    try {
      medicationSchema.parse(values);
      setErrors((e) => ({ ...e, [id]: "" }));
    } catch (error) {
      setErrors((e) => ({ ...e, [id]: firstError(error) }));
    }
  };

  const add = () => {
    if (!isPremium) {
      setPaywallOpen(true);
      return;
    }
    saveMedication({ petId, name: "" });
  };

  return (
    <div className="space-y-4">
      <PaywallDialog open={paywallOpen} onOpenChange={setPaywallOpen} />

      <p className="flex gap-3 rounded-2xl bg-secondary/70 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        {MEDICATION_DISCLAIMER}
      </p>

      {medications.length === 0 ? (
        <EmptyState
          title="No medications added"
          description="Add any existing medication instructions your caregiver needs."
          action={
            <Button className="h-11 rounded-xl" onClick={add}>
              <Plus className="size-4" aria-hidden="true" /> Add medication
            </Button>
          }
        />
      ) : (
        <>
          {medications.map((med, index) => (
            <div key={med.id} className="space-y-4 rounded-3xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">
                  {med.name || `Medication ${index + 1}`}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-muted-foreground"
                  aria-label={`Remove medication ${index + 1}`}
                  onClick={() => deleteMedication(med.id)}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
              <TextField
                label="Name"
                value={med.name}
                error={errors[med.id] || undefined}
                onChange={(name) => {
                  saveMedication({ ...med, name });
                  validate(med.id, { name, startDate: med.startDate, endDate: med.endDate });
                }}
              />
              <TextField
                label="Dosage / instructions"
                optional
                value={med.dosage ?? ""}
                onChange={(dosage) => saveMedication({ ...med, dosage })}
                placeholder="As written on the label"
              />
              <TextField
                label="Time"
                optional
                type="time"
                value={med.time ?? ""}
                onChange={(time) => saveMedication({ ...med, time })}
              />
              <TextField
                label="Frequency"
                optional
                value={med.frequency ?? ""}
                onChange={(frequency) => saveMedication({ ...med, frequency })}
                placeholder="e.g. Twice daily"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Start date"
                  optional
                  type="date"
                  value={med.startDate ?? ""}
                  onChange={(startDate) => {
                    saveMedication({ ...med, startDate });
                    validate(med.id, { name: med.name, startDate, endDate: med.endDate });
                  }}
                />
                <TextField
                  label="End date"
                  optional
                  type="date"
                  value={med.endDate ?? ""}
                  onChange={(endDate) => {
                    saveMedication({ ...med, endDate });
                    validate(med.id, { name: med.name, startDate: med.startDate, endDate });
                  }}
                />
              </div>
              <TextField
                label="Notes"
                optional
                multiline
                value={med.notes ?? ""}
                onChange={(notes) => saveMedication({ ...med, notes })}
              />
            </div>
          ))}
          <Button
            variant="outline"
            className="h-12 w-full rounded-xl"
            onClick={() => {
              if (medications.some((m) => !m.name.trim())) {
                toast.error("Please name the medication you already added first.");
                return;
              }
              add();
            }}
          >
            <Plus className="size-4" aria-hidden="true" /> Add medication
          </Button>
        </>
      )}
    </div>
  );
}
