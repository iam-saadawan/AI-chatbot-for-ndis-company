import { createAdminClient } from '@/utils/supabase/admin'
import { PatientsClient } from '@/components/PatientsClient'

export default async function PatientsPage() {
  const supabase = createAdminClient()

  // Fetch all patients for this tenant (For prototype, just fetch all)
  const { data: patients, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Dashboard Supabase Error (Patients):", error)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient CRM</h1>
        <p className="text-slate-500 mt-1">Manage patient records and link them to their chatbot conversations</p>
      </div>

      <PatientsClient initialPatients={patients || []} />
    </div>
  )
}
