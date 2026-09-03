/**
 * Server-only Flutterwave helpers. The secret key never leaves the server.
 */

export type PaymentEnv = "sandbox" | "live";

const API_BASE = "https://api.flutterwave.com/v3";

export function getSecretKey(): string {
  const key = process.env["FLUTTERWAVE_SECRET_KEY"];
  if (!key) throw new Error("Payments aren't configured yet. Please try again later.");
  return key;
}

/** Test keys look like FLWSECK_TEST-xxxx; live keys do not carry the TEST marker. */
export function getPaymentEnvironment(): PaymentEnv {
  return /test/i.test(getSecretKey()) ? "sandbox" : "live";
}

export async function flutterwaveFetch(
  path: string,
  init?: RequestInit,
): Promise<Record<string, unknown>> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getSecretKey()}`,
      ...init?.headers,
    },
  });

  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    console.error("Flutterwave API error", response.status, body);
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "Payments aren't configured correctly yet (the payment key was rejected). Please try again later.",
      );
    }
    throw new Error("The payment provider is unavailable right now. Please try again.");
  }
  return body;
}

export interface VerifiedTransaction {
  transactionId: string;
  txRef: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  customerId?: string | undefined;
  paidAt?: string | undefined;
}

/** Server-side confirmation with Flutterwave — never trust the browser or a raw webhook body. */
export async function verifyTransaction(transactionId: string): Promise<VerifiedTransaction> {
  const body = await flutterwaveFetch(`/transactions/${encodeURIComponent(transactionId)}/verify`);
  const data = (body["data"] ?? {}) as Record<string, unknown>;
  const customer = (data["customer"] ?? {}) as Record<string, unknown>;

  return {
    transactionId: String(data["id"] ?? transactionId),
    txRef: String(data["tx_ref"] ?? ""),
    email: String(customer["email"] ?? "")
      .trim()
      .toLowerCase(),
    amount: Number(data["amount"] ?? 0),
    currency: String(data["currency"] ?? ""),
    status: String(data["status"] ?? ""),
    customerId: customer["id"] ? String(customer["id"]) : undefined,
    paidAt: data["created_at"] ? String(data["created_at"]) : undefined,
  };
}

export const LIFETIME_PRODUCT_ID = "pet_care_card_lifetime";
export const LIFETIME_PRICE_ID = "lifetime_unlock";
export const LIFETIME_AMOUNT = 4.99;
export const LIFETIME_CURRENCY = "USD";

/** Records a confirmed one-time purchase so entitlement can be restored anywhere. */
export async function recordLifetimePurchase(tx: VerifiedTransaction): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("lifetime_purchases").upsert(
    {
      email: tx.email,
      provider_transaction_id: tx.transactionId,
      provider_customer_id: tx.customerId ?? null,
      product_id: LIFETIME_PRODUCT_ID,
      price_id: LIFETIME_PRICE_ID,
      environment: getPaymentEnvironment(),
      status: "completed",
      purchased_at: tx.paidAt ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "provider_transaction_id" },
  );
  if (error) throw new Error(error.message);
}

/** True when the verified transaction really paid for the lifetime unlock. */
export function isValidLifetimePayment(tx: VerifiedTransaction): boolean {
  return (
    tx.status.toLowerCase() === "successful" &&
    tx.currency.toUpperCase() === LIFETIME_CURRENCY &&
    tx.amount >= LIFETIME_AMOUNT &&
    tx.email.length > 0
  );
}
