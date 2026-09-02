import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/app-shell";
import { TextField } from "@/components/app/form-field";
import { Button } from "@/components/ui/button";
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
import { firstError, petSchema } from "@/lib/validation";

export const Route = createFileRoute("/pets/new")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Add a pet — Pet Care Card" },
      {
        name: "description",
        content: "Add your pet's name and a few basics. Everything except the name is optional.",
      },
      { property: "og:title", content: "Add a pet — Pet Care Card" },
      { property: "og:description", content: "Start a care card in under two minutes." },
    ],
  }),
  component: NewPet,
});

const SPECIES: Species[] = ["Dog", "Cat", "Bird", "Rabbit", "Other"];
const SEXES: Sex[] = ["Male", "Female", "Unknown"];

function NewPet() {
  const navigate = useNavigate();
  const { addPet, pets, isPremium } = useCareStore();

  const [name, setName] = useState("");
  const [species, setSpecies] = useState<Species | "">("");
  const [breed, setBreed] = useState("");
  const [sex, setSex] = useState<Sex | "">("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [approximateAge, setApproximateAge] = useState("");
  const [weight, setWeight] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const [error, setError] = useState<string>();

  const submit = () => {
    if (!isPremium && pets.length >= 1) {
      void navigate({ to: "/premium" });
      return;
    }
    try {
      petSchema.parse({ name, breed, weight, approximateAge });
      const pet = addPet({
        name: name.trim(),
        species: species || undefined,
        breed: breed.trim() || undefined,
        sex: sex || undefined,
        dateOfBirth: dateOfBirth || undefined,
        approximateAge: approximateAge.trim() || undefined,
        weight: weight.trim() || undefined,
        photoDataUrl: photo,
      });
      toast.success(`${pet.name}'s card created.`);
      void navigate({ to: "/pets/$petId/edit", params: { petId: pet.id } });
    } catch (err) {
      const message = firstError(err);
      setError(message);
      toast.error(message);
    }
  };

  return (
    <AppShell>
      <Button
        variant="ghost"
        className="mb-4 -ml-2 rounded-xl"
        onClick={() => void navigate({ to: "/" })}
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back
      </Button>

      <h1 className="font-display text-3xl font-semibold">Add Pet</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Only the name is required — you can fill in the rest any time.
      </p>

      <div className="mt-6 space-y-5 rounded-3xl border border-border bg-card p-5">
        <TextField
          label="Name"
          value={name}
          onChange={(v) => {
            setName(v);
            setError(undefined);
          }}
          placeholder="e.g. Luna"
          error={error}
        />

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <Label className="text-sm font-medium">Species</Label>
            <span className="text-xs text-muted-foreground">Optional</span>
          </div>
          <Select value={species} onValueChange={(v) => setSpecies(v as Species)}>
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

        <TextField label="Breed" optional value={breed} onChange={setBreed} placeholder="e.g. Beagle" />

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <Label className="text-sm font-medium">Sex</Label>
            <span className="text-xs text-muted-foreground">Optional</span>
          </div>
          <Select value={sex} onValueChange={(v) => setSex(v as Sex)}>
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
          value={dateOfBirth}
          onChange={setDateOfBirth}
        />
        <TextField
          label="Approximate age"
          optional
          value={approximateAge}
          onChange={setApproximateAge}
          placeholder="e.g. About 4 years"
        />
        <TextField
          label="Weight"
          optional
          value={weight}
          onChange={setWeight}
          placeholder="e.g. 12 kg"
        />

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Photo</Label>
          <PhotoPicker value={photo} onChange={setPhoto} />
        </div>
      </div>

      <Button size="lg" className="mt-6 h-14 w-full rounded-2xl text-base" onClick={submit}>
        Save and continue
      </Button>
    </AppShell>
  );
}
