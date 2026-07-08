'use client'

import { useState, useMemo } from 'react'
import { useRequireAuth } from '@/lib/admin/auth'
import type { AdminReservation, ReservationStatus } from '@/lib/admin/types'
import { reservations as mockReservations } from '@/lib/admin/data'

type ModalMode = 'view' | 'edit' | null

interface ToastItem {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  message: string
}

const statusStyles: Record<ReservationStatus, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400',
  confirmed: 'bg-green-500/15 text-green-400',
  cancelled: 'bg-red-500/15 text-red-400',
  completed: 'bg-blue-500/15 text-blue-400',
  'no-show': 'bg-gray-500/15 text-gray-400',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function generateId() {
  return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export default function AdminReservationsPage() {
  useRequireAuth()

  const [reservations, setReservations] = useState<AdminReservation[]>(mockReservations)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedReservation, setSelectedReservation] = useState<AdminReservation | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const [editForm, setEditForm] = useState<AdminReservation>({
    id: '',
    customerName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    tableNumber: 1,
    status: 'pending',
    createdAt: '',
  })

  function addToast(type: ToastItem['type'], message: string) {
    const id = Date.now().toString(36)
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const matchesSearch =
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || r.status === statusFilter
      const matchesDate = !dateFilter || r.date === dateFilter

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [reservations, searchTerm, statusFilter, dateFilter])

  function openView(reservation: AdminReservation) {
    setSelectedReservation(reservation)
    setModalMode('view')
  }

  function openEdit(reservation: AdminReservation) {
    setSelectedReservation(reservation)
    setEditForm({ ...reservation })
    setModalMode('edit')
  }

  function closeModal() {
    setSelectedReservation(null)
    setModalMode(null)
  }

  function handleConfirm(reservation: AdminReservation) {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservation.id ? { ...r, status: 'confirmed' as ReservationStatus } : r))
    )
    addToast('success', `Reservation #${reservation.id} confirmed successfully`)
  }

  function handleCancel(reservation: AdminReservation) {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservation.id ? { ...r, status: 'cancelled' as ReservationStatus } : r))
    )
    addToast('warning', `Reservation #${reservation.id} cancelled`)
  }

  function handleDelete(reservation: AdminReservation) {
    setReservations((prev) => prev.filter((r) => r.id !== reservation.id))
    addToast('info', `Reservation #${reservation.id} deleted`)
  }

  function handleEditSave() {
    setReservations((prev) =>
      prev.map((r) => (r.id === editForm.id ? { ...editForm } : r))
    )
    addToast('success', `Reservation #${editForm.id} updated successfully`)
    closeModal()
  }

  function handleAdd() {
    const now = new Date().toISOString().split('T')[0]
    const newReservation: AdminReservation = {
      id: generateId(),
      customerName: '',
      email: '',
      phone: '',
      date: now,
      time: '19:00',
      guests: 2,
      tableNumber: 1,
      status: 'pending',
      specialRequests: '',
      createdAt: new Date().toISOString(),
    }
    setEditForm(newReservation)
    setModalMode('edit')
  }

  function handleAddSave() {
    setReservations((prev) => [...prev, editForm])
    addToast('success', `Reservation #${editForm.id} created successfully`)
    closeModal()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl md:text-3xl text-mist">
          Reservations
        </h1>
        <button type="button" className="btn-3d" onClick={handleAdd}>
          <span className="btn-3d-layer flex items-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Reservation
          </span>
          <span className="btn-3d-depth" />
        </button>
      </div>

      {/* Filters */}
      <div className="section-panel rounded-2xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist/30"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all min-w-[130px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="no-show">No-Show</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="mt-4 text-sm text-mist/50">
          Total: <span className="text-amber font-semibold">{filteredReservations.length}</span> reservations
        </div>
      </div>

      {/* Table */}
      <div className="section-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">ID</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Customer</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Phone</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Date</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Time</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Guests</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Table</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Status</th>
                <th className="text-right px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-mist/30">
                    No reservations found
                  </td>
                </tr>
              )}
              {filteredReservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-amber">#{reservation.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-mist font-medium">{reservation.customerName}</div>
                    <div className="text-mist/40 text-xs mt-0.5">{reservation.email}</div>
                  </td>
                  <td className="px-4 py-3.5 text-mist/70">{reservation.phone}</td>
                  <td className="px-4 py-3.5 text-mist/80">{formatDate(reservation.date)}</td>
                  <td className="px-4 py-3.5 text-mist/80">{reservation.time}</td>
                  <td className="px-4 py-3.5 text-mist/80">{reservation.guests}</td>
                  <td className="px-4 py-3.5 text-mist/80">{reservation.tableNumber}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[reservation.status]}`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openView(reservation)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-amber hover:bg-amber/10 transition-all"
                        title="View"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(reservation)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      {reservation.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleConfirm(reservation)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-green-400 hover:bg-green-400/10 transition-all"
                          title="Confirm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 11 12 14 22 4" />
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                          </svg>
                        </button>
                      )}
                      {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                        <button
                          type="button"
                          onClick={() => handleCancel(reservation)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          title="Cancel"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(reservation)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {modalMode === 'view' && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative section-panel rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto animate-[fadeInScale_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-mist">Reservation Details</h2>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-mist hover:bg-white/5 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-mist/50 text-sm">Reservation ID</span>
                <span className="text-amber font-bold">#{selectedReservation.id}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-mist/50 text-sm">Customer</span>
                <span className="text-mist font-medium">{selectedReservation.customerName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-mist/50 text-sm">Email</span>
                <span className="text-mist text-sm">{selectedReservation.email}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-mist/50 text-sm">Phone</span>
                <span className="text-mist text-sm">{selectedReservation.phone}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-mist/50 text-sm">Date</span>
                <span className="text-mist">{formatDate(selectedReservation.date)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-mist/50 text-sm">Time</span>
                <span className="text-mist">{selectedReservation.time}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-mist/50 text-sm">Guests</span>
                <span className="text-mist">{selectedReservation.guests}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-mist/50 text-sm">Table</span>
                <span className="text-mist">#{selectedReservation.tableNumber}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-mist/50 text-sm">Status</span>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[selectedReservation.status]}`}
                >
                  {selectedReservation.status}
                </span>
              </div>
              {selectedReservation.specialRequests && (
                <div className="pb-3 border-b border-white/10">
                  <div className="text-mist/50 text-sm mb-1">Special Requests</div>
                  <div className="text-mist text-sm bg-white/5 rounded-xl px-4 py-3">
                    {selectedReservation.specialRequests}
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-mist/50 text-sm">Created At</span>
                <span className="text-mist/60 text-sm">{formatDateTime(selectedReservation.createdAt)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="mt-6 w-full bg-white/5 border border-white/10 rounded-xl py-2.5 text-sm text-mist/70 hover:text-mist hover:bg-white/10 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {modalMode === 'edit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative section-panel rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto animate-[fadeInScale_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-mist">
                {selectedReservation ? 'Edit Reservation' : 'Add Reservation'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-mist hover:bg-white/5 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-mist/70 mb-1.5">Customer Name</label>
                <input
                  type="text"
                  value={editForm.customerName}
                  onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-mist/70 mb-1.5">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-mist/70 mb-1.5">Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-mist/70 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-mist/70 mb-1.5">Time</label>
                  <input
                    type="time"
                    value={editForm.time}
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-mist/70 mb-1.5">Guests</label>
                  <input
                    type="number"
                    min={1}
                    value={editForm.guests}
                    onChange={(e) => setEditForm({ ...editForm, guests: parseInt(e.target.value) || 1 })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-mist/70 mb-1.5">Table Number</label>
                  <input
                    type="number"
                    min={1}
                    value={editForm.tableNumber}
                    onChange={(e) => setEditForm({ ...editForm, tableNumber: parseInt(e.target.value) || 1 })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-mist/70 mb-1.5">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as ReservationStatus })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                  <option value="no-show">No-Show</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-mist/70 mb-1.5">Special Requests</label>
                <textarea
                  rows={3}
                  value={editForm.specialRequests || ''}
                  onChange={(e) => setEditForm({ ...editForm, specialRequests: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 text-sm text-mist/70 hover:text-mist hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={selectedReservation ? handleEditSave : handleAddSave}
                className="btn-3d flex-1"
              >
                <span className="btn-3d-layer justify-center text-sm">
                  {selectedReservation ? 'Save Changes' : 'Create Reservation'}
                </span>
                <span className="btn-3d-depth" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto section-panel rounded-xl px-4 py-3 flex items-start gap-3 animate-[fadeInScale_0.25s_ease-out] ${
              toast.type === 'success'
                ? 'border-green-500/30'
                : toast.type === 'warning'
                ? 'border-yellow-500/30'
                : toast.type === 'info'
                ? 'border-blue-500/30'
                : 'border-red-500/30'
            }`}
          >
            <span className="shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              )}
              {toast.type === 'warning' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              )}
              {toast.type === 'info' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              )}
              {toast.type === 'error' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </span>
            <span className="text-mist text-sm flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-mist/30 hover:text-mist/70 transition-colors shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
