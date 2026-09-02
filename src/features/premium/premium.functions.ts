import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { PaddleEnv } from "@/lib/paddle.server";

const environmentSchema = z.enum(["sandbox", "live"]);

const priceInput = z.object({
  priceId: z.string().min(1),
  environment: environmentSchema,
});

const entitlementInput = z.object({
  email: z.string().trim().email("Please enter the email you used at checkout."),
  environment: environmentSchema,
});

export interface VerifiedEntitlement {
  lifetimeUnlocked: boolean;
  purchasedAt?: string;
  reference?: string;
}

/** Resolves a human-readable price ID to the provider's internal price ID. */
export const resolvePaddlePrice = createServerFn({ method: "GET" })
  .inputValidator((data: { priceId: string; environment: PaddleEnv }) => priceInput.parse(data))
  .handler(async ({ data }): Promise<string> => {
    const { gatewayFetch } = await import("@/lib/paddle.server");
    const response = await gatewayFetch(
      data.environment,
      `/prices?external_id=${encodeURIComponent(data.priceId)}`,
    );
    const result = (await response.json()) as { data?: Array<{ id: string }> };
    const id = result.data?.[0]?.id;
    if (!id) throw new Error("This purchase isn't available right now. Please try again later.");
    return id;
  });

/**
 * Server-side entitlement check. The purchases table is only reachable by
 * trusted server code, so the browser can never grant itself premium.
 */
export const verifyLifetimeEntitlement = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; environment: PaddleEnv }) =>
    entitlementInput.parse(data),
  )
  .handler(async ({ data }): Promise<VerifiedEntitlement> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("lifetime_purchases")
      .select("paddle_transaction_id, purchased_at, status")
      .eq("email", data.email.trim().toLowerCase())
      .eq("environment", data.environment)
      .eq("status", "completed")
      .order("purchased_at", { ascending: false })
      .limit(1);

    if (error) {
      throw new Error("We couldn't check your purchase right now. Please try again in a moment.");
    }

    const row = rows?.[0];
    if (!row) return { lifetimeUnlocked: false };

    return {
      lifetimeUnlocked: true,
      purchasedAt: row.purchased_at as string,
      reference: row.paddle_transaction_id as string,
    };
  });
