import type { CareStoreValue } from "@/features/pets/hooks/use-care-store";

import type { ParsedCareDetails } from "./voice-types";

type Store = Pick<
  CareStoreValue,
  "updatePet" | "saveFeeding" | "saveRoutine" | "saveMedication" | "saveEmergency" | "saveVet"
>;

const clean = <T extends Record<string, string | null>>(input: T) =>
  Object.fromEntries(
    Object.entries(input).filter(([, value]) => Boolean(value)),
  ) as Partial<Record<keyof T, string>>;

/** Writes reviewed voice-fill details onto an existing pet. */
export function applyParsedDetails(
  store: Store,
  petId: string,
  details: ParsedCareDetails,
): void {
  const pet = clean({
    breed: details.pet.breed,
    approximateAge: details.pet.approximateAge,
    weight: details.pet.weight,
    personality: details.pet.personality,
    thingsToKnow: details.pet.thingsToKnow,
  });
  if (details.pet.species) Object.assign(pet, { species: details.pet.species });
  if (details.pet.sex) Object.assign(pet, { sex: details.pet.sex });
  if (Object.keys(pet).length > 0) store.updatePet(petId, pet);

  const feeding = clean(details.feeding);
  if (Object.keys(feeding).length > 0) store.saveFeeding({ petId, ...feeding });

  const routine = clean(details.routine);
  if (Object.keys(routine).length > 0) store.saveRoutine(petId, routine);

  for (const med of details.medications) {
    store.saveMedication({
      petId,
      name: med.name,
      ...clean({
        dosage: med.dosage,
        time: med.time,
        frequency: med.frequency,
        notes: med.notes,
      }),
    });
  }

  const emergency = clean(details.emergency);
  if (Object.keys(emergency).length > 0) store.saveEmergency(petId, emergency);

  const vet = clean(details.veterinarian);
  if (Object.keys(vet).length > 0) store.saveVet(petId, vet);
}
