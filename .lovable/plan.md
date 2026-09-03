# Switch payments from Paddle to Lovable's built-in Stripe

Paddle's domain rejection is final, so the $4.99 lifetime unlock moves to Lovable's built-in
Stripe payments. No Stripe account setup, API keys, or domain review is required — Lovable manages
the account, checkout and webhooks.

## What you need to do first

1. Open the Payments dashboard and disconnect Paddle (three-dots menu, top right).
2. Tell me when it's done — I can't disconnect it for you.

Once disconnected I enable Stripe payments, recreate the product, and rewire the app.

## What changes for buyers

Nothing visible changes in positioning: still "Unlock Lifetime — $4.99" and
"One payment. Lifetime access. No subscription." The checkout window will be Stripe's instead of
Paddle's, and the receipt/invoice comes from Stripe.

## Work to be done

1. **Enable Stripe payments** and recreate the catalog: product `pet_care_card_lifetime`, one-time
   price `lifetime_unlock`, 499 USD, quantity fixed at 1. Paddle's catalog does not carry over.
2. **Rewire checkout**: replace the Paddle.js overlay with Stripe checkout, keeping the same
   premium copy, error messages and confirmation polling behaviour.
3. **Rewire entitlement**: keep the existing verified server-side entitlement model, swapping the
   stored transaction/customer identifiers to Stripe's. Restore Purchase keeps working by email.
4. **Replace the webhook**: new handler at `/api/public/payments/webhook` verifying Stripe's
   signature, granting lifetime entitlement on successful one-time payment, and revoking on refund.
5. **Remove Paddle code**: `src/lib/paddle.ts`, `src/lib/paddle.server.ts`, the Paddle SDK
   dependency, the sandbox banner wiring, and Paddle-specific fields.
6. **Update legal and marketing copy**: Privacy, Terms, Refunds, Pricing, Contact and `llms.txt`
   currently name Paddle as Merchant of Record and point refunds to paddle.net. These become
   Stripe-based: Tech Faculty is the seller, Stripe is the payment processor, and refunds are
   requested from us directly (30-day money-back guarantee stays).
7. **Verify**: build and typecheck clean, `/premium` and `/pricing` load, unsigned webhook requests
   rejected, test purchase completes end to end and unlocks premium.

## Technical notes

- Purchases table: migration to rename `paddle_transaction_id` / `paddle_customer_id` to
  provider-neutral columns, preserving RLS and grants. No existing live purchases to migrate.
- Entitlement verification stays server-side in `premium.functions.ts`; the client keeps reading the
  verified entitlement for gating, so no gating logic changes.
- Test checkout works immediately; live charges require publishing the project.
