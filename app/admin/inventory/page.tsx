'use client'

import { useState, useMemo } from 'react'
import { useRequireAuth } from '@/lib/admin/auth'
import type { AdminInventoryItem, InventoryUnit } from '@/lib/admin/types'
import { inventoryItems as mockInventory } from '@/lib/admin/data'

type ModalMode = 'add' | 'edit' | 'view' | null

interface ToastItem {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  message: string
}

const units: InventoryUnit[] = ['kg', 'g', 'l', 'ml', 'pcs', 'boxes', 'bottles']

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function isExpired(dateStr: string) {
  return new Date(dateStr + 'T23:59:59') < new Date()
}

function generateId() {
  return 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export default function AdminInventoryPage() {
  useRequireAuth()

  const [items, setItems] = useState<AdminInventoryItem[]>(mockInventory)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<AdminInventoryItem | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const [editForm, setEditForm] = useState<AdminInventoryItem>({
    id: '',
    name: '',
    quantity: 0,
    unit: 'kg',
    supplier: '',
    expiryDate: '',
    lowStockAlert: 0,
  })

  function addToast(type: ToastItem['type'], message: string) {
    const id = Date.now().toString(36)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  function dismissToast(id: string) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const lowStockItems = useMemo(() => items.filter(i => i.quantity <= i.lowStockAlert), [items])

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items
    const q = searchTerm.toLowerCase()
    return items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.supplier.toLowerCase().includes(q)
    )
  }, [items, searchTerm])

  function openView(item: AdminInventoryItem) {
    setSelectedItem(item)
    setModalMode('view')
  }

  function openEdit(item: AdminInventoryItem) {
    setSelectedItem(item)
    setEditForm({ ...item })
    setModalMode('edit')
  }

  function openAdd() {
    setSelectedItem(null)
    setEditForm({
      id: generateId(),
      name: '',
      quantity: 0,
      unit: 'kg',
      supplier: '',
      expiryDate: '',
      lowStockAlert: 0,
    })
    setModalMode('add')
  }

  function closeModal() {
    setSelectedItem(null)
    setModalMode(null)
  }

  function handleSave() {
    if (modalMode === 'add') {
      setItems(prev => [...prev, editForm])
      addToast('success', `"${editForm.name}" added to inventory`)
    } else {
      setItems(prev => prev.map(i => i.id === editForm.id ? { ...editForm } : i))
      addToast('success', `"${editForm.name}" updated`)
    }
    closeModal()
  }

  function handleDelete(item: AdminInventoryItem) {
    setItems(prev => prev.filter(i => i.id !== item.id))
    addToast('warning', `"${item.name}" removed from inventory`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl md:text-3xl text-mist">Inventory</h1>
        <button type="button" className="btn-3d" onClick={openAdd}>
          <span className="btn-3d-layer flex items-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Item
          </span>
          <span className="btn-3d-depth" />
        </button>
      </div>

      {lowStockItems.length > 0 && (
        <div className="section-panel rounded-2xl p-4 md:p-5 border-red-500/20">
          <div className="flex items-center gap-2 text-red-400 font-medium text-sm mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Low Stock Alert
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.map(item => (
              <div key={item.id} className="bg-red-500/5 rounded-xl px-4 py-3 border border-red-500/10">
                <div className="font-medium text-mist text-sm">{item.name}</div>
                <div className="text-red-400 text-xs mt-1">
                  {item.quantity} {item.unit} remaining &mdash; Alert at {item.lowStockAlert} {item.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section-panel rounded-2xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist/30">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text" placeholder="Search by name or supplier..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
            />
          </div>
        </div>
        <div className="text-sm text-mist/50 mb-4">
          Total: <span className="text-amber font-semibold">{filteredItems.length}</span> items
          {lowStockItems.length > 0 && (
            <span className="text-red-400 ml-2">({lowStockItems.length} low stock)</span>
          )}
        </div>
      </div>

      <div className="section-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Name</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Quantity</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Unit</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Supplier</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Expiry Date</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Low Stock Alert</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Status</th>
                <th className="text-right px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-mist/30">No inventory items found</td>
                </tr>
              )}
              {filteredItems.map(item => {
                const isLow = item.quantity <= item.lowStockAlert
                const expired = isExpired(item.expiryDate)
                return (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="text-mist font-medium">{item.name}</span>
                    </td>
                    <td className="px-4 py-3.5 text-mist/80">{item.quantity}</td>
                    <td className="px-4 py-3.5 text-mist/60">{item.unit}</td>
                    <td className="px-4 py-3.5 text-mist/70">{item.supplier}</td>
                    <td className={`px-4 py-3.5 ${expired ? 'text-red-400' : 'text-mist/70'}`}>
                      {formatDate(item.expiryDate)}
                      {expired && <span className="ml-1 text-xs">(expired)</span>}
                    </td>
                    <td className="px-4 py-3.5 text-mist/70">{item.lowStockAlert} {item.unit}</td>
                    <td className="px-4 py-3.5">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400">In Stock</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => openView(item)} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-amber hover:bg-amber/10 transition-all" title="View">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        </button>
                        <button type="button" onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-blue-400 hover:bg-blue-400/10 transition-all" title="Edit">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        <button type="button" onClick={() => handleDelete(item)} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalMode === 'view' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative section-panel rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto animate-[fadeInScale_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-mist">Inventory Item</h2>
              <button type="button" onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-mist hover:bg-white/5 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              {[
                ['Name', selectedItem.name],
                ['Quantity', `${selectedItem.quantity} ${selectedItem.unit}`],
                ['Supplier', selectedItem.supplier],
                ['Expiry Date', formatDate(selectedItem.expiryDate)],
                ['Low Stock Alert', `${selectedItem.lowStockAlert} ${selectedItem.unit}`],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-mist/50 text-sm">{label as string}</span>
                  <span className="text-mist font-medium text-sm">{value as string}</span>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <span className="text-mist/50 text-sm">Status</span>
                {selectedItem.quantity <= selectedItem.lowStockAlert ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    Low Stock
                  </span>
                ) : (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400">In Stock</span>
                )}
              </div>
            </div>
            <button type="button" onClick={closeModal} className="mt-6 w-full bg-white/5 border border-white/10 rounded-xl py-2.5 text-sm text-mist/70 hover:text-mist hover:bg-white/10 transition-all">Close</button>
          </div>
        </div>
      )}

      {(modalMode === 'add' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative section-panel rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto animate-[fadeInScale_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-mist">{modalMode === 'add' ? 'Add Inventory Item' : 'Edit Inventory Item'}</h2>
              <button type="button" onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-mist hover:bg-white/5 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-mist/70 mb-1.5">Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-mist/70 mb-1.5">Quantity</label>
                  <input type="number" min={0} value={editForm.quantity} onChange={e => setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 0 })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-mist/70 mb-1.5">Unit</label>
                  <select value={editForm.unit} onChange={e => setEditForm({ ...editForm, unit: e.target.value as InventoryUnit })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all">
                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-mist/70 mb-1.5">Supplier</label>
                <input type="text" value={editForm.supplier} onChange={e => setEditForm({ ...editForm, supplier: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-mist/70 mb-1.5">Expiry Date</label>
                <input type="date" value={editForm.expiryDate} onChange={e => setEditForm({ ...editForm, expiryDate: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all [color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-sm text-mist/70 mb-1.5">Low Stock Alert Level</label>
                <input type="number" min={1} value={editForm.lowStockAlert} onChange={e => setEditForm({ ...editForm, lowStockAlert: parseInt(e.target.value) || 1 })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={closeModal} className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 text-sm text-mist/70 hover:text-mist hover:bg-white/10 transition-all">Cancel</button>
              <button type="button" onClick={handleSave} className="btn-3d flex-1">
                <span className="btn-3d-layer justify-center text-sm">{modalMode === 'add' ? 'Add Item' : 'Save Changes'}</span>
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
