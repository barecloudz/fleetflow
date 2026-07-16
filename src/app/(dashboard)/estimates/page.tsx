import { createClient } from '@/lib/supabase/server'
import EstimatesClient from './estimates-client'

export default async function EstimatesPage() {
  const supabase = await createClient()

  const [{ data: estimates }, { data: customers }, { data: vehicles }] = await Promise.all([
    supabase.from('estimates').select(`
      id, number, status, subtotal, tax, total, expires_at, created_at, notes,
      customers(first_name, last_name),
      vehicles(year, make, model)
    `).order('created_at', { ascending: false }),
    supabase.from('customers').select('id, first_name, last_name').order('first_name'),
    supabase.from('vehicles').select('id, year, make, model, customer_id'),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <EstimatesClient initialEstimates={(estimates ?? []) as any[]} customers={customers ?? []} vehicles={vehicles ?? []} />
}
