import { createAdminClient } from '@/utils/supabase/admin'
import Link from 'next/link'
import { MessageSquare, ChevronRight, Clock } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createAdminClient()

  // For this prototype, we'll fetch the most recent conversations
  // In a real app we'd filter by the logged-in user's tenant_id
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('id, session_id, created_at, tenant_id')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error("Dashboard Supabase Error:", error)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Conversations</h1>
        <p className="text-slate-500 mt-1">View and analyze chatbot interactions</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <div className="w-full text-left">
            <div className="grid grid-cols-[2fr,2fr,1fr] border-b border-slate-200/50 bg-slate-50/50 px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div>Session</div>
              <div>Date & Time</div>
              <div className="text-right">Action</div>
            </div>
            <div className="divide-y divide-slate-200/50">
              {!conversations?.length && (
                <div className="px-6 py-12 text-center text-slate-500">
                  No conversations recorded yet.
                </div>
              )}
              {conversations?.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/conversations/${conv.id}`}
                  className="grid grid-cols-[2fr,2fr,1fr] items-center px-6 py-4 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{conv.session_id}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{conv.id.split('-')[0]}...</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {new Date(conv.created_at).toLocaleString()}
                  </div>
                  <div className="text-right text-slate-400 group-hover:text-blue-600 transition-colors flex justify-end">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
