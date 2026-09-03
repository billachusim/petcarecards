# SEO + AI-search growth plan for Pet Care Card

Goal: rank in Google for pet-handover searches, and get named by AI assistants
(ChatGPT, Gemini, Perplexity, Copilot) and Google's AI results when people ask
"what should I leave my pet sitter?".

## Part 1 — Fix what's currently broken

These are confirmed problems in the project today:

- `public/robots.txt` and `public/sitemap.xml` still point at the old
  `project--e388cfa0…lovable.app` preview domain, not `petcarecards.app`.
  Google will treat those as a different site. Fix both to the real domain.
- The sitemap is a hand-written static file, so it drifts every time a guide is
  added. Replace it with a route that generates the XML from the real guide list
  (needs your OK — see Questions).
- Guide pages have Article and FAQ structured data but no breadcrumb data, so
  Google can't show the "Home > Guides > …" trail in results.
- No Google Search Console connection, so there's zero visibility into what
  you actually rank for. Connect it and submit the sitemap.

## Part 2 — Content that can actually rank

Current guides target very small terms (20–140 searches/month). They're good
for AI answers but won't move Google traffic much. Add six guides aimed at
real demand, all still on-mission (things a caregiver needs to know):

| New guide | Monthly US searches | Difficulty |
|---|---|---|
| Puppy feeding schedule by age | 1,600 | easy |
| How to give a dog a pill (without the fight) | 1,600 | easy |
| Cat feeding schedule: how often and how much | 1,300 | easy |
| Dog feeding chart by weight | 1,000 | medium |
| Pet first aid basics for sitters | 720 | medium |
| Dog sitter checklist before you leave | 140 | easy |

Each follows the existing guide format (short answer up top, sections, FAQs,
care-card CTA), keeps the non-medical disclaimer, and links to the related
existing guides so the hub gains internal-link strength.

Plus two free, indexable tools that attract links and are the kind of thing
AI assistants cite:

- **Pet feeding calculator** — enter weight, age and food type, get a portion
  and schedule you can push straight into a care card.
- **Printable care sheet library** — blank PDF templates (sitter checklist,
  emergency contacts, medication log) downloadable without an account.

## Part 3 — Being the answer AI assistants give

- Expand `llms.txt` into a fuller machine-readable summary: absolute URLs, a
  one-line description per page, pricing, and explicit "what this is not".
- Add a short **direct answer block** at the top of every guide — 40–60 words
  that fully answer the title question. Assistants lift these verbatim.
- Add definition-style Q&A phrasing ("A pet care card is …") so the text
  matches how people phrase questions to chatbots.
- Add sitewide `WebSite` + `Organization` structured data naming Tech Faculty,
  with `sameAs` links to your public profiles, and `BreadcrumbList` on guides.
- Add an **About** page describing Tech Faculty, who writes the guides and how
  they're reviewed. AI systems and Google both weight identifiable authorship.
- Confirm AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) are
  allowed in robots.txt — blocking them removes you from AI answers entirely.

## Part 4 — Ongoing (owner actions)

- Submit the sitemap in Google Search Console and Bing Webmaster Tools once the
  domain is live.
- Get listed where AI assistants source recommendations: Product Hunt,
  AlternativeTo, relevant subreddits, pet-blog roundups.
- Re-check rankings monthly and expand the guides that gain impressions.

## Technical notes

- New guides are entries in `src/features/guides/guides-data.ts`; the existing
  `/guides/$slug` route renders them, no new route file per guide.
- Tools become new public routes (`/tools/feeding-calculator`, `/templates`)
  with their own `head()` metadata via `publicHead()` and `SoftwareApplication`
  / `HowTo` structured data.
- Breadcrumb, WebSite and Organization JSON-LD go through the existing
  `jsonLdScript` helper in `src/lib/seo.ts`.
- Sitemap becomes `src/routes/sitemap[.]xml.ts` generating entries from
  `GUIDES` plus the static public routes; the old static file is deleted.
- No backend or schema changes; the feeding calculator runs client-side.

## Questions before I build

1. Should I replace the static sitemap with the auto-generating route? (Recommended.)
2. Build everything in Parts 1–3, or start with Part 1 + the six new guides?
3. Any public profiles (X, LinkedIn, Product Hunt) to reference in the About
   page and structured data?
