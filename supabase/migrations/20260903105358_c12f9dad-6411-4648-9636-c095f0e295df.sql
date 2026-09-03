ALTER TABLE public.guide_job_state
ADD COLUMN IF NOT EXISTS job_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex');