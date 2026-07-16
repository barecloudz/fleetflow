-- ============================================================
-- Run this in the Supabase SQL Editor AFTER schema.sql
-- Allows the signup flow to create a shop before the user exists
-- ============================================================

create or replace function public.create_shop(shop_name text)
returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare
  new_shop_id uuid;
begin
  insert into public.shops (name) values (shop_name) returning id into new_shop_id;
  return new_shop_id;
end;
$$;

-- Allow unauthenticated callers (signup happens before auth)
grant execute on function public.create_shop(text) to anon, authenticated;
