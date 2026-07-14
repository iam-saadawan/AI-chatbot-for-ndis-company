'use client'

import { useState } from 'react'
import { Save, MessageSquare, Palette, Shield } from 'lucide-react'

export function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  // Default values if no settings exist yet
  const [systemPrompt, setSystemPrompt] = useState(initialSettings?.system_prompt || 'You are a helpful AI assistant for an NDIS provider. Answer questions politely and clearly.')
  const [welcomeMessage, setWelcomeMessage] = useState(initialSettings?.welcome_message || 'Hi there! 👋 How can I help you today?')
  const [primaryColor, setPrimaryColor] = useState(initialSettings?.primary_color || '#2563eb')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_prompt: systemPrompt,
        welcome_message: welcomeMessage,
        primary_color: primaryColor,
      })
    })

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      console.error("Failed to save settings")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        
        {/* AI Configuration */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">AI Configuration</h3>
              <p className="text-sm text-slate-500">Manage how the AI behaves and responds</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">System Prompt</label>
            <p className="text-xs text-slate-500 mb-3">This instructs the AI on its persona, rules, and how to handle NDIS-specific inquiries.</p>
            <textarea 
              rows={5}
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm"
            />
          </div>
        </div>

        {/* Widget Appearance */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Widget Appearance</h3>
              <p className="text-sm text-slate-500">Customize the look and feel of your chat widget</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Welcome Message</label>
              <input 
                type="text" 
                value={welcomeMessage}
                onChange={e => setWelcomeMessage(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Primary Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0" 
                />
                <input 
                  type="text" 
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm" 
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sidebar Actions */}
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Save Changes</h3>
          <p className="text-sm text-slate-500 mb-6">Changes will be applied immediately to your live chat widget.</p>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Configuration'}
          </button>
          
          {success && (
            <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100 flex justify-center animate-in fade-in">
              Settings saved successfully!
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
