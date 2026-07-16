import { createClient } from '@/lib/supabase/server'
import InventoryClient from './inventory-client'

export default async function InventoryPage() {
  const supabase = await createClient()

  const { data: parts } = await supabase
    .from('inventory')
    .select('*')
    .order('name')

  return <InventoryClient initialParts={parts ?? []} />
}
