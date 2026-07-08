'use client'

import { useState } from 'react'
import { useRequireAuth } from '@/lib/admin/auth'

interface ToastItem {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  message: string
}

interface OpeningHour {
  day: string
  open: string
  close: string
  closed: boolean
}

interface SettingsState {
  name: string
  address: string
  contact: string
  email: string
  tax: number
  currency: string
  timezone: string
  maxGuestsPerReservation: number
  reservationNotice: number
  autoConfirmReservations: boolean
  openingHours: OpeningHour[]
}

const defaultSettings: SettingsState = {
  name: 'Bistro Aurelia',
  address: '123 Dining Street, New York, NY 10001',
  contact: '(212) 555-0199',
  email: 'info@bistroaurelia.com',
  tax: 8.875,
  currency: 'USD',
  timezone: 'America/New_York',
  maxGuestsPerReservation: 8,
  reservationNotice: 2,
  autoConfirmReservations: false,
  openingHours: [
    { day: 'Monday', open: '11:00', close: '22:00', closed: false },
    { day: 'Tuesday', open: '11:00', close: '22:00', closed: false },
    { day: 'Wednesday', open: '11:00', close: '22:00', closed: false },
    { day: 'Thursday', open: '11:00', close: '23:00', closed: false },
    { day: 'Friday', open: '11:00', close: '23:00', closed: false },
    { day: 'Saturday', open: '10:00', close: '23:00', closed: false },
    { day: 'Sunday', open: '10:00', close: '21:00', closed: false },
  ],
}

const currencies = ['USD', 'EUR', 'GBP']
const timezones = ['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London']
const timezoneLabels: Record<string, string> = {
  'America/New_York': 'EST',
  'America/Chicago': 'CST',
  'America/Los_Angeles': 'PST',
  'Europe/London': 'GMT',
}

export default function AdminSettingsPage() {
  useRequireAuth()

  const [settings, setSettings] = useState<SettingsState>(defaultSettings)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  function addToast(type: ToastItem['type'], message: string) {
    const id = Date.now().toString(36)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  function dismissToast(id: string) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  function updateField<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  function updateHour(idx: number, field: keyof OpeningHour, value: string | boolean) {
    setSettings(prev => ({
      ...prev,
      openingHours: prev.openingHours.map((h, i) => i === idx ? { ...h, [field]: value } : h),
    }))
  }

  function handleSave() {
    addToast('success', 'Settings saved successfully. Backend integration pending.')
  }

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all'
  const labelClass = 'block text-sm text-mist/70 mb-1.5'
  const selectClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-mist">Settings</h1>
      </div>

      <div className="section-panel rounded-2xl p-6">
        <h2 className="font-display text-lg text-mist tracking-wide mb-5">Restaurant Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Restaurant Name</label>
            <input type="text" value={settings.name} onChange={e => updateField('name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={settings.email} onChange={e => updateField('email', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input type="text" value={settings.address} onChange={e => updateField('address', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Contact Number</label>
            <input type="text" value={settings.contact} onChange={e => updateField('contact', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      <div className="section-panel rounded-2xl p-6">
        <h2 className="font-display text-lg text-mist tracking-wide mb-5">Business Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Tax (%)</label>
            <input type="number" step="0.001" min={0} max={100} value={settings.tax} onChange={e => updateField('tax', parseFloat(e.target.value) || 0)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <select value={settings.currency} onChange={e => updateField('currency', e.target.value)} className={selectClass}>
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Timezone</label>
            <select value={settings.timezone} onChange={e => updateField('timezone', e.target.value)} className={selectClass}>
              {timezones.map(tz => <option key={tz} value={tz}>{timezoneLabels[tz] || tz}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="section-panel rounded-2xl p-6">
        <h2 className="font-display text-lg text-mist tracking-wide mb-5">Reservation Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Max Guests Per Reservation</label>
            <input type="number" min={1} max={50} value={settings.maxGuestsPerReservation} onChange={e => updateField('maxGuestsPerReservation', parseInt(e.target.value) || 1)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Notice Required (hours)</label>
            <input type="number" min={0} max={168} value={settings.reservationNotice} onChange={e => updateField('reservationNotice', parseInt(e.target.value) || 0)} className={inputClass} />
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" checked={settings.autoConfirmReservations} onChange={e => updateField('autoConfirmReservations', e.target.checked)} className="sr-only peer" />
                <div className="w-10 h-5.5 bg-white/10 rounded-full peer-checked:bg-amber/50 transition-colors" />
                <div className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-mist rounded-full transition-transform peer-checked:translate-x-4.5`} style={{ width: '18px', height: '18px' }} />
              </div>
              <span className="text-sm text-mist/70">Auto-Confirm Reservations</span>
            </label>
          </div>
        </div>
      </div>

      <div className="section-panel rounded-2xl p-6">
        <h2 className="font-display text-lg text-mist tracking-wide mb-5">Opening Hours</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-mist/50 font-medium uppercase tracking-wider text-xs">Day</th>
                <th className="text-left px-4 py-3 text-mist/50 font-medium uppercase tracking-wider text-xs">Open</th>
                <th className="text-left px-4 py-3 text-mist/50 font-medium uppercase tracking-wider text-xs">Close</th>
                <th className="text-left px-4 py-3 text-mist/50 font-medium uppercase tracking-wider text-xs">Closed</th>
              </tr>
            </thead>
            <tbody>
              {settings.openingHours.map((hour, idx) => (
                <tr key={hour.day} className="border-b border-white/5">
                  <td className="px-4 py-3 text-mist font-medium">{hour.day}</td>
                  <td className="px-4 py-3">
                    <input type="time" value={hour.open} onChange={e => updateHour(idx, 'open', e.target.value)} disabled={hour.closed} className={`bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all [color-scheme:dark] ${hour.closed ? 'opacity-30' : ''}`} />
                  </td>
                  <td className="px-4 py-3">
                    <input type="time" value={hour.close} onChange={e => updateHour(idx, 'close', e.target.value)} disabled={hour.closed} className={`bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all [color-scheme:dark] ${hour.closed ? 'opacity-30' : ''}`} />
                  </td>
                  <td className="px-4 py-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={hour.closed} onChange={e => updateHour(idx, 'closed', e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-white/5 accent-amber" />
                      <span className="text-xs text-mist/50">{hour.closed ? 'Yes' : 'No'}</span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" className="btn-3d" onClick={handleSave}>
          <span className="btn-3d-layer flex items-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
            Save Settings
          </span>
          <span className="btn-3d-depth" />
        </button>
      </div>

      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`pointer-events-auto section-panel rounded-xl px-4 py-3 flex items-start gap-3 animate-[fadeInScale_0.25s_ease-out] ${toast.type === 'success' ? 'border-green-500/30' : toast.type === 'warning' ? 'border-yellow-500/30' : toast.type === 'info' ? 'border-blue-500/30' : 'border-red-500/30'}`}>
            <span className="shrink-0 mt-0.5">
              {toast.type === 'success' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
              {toast.type === 'warning' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>}
            </span>
            <span className="text-mist text-sm flex-1">{toast.message}</span>
            <button type="button" onClick={() => dismissToast(toast.id)} className="text-mist/30 hover:text-mist/70 transition-colors shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
