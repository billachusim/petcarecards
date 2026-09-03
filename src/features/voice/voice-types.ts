import type { Sex, Species } from "@/features/pets/models";

export interface ParsedMedication {
  name: string;
  dosage: string | null;
  time: string | null;
  frequency: string | null;
  notes: string | null;
}

export interface ParsedCareDetails {
  pet: {
    name: string | null;
    species: Species | null;
    breed: string | null;
    sex: Sex | null;
    approximateAge: string | null;
    weight: string | null;
    personality: string | null;
    thingsToKnow: string | null;
  };
  feeding: {
    foodName: string | null;
    amount: string | null;
    times: string | null;
    mealsPerDay: string | null;
    treats: string | null;
    foodsToAvoid: string | null;
    notes: string | null;
  };
  routine: {
    walkSchedule: string | null;
    playtime: string | null;
    sleepRoutine: string | null;
    bathroomRoutine: string | null;
    crateInstructions: string | null;
    indoorOutdoorNotes: string | null;
    other: string | null;
  };
  medications: ParsedMedication[];
  emergency: {
    primaryName: string | null;
    primaryPhone: string | null;
    secondaryName: string | null;
    secondaryPhone: string | null;
    specialInstructions: string | null;
  };
  veterinarian: {
    vetName: string | null;
    clinicName: string | null;
    phone: string | null;
    address: string | null;
  };
}

export const EMPTY_PARSED: ParsedCareDetails = {
  pet: {
    name: null,
    species: null,
    breed: null,
    sex: null,
    approximateAge: null,
    weight: null,
    personality: null,
    thingsToKnow: null,
  },
  feeding: {
    foodName: null,
    amount: null,
    times: null,
    mealsPerDay: null,
    treats: null,
    foodsToAvoid: null,
    notes: null,
  },
  routine: {
    walkSchedule: null,
    playtime: null,
    sleepRoutine: null,
    bathroomRoutine: null,
    crateInstructions: null,
    indoorOutdoorNotes: null,
    other: null,
  },
  medications: [],
  emergency: {
    primaryName: null,
    primaryPhone: null,
    secondaryName: null,
    secondaryPhone: null,
    specialInstructions: null,
  },
  veterinarian: { vetName: null, clinicName: null, phone: null, address: null },
};
