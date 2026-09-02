CREATE TABLE public.lifetime_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  paddle_transaction_id TEXT NOT NULL UNIQUE,
  paddle_customer_id TEXT,
  product_id TEXT NOT NULL,
  price_id TEXT NOT NULL,
  environment TEXT NOT NULL DEFAULT 'sandbox',
  status TEXT NOT NULL DEFAULT 'completed',
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_lifetime_purchases_email_env ON public.lifetime_purchases (lower(email), environment);

GRANT ALL ON public.lifetime_purchases TO service_role;

ALTER TABLE public.lifetime_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages lifetime purchases"
  ON public.lifetime_purchases FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');