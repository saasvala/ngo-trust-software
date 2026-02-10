
-- Donors table
CREATE TABLE public.donors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  pan_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'IN',
  donor_type TEXT NOT NULL DEFAULT 'individual' CHECK (donor_type IN ('individual', 'corporate', 'csr', 'anonymous')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Donations table
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donation_number TEXT NOT NULL UNIQUE,
  donor_id UUID REFERENCES public.donors(id) ON DELETE SET NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_mode TEXT NOT NULL CHECK (payment_mode IN ('cash', 'upi', 'bank_transfer', 'cheque', 'card', 'online', 'other')),
  payment_reference TEXT,
  project_id UUID,
  purpose TEXT,
  tax_benefit_eligible BOOLEAN NOT NULL DEFAULT true,
  receipt_number TEXT,
  receipt_issued BOOLEAN NOT NULL DEFAULT false,
  donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Projects table (for project mapping in donations)
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  budget NUMERIC(14,2) DEFAULT 0,
  spent NUMERIC(14,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'planned')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key for donations.project_id
ALTER TABLE public.donations ADD CONSTRAINT donations_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public read policies (demo mode - no auth required)
CREATE POLICY "Allow public read on donors" ON public.donors FOR SELECT USING (true);
CREATE POLICY "Allow public insert on donors" ON public.donors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on donors" ON public.donors FOR UPDATE USING (true);

CREATE POLICY "Allow public read on donations" ON public.donations FOR SELECT USING (true);
CREATE POLICY "Allow public insert on donations" ON public.donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on donations" ON public.donations FOR UPDATE USING (true);

CREATE POLICY "Allow public read on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert on projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on projects" ON public.projects FOR UPDATE USING (true);

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON public.donors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON public.donations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed demo data
INSERT INTO public.projects (name, description, budget, spent, status, start_date, end_date) VALUES
  ('Education Initiative', 'Providing education to underprivileged children', 500000, 325000, 'active', '2024-04-01', '2025-03-31'),
  ('Healthcare Camp', 'Free medical camps in rural areas', 300000, 180000, 'active', '2024-06-01', '2025-05-31'),
  ('Rural Development', 'Infrastructure development in villages', 1000000, 450000, 'active', '2024-01-01', '2025-12-31'),
  ('Women Empowerment', 'Skill development for women', 200000, 95000, 'active', '2024-07-01', '2025-06-30'),
  ('General Fund', 'General operational fund', 0, 0, 'active', NULL, NULL);

INSERT INTO public.donors (full_name, email, phone, pan_number, donor_type, city, state) VALUES
  ('Rajesh Sharma', 'rajesh@example.com', '9876543210', 'ABCPS1234D', 'individual', 'Mumbai', 'Maharashtra'),
  ('Priya Patel', 'priya@example.com', '9876543211', 'DEFPP5678E', 'individual', 'Ahmedabad', 'Gujarat'),
  ('TechCorp India', 'csr@techcorp.com', '0221234567', 'AABCT1234F', 'corporate', 'Bangalore', 'Karnataka'),
  ('Amit Gupta', 'amit@example.com', '9876543212', 'GHIAG9012G', 'individual', 'Delhi', 'Delhi'),
  ('Anonymous Donor', NULL, NULL, NULL, 'anonymous', NULL, NULL);

INSERT INTO public.donations (donation_number, donor_id, amount, payment_mode, project_id, purpose, tax_benefit_eligible, receipt_number, receipt_issued, donation_date, created_by)
SELECT 
  'DON-' || LPAD(ROW_NUMBER() OVER ()::TEXT, 4, '0'),
  d.id, v.amount, v.mode,
  p.id, v.purpose, v.tax_eligible, v.receipt, true, v.dt::date, 'demo'
FROM (VALUES
  ('Rajesh Sharma', 25000, 'upi', 'Education Initiative', 'Education support', true, 'RCP-0001', '2025-02-05'),
  ('Rajesh Sharma', 50000, 'bank_transfer', 'Healthcare Camp', 'Healthcare', true, 'RCP-0002', '2025-01-15'),
  ('Priya Patel', 10000, 'cash', 'General Fund', 'General donation', true, 'RCP-0003', '2025-01-20'),
  ('TechCorp India', 100000, 'bank_transfer', 'Rural Development', 'CSR contribution', true, 'RCP-0004', '2024-12-10'),
  ('Amit Gupta', 15000, 'upi', 'Women Empowerment', 'Women education', true, 'RCP-0005', '2025-02-01'),
  ('Priya Patel', 30000, 'card', 'Education Initiative', 'School supplies', true, 'RCP-0006', '2024-11-15'),
  ('Anonymous Donor', 5000, 'cash', 'General Fund', 'Anonymous gift', false, NULL, '2025-01-05')
) AS v(donor_name, amount, mode, project_name, purpose, tax_eligible, receipt, dt)
JOIN public.donors d ON d.full_name = v.donor_name
JOIN public.projects p ON p.name = v.project_name;
