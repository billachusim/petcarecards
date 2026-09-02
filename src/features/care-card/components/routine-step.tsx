import { TextField } from "@/components/app/form-field";
import { useCareStore } from "@/features/pets/hooks/use-care-store";

const FIELDS = [
  { key: "walkSchedule", label: "Walk schedule", placeholder: "e.g. 8 am, 1 pm, 7 pm" },
  { key: "playtime", label: "Playtime" },
  { key: "sleepRoutine", label: "Sleep routine" },
  { key: "bathroomRoutine", label: "Bathroom routine" },
  { key: "crateInstructions", label: "Crate instructions" },
  { key: "indoorOutdoorNotes", label: "Indoor / outdoor notes" },
  { key: "other", label: "Anything else" },
] as const;

export function RoutineStep({ petId }: { petId: string }) {
  const { routineFor, saveRoutine } = useCareStore();
  const routine = routineFor(petId);

  return (
    <div className="space-y-5 rounded-3xl border border-border bg-card p-5">
      {FIELDS.map((field) => (
        <TextField
          key={field.key}
          label={field.label}
          optional
          multiline
          rows={2}
          placeholder={"placeholder" in field ? field.placeholder : undefined}
          value={(routine?.[field.key] as string | undefined) ?? ""}
          onChange={(value) => saveRoutine(petId, { [field.key]: value })}
        />
      ))}
    </div>
  );
}
