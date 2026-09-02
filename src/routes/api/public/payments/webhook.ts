import { createFileRoute } from "@tanstack/react-router";

import { verifyWebhook, EventName, type PaddleEnv } from "@/lib/paddle.server";

/* eslint-disable @typescript-eslint/no-explicit-any */

async function getAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function handleTransactionCompleted(data: any, env: PaddleEnv) {
  const email: string | undefined =
    data.customData?.email ?? data.customer?.email ?? undefined;

  if (!email) {
    console.warn("Skipping transaction: no email in customData", { transactionId: data.id });
    return;
  }

  const item = data.items?.[0];
  const priceId = item?.price?.importMeta?.externalId;
  const productId = item?.price?.productId
    ? (item?.product?.importMeta?.externalId ?? "pet_care_card_lifetime")
    : undefined;

  if (!priceId) {
    console.warn("Skipping transaction: missing importMeta.externalId", {
      rawPriceId: item?.price?.id,
    });
    return;
  }

  const supabaseAdmin = await getAdmin();
  const { error } = await supabaseAdmin.from("lifetime_purchases").upsert(
    {
      email: String(email).trim().toLowerCase(),
      paddle_transaction_id: data.id,
      paddle_customer_id: data.customerId ?? null,
      product_id: productId ?? "pet_care_card_lifetime",
      price_id: priceId,
      environment: env,
      status: "completed",
      purchased_at: data.billedAt ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "paddle_transaction_id" },
  );

  if (error) throw new Error(error.message);
}

async function handleWebhook(req: Request, env: PaddleEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.eventType) {
    case EventName.TransactionCompleted:
      await handleTransactionCompleted(event.data as any, env);
      break;
    default:
      console.log("Unhandled payments event:", event.eventType);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const env = (url.searchParams.get("env") || "sandbox") as PaddleEnv;
        try {
          await handleWebhook(request, env);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Payments webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
