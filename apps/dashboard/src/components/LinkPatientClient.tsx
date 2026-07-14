'use client'

import { useState } from 'react'
import { Link as LinkIcon, User, CheckCircle2, FileText, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function LinkPatientClient({ 
  conversationId, 
  initialPatient, 
  patients 
}: { 
  conversationId: string
  initialPatient: any
  patients: any[]
}) {
  const [linkedPatient, setLinkedPatient] = useState(initialPatient)
  const [isLinking, setIsLinking] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState('')

  const handleLink = async () => {
    if (!selectedPatientId) return
    setIsLinking(true)

    try {
      const res = await fetch(`/api/conversations/${conversationId}/link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: selectedPatientId })
      })

      if (res.ok) {
        const { data } = await res.json()
        setLinkedPatient(data.patients) // Because we selected *, patients(*)
      } else {
        console.error("Failed to link patient")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLinking(false)
    }
  }

  if (linkedPatient) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between mb-6 shadow-sm animate-in fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              Linked to {linkedPatient.name}
            </div>
            {linkedPatient.ndis_number && (
              <div className="text-xs font-medium text-emerald-700 flex items-center gap-1 mt-0.5">
                <FileText className="w-3.5 h-3.5" /> NDIS: {linkedPatient.ndis_number}
              </div>
            )}
          </div>
        </div>
        <Link 
          href="/patients"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
        >
          View Profile <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between mb-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
          <User className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">Anonymous Conversation</div>
          <div className="text-xs text-slate-500 mt-0.5">Link this session to a patient record</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48"
        >
          <option value="">Select a patient...</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.name} {p.ndis_number ? `(${p.ndis_number})` : ''}</option>
          ))}
        </select>
        <button
          onClick={handleLink}
          disabled={!selectedPatientId || isLinking}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <LinkIcon className="w-4 h-4" />
          {isLinking ? 'Linking...' : 'Link'}
        </button>
      </div>
    </div>
  )
}
