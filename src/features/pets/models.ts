/**
 * Core domain models for Pet Care Card.
 * All data is local-first: stored per browser/device, no account required.
 */

export type Species = "Dog" | "Cat" | "Bird" | "Rabbit" | "Other";
export type Sex = "Male" | "Female" | "Unknown";

export interface Timestamped {
  createdAt: string;
  updatedAt: string;
}

export interface Pet extends Timestamped {
  id: string;
  name: string;
  species?: Species | undefined;
  breed?: string | undefined;
  sex?: Sex | undefined;
  dateOfBirth?: string | undefined;
  approximateAge?: string | undefined;
  weight?: string | undefined;
  photoDataUrl?: string | undefined;
  personality?: string | undefined;
  thingsToKnow?: string | undefined;
}

export interface FeedingSchedule extends Timestamped {
  id: string;
  petId: string;
  foodName?: string | undefined;
  amount?: string | undefined;
  times?: string | undefined;
  mealsPerDay?: string | undefined;
  treats?: string | undefined;
  foodsToAvoid?: string | undefined;
  notes?: string | undefined;
}

export interface CareRoutine extends Timestamped {
  id: string;
  petId: string;
  walkSchedule?: string | undefined;
  playtime?: string | undefined;
  sleepRoutine?: string | undefined;
  bathroomRoutine?: string | undefined;
  crateInstructions?: string | undefined;
  indoorOutdoorNotes?: string | undefined;
  other?: string | undefined;
}

export interface Medication extends Timestamped {
  id: string;
  petId: string;
  name: string;
  dosage?: string | undefined;
  time?: string | undefined;
  frequency?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  notes?: string | undefined;
}

export interface EmergencyContact extends Timestamped {
  id: string;
  petId: string;
  primaryName?: string | undefined;
  primaryPhone?: string | undefined;
  secondaryName?: string | undefined;
  secondaryPhone?: string | undefined;
  specialInstructions?: string | undefined;
}

export interface Veterinarian extends Timestamped {
  id: string;
  petId: string;
  vetName?: string | undefined;
  clinicName?: string | undefined;
  phone?: string | undefined;
  address?: string | undefined;
}

export type ReminderType = "feeding" | "medication" | "walk" | "bathroom" | "custom";
export type RepeatSchedule = "once" | "daily" | "weekdays" | "weekly";

export interface Reminder extends Timestamped {
  id: string;
  petId: string;
  type: ReminderType;
  title: string;
  time: string; // HH:mm
  repeat: RepeatSchedule;
  startDate?: string | undefined;
  endDate?: string | undefined;
  enabled: boolean;
}

/** Aggregate view assembled for rendering / sharing a care card. */
export interface CareCard {
  pet: Pet;
  feedings: FeedingSchedule[];
  routine?: CareRoutine | undefined;
  medications: Medication[];
  emergency?: EmergencyContact | undefined;
  veterinarian?: Veterinarian | undefined;
  generatedAt: string;
}

export interface CaregiverInfo {
  name?: string | undefined;
  phone?: string | undefined;
  notes?: string | undefined;
}

export interface PremiumEntitlement {
  lifetimeUnlocked: boolean;
  purchasedAt?: string | undefined;
  reference?: string | undefined;
}
