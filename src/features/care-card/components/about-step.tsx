import { TextField } from "@/components/app/form-field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhotoPicker } from "@/features/pets/components/photo-picker";
import { useCareStore } from "@/features/pets/hooks/use-care-store";
import type { Sex, Species } from "@/features/pets/models";

const SPECIES: Species[] = ["Dog", "Cat", "Bird", "Rabbit", "Other"];
const SEXES: Sex[] = ["Male", "Female", "Unknown"];

export function AboutStep({ petId }: { petId: string }) {
  const { getPet, updatePet } = useCareStore();
  const pet = getPet(petId);
  if (!pet) return null;

  return (
    <div className="space-y-5">
      <PhotoPicker
        value={pet.photoDataUrl}
        onChange={(photoDataUrl) => updatePet(petId, { photoDataUrl })}
      />
      <TextField label="Name" value={pet.name} onChange={(name) => updatePet(petId, { name })} />

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Species</Label>
        <Select
          value={pet.species ?? ""}
          onValueChange={(v) => updatePet(petId, { species: v as Species })}
        >
          <SelectTrigger className="h-12 w-full rounded-xl bg-card">
            <SelectValue placeholder="Choose a species" />
          </SelectTrigger>
          <SelectContent>
            {SPECIES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TextField
        label="Breed"
        optional
        value={pet.breed ?? ""}
        onChange={(breed) => updatePet(petId, { breed })}
      />

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Sex</Label>
        <Select value={pet.sex ?? ""} onValueChange={(v) => updatePet(petId, { sex: v as Sex })}>
          <SelectTrigger className="h-12 w-full rounded-xl bg-card">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            {SEXES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TextField
        label="Date of birth"
        optional
        type="date"
        value={pet.dateOfBirth ?? ""}
        onChange={(dateOfBirth) => updatePet(petId, { dateOfBirth })}
      />
      <TextField
        label="Approximate age"
        optional
        value={pet.approximateAge ?? ""}
        onChange={(approximateAge) => updatePet(petId, { approximateAge })}
      />
      <TextField
        label="Weight"
        optional
        value={pet.weight ?? ""}
        onChange={(weight) => updatePet(petId, { weight })}
      />
      <TextField
        label="Personality / temperament"
        optional
        multiline
        value={pet.personality ?? ""}
        onChange={(personality) => updatePet(petId, { personality })}
        placeholder="Friendly with people, nervous around bikes…"
      />
      <TextField
        label="Things to know"
        optional
        multiline
        value={pet.thingsToKnow ?? ""}
        onChange={(thingsToKnow) => updatePet(petId, { thingsToKnow })}
        placeholder="Anything a caregiver should hear before day one."
      />
    </div>
  );
}
