'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getShopId(): Promise<string> {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('shop_id').single()
  if (!data?.shop_id) throw new Error('No shop found for this user')
  return data.shop_id
}

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────

export async function addCustomer(_: unknown, formData: FormData) {
  try {
    const supabase = await createClient()
    const shop_id = await getShopId()

    const { error } = await supabase.from('customers').insert({
      shop_id,
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string || null,
      phone: formData.get('phone') as string || null,
      address: formData.get('address') as string || null,
      notes: formData.get('notes') as string || null,
      status: 'Active',
    })

    if (error) return { error: error.message }
    revalidatePath('/customers')
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

// ─── VEHICLES ─────────────────────────────────────────────────────────────────

export async function addVehicle(_: unknown, formData: FormData) {
  try {
    const supabase = await createClient()
    const shop_id = await getShopId()

    const customerId = formData.get('customer_id') as string
    const mileageStr = formData.get('mileage') as string
    const yearStr = formData.get('year') as string

    const { error } = await supabase.from('vehicles').insert({
      shop_id,
      customer_id: customerId || null,
      year: yearStr ? parseInt(yearStr) : null,
      make: formData.get('make') as string || null,
      model: formData.get('model') as string || null,
      trim: formData.get('trim') as string || null,
      vin: formData.get('vin') as string || null,
      color: formData.get('color') as string || null,
      mileage: mileageStr ? parseInt(mileageStr) : null,
      license_plate: formData.get('license_plate') as string || null,
      status: 'Active',
    })

    if (error) return { error: error.message }
    revalidatePath('/vehicles')
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

// ─── INVENTORY ────────────────────────────────────────────────────────────────

export async function addPart(_: unknown, formData: FormData) {
  try {
    const supabase = await createClient()
    const shop_id = await getShopId()

    const { error } = await supabase.from('inventory').insert({
      shop_id,
      name: formData.get('name') as string,
      part_number: formData.get('part_number') as string || null,
      category: formData.get('category') as string || null,
      in_stock: parseInt(formData.get('in_stock') as string) || 0,
      reorder_point: parseInt(formData.get('reorder_point') as string) || 0,
      unit_cost: parseFloat(formData.get('unit_cost') as string) || 0,
      supplier: formData.get('supplier') as string || null,
      notes: formData.get('notes') as string || null,
    })

    if (error) return { error: error.message }
    revalidatePath('/inventory')
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function deletePart(partId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('inventory').delete().eq('id', partId)
    if (error) throw error
    revalidatePath('/inventory')
  } catch (e: unknown) {
    console.error(e)
  }
}

// ─── WORK ORDERS ──────────────────────────────────────────────────────────────

export async function addWorkOrder(_: unknown, formData: FormData) {
  try {
    const supabase = await createClient()
    const shop_id = await getShopId()

    // Generate next WO number
    const { count } = await supabase.from('work_orders').select('*', { count: 'exact', head: true }).eq('shop_id', shop_id)
    const number = `WO-${String((count ?? 0) + 1000 + 1).padStart(4, '0')}`

    const { error } = await supabase.from('work_orders').insert({
      shop_id,
      customer_id: formData.get('customer_id') as string || null,
      vehicle_id: formData.get('vehicle_id') as string || null,
      technician_id: formData.get('technician_id') as string || null,
      number,
      description: formData.get('description') as string || null,
      status: 'Open',
      priority: formData.get('priority') as string || 'Normal',
      total: parseFloat(formData.get('total') as string) || 0,
    })

    if (error) return { error: error.message }
    revalidatePath('/work-orders')
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateWorkOrderStatus(id: string, status: string) {
  try {
    const supabase = await createClient()
    const updates: Record<string, unknown> = { status }
    if (status === 'Completed') updates.completed_at = new Date().toISOString()
    const { error } = await supabase.from('work_orders').update(updates).eq('id', id)
    if (error) throw error
    revalidatePath('/work-orders')
    revalidatePath('/dashboard')
  } catch (e: unknown) {
    console.error(e)
  }
}

// ─── INVOICES ─────────────────────────────────────────────────────────────────

export async function addInvoice(_: unknown, formData: FormData) {
  try {
    const supabase = await createClient()
    const shop_id = await getShopId()

    const { count } = await supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('shop_id', shop_id)
    const number = `INV-${String((count ?? 0) + 2000 + 1).padStart(4, '0')}`

    const { error } = await supabase.from('invoices').insert({
      shop_id,
      customer_id: formData.get('customer_id') as string || null,
      work_order_id: formData.get('work_order_id') as string || null,
      number,
      amount: parseFloat(formData.get('amount') as string) || 0,
      due_date: formData.get('due_date') as string || null,
      status: 'Pending',
      notes: formData.get('notes') as string || null,
    })

    if (error) return { error: error.message }
    revalidatePath('/payments')
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateInvoiceStatus(id: string, status: string) {
  try {
    const supabase = await createClient()
    const updates: Record<string, unknown> = { status }
    if (status === 'Paid') updates.paid_at = new Date().toISOString()
    const { error } = await supabase.from('invoices').update(updates).eq('id', id)
    if (error) throw error
    revalidatePath('/payments')
  } catch (e: unknown) {
    console.error(e)
  }
}

// ─── TECHNICIANS ──────────────────────────────────────────────────────────────

export async function addTechnician(_: unknown, formData: FormData) {
  try {
    const supabase = await createClient()
    const shop_id = await getShopId()

    const { error } = await supabase.from('technicians').insert({
      shop_id,
      name: formData.get('name') as string,
      role: formData.get('role') as string || null,
      status: 'Clocked Out',
    })

    if (error) return { error: error.message }
    revalidatePath('/technicians')
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateTechnicianStatus(id: string, status: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('technicians').update({ status }).eq('id', id)
    if (error) throw error
    revalidatePath('/technicians')
  } catch (e: unknown) {
    console.error(e)
  }
}

// ─── ESTIMATES ────────────────────────────────────────────────────────────────

export async function addEstimate(_: unknown, formData: FormData) {
  try {
    const supabase = await createClient()
    const shop_id = await getShopId()

    const { count } = await supabase.from('estimates').select('*', { count: 'exact', head: true }).eq('shop_id', shop_id)
    const number = `EST-${String((count ?? 0) + 1000 + 1).padStart(4, '0')}`

    const subtotal = parseFloat(formData.get('subtotal') as string) || 0
    const tax = parseFloat(formData.get('tax') as string) || 0

    const { error } = await supabase.from('estimates').insert({
      shop_id,
      customer_id: formData.get('customer_id') as string || null,
      vehicle_id: formData.get('vehicle_id') as string || null,
      number,
      status: 'Draft',
      subtotal,
      tax,
      total: subtotal + tax,
      notes: formData.get('notes') as string || null,
      expires_at: formData.get('expires_at') as string || null,
    })

    if (error) return { error: error.message }
    revalidatePath('/estimates')
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateEstimateStatus(id: string, status: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('estimates').update({ status }).eq('id', id)
    if (error) throw error
    revalidatePath('/estimates')
  } catch (e: unknown) {
    console.error(e)
  }
}

// ─── PURCHASE ORDERS ──────────────────────────────────────────────────────────

export async function addPurchaseOrder(_: unknown, formData: FormData) {
  try {
    const supabase = await createClient()
    const shop_id = await getShopId()

    const { count } = await supabase.from('purchase_orders').select('*', { count: 'exact', head: true }).eq('shop_id', shop_id)
    const number = `PO-${String((count ?? 0) + 1000 + 1).padStart(4, '0')}`

    const { error } = await supabase.from('purchase_orders').insert({
      shop_id,
      supplier: formData.get('supplier') as string,
      number,
      status: 'Draft',
      total: parseFloat(formData.get('total') as string) || 0,
      notes: formData.get('notes') as string || null,
      ordered_at: formData.get('ordered_at') as string || null,
    })

    if (error) return { error: error.message }
    revalidatePath('/purchase-orders')
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updatePurchaseOrderStatus(id: string, status: string) {
  try {
    const supabase = await createClient()
    const updates: Record<string, unknown> = { status }
    if (status === 'Received') updates.received_at = new Date().toISOString().split('T')[0]
    const { error } = await supabase.from('purchase_orders').update(updates).eq('id', id)
    if (error) throw error
    revalidatePath('/purchase-orders')
  } catch (e: unknown) {
    console.error(e)
  }
}

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────

export async function addAppointment(_: unknown, formData: FormData) {
  try {
    const supabase = await createClient()
    const shop_id = await getShopId()

    const { error } = await supabase.from('appointments').insert({
      shop_id,
      customer_id: formData.get('customer_id') as string || null,
      vehicle_id: formData.get('vehicle_id') as string || null,
      technician_id: formData.get('technician_id') as string || null,
      title: formData.get('title') as string,
      description: formData.get('description') as string || null,
      status: 'Scheduled',
      starts_at: formData.get('starts_at') as string,
      ends_at: formData.get('ends_at') as string || null,
    })

    if (error) return { error: error.message }
    revalidatePath('/calendar')
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

// ─── INSPECTIONS ──────────────────────────────────────────────────────────────

export async function addInspection(_: unknown, formData: FormData) {
  try {
    const supabase = await createClient()
    const shop_id = await getShopId()

    const { error } = await supabase.from('inspections').insert({
      shop_id,
      vehicle_id: formData.get('vehicle_id') as string || null,
      work_order_id: formData.get('work_order_id') as string || null,
      technician_id: formData.get('technician_id') as string || null,
      status: 'Pending',
      notes: formData.get('notes') as string || null,
    })

    if (error) return { error: error.message }
    revalidatePath('/inspections')
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateInspectionStatus(id: string, status: string) {
  try {
    const supabase = await createClient()
    const updates: Record<string, unknown> = { status }
    if (status === 'Completed') updates.completed_at = new Date().toISOString()
    const { error } = await supabase.from('inspections').update(updates).eq('id', id)
    if (error) throw error
    revalidatePath('/inspections')
  } catch (e: unknown) {
    console.error(e)
  }
}
