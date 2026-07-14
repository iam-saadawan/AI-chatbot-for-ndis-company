import { createAdminClient } from '@/utils/supabase/admin'
import { SettingsClient } from '@/components/SettingsClient'

export default async function SettingsPage() {
  const supabase = createAdminClient()

  // Assuming a single tenant for this prototype
  const tenant_id = 'b30e384b-71d8-45eb-8454-96246ee4c451'

  const { data: settings } = await supabase
    .from('tenant_settings')
    .select('*')
    .eq('tenant_id', tenant_id)
    .single()

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">Configure your AI chatbot and dashboard preferences</p>
      </div>

      <SettingsClient initialSettings={settings} />
    </div>
  )
}
