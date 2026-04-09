
CREATE TABLE public.investor_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  currency TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  sol_equivalent NUMERIC NOT NULL DEFAULT 0,
  tokens_base NUMERIC NOT NULL DEFAULT 0,
  tokens_bonus NUMERIC NOT NULL DEFAULT 0,
  tokens_total NUMERIC NOT NULL DEFAULT 0,
  stage INTEGER NOT NULL DEFAULT 1,
  note TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.investor_purchases ENABLE ROW LEVEL SECURITY;

-- Anyone can read purchases by wallet address (no auth required for lookup)
CREATE POLICY "Anyone can read purchases"
ON public.investor_purchases
FOR SELECT
USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert purchases"
ON public.investor_purchases
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update
CREATE POLICY "Admins can update purchases"
ON public.investor_purchases
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete purchases"
ON public.investor_purchases
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_investor_purchases_wallet ON public.investor_purchases (wallet_address);
