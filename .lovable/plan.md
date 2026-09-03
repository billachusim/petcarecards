# Optional account backup for pet care data

One data flow only: if a user turns it on, their full care card is stored in our
backend under their account. Nothing is sent otherwise. No separate anonymous
event tracking.

## What the user sees

- Settings gains a "Back up and sync" section: sign in with Google or email.
- Clear framing at sign-in: "Back up your care cards so you can open them on a
  new phone, and help us improve Pet Care Card. Optional — the app works fully
  without it."
- Once signed in and backup is on, every change to a pet, feeding, routine,
  medication, vet, emergency contact and reminder is saved to the account and
  restored automatically on any other device with the same sign-in.
- A "Restore from backup" action pulls the account copy onto the current device.
- A "Turn off backup" switch stops syncing and leaves local data untouched.
- A "Delete my backup" button permanently removes every server row for that
  account.
- Local-first stays the default: signed-out behaviour is exactly as today, and
  no route becomes gated.

## What gets stored

The full record set, exactly as the app already models it, plus the account
email and timestamps:

- Pet: name, species, breed, sex, date of birth / approximate age, weight,
  personality, things to know, photo.
- Feeding: food, amount, times, meals per day, treats, foods to avoid, notes.
- Routine: walks, playtime, sleep, bathroom, crate, indoor/outdoor, other.
- Medications: name, dosage, time, frequency, dates, notes.
- Emergency contacts and veterinarian details.
- Reminders and caregiver info.

Every row carries created/updated timestamps, so card creation and update
activity is measurable over time without any extra tracking layer.

## Consent and legal

- Backup is off until the user signs in and explicitly enables it; the sign-in
  screen states what is stored and why before they proceed.
- Privacy policy (Tech Faculty as controller) gains a Backup and sync section:
  what is stored, that it is processed on consent, how to withdraw, retention
  after deletion, and that photos and free-text notes are included.
- Privacy and Terms both state that **aggregated and anonymised insights derived
  from stored care data may be published, shared or licensed to third parties**,
  while identifiable data and photos never are.
- Settings keeps the existing local export and local delete actions alongside
  the new backup controls.

## Technical notes

- Auth: Supabase email + Google sign-in through the Lovable broker. The app
  stays public; no `_authenticated` gating of existing routes.
- Tables mirroring the local models — `profiles`, `backup_pets`,
  `backup_feedings`, `backup_routines`, `backup_medications`,
  `backup_emergency_contacts`, `backup_vets`, `backup_reminders` — each with
  `user_id`, the local record `id` as a stable key, and `created_at` /
  `updated_at`. RLS scoped to `auth.uid()`, grants to `authenticated` and
  `service_role` only, no `anon` access.
- Photos: stored inline as data URLs to start (they already are locally); if
  size becomes a problem, move to a private storage bucket later.
- Sync through authenticated server functions (`requireSupabaseAuth`): a push
  that upserts changed records and a pull that returns the account set.
  Conflict rule is last-write-wins on `updated_at` per record.
- The care store gains a debounced push after each local write when backup is
  enabled, and a pull on sign-in / app load.
- Delete-my-backup is a single authenticated server function removing all rows
  for the user.

## Order of work

1. Migration: backup tables, RLS, grants.
2. Email + Google auth and a sign-in screen with the backup explanation.
3. Push/pull/delete server functions and care-store wiring.
4. Settings: backup section, restore, turn off, delete backup.
5. Privacy and Terms updates, including the anonymised-insights clause.
