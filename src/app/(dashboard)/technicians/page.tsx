import { createClient } from '@/lib/supabase/server'
import TechniciansClient from './technicians-client'

export default async function TechniciansPage() {
  const supabase = await createClient()

  const { data: technicians } = await supabase
    .from('technicians')
    .select('*')
    .order('name')

  return <TechniciansClient initialTechnicians={technicians ?? []} />
}
