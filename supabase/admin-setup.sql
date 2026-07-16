-- ============================================================
-- Run this in the Supabase SQL Editor
-- 1. Allows platform_admin role (no shop required)
-- 2. Creates your admin profile after you create the auth user
-- ============================================================

-- Step 1: Make shop_id nullable (admins don't belong to a shop)
alter table public.profiles
  alter column shop_id drop not null;

-- Step 2: Add platform_admin to allowed roles
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('platform_admin', 'owner', 'admin', 'technician', 'service_advisor'));

-- Step 3: Allow platform_admin to read all shops
create policy "platform_admin_read_shops" on public.shops
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'platform_admin'
    )
  );

-- Step 4: Allow platform_admin to update shops (suspend, change plan, etc.)
create policy "platform_admin_update_shops" on public.shops
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'platform_admin'
    )
  );

-- ============================================================
-- AFTER running this file:
-- 1. Go to Supabase → Authentication → Users → "Add user" (Invite)
-- 2. Enter YOUR email and a strong password
-- 3. Copy the user UUID that appears
-- 4. Run the block below, replacing YOUR_UUID and YOUR_EMAIL
-- ============================================================

-- insert into public.profiles (id, shop_id, first_name, last_name, role)
-- values ('YOUR_UUID', null, 'Blake', 'YourLastName', 'platform_admin');
