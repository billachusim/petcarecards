-- Profiles (account email + caregiver info)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  caregiver_name text,
  caregiver_phone text,
  caregiver_notes text,
  backup_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own profile" ON public.profiles
  FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Pets
CREATE TABLE public.backup_pets (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  species text,
  breed text,
  sex text,
  date_of_birth text,
  approximate_age text,
  weight text,
  photo_data_url text,
  personality text,
  things_to_know text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.backup_pets TO authenticated;
GRANT ALL ON public.backup_pets TO service_role;
ALTER TABLE public.backup_pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own pets" ON public.backup_pets
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER backup_pets_set_updated_at BEFORE UPDATE ON public.backup_pets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX backup_pets_user_idx ON public.backup_pets(user_id);

-- Feedings
CREATE TABLE public.backup_feedings (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL,
  food_name text,
  amount text,
  times text,
  meals_per_day text,
  treats text,
  foods_to_avoid text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.backup_feedings TO authenticated;
GRANT ALL ON public.backup_feedings TO service_role;
ALTER TABLE public.backup_feedings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own feedings" ON public.backup_feedings
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER backup_feedings_set_updated_at BEFORE UPDATE ON public.backup_feedings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX backup_feedings_user_idx ON public.backup_feedings(user_id);

-- Routines
CREATE TABLE public.backup_routines (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL,
  walk_schedule text,
  playtime text,
  sleep_routine text,
  bathroom_routine text,
  crate_instructions text,
  indoor_outdoor_notes text,
  other text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.backup_routines TO authenticated;
GRANT ALL ON public.backup_routines TO service_role;
ALTER TABLE public.backup_routines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own routines" ON public.backup_routines
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER backup_routines_set_updated_at BEFORE UPDATE ON public.backup_routines
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX backup_routines_user_idx ON public.backup_routines(user_id);

-- Medications
CREATE TABLE public.backup_medications (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL,
  name text NOT NULL,
  dosage text,
  time text,
  frequency text,
  start_date text,
  end_date text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.backup_medications TO authenticated;
GRANT ALL ON public.backup_medications TO service_role;
ALTER TABLE public.backup_medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own medications" ON public.backup_medications
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER backup_medications_set_updated_at BEFORE UPDATE ON public.backup_medications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX backup_medications_user_idx ON public.backup_medications(user_id);

-- Emergency contacts
CREATE TABLE public.backup_emergency_contacts (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL,
  primary_name text,
  primary_phone text,
  secondary_name text,
  secondary_phone text,
  special_instructions text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.backup_emergency_contacts TO authenticated;
GRANT ALL ON public.backup_emergency_contacts TO service_role;
ALTER TABLE public.backup_emergency_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own emergency contacts" ON public.backup_emergency_contacts
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER backup_emergency_contacts_set_updated_at BEFORE UPDATE ON public.backup_emergency_contacts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX backup_emergency_contacts_user_idx ON public.backup_emergency_contacts(user_id);

-- Veterinarians
CREATE TABLE public.backup_vets (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL,
  vet_name text,
  clinic_name text,
  phone text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.backup_vets TO authenticated;
GRANT ALL ON public.backup_vets TO service_role;
ALTER TABLE public.backup_vets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own vets" ON public.backup_vets
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER backup_vets_set_updated_at BEFORE UPDATE ON public.backup_vets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX backup_vets_user_idx ON public.backup_vets(user_id);

-- Reminders
CREATE TABLE public.backup_reminders (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL,
  type text NOT NULL DEFAULT 'custom',
  title text NOT NULL,
  time text NOT NULL,
  repeat text NOT NULL DEFAULT 'daily',
  start_date text,
  end_date text,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.backup_reminders TO authenticated;
GRANT ALL ON public.backup_reminders TO service_role;
ALTER TABLE public.backup_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own reminders" ON public.backup_reminders
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER backup_reminders_set_updated_at BEFORE UPDATE ON public.backup_reminders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX backup_reminders_user_idx ON public.backup_reminders(user_id);