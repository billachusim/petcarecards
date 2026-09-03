import { GUIDES, type Guide, type GuideFaq, type GuideSection } from "./guides-data";
import { fetchPublishedGeneratedGuides } from "./generated-guides.server";

const MODEL = "openai/gpt-5.6-sol";
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MAX_TOPIC_ATTEMPTS = 3;
const MAX_TRANSIENT_RETRIES = 2;
const LEASE_MINUTES = 15;

export interface RunResult {
  status: "published" | "skipped" | "failed" | "paused" | "locked";
  slug?: string;
  topic?: string;
  reason?: string;
}

interface DraftGuide {
  topic: string;
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  answer: string;
  readMinutes: number;
  medicalDisclaimer: boolean;
  intro: string[];
  sections: GuideSection[];
  faqs: GuideFaq[];
  related: string[];
}

class TerminalGatewayError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

/** Rejects anything that reads as dosing or diagnosis rather than organisation. */
const UNSAFE_PATTERNS: RegExp[] = [
  /\b\d+(\.\d+)?\s?(mg|milligram|ml|millilitre|milliliter|cc|iu)\b/i,
  /\bmg\s*\/\s*kg\b/i,
  /\b(diagnos(e|is|ing)|prescrib(e|ing)|dosage of|correct dose)\b/i,
  /\bgive (your|the) (dog|cat|pet) \d+/i,
];

function findUnsafeText(draft: DraftGuide): string | null {
  const haystack = [
    draft.title,
    draft.description,
    draft.answer,
    ...draft.intro,
    ...draft.sections.flatMap((section) => [
      section.heading,
      ...(section.paragraphs ?? []),
      ...(section.bullets ?? []),
      ...(section.checklist ?? []),
    ]),
    ...draft.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join("\n");

  for (const pattern of UNSAFE_PATTERNS) {
    const match = haystack.match(pattern);
    if (match) return match[0];
  }
  return null;
}

function validateDraft(
  draft: DraftGuide,
  existingSlugs: Set<string>,
  existingTitles: Set<string>,
): string | null {
  if (!draft.slug || !/^[a-z0-9-]{8,70}$/.test(draft.slug)) return "invalid slug";
  if (existingSlugs.has(draft.slug)) return `duplicate slug: ${draft.slug}`;
  if (existingTitles.has(normalizeTitle(draft.title))) return `duplicate title: ${draft.title}`;
  if (draft.title.length < 15 || draft.title.length > 90) return "title length out of range";
  if (draft.metaTitle.length < 15 || draft.metaTitle.length > 75) return "meta title length out of range";
  if (draft.description.length < 70 || draft.description.length > 165) return "description length out of range";

  const answerWords = wordCount(draft.answer);
  if (answerWords < 35 || answerWords > 70) return `answer is ${answerWords} words`;
  if (draft.intro.length < 1) return "missing intro";
  if (draft.sections.length < 4) return `only ${draft.sections.length} sections`;
  if (draft.faqs.length < 3) return `only ${draft.faqs.length} FAQs`;

  for (const section of draft.sections) {
    const body = [...(section.paragraphs ?? []), ...(section.bullets ?? []), ...(section.checklist ?? [])];
    if (!section.heading || body.length === 0) return "a section is empty";
  }
  for (const faq of draft.faqs) {
    if (!faq.question || wordCount(faq.answer) < 15) return "an FAQ answer is too short";
  }

  const unsafe = findUnsafeText(draft);
  if (unsafe) return `unsafe medical content: "${unsafe}"`;

  return null;
}

function buildPrompt(existing: Guide[]): string {
  const list = existing.map((guide) => `- ${guide.slug} — ${guide.title}`).join("\n");
  return `You write practical pet-care guides for Pet Care Card (petcarecards.app), a free tool that turns a pet's feeding, routine, medication and emergency details into one care card an owner can hand to a sitter.

Pick ONE new guide topic and write it in full.

Topic rules:
- It must be a topic a pet owner or caregiver genuinely searches for: feeding and portions, daily routines, sitter and boarding handovers, travel, puppy/kitten and senior care, house-sitting logistics, emergency preparedness, species-specific routines (dogs, cats, and occasionally rabbits, birds or small pets).
- It must be clearly DIFFERENT from every guide already published. Do not rewrite, re-angle, or narrow an existing topic.
- Write for a real search intent, with a specific, natural title (no clickbait, no year numbers, no "ultimate").

Already published (do not repeat these topics):
${list}

Safety rules (strict):
- Never diagnose a condition, never recommend or state medication names, doses, dosages, amounts in mg/ml, or frequency of medication.
- For anything health-related, tell the reader to follow their veterinarian's written instructions and set medicalDisclaimer to true.
- Food portion guidance may reference general planning ranges and standard calorie formulas, but must tell the reader to confirm with their vet or the food label.
- Never invent statistics, studies, brands, prices, testimonials or expert quotes.

Style: plain British-neutral English, second person, concrete and practical, short paragraphs, useful checklists. No emojis. No mention of being AI-written.

Return ONLY valid JSON in exactly this shape:
{
  "topic": "short description of the search intent",
  "slug": "kebab-case-url-slug",
  "title": "H1 title, 30-70 characters",
  "metaTitle": "SEO title ending with ' — Pet Care Card', under 70 characters",
  "description": "meta description, 90-155 characters",
  "answer": "a direct answer of 40-60 words that fully answers the title on its own",
  "readMinutes": 6,
  "medicalDisclaimer": false,
  "intro": ["1-2 short opening paragraphs"],
  "sections": [
    { "heading": "Section heading", "paragraphs": ["..."], "bullets": ["..."], "checklist": ["..."] }
  ],
  "faqs": [ { "question": "...", "answer": "2-4 sentences" } ],
  "related": ["slug-of-an-existing-guide", "another-existing-slug"]
}

Include at least 5 sections (each with a heading plus paragraphs and/or bullets or a checklist) and at least 4 FAQs. "related" must contain 2-3 slugs taken only from the published list above.`;
}

async function callGateway(prompt: string): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new TerminalGatewayError("LOVABLE_API_KEY is not configured.", 401);

  let attempt = 0;
  for (;;) {
    const response = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a careful pet-care writer. You never give veterinary, diagnostic or dosing advice. You always return strict JSON with no markdown fences.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (response.ok) {
      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = payload.choices?.[0]?.message?.content;
      if (!content) throw new Error("The AI service returned an empty response.");
      return content;
    }

    const body = await response.text();
    const status = response.status;

    if (status === 429 || status >= 500) {
      if (attempt >= MAX_TRANSIENT_RETRIES) {
        throw new TerminalGatewayError(
          status === 429
            ? "The AI service is rate limited; the next weekly run will try again."
            : "The AI service is temporarily unavailable; the next weekly run will try again.",
          status,
        );
      }
      const retryAfter = Number(response.headers.get("retry-after"));
      const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? Math.min(retryAfter, 60) * 1000
        : (attempt + 1) * 5000 + Math.floor(Math.random() * 2000);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      attempt += 1;
      continue;
    }

    let message = `The AI service rejected the request (${status}).`;
    try {
      const parsed = JSON.parse(body) as { error?: { message?: string }; message?: string };
      message = parsed.error?.message ?? parsed.message ?? message;
    } catch {
      /* keep default message */
    }
    throw new TerminalGatewayError(message, status);
  }
}

function parseDraft(raw: string): DraftGuide {
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const parsed = JSON.parse(cleaned) as Partial<DraftGuide> & { slug?: string; title?: string };

  const title = String(parsed.title ?? "").trim();
  return {
    topic: String(parsed.topic ?? title).trim(),
    slug: slugify(String(parsed.slug ?? title)),
    title,
    metaTitle: String(parsed.metaTitle ?? title).trim(),
    description: String(parsed.description ?? "").trim(),
    answer: String(parsed.answer ?? "").trim(),
    readMinutes: Math.min(15, Math.max(3, Number(parsed.readMinutes) || 6)),
    medicalDisclaimer: Boolean(parsed.medicalDisclaimer),
    intro: (parsed.intro ?? []).map((line) => String(line).trim()).filter(Boolean),
    sections: (parsed.sections ?? []).filter(Boolean),
    faqs: (parsed.faqs ?? []).filter((faq) => faq && faq.question && faq.answer),
    related: (parsed.related ?? []).map((slug) => String(slug).trim()).filter(Boolean),
  };
}

async function setJobState(fields: Record<string, unknown>) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin
    .from("guide_job_state")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", "weekly-guide");
}

/**
 * Generates and publishes one guide. Single-flight via a database lease,
 * bounded attempts, and self-pausing on credit/policy failures.
 */
export async function runWeeklyGuideJob(force = false): Promise<RunResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const now = new Date();
  const leaseUntil = new Date(now.getTime() + LEASE_MINUTES * 60_000).toISOString();

  const { data: state } = await supabaseAdmin
    .from("guide_job_state")
    .select("paused,pause_reason")
    .eq("id", "weekly-guide")
    .maybeSingle();

  // Single-flight: only one caller can move the lease forward.
  const { data: leased } = await supabaseAdmin
    .from("guide_job_state")
    .update({ lease_until: leaseUntil, last_run_at: now.toISOString() })
    .eq("id", "weekly-guide")
    .or(`lease_until.is.null,lease_until.lt.${now.toISOString()}`)
    .select("id");

  if (!leased || leased.length === 0) {
    return { status: "locked", reason: "Another run is already in progress." };
  }

  const paused = Boolean(state?.paused) && !force;
  if (paused) {
    console.warn("[weekly-guide] job is paused; running a single probe:", state?.pause_reason);
  }

  const { data: run } = await supabaseAdmin
    .from("guide_generation_runs")
    .insert({ status: "running" })
    .select("id")
    .single();
  const runId = run?.id as string | undefined;

  const finish = async (result: RunResult, attempts: number) => {
    if (runId) {
      await supabaseAdmin
        .from("guide_generation_runs")
        .update({
          status: result.status === "locked" ? "skipped" : result.status,
          finished_at: new Date().toISOString(),
          topic: result.topic ?? null,
          slug: result.slug ?? null,
          attempts,
          error: result.reason ?? null,
        })
        .eq("id", runId);
    }
    await setJobState({ lease_until: null });
    return result;
  };

  try {
    const generated = await fetchPublishedGeneratedGuides();
    const existing = [...GUIDES, ...generated];
    const existingSlugs = new Set(existing.map((guide) => guide.slug));
    const existingTitles = new Set(existing.map((guide) => normalizeTitle(guide.title)));
    const prompt = buildPrompt(existing);

    let lastReason = "";
    for (let attempt = 1; attempt <= MAX_TOPIC_ATTEMPTS; attempt += 1) {
      const raw = await callGateway(
        attempt === 1
          ? prompt
          : `${prompt}\n\nYour previous attempt was rejected because: ${lastReason}. Choose a different topic and fix the problem.`,
      );

      let draft: DraftGuide;
      try {
        draft = parseDraft(raw);
      } catch {
        lastReason = "the response was not valid JSON";
        continue;
      }

      draft.related = draft.related.filter((slug) => existingSlugs.has(slug)).slice(0, 3);
      const problem = validateDraft(draft, existingSlugs, existingTitles);
      if (problem) {
        lastReason = problem;
        console.warn(`[weekly-guide] attempt ${attempt} rejected: ${problem}`);
        continue;
      }

      const { error } = await supabaseAdmin.from("generated_guides").insert({
        slug: draft.slug,
        title: draft.title,
        meta_title: draft.metaTitle,
        description: draft.description,
        answer: draft.answer,
        intro: draft.intro,
        sections: draft.sections as unknown as never,
        faqs: draft.faqs as unknown as never,
        related: draft.related,
        read_minutes: draft.readMinutes,
        medical_disclaimer: draft.medicalDisclaimer,
        status: "published",
        topic: draft.topic,
        model: MODEL,
      });

      if (error) {
        lastReason = `database insert failed: ${error.message}`;
        console.error("[weekly-guide]", lastReason);
        continue;
      }

      if (state?.paused) {
        await setJobState({ paused: false, pause_reason: null, paused_at: null });
      }

      console.log(`[weekly-guide] published /guides/${draft.slug}`);
      return await finish({ status: "published", slug: draft.slug, topic: draft.topic }, attempt);
    }

    return await finish(
      { status: "skipped", reason: `No publishable guide after ${MAX_TOPIC_ATTEMPTS} attempts: ${lastReason}` },
      MAX_TOPIC_ATTEMPTS,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (error instanceof TerminalGatewayError && (error.status === 402 || error.status === 403)) {
      // Circuit breaker: stop future runs until credits/policy are sorted out.
      await setJobState({ paused: true, pause_reason: message, paused_at: new Date().toISOString() });
      console.error("[weekly-guide] paused:", message);
      return await finish({ status: "paused", reason: message }, 1);
    }

    console.error("[weekly-guide] failed:", message);
    return await finish({ status: "failed", reason: message }, 1);
  }
}
