# Make "Talk about your pet" findable in search and AI answers

Right now the voice feature only exists inside the app, behind screens Google and AI chatbots can never see. This plan gives it public, indexable pages so people searching "pet sitter instructions", "voice notes for my dog sitter", or asking ChatGPT "how do I quickly write care instructions for my pet sitter?" land on Pet Care Card.

Semrush shows the direct terms are small but very winnable (e.g. "pet sitter instructions": ~110 searches/month, difficulty 24/100 — easy), and the surrounding house/pet-sitting cluster is much larger. The play is to own the "talk instead of typing" angle nobody else covers.

## 1. New public feature page: /talk-about-your-pet

A real marketing page (not app-only) built around the promise: *speak for a minute, get a complete care card for your sitter, grandparents, dog walker or friend.*

- H1: "Talk about your pet — we'll write the care card"
- Short demo-style section showing a spoken sentence turning into filled fields (food, walks, medication, vet, emergency contact)
- Three steps: press the mic, say what a sitter should know, check and share
- Who it's for: pet sitters, dog walkers, boarding kennels, grandparents, neighbours, friends
- Answers the objections: works in English, nothing saves until you check it, your recording isn't stored, two free voice fills then a one-off unlock
- Clear calls to action into the app, plus links to the printable templates and the sitter checklist guide
- Its own title, description, canonical, og/twitter tags with the existing social image

## 2. New guide: how to record care instructions by voice

A public guide (in the same guides system as the existing ones) targeting how-to phrasing people actually search and ask chatbots:
"How to leave pet care instructions for a sitter without typing it all out."

Includes a direct answer at the top, a script of exactly what to say out loud (so it's quotable by AI assistants), what sitters most often need, what not to rely on voice for (exact medication doses — always check the label), and links to the feature page and templates.

## 3. Put voice on the pages that already get traffic

- Add a voice section to the public landing page copy, so the homepage itself says the app can be filled in by talking
- Add a short "prefer to talk?" cross-link from the most relevant existing guides (sitter checklist, dog-sitter handoff, cat instructions, printable templates)
- Add it to the About page description of what the app does

## 4. Structured data and AI-search wiring

- HowTo structured data on the feature page (press mic → speak → review → share), so it can be pulled into AI answers and rich results
- FAQ structured data answering: Does it work on my phone? Is my voice recorded? Is it free? What languages? Can I fix mistakes?
- BreadcrumbList on both new pages, matching the existing pages
- Add the voice capability to the app's existing SoftwareApplication feature list
- Add both new URLs to the sitemap
- Extend the machine-readable llms.txt so AI chatbots see "voice-to-care-card" as a named capability with a one-line description and URL — this is what gets us cited in chatbot answers

## 5. Wording that matches how people search

Use the natural phrases throughout the new pages instead of product jargon:
pet sitter instructions, dog sitter instructions, what to leave for a pet sitter, care instructions for grandparents watching the dog, voice notes for pet sitter, pet care instruction sheet.

## Technical notes

- New route `src/routes/talk-about-your-pet.tsx` (public, indexable) with `head()` metadata, canonical and JSON-LD via the existing `src/lib/seo.ts` helpers (`absoluteUrl`, `breadcrumbLd`, `jsonLdScript`, social image constants).
- New static guide entry in `src/features/guides/guides-data.ts` following the existing `Guide` shape (direct answer, sections, FAQs, related links, dates, disclaimer) — it flows into `/guides`, the sitemap and llms.txt automatically.
- Add `/talk-about-your-pet` to `src/routes/sitemap[.]xml.ts` and to the capability list in `src/routes/llms[.]txt.ts`.
- Update landing copy in `src/routes/index.tsx`, plus `related` links in the four existing guides named above and the `/about` description.
- No changes to the voice feature's behaviour, pricing, gating or storage — this is presentation and metadata only.

## Not in scope

No new tracking, no pricing changes, no publishing. After this ships you can publish and submit the two new URLs in Search Console.
