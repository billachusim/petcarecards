import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const emailInput = z.object({
  email: z.string().trim().email("Please enter the email you used at checkout."),
});

const checkoutInput = z.object({
  email: z.string().trim().email("Please add a valid email so we can link your purchase."),
  origin: z.string().trim().url(),
});

const confirmInput = z.object({
  transactionId: z.string().trim().min(1),
});

export interface VerifiedEntitlement {
  lifetimeUnlocked: boolean;
  environment: "sandbox" | "live";
  purchasedAt?: string;
  reference?: string;
}

/** Creates a hosted Flutterwave checkout for the one-time lifetime unlock. */
export const createLifetimeCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; origin: string }) => checkoutInput.parse(data))
  .handler(async ({ data }): Promise<{ link: string; txRef: string }> => {
    const { flutterwaveFetch, LIFETIME_AMOUNT, LIFETIME_CURRENCY } = await import(
      "@/lib/flutterwave.server"
    );

    const email = data.email.trim().toLowerCase();
    const txRef = `pcc-lifetime-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const body = await flutterwaveFetch("/payments", {
      method: "POST",
      body: JSON.stringify({
        tx_ref: txRef,
        amount: LIFETIME_AMOUNT,
        currency: LIFETIME_CURRENCY,
        redirect_url: `${data.origin.replace(/\/$/, "")}/premium`,
        payment_options: "card",
        customer: { email },
        meta: { email, product: "pet_care_card_lifetime" },
        customizations: {
          title: "Pet Care Card",
          description: "Lifetime unlock — one payment, no subscription",
        },
      }),
    });

    const link = ((body["data"] ?? {}) as Record<string, unknown>)["link"];
    if (typeof link !== "string" || !link) {
      throw new Error("We couldn't open the checkout. Please try again.");
    }
    return { link, txRef };
  });

/**
 * Server-side entitlement check. The purchases table is only reachable by
 * trusted server code, so the browser can never grant itself premium.
 */
export const verifyLifetimeEntitlement = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) => emailInput.parse(data))
  .handler(async ({ data }): Promise<VerifiedEntitlement> => {
    const { getPaymentEnvironment } = await import("@/lib/flutterwave.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const environment = getPaymentEnvironment();

    const { data: rows, error } = await supabaseAdmin
      .from("lifetime_purchases")
      .select("provider_transaction_id, purchased_at, status")
      .eq("email", data.email.trim().toLowerCase())
      .eq("environment", environment)
      .eq("status", "completed")
      .order("purchased_at", { ascending: false })
      .limit(1);

    if (error) {
      throw new Error("We couldn't check your purchase right now. Please try again in a moment.");
    }

    const row = rows?.[0];
    if (!row) return { lifetimeUnlocked: false, environment };

    return {
      lifetimeUnlocked: true,
      environment,
      purchasedAt: row.purchased_at as string,
      reference: row.provider_transaction_id as string,
    };
  });

/**
 * Fallback confirmation for the redirect back from checkout, in case the
 * webhook is slow. The transaction is re-verified with Flutterwave server-side.
 */
export const confirmLifetimeCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: { transactionId: string }) => confirmInput.parse(data))
  .handler(async ({ data }): Promise<{ recorded: boolean }> => {
    const { verifyTransaction, isValidLifetimePayment, recordLifetimePurchase } = await import(
      "@/lib/flutterwave.server"
    );
    const tx = await verifyTransaction(data.transactionId);
    if (!isValidLifetimePayment(tx)) return { recorded: false };
    await recordLifetimePurchase(tx);
    return { recorded: true };
  });
