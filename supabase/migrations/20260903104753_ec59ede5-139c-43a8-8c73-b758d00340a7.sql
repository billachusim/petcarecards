CREATE TABLE public.generated_guides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_title TEXT NOT NULL,
  description TEXT NOT NULL,
  answer TEXT NOT NULL,
  intro JSONB NOT NULL DEFAULT '[]'::jsonb,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  related JSONB NOT NULL DEFAULT '[]'::jsonb,
  read_minutes INTEGER NOT NULL DEFAULT 6,
  medical_disclaimer BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published',
  topic TEXT,
  model TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT generated_guides_status_check CHECK (status IN ('published', 'unpublished'))
);

GRANT SELECT ON public.generated_guides TO anon;
GRANT SELECT ON public.generated_guides TO authenticated;
GRANT ALL ON public.generated_guides TO service_role;

ALTER TABLE public.generated_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published guides are publicly readable"
ON public.generated_guides FOR SELECT
TO anon, authenticated
USING (status = 'published');

CREATE INDEX generated_guides_status_published_at_idx
ON public.generated_guides (status, published_at DESC);

CREATE TABLE public.guide_generation_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  finished_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'running',
  topic TEXT,
  slug TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  CONSTRAINT guide_generation_runs_status_check
    CHECK (status IN ('running', 'published', 'skipped', 'failed', 'paused'))
);

GRANT ALL ON public.guide_generation_runs TO service_role;
ALTER TABLE public.guide_generation_runs ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.guide_job_state (
  id TEXT NOT NULL PRIMARY KEY,
  paused BOOLEAN NOT NULL DEFAULT false,
  pause_reason TEXT,
  paused_at TIMESTAMP WITH TIME ZONE,
  lease_until TIMESTAMP WITH TIME ZONE,
  last_run_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.guide_job_state TO service_role;
ALTER TABLE public.guide_job_state ENABLE ROW LEVEL SECURITY;

INSERT INTO public.guide_job_state (id) VALUES ('weekly-guide');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generated_guides_set_updated_at
BEFORE UPDATE ON public.generated_guides
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();