-- Add trial_ends_at to shops table
-- Run this in the Supabase SQL Editor
alter table public.shops
  add column if not exists trial_ends_at timestamptz;
