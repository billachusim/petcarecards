import type { CareDatabase } from "@/features/pets/data/care-data-repository";
import type {
  CareRoutine,
  EmergencyContact,
  FeedingSchedule,
  Medication,
  Pet,
  Reminder,
  Sex,
  Species,
  Veterinarian,
} from "@/features/pets/models";

/** Wire shape pushed to / pulled from the backend. Snake_case mirrors the tables. */
export interface BackupPayload {
  pets: Record<string, unknown>[];
  feedings: Record<string, unknown>[];
  routines: Record<string, unknown>[];
  medications: Record<string, unknown>[];
  emergency: Record<string, unknown>[];
  vets: Record<string, unknown>[];
  reminders: Record<string, unknown>[];
  caregiver: { name?: string | null; phone?: string | null; notes?: string | null };
}

const base = (r: { id: string; createdAt: string; updatedAt: string }) => ({
  id: r.id,
  created_at: r.createdAt,
  updated_at: r.updatedAt,
});

export function toBackupPayload(db: CareDatabase): BackupPayload {
  return {
    pets: db.pets.map((p) => ({
      ...base(p),
      name: p.name,
      species: p.species ?? null,
      breed: p.breed ?? null,
      sex: p.sex ?? null,
      date_of_birth: p.dateOfBirth ?? null,
      approximate_age: p.approximateAge ?? null,
      weight: p.weight ?? null,
      photo_data_url: p.photoDataUrl ?? null,
      personality: p.personality ?? null,
      things_to_know: p.thingsToKnow ?? null,
    })),
    feedings: db.feedings.map((f) => ({
      ...base(f),
      pet_id: f.petId,
      food_name: f.foodName ?? null,
      amount: f.amount ?? null,
      times: f.times ?? null,
      meals_per_day: f.mealsPerDay ?? null,
      treats: f.treats ?? null,
      foods_to_avoid: f.foodsToAvoid ?? null,
      notes: f.notes ?? null,
    })),
    routines: db.routines.map((r) => ({
      ...base(r),
      pet_id: r.petId,
      walk_schedule: r.walkSchedule ?? null,
      playtime: r.playtime ?? null,
      sleep_routine: r.sleepRoutine ?? null,
      bathroom_routine: r.bathroomRoutine ?? null,
      crate_instructions: r.crateInstructions ?? null,
      indoor_outdoor_notes: r.indoorOutdoorNotes ?? null,
      other: r.other ?? null,
    })),
    medications: db.medications.map((m) => ({
      ...base(m),
      pet_id: m.petId,
      name: m.name,
      dosage: m.dosage ?? null,
      time: m.time ?? null,
      frequency: m.frequency ?? null,
      start_date: m.startDate ?? null,
      end_date: m.endDate ?? null,
      notes: m.notes ?? null,
    })),
    emergency: db.emergency.map((e) => ({
      ...base(e),
      pet_id: e.petId,
      primary_name: e.primaryName ?? null,
      primary_phone: e.primaryPhone ?? null,
      secondary_name: e.secondaryName ?? null,
      secondary_phone: e.secondaryPhone ?? null,
      special_instructions: e.specialInstructions ?? null,
    })),
    vets: db.vets.map((v) => ({
      ...base(v),
      pet_id: v.petId,
      vet_name: v.vetName ?? null,
      clinic_name: v.clinicName ?? null,
      phone: v.phone ?? null,
      address: v.address ?? null,
    })),
    reminders: db.reminders.map((r) => ({
      ...base(r),
      pet_id: r.petId,
      type: r.type,
      title: r.title,
      time: r.time,
      repeat: r.repeat,
      start_date: r.startDate ?? null,
      end_date: r.endDate ?? null,
      enabled: r.enabled,
    })),
    caregiver: {
      name: db.caregiver.name ?? null,
      phone: db.caregiver.phone ?? null,
      notes: db.caregiver.notes ?? null,
    },
  };
}

const str = (value: unknown): string | undefined =>
  typeof value === "string" && value.length > 0 ? value : undefined;

const stamps = (row: Record<string, unknown>) => ({
  id: String(row["id"]),
  createdAt: str(row["created_at"]) ?? new Date().toISOString(),
  updatedAt: str(row["updated_at"]) ?? new Date().toISOString(),
});

/** Rebuilds the local database shape from a pulled backup. */
export function fromBackupPayload(payload: BackupPayload): Omit<CareDatabase, "premium"> {
  return {
    pets: payload.pets.map((row): Pet => ({
      ...stamps(row),
      name: String(row["name"] ?? "Pet"),
      species: str(row["species"]) as Species | undefined,
      breed: str(row["breed"]),
      sex: str(row["sex"]) as Sex | undefined,
      dateOfBirth: str(row["date_of_birth"]),
      approximateAge: str(row["approximate_age"]),
      weight: str(row["weight"]),
      photoDataUrl: str(row["photo_data_url"]),
      personality: str(row["personality"]),
      thingsToKnow: str(row["things_to_know"]),
    })),
    feedings: payload.feedings.map((row): FeedingSchedule => ({
      ...stamps(row),
      petId: String(row["pet_id"]),
      foodName: str(row["food_name"]),
      amount: str(row["amount"]),
      times: str(row["times"]),
      mealsPerDay: str(row["meals_per_day"]),
      treats: str(row["treats"]),
      foodsToAvoid: str(row["foods_to_avoid"]),
      notes: str(row["notes"]),
    })),
    routines: payload.routines.map((row): CareRoutine => ({
      ...stamps(row),
      petId: String(row["pet_id"]),
      walkSchedule: str(row["walk_schedule"]),
      playtime: str(row["playtime"]),
      sleepRoutine: str(row["sleep_routine"]),
      bathroomRoutine: str(row["bathroom_routine"]),
      crateInstructions: str(row["crate_instructions"]),
      indoorOutdoorNotes: str(row["indoor_outdoor_notes"]),
      other: str(row["other"]),
    })),
    medications: payload.medications.map((row): Medication => ({
      ...stamps(row),
      petId: String(row["pet_id"]),
      name: String(row["name"] ?? ""),
      dosage: str(row["dosage"]),
      time: str(row["time"]),
      frequency: str(row["frequency"]),
      startDate: str(row["start_date"]),
      endDate: str(row["end_date"]),
      notes: str(row["notes"]),
    })),
    emergency: payload.emergency.map((row): EmergencyContact => ({
      ...stamps(row),
      petId: String(row["pet_id"]),
      primaryName: str(row["primary_name"]),
      primaryPhone: str(row["primary_phone"]),
      secondaryName: str(row["secondary_name"]),
      secondaryPhone: str(row["secondary_phone"]),
      specialInstructions: str(row["special_instructions"]),
    })),
    vets: payload.vets.map((row): Veterinarian => ({
      ...stamps(row),
      petId: String(row["pet_id"]),
      vetName: str(row["vet_name"]),
      clinicName: str(row["clinic_name"]),
      phone: str(row["phone"]),
      address: str(row["address"]),
    })),
    reminders: payload.reminders.map((row): Reminder => ({
      ...stamps(row),
      petId: String(row["pet_id"]),
      type: (str(row["type"]) ?? "custom") as Reminder["type"],
      title: String(row["title"] ?? "Reminder"),
      time: String(row["time"] ?? "08:00"),
      repeat: (str(row["repeat"]) ?? "daily") as Reminder["repeat"],
      startDate: str(row["start_date"]),
      endDate: str(row["end_date"]),
      enabled: row["enabled"] !== false,
    })),
    caregiver: {
      name: payload.caregiver.name ?? undefined,
      phone: payload.caregiver.phone ?? undefined,
      notes: payload.caregiver.notes ?? undefined,
    },
  };
}
