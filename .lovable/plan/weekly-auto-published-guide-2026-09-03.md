# Weekly auto-published guide

One new caregiver guide goes live every week, written automatically, with no manual step. Topics are chosen fresh each week and checked against everything already published so nothing repeats.

## How it will work

```text
Monday 09:00 UTC
  -> pick a topic not already covered
  -> write the guide (direct answer, sections, FAQs, related links)
  -> quality + safety checks
  -> save as published
  -> live at /guides/<slug>, listed on /guides, added to sitemap.xml and llms.txt
```

## Topic selection

The generator receives the titles and slugs of every existing guide (13 today, plus everything auto-published since) and is instructed to choose a distinct, high-intent pet-care topic a caregiver or owner would actually search for — feeding, medication routines, sitter handoffs, travel and boarding, senior and puppy/kitten care, emergencies, species-specific routines. Near-duplicate slugs and titles are rejected and a new topic is requested, up to three attempts.

Topics stay inside the site's niche: practical pet-care instructions and caregiver handoff. The prompt explicitly forbids diagnosis, dosage recommendations, and anything that reads as veterinary advice, and requires a "follow your vet's instructions" line on any health-adjacent guide — matching the existing guides.

## Quality gates before anything is published

A guide is only saved if it passes all of these; otherwise the run stops and nothing is published that week:

- Unique slug and title versus every existing guide
- Minimum length, plus all required parts present (40-60 word direct answer, 4+ sections, 3+ FAQs)
- No dosage figures or diagnostic claims
- Valid links to related existing guides only

Because publishing is automatic, an admin screen at `/settings` will list auto-published guides with a one-click **Unpublish** so anything wrong can be pulled immediately, and every run is logged with its outcome.

## What visitors see

Auto-published guides render through the same guide page as the hand-written ones — same layout, breadcrumbs, direct-answer block, Article/FAQ/Breadcrumb structured data, same social card. They appear on `/guides`, in `sitemap.xml`, and in `llms.txt` automatically, so Google and AI assistants pick them up on the next crawl.

## Technical notes

- New table `public.generated_guides`: slug (unique), title, meta title, description, answer, sections and faqs as JSON, related slugs, read minutes, published/updated timestamps, status (`published` | `unpublished`), plus generation metadata. GRANTs: `SELECT` to `anon`/`authenticated` filtered to `status = 'published'` by RLS; writes service-role only. A `generation_runs` table records each attempt (topic, outcome, error).
- Generation runs in `src/routes/api/public/hooks/weekly-guide.ts`, guarded by a shared-secret header stored as a Cloud secret. It calls the Lovable AI Gateway (current Gemini flash model, structured JSON output) — no extra API key needed; cost is a few credits per week.
- Scheduled with `pg_cron` + `pg_net`, weekly at Monday 09:00 UTC, against the stable `project--<id>.lovable.app` URL. Weekly cadence means no meaningful recurring database cost.
- Guide reads move behind a single source that merges the static `GUIDES` array with published rows from the database, used by `/guides`, `/guides/$slug`, `sitemap.xml`, `llms.txt` and `/about`. The 13 existing guides stay in code exactly as they are.
- `llms.txt` becomes a server route so it stays in sync, replacing the static file.
- Verification: the endpoint is invoked once manually after build to confirm a real guide is generated, saved, rendered at its URL and present in the sitemap.

## Your ongoing effort

None required. Optionally check the auto-published list occasionally and unpublish anything you disagree with.
