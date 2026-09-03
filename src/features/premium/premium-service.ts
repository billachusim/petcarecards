import { readJson, writeJson } from "@/lib/storage/local-store";
import { STORAGE_KEYS } from "@/features/pets/data/care-data-repository";
import type { PremiumEntitlement } from "@/features/pets/models";
import {
  confirmLifetimeCheckout,
  createLifetimeCheckout,
  verifyLifetimeEntitlement,
} from "./premium.functions";

export const LIFETIME_PRICE = "$4.99";
export const LIFETIME_PRICE_ID = "lifetime_unlock";

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

function friendly(error: unknown, fallback: string): Error {
  if (error instanceof Error && error.message && !/^\[object/.test(error.message)) return error;
  return new Error(fallback);
}

/**
 * Asks the server whether this email has a completed lifetime purchase.
 * The browser never decides this on its own — the purchase record is written
 * only after the payment is verified with the provider.
 */
export async function verifyEntitlement(email: string): Promise<PremiumEntitlement> {
  let result;
  try {
    result = await verifyLifetimeEntitlement({ data: { email: email.trim() } });
  } catch (error) {
    throw friendly(error, "We couldn't check your purchase right now. Please try again.");
  }

  const normalized = email.trim().toLowerCase();
  if (!result.lifetimeUnlocked) {
    return { lifetimeUnlocked: false, email: normalized, environment: result.environment };
  }

  return {
    lifetimeUnlocked: true,
    email: normalized,
    environment: result.environment,
    purchasedAt: result.purchasedAt,
    reference: result.reference,
    verifiedAt: new Date().toISOString(),
  };
}

/**
 * Restore Purchase: looks the purchase up on the server by the email used at
 * checkout, so a buyer can unlock again on any device or browser.
 */
export async function restorePurchase(email?: string): Promise<PremiumEntitlement> {
  const target = email?.trim() || readEntitlement().email;
  if (!target) {
    throw new Error("Enter the email you used at checkout so we can find your purchase.");
  }
  const entitlement = await verifyEntitlement(target);
  if (!entitlement.lifetimeUnlocked) {
    throw new Error(
      "We couldn't find a purchase for that email. Check the address you used at checkout, or contact support.",
    );
  }
  return entitlement;
}

const PENDING_EMAIL_KEY = "pcc.pendingCheckoutEmail";

export function readPendingCheckoutEmail(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem(PENDING_EMAIL_KEY) ?? undefined;
}

export function clearPendingCheckoutEmail(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PENDING_EMAIL_KEY);
}

/** Sends the buyer to the secure hosted checkout for the one-time lifetime unlock. */
export async function startLifetimeCheckout(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  let link: string;
  try {
    const result = await createLifetimeCheckout({
      data: { email: normalizedEmail, origin: window.location.origin },
    });
    link = result.link;
  } catch (error) {
    throw friendly(error, "We couldn't open the checkout. Please try again.");
  }

  window.localStorage.setItem(PENDING_EMAIL_KEY, normalizedEmail);
  window.location.href = link;
}

/**
 * Called when the buyer is redirected back from checkout. Re-verifies the
 * transaction server-side so the unlock never depends on URL parameters.
 */
export async function confirmCheckoutReturn(transactionId: string): Promise<boolean> {
  try {
    const result = await confirmLifetimeCheckout({ data: { transactionId } });
    return result.recorded;
  } catch {
    return false;
  }
}
