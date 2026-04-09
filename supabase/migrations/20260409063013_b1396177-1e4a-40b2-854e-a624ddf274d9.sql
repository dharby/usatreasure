
CREATE TABLE public.kyc_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.kyc_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit KYC"
ON public.kyc_submissions
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can read KYC"
ON public.kyc_submissions
FOR SELECT
TO public
USING (true);
