import { readJson, writeJson } from "@/lib/storage/local-store";
import { STORAGE_KEYS } from "@/features/pets/data/care-data-repository";
import type { PremiumEntitlement } from "@/features/pets/models";
import { getPaddleEnvironment, getPaddlePriceId, initializePaddle } from "@/lib/paddle";
import { verifyLifetimeEntitlement } from "./premium.functions";

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
 * only by the verified payment webhook.
 */
export async function verifyEntitlement(email: string): Promise<PremiumEntitlement> {
  const environment = getPaddleEnvironment();
  let result;
  try {
    result = await verifyLifetimeEntitlement({ data: { email: email.trim(), environment } });
  } catch (error) {
    throw friendly(error, "We couldn't check your purchase right now. Please try again.");
  }

  if (!result.lifetimeUnlocked) {
    return { lifetimeUnlocked: false, email: email.trim().toLowerCase(), environment };
  }

  return {
    lifetimeUnlocked: true,
    email: email.trim().toLowerCase(),
    environment,
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

interface CheckoutOptions {
  email: string;
  /** Called after the buyer completes payment in the overlay. */
  onCompleted: () => void;
  onClosed?: () => void;
}

/** Opens the secure hosted checkout for the one-time lifetime unlock. */
export async function startLifetimeCheckout({
  email,
  onCompleted,
  onClosed,
}: CheckoutOptions): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    await initializePaddle();
    const paddlePriceId = await getPaddlePriceId(LIFETIME_PRICE_ID);

    window.Paddle.Checkout.open({
      items: [{ priceId: paddlePriceId, quantity: 1 }],
      customer: { email: normalizedEmail },
      customData: { email: normalizedEmail },
      settings: {
        displayMode: "overlay",
        successUrl: `${window.location.origin}/premium?checkout=success`,
        allowLogout: false,
        variant: "one-page",
      },
      eventCallback: (event: { name?: string }) => {
        if (event?.name === "checkout.completed") onCompleted();
        if (event?.name === "checkout.closed") onClosed?.();
      },
    });
  } catch (error) {
    throw friendly(error, "We couldn't open the checkout. Please try again.");
  }
}
