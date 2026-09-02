import { TextField } from "@/components/app/form-field";
import { useCareStore } from "@/features/pets/hooks/use-care-store";
import { phoneSchema } from "@/lib/validation";

function phoneError(value: string): string | undefined {
  const result = phoneSchema.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

export function EmergencyStep({ petId }: { petId: string }) {
  const { emergencyFor, saveEmergency, vetFor, saveVet } = useCareStore();
  const emergency = emergencyFor(petId);
  const vet = vetFor(petId);

  return (
    <div className="space-y-4">
      <div className="space-y-5 rounded-3xl border border-border bg-card p-5">
        <h3 className="font-display text-lg font-semibold">Emergency contacts</h3>
        <TextField
          label="Primary contact name"
          optional
          value={emergency?.primaryName ?? ""}
          onChange={(primaryName) => saveEmergency(petId, { primaryName })}
        />
        <TextField
          label="Primary contact phone"
          optional
          type="tel"
          value={emergency?.primaryPhone ?? ""}
          error={phoneError(emergency?.primaryPhone ?? "")}
          onChange={(primaryPhone) => saveEmergency(petId, { primaryPhone })}
        />
        <TextField
          label="Secondary contact name"
          optional
          value={emergency?.secondaryName ?? ""}
          onChange={(secondaryName) => saveEmergency(petId, { secondaryName })}
        />
        <TextField
          label="Secondary contact phone"
          optional
          type="tel"
          value={emergency?.secondaryPhone ?? ""}
          error={phoneError(emergency?.secondaryPhone ?? "")}
          onChange={(secondaryPhone) => saveEmergency(petId, { secondaryPhone })}
        />
        <TextField
          label="Special emergency instructions"
          optional
          multiline
          value={emergency?.specialInstructions ?? ""}
          onChange={(specialInstructions) => saveEmergency(petId, { specialInstructions })}
        />
      </div>

      <div className="space-y-5 rounded-3xl border border-border bg-card p-5">
        <h3 className="font-display text-lg font-semibold">Veterinarian</h3>
        <TextField
          label="Veterinarian name"
          optional
          value={vet?.vetName ?? ""}
          onChange={(vetName) => saveVet(petId, { vetName })}
        />
        <TextField
          label="Clinic"
          optional
          value={vet?.clinicName ?? ""}
          onChange={(clinicName) => saveVet(petId, { clinicName })}
        />
        <TextField
          label="Phone"
          optional
          type="tel"
          value={vet?.phone ?? ""}
          error={phoneError(vet?.phone ?? "")}
          onChange={(phone) => saveVet(petId, { phone })}
        />
        <TextField
          label="Address"
          optional
          multiline
          rows={2}
          value={vet?.address ?? ""}
          onChange={(address) => saveVet(petId, { address })}
        />
      </div>
    </div>
  );
}
