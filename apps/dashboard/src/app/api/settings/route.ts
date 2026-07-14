import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { system_prompt, primary_color, welcome_message } = body

    const supabase = createAdminClient()

    // Assuming a single tenant for this prototype
    const tenant_id = 'b30e384b-71d8-45eb-8454-96246ee4c451'

    // Upsert the settings
    const { data, error } = await supabase
      .from('tenant_settings')
      .upsert(
        { 
          tenant_id, 
          system_prompt, 
          primary_color, 
          welcome_message,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'tenant_id' }
      )
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
