# Pet Care Cards

Build a complete, production-ready web app called "Pet Care Card" — a focused utility (NOT a social network, marketplace, or vet platform). This is the web (React/TypeScript) counterpart of an existing Flutter mobile app; replicate the same features, names, flows, and copy, adapted to web idioms only where a mobile-only capability has no web equivalent.

CORE PROMISE: "Are you leaving your pet with someone? Create a complete care card in two minutes." Flow: Open app → Add pet → Enter essential info → Generate Care Card → Share/print/QR, in ~2 minutes. Keep it extremely simple — do not add social feeds, marketplace, chat, ads, subscriptions, or analytics dashboards.

FREEMIUM MODEL: Free tier = 1 pet with full basic functionality (photo, basic info, caregiver info, feeding, bathroom/routine instructions, general care, emergency contact, vet info, basic care card, basic QR code, basic reminders) — genuinely useful, not crippled. Premium = ONE-TIME lifetime purchase (not subscription) at $4.99 via Lovable Payments/Stripe, unlocking: unlimited pets, full care cards, QR codes, medication schedules, advanced reminders, printable PDF care cards, shareable cards, emergency section, backup/export. Purchase screen must say "Unlock Lifetime — $4.99" and "One payment. Lifetime access. No subscription." — never subscription language. Include Restore Purchase equivalent, Terms, Privacy Policy links.

ONBOARDING (first launch, no account required): 3 screens — (1) "Leaving your pet with someone?" / "Create a simple care card with everything they need to know." (2) "Everything in one place." showing Feeding, Medication, Routine, Emergency contacts, Vet information. (3) "Share it in seconds." explaining share/print/QR. End with "Create My Pet Care Card" CTA.

HOME SCREEN: Empty state "Your pet's care card starts here." + "+ Add Pet" button when no pet. When a pet exists: photo, name, small summary, primary CTA "View Care Card", secondary actions Edit Pet / Share Card / QR Code, plus Reminders button. If premium, show simple pet list/grid. Keep it uncomplicated.

PET CREATION: Fast multi-step flow — name (required), species (Dog/Cat/Bird/Rabbit/Other), breed, sex, DOB/approx age, weight, photo — all except name clearly optional.

CARE CARD DATA SECTIONS (organize as short logical steps: Pet → Feeding → Routine → Medication → Emergency → Done, with progress indicator, skippable, savable):
- About: name, photo, species, breed, age, weight, personality/temperament, "things to know" free text.
- Feeding: multiple entries — food name/type, amount, feeding times, number of meals, treat instructions, foods to avoid, notes.
- Daily Routine: walk schedule, playtime, sleep routine, bathroom routine, crate instructions, indoor/outdoor notes, other — flexible free-form fields.
- Medications: multiple entries — name, dosage/instructions, time, frequency, start/end date, notes. Include explicit disclaimer: "The app does not provide medical advice or recommend medications or dosages. It only helps owners organize instructions they provide." No dosage suggestions, no brand recommendations, no diagnosis features anywhere.
- Emergency: emergency contact name/phone, secondary contact, veterinarian name/clinic/phone/address, special emergency instructions. Show Call and Directions quick actions only when the relevant info exists.

REMINDERS: For feeding, medication, walk, bathroom, and custom tasks — title, time, repeat schedule, start/end date, enable/disable. Implement with browser Notification API + service worker for local reminders (no backend requirement for core function). Request notification permission only when the user enables their first reminder, with explanatory copy: "Care Card uses notifications to remind you or your caregiver about scheduled care." Be upfront in the UI/help text that browser notifications only fire while the app/browser is active per web platform limits — do not overpromise native-app-level reliability.

CARE CARD (hero feature): Beautiful, highly readable, print-quality page with sections in order: header (photo, name, species/breed), ABOUT, FEEDING, ROUTINE, MEDICATION, EMERGENCY (visually distinct), VETERINARIAN, SPECIAL INSTRUCTIONS. Large typography, strong hierarchy, glanceable by a caregiver in seconds. Gracefully hide sections/fields that are empty.

QR CODE: Generate a QR pointing to a shareable Care Card route/identifier (e.g. /care/:id) — do NOT encode raw sensitive pet data directly into the QR payload. Build a clean CareCardSharingService abstraction so a hosted/public sharing backend can be added later without rewrites. For now, keep sharing scoped and avoid exposing unnecessary private data. Screen copy: "Scan to view [Pet Name]'s Care Card" with Share QR Code and Save QR Code actions.

SHARING: Use the Web Share API where supported, with a clean copy-link/download fallback. Options: Share Care Card, Share QR Code, Share PDF. No internal messaging system.

PDF EXPORT (premium): Polished, print-friendly (A4/Letter) PDF of the Care Card — clear sections, good typography, proper page breaks, no clipped text, graceful handling of long notes and missing optional fields. Flow: Generate → Preview → Share/Print (browser print + download).

PRINTING (premium): Use the browser's native print via a dedicated print-optimized layout/stylesheet — no custom print infrastructure.

DATA STORAGE: Local-first, no account required for the MVP. Use Lovable Cloud for persistence structured so it can work per-device/browser without login, keeping premium entitlement stored separately from pet data. Data model: Pet, FeedingSchedule, CareRoutine, Medication, Reminder, EmergencyContact, Veterinarian, CareCard — fields as commonly specified (id, petId relations, timestamps, etc.), strongly typed.

PRIVACY: No unnecessary data collection, no selling data, no unnecessary analytics, Privacy Policy and Terms of Use placeholders ready for real content before launch.

OFFLINE/PERFORMANCE: Core flows (create/edit pets, view care cards, manage reminders/medications, generate QR, view PDFs) should work without network beyond what's unavoidable for a web app; avoid unnecessary network calls, heavy startup work, and large image memory use — compress/resize pet photos; generate PDFs asynchronously so the UI never freezes.

ARCHITECTURE: Feature-oriented folder structure mirroring: onboarding, pets, care-card, reminders, medications, sharing, pdf, premium, settings — with clear separation of UI, business logic/hooks, models, and data/services layers. Keep business logic out of components, avoid giant files, build reusable components, strong TypeScript typing throughout.

UI/UX: Warm, trustworthy, calm, modern, "premium without flashy" — not cartoonish. Rounded cards, large readable type, generous whitespace, clear primary buttons, simple icons, strong visual hierarchy. Accessible: good contrast, large touch targets, screen-reader labels, keyboard-safe forms, respects browser text-size settings.

VALIDATION: Pet name required; sensible (not overly strict) phone validation; medication requires name if an entry exists; validate start/end date relationships; never crash on empty optional fields.

ERROR HANDLING: Human-readable messages everywhere (permission denial, photo permission, invalid input, PDF/QR/share failures, storage errors, payment/restore errors) — never show raw exceptions to users.

PREMIUM GATING: When a free user hits a premium feature, show a concise paywall: "Keep everything ready for your pet's caregiver." with checklist (Unlimited pets, Medication schedules, Smart care reminders, Printable Care Cards, PDF export, Easy sharing), "Unlock Lifetime — $4.99", "One payment. No subscription.", and a Restore Purchase option. Do not repeatedly interrupt with aggressive paywalls — keep the free product genuinely useful.

SETTINGS: Keep minimal — Restore Purchase, Premium status, Notification settings, Data export, Delete all local data (with confirmation: "Delete all pet data? This cannot be undone." Cancel/Delete), Privacy Policy, Terms of Use, About, App version.

EMPTY STATES: Thoughtful copy exactly as: no pets → "No care cards yet." / "Create one for your pet before their next stay with a sitter." (CTA Add Pet); no medications → "No medications added" / "Add any existing medication instructions your caregiver needs."; no reminders → "No reminders yet" / "Add feeding, medication, walking, or custom care reminders."

NAVIGATION: Clean client-side routing reflecting the deep-link intent from the original spec (home, add/edit pet, care card view at a shareable route, reminders, medications, premium/paywall, settings), so a shareable Care Card URL can open directly to that pet's card.

Please set up Lovable Cloud for local-first data persistence and reminders, and set up Lovable Payments for the one-time $4.99 lifetime unlock (recommend the right provider/config). Do not build any of the explicitly out-of-scope features (social feeds, marketplace, vet chat, insurance, subscriptions, ads, complex analytics, internal chat). Keep the whole experience simple enough that a pet owner understands it in seconds: "I'm leaving my pet with someone. This gives them everything they need."

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://petcarecards.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e388cfa0-1f6a-44f4-a7ed-c96329bf5ab7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
