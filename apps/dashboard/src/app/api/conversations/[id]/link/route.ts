import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params
    const body = await request.json()
    const { patient_id } = body

    if (!patient_id) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('conversations')
      .update({ patient_id })
      .eq('id', conversationId)
      .select('*, patients(*)')
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error linking patient:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
