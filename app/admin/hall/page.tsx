'use client'

import { useState, useCallback } from 'react'
import { useRequireAuth } from '@/lib/admin/auth'
import FloorPlan from '@/components/FloorPlan'
import type { TableData } from '@/lib/types'

interface ToastItem {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  message: string
}

type AdminTableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance' | 'blocked'

const statusConfig: Record<AdminTableStatus, { label: string; color: string; btnClass: string }> = {
  available: { label: 'Available', color: 'text-green-400', btnClass: 'bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/25' },
  occupied: { label: 'Occupied', color: 'text-red-400', btnClass: 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25' },
  reserved: { label: 'Reserved', color: 'text-amber', btnClass: 'bg-amber/15 text-amber border-amber/30 hover:bg-amber/25' },
  cleaning: { label: 'Cleaning', color: 'text-blue-400', btnClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/25' },
  maintenance: { label: 'Maintenance', color: 'text-red-400', btnClass: 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25' },
  blocked: { label: 'Blocked', color: 'text-gray-400', btnClass: 'bg-gray-500/15 text-gray-400 border-gray-500/30 hover:bg-gray-500/25' },
}

const allStatuses: AdminTableStatus[] = ['available', 'reserved', 'cleaning', 'maintenance', 'blocked']

export default function AdminHallPage() {
  useRequireAuth()

  const [selectedTableId, setSelectedTableId] = useState<number | null>(null)
  const [tableStatuses, setTableStatuses] = useState<Map<number, AdminTableStatus>>(new Map())
  const [toasts, setToasts] = useState<ToastItem[]>([])

  function addToast(type: ToastItem['type'], message: string) {
    const id = Date.now().toString(36)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  function dismissToast(id: string) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const handleTableSelect = useCallback((table: TableData) => {
    setSelectedTableId(table.id)
  }, [])

  function handleStatusChange(status: AdminTableStatus) {
    if (!selectedTableId) return
    setTableStatuses(prev => {
      const next = new Map(prev)
      next.set(selectedTableId, status)
      return next
    })
    const cfg = statusConfig[status]
    addToast('success', `Table ${String(selectedTableId).padStart(2, '0')} status changed to ${cfg.label}`)
  }

  const selectedTableNumber = selectedTableId !== null
    ? String(selectedTableId).padStart(2, '0')
    : null

  const currentStatus = selectedTableId !== null
    ? tableStatuses.get(selectedTableId) ?? null
    : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-mist">Hall Management</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <FloorPlan
            selectedTableId={selectedTableId}
            onTableSelect={handleTableSelect}
          />
        </div>

        <div className="w-full lg:w-[340px] shrink-0">
          <div className="section-panel rounded-2xl p-5 sticky top-24">
            {selectedTableId === null ? (
              <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-mist/20">
                  <path d="M3 3v18h18V3H3z" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" />
                </svg>
                <p className="text-mist/40 text-sm">Select a table to manage</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-amber/15 flex items-center justify-center mx-auto mb-3">
                    <span className="font-display text-2xl text-amber">{selectedTableNumber}</span>
                  </div>
                  <h3 className="font-display text-xl text-mist">Table {selectedTableNumber}</h3>
                  {currentStatus && (
                    <p className={`text-sm mt-1 ${statusConfig[currentStatus].color}`}>
                      {statusConfig[currentStatus].label}
                    </p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs text-mist/50 uppercase tracking-wider font-medium mb-3">Change Status</p>
                  {allStatuses.map(status => {
                    const cfg = statusConfig[status]
                    const isActive = currentStatus === status
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleStatusChange(status)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${cfg.btnClass} ${isActive ? 'ring-2 ring-amber/40' : ''}`}
                      >
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTableId(null)}
                  className="mt-6 w-full bg-white/5 border border-white/10 rounded-xl py-2 text-sm text-mist/50 hover:text-mist hover:bg-white/10 transition-all"
                >
                  Deselect Table
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`pointer-events-auto section-panel rounded-xl px-4 py-3 flex items-start gap-3 animate-[fadeInScale_0.25s_ease-out] ${toast.type === 'success' ? 'border-green-500/30' : toast.type === 'warning' ? 'border-yellow-500/30' : toast.type === 'info' ? 'border-blue-500/30' : 'border-red-500/30'}`}>
            <span className="shrink-0 mt-0.5">
              {toast.type === 'success' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
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
