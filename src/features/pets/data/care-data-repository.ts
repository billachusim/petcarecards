import {
  newId,
  nowIso,
  readJson,
  removeKey,
  writeJson,
} from "@/lib/storage/local-store";
import type {
  CareRoutine,
  CaregiverInfo,
  EmergencyContact,
  FeedingSchedule,
  Medication,
  Pet,
  PremiumEntitlement,
  Reminder,
  Veterinarian,
} from "../models";

export const STORAGE_KEYS = {
  pets: "pcc.pets",
  feedings: "pcc.feedings",
  routines: "pcc.routines",
  medications: "pcc.medications",
  emergency: "pcc.emergency",
  vets: "pcc.vets",
  reminders: "pcc.reminders",
  caregiver: "pcc.caregiver",
  premium: "pcc.premium",
  onboarded: "pcc.onboarded",
} as const;

export interface CareDatabase {
  pets: Pet[];
  feedings: FeedingSchedule[];
  routines: CareRoutine[];
  medications: Medication[];
  emergency: EmergencyContact[];
  vets: Veterinarian[];
  reminders: Reminder[];
  caregiver: CaregiverInfo;
  premium: PremiumEntitlement;
}

export const emptyDatabase = (): CareDatabase => ({
  pets: [],
  feedings: [],
  routines: [],
  medications: [],
  emergency: [],
  vets: [],
  reminders: [],
  caregiver: {},
  premium: { lifetimeUnlocked: false },
});

export function loadDatabase(): CareDatabase {
  const base = emptyDatabase();
  return {
    pets: readJson(STORAGE_KEYS.pets, base.pets),
    feedings: readJson(STORAGE_KEYS.feedings, base.feedings),
    routines: readJson(STORAGE_KEYS.routines, base.routines),
    medications: readJson(STORAGE_KEYS.medications, base.medications),
    emergency: readJson(STORAGE_KEYS.emergency, base.emergency),
    vets: readJson(STORAGE_KEYS.vets, base.vets),
    reminders: readJson(STORAGE_KEYS.reminders, base.reminders),
    caregiver: readJson(STORAGE_KEYS.caregiver, base.caregiver),
    premium: readJson(STORAGE_KEYS.premium, base.premium),
  };
}

export function saveDatabase(db: CareDatabase): void {
  writeJson(STORAGE_KEYS.pets, db.pets);
  writeJson(STORAGE_KEYS.feedings, db.feedings);
  writeJson(STORAGE_KEYS.routines, db.routines);
  writeJson(STORAGE_KEYS.medications, db.medications);
  writeJson(STORAGE_KEYS.emergency, db.emergency);
  writeJson(STORAGE_KEYS.vets, db.vets);
  writeJson(STORAGE_KEYS.reminders, db.reminders);
  writeJson(STORAGE_KEYS.caregiver, db.caregiver);
  writeJson(STORAGE_KEYS.premium, db.premium);
}

/** Deletes every pet-related record. Premium entitlement is stored separately and kept. */
export function clearPetData(): void {
  (
    [
      STORAGE_KEYS.pets,
      STORAGE_KEYS.feedings,
      STORAGE_KEYS.routines,
      STORAGE_KEYS.medications,
      STORAGE_KEYS.emergency,
      STORAGE_KEYS.vets,
      STORAGE_KEYS.reminders,
      STORAGE_KEYS.caregiver,
    ] as const
  ).forEach(removeKey);
}

export function stamp<T extends { id: string; createdAt: string; updatedAt: string }>(
  partial: Omit<T, "id" | "createdAt" | "updatedAt"> & Partial<Pick<T, "id">>,
): T {
  const ts = nowIso();
  return {
    ...(partial as object),
    id: partial.id ?? newId(),
    createdAt: ts,
    updatedAt: ts,
  } as T;
}
