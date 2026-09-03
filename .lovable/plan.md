# Pet data: anonymous insights + optional cloud backup

Two separate systems, both opt-in, both switchable off in Settings.

## 1. Anonymous usage events (no email, no pet names)

A lightweight event log that tells you how the app is really used and builds a
long-term dataset with no personal data in it.

Each event stores: a random device ID (generated locally, not tied to a person),
event name, timestamp, and a small set of safe attributes.

Events tracked:
- `pet_added` — species, sex, age band (puppy/adult/senior), weight band
- `care_card_created` — which sections were filled in, number of pets on device
- `card_shared` — method (link, PDF, print, QR)
- `voice_fill_used` — whether the transcript was edited before saving
- `reminder_created` — reminder type, repeat pattern
- `premium_unlocked`

Never stored here: pet name, photo, free-text notes, phone numbers, addresses,
vet names, email, IP-derived identity.

Why this is valuable: it produces clean, structured, aggregate-ready records
(species/breed mix, feeding patterns, medication frequency shape, seasonal
signals) with essentially zero re-identification risk — the kind of dataset that
is safe to summarise publicly or license later.

## 2. Optional account backup (email, full care data)

For users who want their card on a second device.

- Sign in with Google or email to enable backup.
- Their pets, feedings, routines, medications, vets, emergency contacts and
  reminders sync to their account and restore on any device.
- Local-first stays the default: not signing in changes nothing about how the
  app works today.
- Clear framing at the prompt: "Back up your card so you can open it on a new
  phone. You can delete it any time."
- Delete-account button wipes every server row for that user.

## 3. Consent and legal

- A one-time card after the first care card is created, offering both switches
  separately: "Help improve Pet Care Card (anonymous)" and "Back up my card".
  Both default to off; dismissing keeps them off.
- Settings gets a Data & privacy section with both toggles, an export button and
  a delete-my-data button.
- Privacy policy gains a section (Tech Faculty as controller) covering: what
  anonymous events contain, that backup data is personal data processed on
  consent, retention, and an explicit statement that **aggregated and anonymised
  insights may be published, shared or licensed to third parties**, while
  identifiable account data never is.
- Terms gains matching wording so future licensing is covered from day one.

## Technical notes

- Two new tables. `pet_events`: device_id, event, props jsonb, app_version,
  created_at — insert-only for anon/authenticated, no read access from the
  client, service_role for analysis. Written through a server function that
  strips anything not on an allow-list of keys, so free text can never leak in.
- `care_backups` (or per-entity tables): user_id owned, RLS scoped to
  `auth.uid()`, full grants to that user only. Sync is last-write-wins on
  `updated_at` per record, pushed from the existing care store.
- Auth: Google sign-in via the Lovable broker plus email; the app stays fully
  usable signed-out — no route is gated.
- Backup writes go through authenticated server functions; event writes through
  a public server function that never returns data.
- A small dashboard is out of scope for this pass; aggregate queries can be run
  against the backend directly.

## Order of work

1. Migration: `pet_events` + backup tables, RLS, grants.
2. Consent store, Settings section, one-time prompt card.
3. Event emission at the six tracked moments.
4. Auth + backup sync and restore, delete-my-data.
5. Privacy, Terms and Refunds wording updates.
