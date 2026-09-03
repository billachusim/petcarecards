import type { Guide, GuideFaq, GuideSection } from "./guides-data";

interface GeneratedGuideRow {
  slug: string;
  title: string;
  meta_title: string;
  description: string;
  answer: string;
  intro: unknown;
  sections: unknown;
  faqs: unknown;
  related: unknown;
  read_minutes: number;
  medical_disclaimer: boolean;
  published_at: string;
  updated_at: string;
}

function toDate(value: string): string {
  return new Date(value).toISOString().slice(0, 10);
}

export function rowToGuide(row: GeneratedGuideRow): Guide {
  return {
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title,
    description: row.description,
    answer: row.answer,
    published: toDate(row.published_at),
    updated: toDate(row.updated_at),
    readMinutes: row.read_minutes,
    medicalDisclaimer: row.medical_disclaimer,
    intro: (row.intro as string[]) ?? [],
    sections: (row.sections as GuideSection[]) ?? [],
    faqs: (row.faqs as GuideFaq[]) ?? [],
    related: (row.related as string[]) ?? [],
    generated: true,
  };
}

/** Published auto-written guides, newest first. Server-only. */
export async function fetchPublishedGeneratedGuides(): Promise<Guide[]> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("generated_guides")
      .select(
        "slug,title,meta_title,description,answer,intro,sections,faqs,related,read_minutes,medical_disclaimer,published_at,updated_at",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("[guides] failed to load generated guides", error.message);
      return [];
    }

    return (data ?? []).map((row) => rowToGuide(row as unknown as GeneratedGuideRow));
  } catch (error) {
    console.error("[guides] generated guide lookup failed", error);
    return [];
  }
}
