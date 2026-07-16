-- ============================================================
-- FleetFlow Schema
-- Paste this entire file into the Supabase SQL Editor and run it.
-- ============================================================


-- ============================================================
-- SHOPS (one row per mechanic shop / tenant)
-- ============================================================
create table public.shops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  address text,
  city text,
  state text,
  zip text,
  email text,
  logo_url text,
  subscription_status text not null default 'trialing'
    check (subscription_status in ('trialing', 'active', 'past_due', 'suspended', 'cancelled')),
  subscription_grace_until timestamptz,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'starter'
    check (plan in ('starter', 'pro', 'enterprise')),
  created_at timestamptz not null default now()
);

-- Shops are managed server-side only — no direct client access
alter table public.shops enable row level security;


-- ============================================================
-- PROFILES (links auth.users → shops)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  shop_id uuid not null references public.shops(id) on delete cascade,
  first_name text,
  last_name text,
  role text not null default 'technician'
    check (role in ('owner', 'admin', 'technician', 'service_advisor')),
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read/update their own profile
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- Auto-create profile row when a new user signs up
-- (shop_id must be passed as user metadata during sign-up)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, shop_id, first_name, last_name, role)
  values (
    new.id,
    (new.raw_user_meta_data->>'shop_id')::uuid,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    coalesce(new.raw_user_meta_data->>'role', 'owner')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================
-- HELPER: get the calling user's shop_id
-- ============================================================
create or replace function public.my_shop_id()
returns uuid
language sql
stable
security definer set search_path = ''
as $$
  select shop_id from public.profiles where id = auth.uid();
$$;


-- ============================================================
-- CUSTOMERS
-- ============================================================
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  address text,
  notes text,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  created_at timestamptz not null default now()
);

alter table public.customers enable row level security;
create index on public.customers(shop_id);

create policy "customers_shop_isolation" on public.customers
  using (shop_id = public.my_shop_id());


-- ============================================================
-- VEHICLES
-- ============================================================
create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  year integer,
  make text,
  model text,
  trim text,
  vin text,
  color text,
  mileage integer,
  license_plate text,
  last_service date,
  next_service_due date,
  status text not null default 'Active',
  notes text,
  created_at timestamptz not null default now()
);

alter table public.vehicles enable row level security;
create index on public.vehicles(shop_id);
create index on public.vehicles(customer_id);

create policy "vehicles_shop_isolation" on public.vehicles
  using (shop_id = public.my_shop_id());


-- ============================================================
-- TECHNICIANS
-- ============================================================
create table public.technicians (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  role text,
  status text not null default 'Clocked Out'
    check (status in ('Clocked In', 'Clocked Out', 'On Break')),
  hours_today numeric(5,2) not null default 0,
  jobs_completed integer not null default 0,
  efficiency numeric(5,2) not null default 0,
  created_at timestamptz not null default now()
);

alter table public.technicians enable row level security;
create index on public.technicians(shop_id);

create policy "technicians_shop_isolation" on public.technicians
  using (shop_id = public.my_shop_id());


-- ============================================================
-- WORK ORDERS
-- ============================================================
create table public.work_orders (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  technician_id uuid references public.technicians(id) on delete set null,
  number text not null,           -- human-readable e.g. "WO-1048"
  description text,
  status text not null default 'Open'
    check (status in ('Open', 'In Progress', 'Awaiting Parts', 'Completed', 'Cancelled')),
  priority text not null default 'Normal'
    check (priority in ('Normal', 'High', 'Urgent')),
  total numeric(10,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.work_orders enable row level security;
create index on public.work_orders(shop_id);
create index on public.work_orders(customer_id);
create index on public.work_orders(status);

create policy "work_orders_shop_isolation" on public.work_orders
  using (shop_id = public.my_shop_id());


-- ============================================================
-- INVENTORY / PARTS
-- ============================================================
create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  name text not null,
  part_number text,
  category text,
  in_stock integer not null default 0,
  reorder_point integer not null default 0,
  unit_cost numeric(10,2) not null default 0,
  supplier text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.inventory enable row level security;
create index on public.inventory(shop_id);

create policy "inventory_shop_isolation" on public.inventory
  using (shop_id = public.my_shop_id());


-- ============================================================
-- ESTIMATES
-- ============================================================
create table public.estimates (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  number text not null,
  status text not null default 'Draft'
    check (status in ('Draft', 'Sent', 'Approved', 'Declined', 'Expired')),
  subtotal numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  notes text,
  expires_at date,
  created_at timestamptz not null default now()
);

alter table public.estimates enable row level security;
create index on public.estimates(shop_id);

create policy "estimates_shop_isolation" on public.estimates
  using (shop_id = public.my_shop_id());


-- ============================================================
-- INVOICES
-- ============================================================
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  work_order_id uuid references public.work_orders(id) on delete set null,
  number text not null,
  status text not null default 'Pending'
    check (status in ('Pending', 'Paid', 'Overdue', 'Void')),
  amount numeric(10,2) not null default 0,
  due_date date,
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.invoices enable row level security;
create index on public.invoices(shop_id);
create index on public.invoices(customer_id);

create policy "invoices_shop_isolation" on public.invoices
  using (shop_id = public.my_shop_id());


-- ============================================================
-- PURCHASE ORDERS
-- ============================================================
create table public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  supplier text not null,
  number text not null,
  status text not null default 'Draft'
    check (status in ('Draft', 'Submitted', 'Received', 'Cancelled')),
  total numeric(10,2) not null default 0,
  notes text,
  ordered_at date,
  received_at date,
  created_at timestamptz not null default now()
);

alter table public.purchase_orders enable row level security;
create index on public.purchase_orders(shop_id);

create policy "purchase_orders_shop_isolation" on public.purchase_orders
  using (shop_id = public.my_shop_id());


-- ============================================================
-- INSPECTIONS
-- ============================================================
create table public.inspections (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  work_order_id uuid references public.work_orders(id) on delete set null,
  technician_id uuid references public.technicians(id) on delete set null,
  status text not null default 'Pending'
    check (status in ('Pending', 'In Progress', 'Completed')),
  results jsonb,              -- flexible JSON for inspection checklist items
  notes text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.inspections enable row level security;
create index on public.inspections(shop_id);

create policy "inspections_shop_isolation" on public.inspections
  using (shop_id = public.my_shop_id());


-- ============================================================
-- APPOINTMENTS
-- ============================================================
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  technician_id uuid references public.technicians(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'Scheduled'
    check (status in ('Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No Show')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.appointments enable row level security;
create index on public.appointments(shop_id);
create index on public.appointments(starts_at);

create policy "appointments_shop_isolation" on public.appointments
  using (shop_id = public.my_shop_id());
