import { createAdminClient } from '@/utils/supabase/admin'
import { AnalyticsCharts } from '@/components/AnalyticsCharts'
import { MessageSquare, Users, Activity, Zap } from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = createAdminClient()

  // Fetch all conversations to get total count
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, created_at')

  // Fetch all messages to get total count
  const { data: messages } = await supabase
    .from('messages')
    .select('id, created_at')

  const totalConversations = conversations?.length || 0
  const totalMessages = messages?.length || 0
  const avgMessages = totalConversations > 0 ? Math.round(totalMessages / totalConversations) : 0

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1">Key performance metrics and usage statistics</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Live Metrics
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{totalConversations}</div>
            <div className="text-sm font-medium text-slate-500">Total Conversations</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{totalMessages}</div>
            <div className="text-sm font-medium text-slate-500">Total Messages</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{avgMessages}</div>
            <div className="text-sm font-medium text-slate-500">Avg. Msgs / Session</div>
          </div>
        </div>
      </div>

      <AnalyticsCharts conversations={conversations || []} messages={messages || []} />
    </div>
  )
}
