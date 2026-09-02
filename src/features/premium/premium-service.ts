import { readJson, writeJson } from "@/lib/storage/local-store";
import { STORAGE_KEYS } from "@/features/pets/data/care-data-repository";
import type { PremiumEntitlement } from "@/features/pets/models";

export const LIFETIME_PRICE = "$4.99";

export const PREMIUM_BENEFITS = [
  "Unlimited pets",
  "Medication schedules",
  "Smart care reminders",
  "Printable Care Cards",
  "PDF export",
  "Easy sharing",
] as const;

export type PremiumFeature =
  | "unlimited-pets"
  | "medications"
  | "reminders"
  | "pdf"
  | "print"
  | "sharing"
  | "qr";

export function readEntitlement(): PremiumEntitlement {
  return readJson<PremiumEntitlement>(STORAGE_KEYS.premium, { lifetimeUnlocked: false });
}

export function writeEntitlement(entitlement: PremiumEntitlement): void {
  writeJson(STORAGE_KEYS.premium, entitlement);
}

/**
 * Restore Purchase equivalent for the web. Today it re-reads the locally stored
 * entitlement; once a hosted payments backend is attached this is the single
 * place that needs to look the purchase up remotely.
 */
export async function restorePurchase(): Promise<PremiumEntitlement> {
  const local = readEntitlement();
  if (local.lifetimeUnlocked) return local;
  throw new Error(
    "We couldn't find a previous purchase on this device. If you bought Lifetime access, use the same browser you purchased with.",
  );
}
