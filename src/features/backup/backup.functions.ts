import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import type { BackupPayload, BackupRow } from "./backup-mapping";

const TABLES = [
  "backup_pets",
  "backup_feedings",
  "backup_routines",
  "backup_medications",
  "backup_emergency_contacts",
  "backup_vets",
  "backup_reminders",
] as const;

type Row = BackupRow;

const asRows = (value: unknown): Row[] =>
  Array.isArray(value) ? (value.filter((v) => v && typeof v === "object") as Row[]) : [];

const validate = (input: unknown): BackupPayload => {
  const raw = (input ?? {}) as Record<string, unknown>;
  const caregiver = (raw["caregiver"] ?? {}) as Record<string, unknown>;
  const text = (v: unknown) => (typeof v === "string" ? v : null);
  return {
    pets: asRows(raw["pets"]),
    feedings: asRows(raw["feedings"]),
    routines: asRows(raw["routines"]),
    medications: asRows(raw["medications"]),
    emergency: asRows(raw["emergency"]),
    vets: asRows(raw["vets"]),
    reminders: asRows(raw["reminders"]),
    caregiver: {
      name: text(caregiver["name"]),
      phone: text(caregiver["phone"]),
      notes: text(caregiver["notes"]),
    },
  };
};

/** Uploads the caller's full local care data, replacing their previous backup. */
export const pushBackup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(validate)
  .handler(async ({ data, context }) => {
    const { supabase, userId, claims } = context;
    const email = typeof claims?.["email"] === "string" ? (claims["email"] as string) : null;

    const own = <T extends Row>(rows: T[]) => rows.map((row) => ({ ...row, user_id: userId }));

    const profile = await supabase.from("profiles").upsert({
      id: userId,
      email,
      caregiver_name: data.caregiver.name ?? null,
      caregiver_phone: data.caregiver.phone ?? null,
      caregiver_notes: data.caregiver.notes ?? null,
      backup_enabled: true,
    });
    if (profile.error) throw new Error(profile.error.message);

    const groups: Record<(typeof TABLES)[number], Row[]> = {
      backup_pets: own(data.pets),
      backup_feedings: own(data.feedings),
      backup_routines: own(data.routines),
      backup_medications: own(data.medications),
      backup_emergency_contacts: own(data.emergency),
      backup_vets: own(data.vets),
      backup_reminders: own(data.reminders),
    };

    for (const table of TABLES) {
      const rows = groups[table];
      if (rows.length > 0) {
        const upsert = await supabase.from(table).upsert(rows as never);
        if (upsert.error) throw new Error(upsert.error.message);
      }
      // Drop rows deleted on the device.
      const keep = rows.map((row) => String(row["id"]));
      let remove = supabase.from(table).delete().eq("user_id", userId);
      if (keep.length > 0) remove = remove.not("id", "in", `(${keep.map((k) => `"${k}"`).join(",")})`);
      const removed = await remove;
      if (removed.error) throw new Error(removed.error.message);
    }

    return { ok: true, savedAt: new Date().toISOString() };
  });

/** Returns the caller's stored backup so it can be restored onto a device. */
export const pullBackup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const read = async (table: (typeof TABLES)[number]) => {
      const { data, error } = await supabase.from(table).select("*").eq("user_id", userId);
      if (error) throw new Error(error.message);
      return (data ?? []) as Row[];
    };
    const profile = await supabase
      .from("profiles")
      .select("caregiver_name, caregiver_phone, caregiver_notes")
      .eq("id", userId)
      .maybeSingle();

    const payload: BackupPayload = {
      pets: await read("backup_pets"),
      feedings: await read("backup_feedings"),
      routines: await read("backup_routines"),
      medications: await read("backup_medications"),
      emergency: await read("backup_emergency_contacts"),
      vets: await read("backup_vets"),
      reminders: await read("backup_reminders"),
      caregiver: {
        name: profile.data?.caregiver_name ?? null,
        phone: profile.data?.caregiver_phone ?? null,
        notes: profile.data?.caregiver_notes ?? null,
      },
    };
    return payload;
  });

/** Permanently removes every backup row belonging to the caller. */
export const deleteBackup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    for (const table of TABLES) {
      const { error } = await supabase.from(table).delete().eq("user_id", userId);
      if (error) throw new Error(error.message);
    }
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
