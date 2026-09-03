ALTER TABLE public.backup_pets ALTER COLUMN id TYPE text;
ALTER TABLE public.backup_feedings ALTER COLUMN id TYPE text, ALTER COLUMN pet_id TYPE text;
ALTER TABLE public.backup_routines ALTER COLUMN id TYPE text, ALTER COLUMN pet_id TYPE text;
ALTER TABLE public.backup_medications ALTER COLUMN id TYPE text, ALTER COLUMN pet_id TYPE text;
ALTER TABLE public.backup_emergency_contacts ALTER COLUMN id TYPE text, ALTER COLUMN pet_id TYPE text;
ALTER TABLE public.backup_vets ALTER COLUMN id TYPE text, ALTER COLUMN pet_id TYPE text;
ALTER TABLE public.backup_reminders ALTER COLUMN id TYPE text, ALTER COLUMN pet_id TYPE text;