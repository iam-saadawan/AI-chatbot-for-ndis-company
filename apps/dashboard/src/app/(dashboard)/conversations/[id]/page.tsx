import { createAdminClient } from '@/utils/supabase/admin'
import Link from 'next/link'
import { LinkPatientClient } from '@/components/LinkPatientClient'
import { ArrowLeft, User, Bot } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: conversation } = await supabase
    .from('conversations')
    .select('*, messages(*), patients(*)')
    .eq('id', id)
    .single()

  if (!conversation) {
    notFound()
  }

  // Fetch all patients for the dropdown (in a real app, filter by tenant)
  const { data: allPatients } = await supabase
    .from('patients')
    .select('*')
    .order('name', { ascending: true })

  // Sort messages by created_at
  const messages = conversation.messages?.sort(
    (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  ) || []

  return (
    <div className="p-8 max-w-4xl mx-auto w-full flex flex-col h-screen">
      <div className="mb-6 flex items-center gap-4">
        <Link 
          href="/" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Session: <span className="text-blue-600 font-mono text-lg">{conversation.session_id}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {new Date(conversation.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <LinkPatientClient 
        conversationId={conversation.id} 
        initialPatient={conversation.patients} 
        patients={allPatients || []} 
      />

      <div className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col mb-8 relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-slate-500 my-10">
              No messages in this conversation.
            </div>
          )}
          {messages.map((msg: any) => {
            const isUser = msg.role === 'user'
            return (
              <div key={msg.id} className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-sm border ${
                  isUser 
                    ? 'bg-blue-600 border-blue-700 text-white' 
                    : 'bg-white border-slate-200 text-blue-600'
                }`}>
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm shadow-sm ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div className={`text-xs mt-2 ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
