import { createClient } from '@/lib/supabase/server'
import WorkOrdersClient from './work-orders-client'

export default async function WorkOrdersPage() {
  const supabase = await createClient()

  const [{ data: workOrders }, { data: customers }, { data: vehicles }, { data: technicians }] = await Promise.all([
    supabase.from('work_orders').select(`
      id, number, description, status, priority, total, created_at,
      customers(first_name, last_name),
      vehicles(year, make, model),
      technicians(name)
    `).order('created_at', { ascending: false }),
    supabase.from('customers').select('id, first_name, last_name').order('first_name'),
    supabase.from('vehicles').select('id, year, make, model, customer_id').order('make'),
    supabase.from('technicians').select('id, name').order('name'),
  ])

  return (
    <WorkOrdersClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialWorkOrders={(workOrders ?? []) as any[]}
      customers={customers ?? []}
      vehicles={vehicles ?? []}
      technicians={technicians ?? []}
    />
  )
}
