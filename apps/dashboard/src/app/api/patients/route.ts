import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, ndis_number } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Assuming a single tenant for this prototype
    const tenant_id = 'b30e384b-71d8-45eb-8454-96246ee4c451'

    const { data, error } = await supabase
      .from('patients')
      .insert([
        { 
          tenant_id, 
          name, 
          email: email || null, 
          phone: phone || null, 
          ndis_number: ndis_number || null 
        }
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error inserting patient:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
