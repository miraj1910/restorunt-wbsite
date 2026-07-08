'use client'

import { useState, useMemo } from 'react'
import { useRequireAuth } from '@/lib/admin/auth'
import type { AdminCustomer, AdminReservation } from '@/lib/admin/types'
import { customers as mockCustomers, reservations as mockReservations } from '@/lib/admin/data'

type ModalMode = 'view' | 'edit' | null

interface ToastItem {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  message: string
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatCurrency(val: number) {
  return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function AdminCustomersPage() {
  useRequireAuth()

  const [customers, setCustomers] = useState<AdminCustomer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const [editForm, setEditForm] = useState<AdminCustomer>({
    id: '', name: '', email: '', phone: '', totalReservations: 0, totalOrders: 0,
    totalSpent: 0, loyaltyPoints: 0, joinedAt: '', notes: '', lastVisit: '',
  })

  function addToast(type: ToastItem['type'], message: string) {
    const id = Date.now().toString(36)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  function dismissToast(id: string) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers
    const q = searchTerm.toLowerCase()
    return customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    )
  }, [customers, searchTerm])

  const totalSpending = useMemo(() =>
    customers.reduce((sum, c) => sum + c.totalSpent, 0),
    [customers]
  )

  function openView(customer: AdminCustomer) {
    setSelectedCustomer(customer)
    setEditForm({ ...customer })
    setModalMode('view')
  }

  function openEdit(customer: AdminCustomer) {
    setSelectedCustomer(customer)
    setEditForm({ ...customer })
    setModalMode('edit')
  }

  function closeModal() {
    setSelectedCustomer(null)
    setModalMode(null)
  }

  function handleEditSave() {
    setCustomers(prev =>
      prev.map(c => c.id === editForm.id ? { ...editForm } : c)
    )
    addToast('success', `${editForm.name}'s profile updated`)
    closeModal()
  }

  function handleNotesSave() {
    setCustomers(prev =>
      prev.map(c => c.id === editForm.id ? { ...c, notes: editForm.notes } : c)
    )
    addToast('success', 'Notes updated')
  }

  const customerReservations = useMemo(() => {
    if (!selectedCustomer) return []
    return mockReservations.filter(r =>
      r.email === selectedCustomer.email ||
      r.customerName === selectedCustomer.name
    ).slice(-5)
  }, [selectedCustomer])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl md:text-3xl text-mist">Customers</h1>
      </div>

      <div className="section-panel rounded-2xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist/30">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search by name, email, or phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all" />
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-sm text-mist/50">
              Total: <span className="text-amber font-semibold">{filteredCustomers.length}</span> customers
            </div>
            <div className="section-panel rounded-xl px-4 py-2.5 text-sm">
              <span className="text-mist/50">Total Spending: </span>
              <span className="text-amber font-semibold">{formatCurrency(totalSpending)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Name</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Email</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Phone</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Reservations</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Orders</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Total Spent</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Loyalty Pts</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Last Visit</th>
                <th className="text-right px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-mist/30">No customers found</td></tr>
              )}
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center text-amber text-xs font-bold">{getInitials(customer.name)}</div>
                      <span className="text-mist font-medium">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-mist/70">{customer.email}</td>
                  <td className="px-4 py-3.5 text-mist/70">{customer.phone}</td>
                  <td className="px-4 py-3.5 text-mist/80">{customer.totalReservations}</td>
                  <td className="px-4 py-3.5 text-mist/80">{customer.totalOrders}</td>
                  <td className="px-4 py-3.5 text-amber font-medium">{formatCurrency(customer.totalSpent)}</td>
                  <td className="px-4 py-3.5 text-mist/80">{customer.loyaltyPoints}</td>
                  <td className="px-4 py-3.5 text-mist/60 text-xs">{formatDate(customer.lastVisit)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => openView(customer)} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-amber hover:bg-amber/10 transition-all" title="View">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      </button>
                      <button type="button" onClick={() => openEdit(customer)} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-blue-400 hover:bg-blue-400/10 transition-all" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalMode === 'view' && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative section-panel rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-[fadeInScale_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-mist">Customer Profile</h2>
              <button type="button" onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-mist hover:bg-white/5 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="flex items-center gap-4 pb-6 border-b border-white/10 mb-6">
              <div className="w-14 h-14 rounded-full bg-amber/20 flex items-center justify-center text-amber text-xl font-bold">{getInitials(selectedCustomer.name)}</div>
              <div>
                <div className="font-display text-2xl text-mist">{selectedCustomer.name}</div>
                <div className="text-mist/50 text-sm">Customer since {formatDate(selectedCustomer.joinedAt)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-mist/50 text-xs uppercase tracking-wider mb-1">Email</div>
                <div className="text-mist text-sm">{selectedCustomer.email}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-mist/50 text-xs uppercase tracking-wider mb-1">Phone</div>
                <div className="text-mist text-sm">{selectedCustomer.phone}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                ['Reservations', selectedCustomer.totalReservations],
                ['Orders', selectedCustomer.totalOrders],
                ['Total Spent', formatCurrency(selectedCustomer.totalSpent)],
                ['Loyalty Points', selectedCustomer.loyaltyPoints],
              ].map(([label, value]) => (
                <div key={label as string} className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-mist/50 text-xs uppercase tracking-wider mb-1">{label as string}</div>
                  <div className="font-display text-lg text-amber">{value as string}</div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm text-mist/70 mb-2">Notes</label>
              <textarea rows={3} value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all resize-none" />
              {editForm.notes !== selectedCustomer.notes && (
                <button type="button" onClick={handleNotesSave} className="mt-2 btn-3d">
                  <span className="btn-3d-layer text-xs py-1.5 px-4">Save Notes</span>
                  <span className="btn-3d-depth" />
                </button>
              )}
            </div>

            <div>
              <h3 className="font-display text-mist text-base mb-3">Recent Activity</h3>
              {customerReservations.length === 0 ? (
                <p className="text-mist/30 text-sm">No recent reservations found.</p>
              ) : (
                <div className="space-y-2">
                  {customerReservations.map(r => (
                    <div key={r.id} className="bg-white/5 rounded-xl px-4 py-3 flex items-center justify-between">
                      <div>
                        <span className="text-mist text-sm">{formatDate(r.date)} at {r.time}</span>
                        <span className="text-mist/40 text-xs ml-2">{r.guests} guests</span>
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.status === 'completed' ? 'bg-green-500/15 text-green-400' :
                        r.status === 'confirmed' ? 'bg-blue-500/15 text-blue-400' :
                        r.status === 'cancelled' ? 'bg-red-500/15 text-red-400' :
                        'bg-yellow-500/15 text-yellow-400'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="button" onClick={closeModal} className="mt-6 w-full bg-white/5 border border-white/10 rounded-xl py-2.5 text-sm text-mist/70 hover:text-mist hover:bg-white/10 transition-all">Close</button>
          </div>
        </div>
      )}

      {modalMode === 'edit' && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative section-panel rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto animate-[fadeInScale_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-mist">Edit Customer</h2>
              <button type="button" onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-mist hover:bg-white/5 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-mist/70 mb-1.5">Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-mist/70 mb-1.5">Email</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-mist/70 mb-1.5">Phone</label>
                <input type="text" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-mist/70 mb-1.5">Notes</label>
                <textarea rows={3} value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={closeModal} className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 text-sm text-mist/70 hover:text-mist hover:bg-white/10 transition-all">Cancel</button>
              <button type="button" onClick={handleEditSave} className="btn-3d flex-1">
                <span className="btn-3d-layer justify-center text-sm">Save Changes</span>
                <span className="btn-3d-depth" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`pointer-events-auto section-panel rounded-xl px-4 py-3 flex items-start gap-3 animate-[fadeInScale_0.25s_ease-out] ${toast.type === 'success' ? 'border-green-500/30' : toast.type === 'warning' ? 'border-yellow-500/30' : toast.type === 'info' ? 'border-blue-500/30' : 'border-red-500/30'}`}>
            <span className="shrink-0 mt-0.5">
              {toast.type === 'success' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
              {toast.type === 'warning' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>}
              {toast.type === 'info' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>}
              {toast.type === 'error' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
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
