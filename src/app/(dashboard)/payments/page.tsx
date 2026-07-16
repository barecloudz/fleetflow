import { createClient } from '@/lib/supabase/server'
import PaymentsClient from './payments-client'

export default async function PaymentsPage() {
  const supabase = await createClient()

  const [{ data: invoices }, { data: customers }, { data: workOrders }] = await Promise.all([
    supabase.from('invoices').select(`
      id, number, amount, due_date, status, paid_at, created_at, notes,
      customers(first_name, last_name),
      work_orders(number)
    `).order('created_at', { ascending: false }),
    supabase.from('customers').select('id, first_name, last_name').order('first_name'),
    supabase.from('work_orders').select('id, number').order('created_at', { ascending: false }),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PaymentsClient initialInvoices={(invoices ?? []) as any[]} customers={customers ?? []} workOrders={workOrders ?? []} />
}
