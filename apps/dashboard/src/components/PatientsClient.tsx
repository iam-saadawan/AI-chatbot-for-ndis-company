'use client'

import { useState } from 'react'
import { Plus, User, FileText, Phone, Mail, Search } from 'lucide-react'

export function PatientsClient({ initialPatients }: { initialPatients: any[] }) {
  const [patients, setPatients] = useState(initialPatients)
  const [isAdding, setIsAdding] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [ndisNumber, setNdisNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.ndis_number?.includes(searchQuery)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Call API route to save patient securely
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, ndis_number: ndisNumber })
    })

    if (res.ok) {
      const { data } = await res.json()
      setPatients([data, ...patients])
      setIsAdding(false)
      // Reset form
      setName('')
      setEmail('')
      setPhone('')
      setNdisNumber('')
    } else {
      console.error("Failed to add patient")
    }

    setLoading(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients by name or NDIS number..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Patient
        </button>
      </div>

      {isAdding && (
        <div className="glass-card p-6 rounded-2xl mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-slate-900 mb-4">New Patient Profile</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NDIS Number</label>
              <input type="text" value={ndisNumber} onChange={e => setNdisNumber(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="123 456 789" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="0400 000 000" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium">Cancel</button>
              <button type="submit" disabled={loading} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Patient'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="w-full text-left">
          <div className="grid grid-cols-[2fr,1.5fr,1.5fr,1fr] border-b border-slate-200/50 bg-slate-50/50 px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div>Patient Name</div>
            <div>Contact Info</div>
            <div>NDIS Details</div>
            <div className="text-right">Added On</div>
          </div>
          <div className="divide-y divide-slate-200/50">
            {filteredPatients.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-500">
                No patients found. Click "Add Patient" to create one.
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <div key={patient.id} className="grid grid-cols-[2fr,1.5fr,1.5fr,1fr] items-center px-6 py-4 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{patient.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><User className="w-3 h-3"/> ID: {patient.id.split('-')[0]}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {patient.email && <div className="text-xs text-slate-600 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400"/> {patient.email}</div>}
                    {patient.phone && <div className="text-xs text-slate-600 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400"/> {patient.phone}</div>}
                    {!patient.email && !patient.phone && <span className="text-xs text-slate-400 italic">No contact provided</span>}
                  </div>
                  <div>
                    {patient.ndis_number ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                        <FileText className="w-3.5 h-3.5" />
                        {patient.ndis_number}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Not provided</span>
                    )}
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    {new Date(patient.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
