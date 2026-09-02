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
  species?: Species;
  breed?: string;
  sex?: Sex;
  dateOfBirth?: string;
  approximateAge?: string;
  weight?: string;
  photoDataUrl?: string;
  personality?: string;
  thingsToKnow?: string;
}

export interface FeedingSchedule extends Timestamped {
  id: string;
  petId: string;
  foodName?: string;
  amount?: string;
  times?: string;
  mealsPerDay?: string;
  treats?: string;
  foodsToAvoid?: string;
  notes?: string;
}

export interface CareRoutine extends Timestamped {
  id: string;
  petId: string;
  walkSchedule?: string;
  playtime?: string;
  sleepRoutine?: string;
  bathroomRoutine?: string;
  crateInstructions?: string;
  indoorOutdoorNotes?: string;
  other?: string;
}

export interface Medication extends Timestamped {
  id: string;
  petId: string;
  name: string;
  dosage?: string;
  time?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface EmergencyContact extends Timestamped {
  id: string;
  petId: string;
  primaryName?: string;
  primaryPhone?: string;
  secondaryName?: string;
  secondaryPhone?: string;
  specialInstructions?: string;
}

export interface Veterinarian extends Timestamped {
  id: string;
  petId: string;
  vetName?: string;
  clinicName?: string;
  phone?: string;
  address?: string;
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
  startDate?: string;
  endDate?: string;
  enabled: boolean;
}

/** Aggregate view assembled for rendering / sharing a care card. */
export interface CareCard {
  pet: Pet;
  feedings: FeedingSchedule[];
  routine?: CareRoutine;
  medications: Medication[];
  emergency?: EmergencyContact;
  veterinarian?: Veterinarian;
  generatedAt: string;
}

export interface CaregiverInfo {
  name?: string;
  phone?: string;
  notes?: string;
}

export interface PremiumEntitlement {
  lifetimeUnlocked: boolean;
  purchasedAt?: string;
  reference?: string;
}
