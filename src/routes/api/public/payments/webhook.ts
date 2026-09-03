import { createFileRoute } from "@tanstack/react-router";

/**
 * Flutterwave webhook. Security: the shared `verif-hash` secret is compared
 * before anything is read, and the transaction is then re-verified directly
 * with Flutterwave before a purchase is recorded.
 */
export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["FLUTTERWAVE_WEBHOOK_HASH"];
        const provided = request.headers.get("verif-hash");

        if (!expected || !provided || provided !== expected) {
          return new Response("Invalid signature", { status: 401 });
        }

        try {
          const payload = (await request.json()) as Record<string, unknown>;
          const data = (payload["data"] ?? {}) as Record<string, unknown>;
          const event = String(payload["event"] ?? "");
          const transactionId = data["id"];

          if (!transactionId) return Response.json({ received: true });
          if (event && !event.startsWith("charge.")) return Response.json({ received: true });

          const { verifyTransaction, isValidLifetimePayment, recordLifetimePurchase } =
            await import("@/lib/flutterwave.server");

          const tx = await verifyTransaction(String(transactionId));
          if (isValidLifetimePayment(tx)) {
            await recordLifetimePurchase(tx);
          } else {
            console.warn("Ignoring unverified or mismatched transaction", {
              id: tx.transactionId,
              status: tx.status,
            });
          }

          return Response.json({ received: true });
        } catch (error) {
          console.error("Payments webhook error:", error);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
