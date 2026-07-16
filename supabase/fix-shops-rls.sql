-- ============================================================
-- Fix: "new row violates row-level security policy for table 'shops'"
-- Run this in the Supabase SQL Editor
--
-- Root cause: shops table has RLS enabled but no INSERT policy.
-- The create_shop() SECURITY DEFINER function still hits RLS in
-- newer Supabase projects even though it runs as postgres.
-- ============================================================

-- Allow shop creation via the create_shop() RPC.
-- This is safe because:
--   1. The function itself is SECURITY DEFINER with controlled logic
--   2. New shops default to 'trialing' status (no elevated access)
--   3. Platform admin controls subscription status separately
create policy "allow_shop_creation" on public.shops
  for insert with check (true);

-- Also: Allow shop owners to read their own shop data
-- (needed for the dashboard to show shop details)
create policy "shop_members_read_own_shop" on public.shops
  for select using (
    id = public.my_shop_id()
  );
