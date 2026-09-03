import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** A published, link-shareable snapshot of a care card. */
export interface SharedCardSnapshot {
  petName: string;
  card: unknown;
  publishedAt: string;
}

const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

function makeToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

interface PublishInput {
  petId: string;
  petName: string;
  card: unknown;
}

const validatePublish = (input: unknown): PublishInput => {
  const raw = (input ?? {}) as Record<string, unknown>;
  const petId = typeof raw["petId"] === "string" ? raw["petId"] : "";
  if (!petId) throw new Error("We couldn't work out which pet to share.");
  return {
    petId,
    petName: typeof raw["petName"] === "string" && raw["petName"] ? raw["petName"] : "Pet",
    card: raw["card"] ?? null,
  };
};

/** Publishes (or refreshes) the public link for one of the caller's pets. */
export const publishSharedCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(validatePublish)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const existing = await supabase
      .from("shared_cards")
      .select("token")
      .eq("user_id", userId)
      .eq("pet_id", data.petId)
      .maybeSingle();
    if (existing.error) throw new Error(existing.error.message);

    const token = existing.data?.token ?? makeToken();
    const { error } = await supabase.from("shared_cards").upsert(
      {
        token,
        user_id: userId,
        pet_id: data.petId,
        pet_name: data.petName,
        snapshot: data.card as never,
        revoked: false,
        updated_at: new Date().toISOString(),
      } as never,
      { onConflict: "token" },
    );
    if (error) throw new Error(error.message);
    return { token };
  });

/** Returns the existing link token for a pet, if one has been published. */
export const getSharedCardToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ({
    petId: String((input as Record<string, unknown>)?.["petId"] ?? ""),
  }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("shared_cards")
      .select("token, revoked")
      .eq("user_id", userId)
      .eq("pet_id", data.petId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row || row.revoked) return { token: null as string | null };
    return { token: row.token as string };
  });

/** Turns off the public link for a pet without touching any stored data. */
export const revokeSharedCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ({
    petId: String((input as Record<string, unknown>)?.["petId"] ?? ""),
  }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("shared_cards")
      .update({ revoked: true } as never)
      .eq("user_id", userId)
      .eq("pet_id", data.petId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Public read of a shared card by its unguessable token. Uses admin access so
 * the table itself stays closed to anonymous reads (no enumeration possible).
 */
export const readSharedCard = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ({
    token: String((input as Record<string, unknown>)?.["token"] ?? ""),
  }))
  .handler(async ({ data }) => {
    if (!/^[a-z0-9]{8,64}$/.test(data.token)) return { card: null };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("shared_cards")
      .select("pet_name, snapshot, revoked, updated_at")
      .eq("token", data.token)
      .maybeSingle();
    if (error) throw new Error("We couldn't load that care card. Please try again.");
    if (!row || row.revoked) return { card: null };
    return {
      card: {
        petName: row.pet_name as string,
        card: row.snapshot,
        publishedAt: row.updated_at as string,
      } satisfies SharedCardSnapshot,
    };
  });
