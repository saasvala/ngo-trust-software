
-- Operational modules: expenses, beneficiaries, volunteers, assets, grants, documents, compliance certificates
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_code text NOT NULL UNIQUE,
  description text NOT NULL,
  category text NOT NULL,
  project text NOT NULL DEFAULT 'General',
  amount numeric NOT NULL DEFAULT 0,
  requested_by text NOT NULL,
  expense_date date NOT NULL DEFAULT current_date,
  status text NOT NULL DEFAULT 'pending',
  bill_attached boolean NOT NULL DEFAULT false,
  decision_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.expenses TO anon;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Allow public insert on expenses" ON public.expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on expenses" ON public.expenses FOR UPDATE USING (true);

CREATE TABLE public.beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_code text NOT NULL UNIQUE,
  name text NOT NULL,
  age int,
  gender text,
  category text NOT NULL,
  project text,
  village text,
  district text,
  status text NOT NULL DEFAULT 'active',
  enrolled_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.beneficiaries TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.beneficiaries TO anon;
GRANT ALL ON public.beneficiaries TO service_role;
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on beneficiaries" ON public.beneficiaries FOR SELECT USING (true);
CREATE POLICY "Allow public insert on beneficiaries" ON public.beneficiaries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on beneficiaries" ON public.beneficiaries FOR UPDATE USING (true);

CREATE TABLE public.volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_code text NOT NULL UNIQUE,
  name text NOT NULL,
  role text NOT NULL,
  department text NOT NULL,
  staff_type text NOT NULL DEFAULT 'volunteer',
  email text,
  phone text,
  location text,
  hours_this_month int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  joined_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.volunteers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.volunteers TO anon;
GRANT ALL ON public.volunteers TO service_role;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on volunteers" ON public.volunteers FOR SELECT USING (true);
CREATE POLICY "Allow public insert on volunteers" ON public.volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on volunteers" ON public.volunteers FOR UPDATE USING (true);

CREATE TABLE public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_code text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  purchase_value numeric NOT NULL DEFAULT 0,
  current_value numeric NOT NULL DEFAULT 0,
  purchase_date date NOT NULL DEFAULT current_date,
  location text,
  assigned_to text,
  condition text NOT NULL DEFAULT 'good',
  status text NOT NULL DEFAULT 'in_use',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.assets TO anon;
GRANT ALL ON public.assets TO service_role;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on assets" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Allow public insert on assets" ON public.assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on assets" ON public.assets FOR UPDATE USING (true);

CREATE TABLE public.grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_code text NOT NULL UNIQUE,
  title text NOT NULL,
  funder text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  released numeric NOT NULL DEFAULT 0,
  stage text NOT NULL DEFAULT 'application',
  start_date date,
  end_date date,
  utilization_pct int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.grants TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.grants TO anon;
GRANT ALL ON public.grants TO service_role;
ALTER TABLE public.grants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on grants" ON public.grants FOR SELECT USING (true);
CREATE POLICY "Allow public insert on grants" ON public.grants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on grants" ON public.grants FOR UPDATE USING (true);

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  file_type text NOT NULL DEFAULT 'PDF',
  size_kb int NOT NULL DEFAULT 0,
  uploaded_by text,
  uploaded_on date NOT NULL DEFAULT current_date,
  expires_on date,
  is_confidential boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.documents TO anon;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Allow public insert on documents" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on documents" ON public.documents FOR UPDATE USING (true);

-- SEED DATA
INSERT INTO public.expenses (ref_code, description, category, project, amount, requested_by, expense_date, status, bill_attached) VALUES
('EXP-001','Travel to Rampur field visit','Travel','Rural Education',12500,'Raj Kumar','2026-02-10','pending',true),
('EXP-002','Office supplies - Stationery','Admin','General',4800,'Meena Sharma','2026-02-09','pending',true),
('EXP-003','Workshop venue booking','Program','Women Empowerment',35000,'Priya Verma','2026-02-08','approved',true),
('EXP-004','Printing - Annual Report 500 copies','Communication','General',28000,'Amit Singh','2026-02-07','approved',true),
('EXP-005','Laptop for field coordinator','IT Equipment','Rural Education',52000,'PM Sharma','2026-02-06','rejected',false),
('EXP-006','Community health camp supplies','Program','Health Initiative',18500,'Dr. Gupta','2026-02-05','approved',true),
('EXP-007','Vehicle fuel - January','Transport','General',8200,'Driver Ramu','2026-02-04','approved',true),
('EXP-008','Internet and phone bills','Utilities','General',6500,'Admin Team','2026-02-03','approved',true),
('EXP-009','Teacher stipends - February','Program','Rural Education',96000,'Priya Verma','2026-02-12','pending',true),
('EXP-010','Water pump maintenance','Program','Clean Water Initiative',14300,'Field Team','2026-02-11','approved',true);

INSERT INTO public.beneficiaries (ref_code, name, age, gender, category, project, village, district, status, enrolled_on) VALUES
('BEN-001','Sunita Devi',32,'Female','Women Empowerment','Skill Training','Rampur','Varanasi','active','2024-06-15'),
('BEN-002','Ravi Kumar',14,'Male','Education','Rural Education','Chandpur','Allahabad','active','2024-08-20'),
('BEN-003','Lakshmi Bai',45,'Female','Health','Health Initiative','Sultanpur','Varanasi','active','2024-03-10'),
('BEN-004','Mohan Lal',58,'Male','Livelihood','Farmer Support','Ghazipur','Ghazipur','completed','2023-12-01'),
('BEN-005','Aarti Kumari',8,'Female','Education','Rural Education','Jaunpur','Jaunpur','active','2024-07-01'),
('BEN-006','Bablu Prasad',22,'Male','Skill Development','Skill Training','Mirzapur','Mirzapur','active','2024-09-15'),
('BEN-007','Kamla Devi',40,'Female','Women Empowerment','Women SHG','Azamgarh','Azamgarh','active','2024-05-20'),
('BEN-008','Rahul Yadav',16,'Male','Education','Digital Literacy','Bhadohi','Bhadohi','active','2024-10-01'),
('BEN-009','Geeta Sharma',29,'Female','Health','Health Initiative','Rampur','Varanasi','active','2025-01-12'),
('BEN-010','Imran Ali',35,'Male','Livelihood','Farmer Support','Chandpur','Allahabad','active','2025-02-02');

INSERT INTO public.volunteers (ref_code, name, role, department, staff_type, email, phone, location, hours_this_month, status, joined_on) VALUES
('VOL-001','Anjali Mehta','Field Coordinator','Programs','staff','anjali@ngo.org','+91 98110 22110','Varanasi',148,'active','2023-04-11'),
('VOL-002','Suresh Patil','Community Mobilizer','Programs','volunteer','suresh@ngo.org','+91 98110 22111','Allahabad',62,'active','2024-01-20'),
('VOL-003','Neha Kulkarni','Accounts Assistant','Finance','staff','neha@ngo.org','+91 98110 22112','Delhi',160,'active','2022-09-05'),
('VOL-004','Rakesh Yadav','Health Educator','Health','volunteer','rakesh@ngo.org','+91 98110 22113','Ghazipur',44,'active','2024-06-15'),
('VOL-005','Fatima Sheikh','Teacher','Education','staff','fatima@ngo.org','+91 98110 22114','Jaunpur',152,'active','2023-07-01'),
('VOL-006','Deepak Verma','Logistics Support','Operations','volunteer','deepak@ngo.org','+91 98110 22115','Mirzapur',28,'inactive','2024-02-10'),
('VOL-007','Priya Nair','M&E Officer','Programs','staff','priya@ngo.org','+91 98110 22116','Delhi',156,'active','2021-11-30'),
('VOL-008','Arun Singh','Data Entry Volunteer','Operations','volunteer','arun@ngo.org','+91 98110 22117','Azamgarh',36,'active','2025-03-18');

INSERT INTO public.assets (ref_code, name, category, purchase_value, current_value, purchase_date, location, assigned_to, condition, status) VALUES
('AST-001','Toyota Innova (UP65 AB 1234)','Vehicle',1850000,1120000,'2022-03-15','Varanasi Office','Field Team','good','in_use'),
('AST-002','Dell Latitude Laptops (x6)','IT Equipment',372000,215000,'2023-06-10','Head Office','Programs Team','good','in_use'),
('AST-003','Community Hall - Rampur','Building',4200000,4450000,'2019-11-01','Rampur','Community','good','in_use'),
('AST-004','Water Purification Units (x4)','Equipment',680000,410000,'2023-01-25','Field Sites','Clean Water Initiative','fair','in_use'),
('AST-005','Office Furniture Set','Furniture',245000,142000,'2021-08-14','Head Office','Admin','fair','in_use'),
('AST-006','Projector & AV Kit','IT Equipment',96000,38000,'2020-12-05','Training Centre','Education Team','poor','maintenance'),
('AST-007','Solar Panel Array 5kW','Equipment',540000,455000,'2024-05-20','Varanasi Office','Operations','good','in_use'),
('AST-008','Mahindra Bolero (UP65 CD 5678)','Vehicle',1120000,690000,'2021-02-11','Allahabad Office','Field Team','fair','in_use');

INSERT INTO public.grants (ref_code, title, funder, amount, released, stage, start_date, end_date, utilization_pct, status) VALUES
('GRT-001','Rural Digital Literacy Expansion','Tata Trusts',5000000,3500000,'implementation','2025-04-01','2026-03-31',72,'active'),
('GRT-002','Maternal Health Outreach','Gates Foundation',8200000,4100000,'implementation','2025-07-01','2027-06-30',48,'active'),
('GRT-003','Clean Water for 20 Villages','HSBC CSR Fund',3600000,3600000,'reporting','2024-04-01','2025-12-31',96,'active'),
('GRT-004','Women SHG Micro-Enterprise','NABARD',2400000,0,'approval','2026-06-01','2027-05-31',0,'pending'),
('GRT-005','Youth Skilling Mission','Ministry of Skill Dev.',6500000,1300000,'agreement','2026-04-01','2028-03-31',18,'active'),
('GRT-006','School Nutrition Pilot','Azim Premji Foundation',1800000,1800000,'closure','2023-04-01','2025-03-31',100,'closed');

INSERT INTO public.documents (name, category, file_type, size_kb, uploaded_by, uploaded_on, expires_on, is_confidential) VALUES
('12A Registration Certificate','Compliance','PDF',842,'Neha Kulkarni','2023-04-02','2028-03-31',false),
('80G Registration Certificate','Compliance','PDF',768,'Neha Kulkarni','2023-05-16','2026-05-14',false),
('Audited Financials FY 2024-25','Finance','PDF',3120,'CA Office','2025-09-12',NULL,true),
('Annual Report 2024-25','Reports','PDF',9840,'Priya Nair','2025-10-01',NULL,false),
('FCRA Renewal Application','Compliance','PDF',1450,'Neha Kulkarni','2025-12-04','2027-03-31',true),
('Trust Deed','Legal','PDF',2210,'Admin Team','2019-01-15',NULL,true),
('PAN Card - Organisation','Legal','JPG',320,'Admin Team','2019-01-15',NULL,true),
('Board Meeting Minutes - Q4','Governance','DOCX',180,'Priya Nair','2026-01-20',NULL,true),
('MoU - Tata Trusts Grant','Grants','PDF',1120,'Anjali Mehta','2025-03-28','2026-03-31',false),
('Beneficiary Consent Forms Batch 12','Programs','PDF',5400,'Field Team','2026-02-01',NULL,true);
