import { createClient } from '@/lib/supabase/server'
import CustomersClient from './customers-client'

export default async function CustomersPage() {
  const supabase = await createClient()

  const { data: customers } = await supabase
    .from('customers')
    .select('*, vehicles(count)')
    .order('created_at', { ascending: false })

  return <CustomersClient initialCustomers={customers ?? []} />
}
