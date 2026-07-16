import { createClient } from '@/lib/supabase/server'
import InspectionsClient from './inspections-client'

export default async function InspectionsPage() {
  const supabase = await createClient()

  const [{ data: inspections }, { data: vehicles }, { data: technicians }, { data: workOrders }] = await Promise.all([
    supabase.from('inspections').select(`
      id, status, notes, created_at, completed_at,
      vehicles(year, make, model),
      technicians(name),
      work_orders(number)
    `).order('created_at', { ascending: false }),
    supabase.from('vehicles').select('id, year, make, model'),
    supabase.from('technicians').select('id, name'),
    supabase.from('work_orders').select('id, number'),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <InspectionsClient initialInspections={(inspections ?? []) as any[]} vehicles={vehicles ?? []} technicians={technicians ?? []} workOrders={workOrders ?? []} />
}
