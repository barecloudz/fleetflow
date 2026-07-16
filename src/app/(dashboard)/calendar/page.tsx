import { createClient } from '@/lib/supabase/server'
import CalendarClient from './calendar-client'

export default async function CalendarPage() {
  const supabase = await createClient()

  const [{ data: appointments }, { data: customers }, { data: vehicles }, { data: technicians }] = await Promise.all([
    supabase.from('appointments').select(`
      id, title, description, status, starts_at, ends_at,
      customers(first_name, last_name),
      technicians(name)
    `).order('starts_at'),
    supabase.from('customers').select('id, first_name, last_name').order('first_name'),
    supabase.from('vehicles').select('id, year, make, model, customer_id'),
    supabase.from('technicians').select('id, name'),
  ])

  return (
    <CalendarClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialAppointments={(appointments ?? []) as any[]}
      customers={customers ?? []}
      vehicles={vehicles ?? []}
      technicians={technicians ?? []}
    />
  )
}
