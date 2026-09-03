CREATE TABLE IF NOT EXISTS public.shared_cards (
  token TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  pet_id TEXT NOT NULL,
  pet_name TEXT NOT NULL DEFAULT 'Pet',
  snapshot JSONB NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, pet_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.shared_cards TO authenticated;
GRANT ALL ON public.shared_cards TO service_role;

ALTER TABLE public.shared_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners manage their shared cards" ON public.shared_cards;
CREATE POLICY "Owners manage their shared cards"
ON public.shared_cards FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);