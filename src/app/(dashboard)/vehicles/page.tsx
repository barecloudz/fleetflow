import { createClient } from '@/lib/supabase/server'
import VehiclesClient from './vehicles-client'

export default async function VehiclesPage() {
  const supabase = await createClient()

  const [{ data: vehicles }, { data: customers }] = await Promise.all([
    supabase.from('vehicles').select(`
      id, year, make, model, trim, vin, color, mileage, license_plate,
      last_service, next_service_due, status,
      customers(id, first_name, last_name)
    `).order('created_at', { ascending: false }),
    supabase.from('customers').select('id, first_name, last_name').order('first_name'),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <VehiclesClient initialVehicles={(vehicles ?? []) as any[]} customers={customers ?? []} />
}
