import { createServerFn } from "@tanstack/react-start";

import type { Guide } from "./guides-data";

/** Public: published auto-written guides, merged into the static list by callers. */
export const getGeneratedGuides = createServerFn({ method: "GET" }).handler(async (): Promise<Guide[]> => {
  const { fetchPublishedGeneratedGuides } = await import("./generated-guides.server");
  return fetchPublishedGeneratedGuides();
});

export interface AdminGuideRow {
  slug: string;
  title: string;
  status: string;
  topic: string | null;
  publishedAt: string;
}

/** Owner-only: list auto-written guides (published and unpublished). */
export const listAutoGuidesAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: { key: string }) => {
    if (!data || typeof data.key !== "string") throw new Error("Admin key required");
    return { key: data.key };
  })
  .handler(async ({ data }): Promise<AdminGuideRow[]> => {
    const secret = process.env["WEEKLY_GUIDE_SECRET"];
    if (!secret || data.key !== secret) {
      throw new Error("That admin key is not correct.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("generated_guides")
      .select("slug,title,status,topic,published_at")
      .order("published_at", { ascending: false })
      .limit(200);
    if (error) throw new Error("Could not load auto-written guides right now.");
    return (rows ?? []).map((row) => ({
      slug: row.slug as string,
      title: row.title as string,
      status: row.status as string,
      topic: (row.topic as string | null) ?? null,
      publishedAt: row.published_at as string,
    }));
  });

/** Owner-only: take an auto-written guide offline, or put it back. */
export const setAutoGuideStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { key: string; slug: string; status: "published" | "unpublished" }) => {
    if (!data || typeof data.key !== "string" || typeof data.slug !== "string") {
      throw new Error("Admin key and guide are required");
    }
    if (data.status !== "published" && data.status !== "unpublished") {
      throw new Error("Invalid status");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const secret = process.env["WEEKLY_GUIDE_SECRET"];
    if (!secret || data.key !== secret) {
      throw new Error("That admin key is not correct.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("generated_guides")
      .update({ status: data.status })
      .eq("slug", data.slug);
    if (error) throw new Error("Could not update that guide right now.");
    return { ok: true as const };
  });
