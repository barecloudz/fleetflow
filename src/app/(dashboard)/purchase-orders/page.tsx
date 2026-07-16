import { createClient } from '@/lib/supabase/server'
import PurchaseOrdersClient from './purchase-orders-client'

export default async function PurchaseOrdersPage() {
  const supabase = await createClient()

  const { data: purchaseOrders } = await supabase
    .from('purchase_orders')
    .select('*')
    .order('created_at', { ascending: false })

  return <PurchaseOrdersClient initialPOs={purchaseOrders ?? []} />
}
