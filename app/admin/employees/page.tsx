'use client'

import { useState, useMemo } from 'react'
import { useRequireAuth } from '@/lib/admin/auth'
import type { AdminEmployee, EmployeeStatus, StaffRole } from '@/lib/admin/types'
import { employees as mockEmployees } from '@/lib/admin/data'
import DataTable from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'

interface ToastItem {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  message: string
}

type ModalMode = 'add' | 'edit' | 'view' | null

const roleColors: Record<StaffRole, string> = {
  manager: 'bg-amber-500/15 text-amber-400',
  chef: 'bg-red-500/15 text-red-400',
  waiter: 'bg-blue-500/15 text-blue-400',
  receptionist: 'bg-green-500/15 text-green-400',
  cashier: 'bg-purple-500/15 text-purple-400',
  cleaner: 'bg-gray-500/15 text-gray-400',
}

const statusColors: Record<EmployeeStatus, string> = {
  active: 'bg-emerald-500/15 text-emerald-400',
  sick: 'bg-yellow-500/15 text-yellow-400',
  vacation: 'bg-blue-500/15 text-blue-400',
  terminated: 'bg-red-500/15 text-red-400',
}

const avatarColors = [
  'bg-amber-500/20 text-amber-400',
  'bg-blue-500/20 text-blue-400',
  'bg-green-500/20 text-green-400',
  'bg-purple-500/20 text-purple-400',
  'bg-red-500/20 text-red-400',
  'bg-pink-500/20 text-pink-400',
  'bg-teal-500/20 text-teal-400',
  'bg-orange-500/20 text-orange-400',
]

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function generateId(): string {
  return 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

const emptyEmployee: AdminEmployee = {
  id: '',
  name: '',
  role: 'waiter',
  email: '',
  phone: '',
  shift: 'Morning',
  salary: 30000,
  status: 'active',
  joinedAt: new Date().toISOString().split('T')[0],
  workingHours: 40,
  performance: 50,
}

export default function AdminEmployeesPage() {
  useRequireAuth()

  const [employees, setEmployees] = useState<AdminEmployee[]>(mockEmployees)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedEmployee, setSelectedEmployee] = useState<AdminEmployee | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editForm, setEditForm] = useState<AdminEmployee>({ ...emptyEmployee })
  const [toasts, setToasts] = useState<ToastItem[]>([])

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

  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === 'all' || e.role === roleFilter
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [employees, searchTerm, roleFilter, statusFilter])

  function openView(emp: AdminEmployee) {
    setSelectedEmployee(emp)
    setModalMode('view')
  }

  function openEdit(emp: AdminEmployee) {
    setSelectedEmployee(emp)
    setEditForm({ ...emp })
    setModalMode('edit')
  }

  function openAdd() {
    setSelectedEmployee(null)
    setEditForm({ ...emptyEmployee, id: generateId(), joinedAt: new Date().toISOString().split('T')[0] })
    setModalMode('add')
  }

  function closeModal() {
    setSelectedEmployee(null)
    setModalMode(null)
  }

  function handleEditSave() {
    setEmployees((prev) => prev.map((e) => (e.id === editForm.id ? { ...editForm } : e)))
    addToast('success', `Employee ${editForm.name} updated successfully`)
    closeModal()
  }

  function handleAddSave() {
    setEmployees((prev) => [...prev, editForm])
    addToast('success', `Employee ${editForm.name} added successfully`)
    closeModal()
  }

  function handleDelete(emp: AdminEmployee) {
    setEmployees((prev) => prev.filter((e) => e.id !== emp.id))
    addToast('info', `Employee ${emp.name} removed`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl md:text-3xl text-mist">Employees</h1>
        <button type="button" className="btn-3d" onClick={openAdd}>
          <span className="btn-3d-layer flex items-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Employee
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
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all min-w-[130px]"
            >
              <option value="all">All Roles</option>
              <option value="manager">Manager</option>
              <option value="chef">Chef</option>
              <option value="waiter">Waiter</option>
              <option value="receptionist">Receptionist</option>
              <option value="cashier">Cashier</option>
              <option value="cleaner">Cleaner</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all min-w-[130px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="sick">Sick</option>
              <option value="vacation">Vacation</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-mist/50">
          Total: <span className="text-amber font-semibold">{filteredEmployees.length}</span> employees
        </div>
      </div>

      {/* Table */}
      <DataTable
        pageSize={10}
        columns={[
          {
            key: 'name',
            header: 'Name',
            sortable: true,
            render: (item) => {
              const e = item as unknown as AdminEmployee
              return (
                <div className="flex items-center gap-3">
                  {e.photo ? (
                    <img src={e.photo} alt={e.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getAvatarColor(e.name)}`}>
                      {getInitials(e.name)}
                    </span>
                  )}
                  <span className="text-mist font-medium">{e.name}</span>
                </div>
              )
            },
          },
          {
            key: 'role',
            header: 'Role',
            render: (item) => {
              const e = item as unknown as AdminEmployee
              return (
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[e.role]}`}>
                  {e.role}
                </span>
              )
            },
          },
          { key: 'email', header: 'Email', sortable: true, render: (item) => { const e = item as unknown as AdminEmployee; return <span className="text-mist/70">{e.email}</span> } },
          { key: 'phone', header: 'Phone', render: (item) => { const e = item as unknown as AdminEmployee; return <span className="text-mist/70">{e.phone}</span> } },
          { key: 'shift', header: 'Shift', render: (item) => { const e = item as unknown as AdminEmployee; return <span className="text-mist/70 capitalize">{e.shift}</span> } },
          {
            key: 'salary',
            header: 'Salary',
            sortable: true,
            render: (item) => { const e = item as unknown as AdminEmployee; return <span className="text-mist font-medium">${e.salary.toLocaleString()}</span> },
          },
          {
            key: 'status',
            header: 'Status',
            render: (item) => {
              const e = item as unknown as AdminEmployee
              return (
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[e.status]}`}>
                  {e.status}
                </span>
              )
            },
          },
          {
            key: 'performance',
            header: 'Performance',
            sortable: true,
            render: (item) => {
              const e = item as unknown as AdminEmployee
              return (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden min-w-[60px]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${e.performance}%`,
                        backgroundColor: e.performance >= 80 ? '#4ade80' : e.performance >= 60 ? '#facc15' : '#f87171',
                      }}
                    />
                  </div>
                  <span className="text-mist/70 text-xs w-8 text-right">{e.performance}%</span>
                </div>
              )
            },
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (item) => {
              const e = item as unknown as AdminEmployee
              return (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openView(e)}
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
                    onClick={() => openEdit(e)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(e)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              )
            },
          },
        ]}
        data={filteredEmployees as unknown as Record<string, unknown>[]}
      />

      {/* View Modal */}
      <Modal isOpen={modalMode === 'view'} onClose={closeModal} title="Employee Details" size="lg">
        {selectedEmployee && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              {selectedEmployee.photo ? (
                <img src={selectedEmployee.photo} alt={selectedEmployee.name} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <span className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${getAvatarColor(selectedEmployee.name)}`}>
                  {getInitials(selectedEmployee.name)}
                </span>
              )}
              <div>
                <h3 className="font-display text-lg text-mist">{selectedEmployee.name}</h3>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-1 ${roleColors[selectedEmployee.role]}`}>
                  {selectedEmployee.role}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-mist/50 text-xs uppercase tracking-wider mb-1">Email</p>
                <p className="text-mist text-sm">{selectedEmployee.email}</p>
              </div>
              <div>
                <p className="text-mist/50 text-xs uppercase tracking-wider mb-1">Phone</p>
                <p className="text-mist text-sm">{selectedEmployee.phone}</p>
              </div>
              <div>
                <p className="text-mist/50 text-xs uppercase tracking-wider mb-1">Shift</p>
                <p className="text-mist text-sm capitalize">{selectedEmployee.shift}</p>
              </div>
              <div>
                <p className="text-mist/50 text-xs uppercase tracking-wider mb-1">Salary</p>
                <p className="text-mist text-sm">${selectedEmployee.salary.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-mist/50 text-xs uppercase tracking-wider mb-1">Status</p>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[selectedEmployee.status]}`}>
                  {selectedEmployee.status}
                </span>
              </div>
              <div>
                <p className="text-mist/50 text-xs uppercase tracking-wider mb-1">Working Hours</p>
                <p className="text-mist text-sm">{selectedEmployee.workingHours}h/week</p>
              </div>
              <div>
                <p className="text-mist/50 text-xs uppercase tracking-wider mb-1">Performance</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden max-w-[120px]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${selectedEmployee.performance}%`,
                        backgroundColor: selectedEmployee.performance >= 80 ? '#4ade80' : selectedEmployee.performance >= 60 ? '#facc15' : '#f87171',
                      }}
                    />
                  </div>
                  <span className="text-mist text-sm">{selectedEmployee.performance}%</span>
                </div>
              </div>
              <div>
                <p className="text-mist/50 text-xs uppercase tracking-wider mb-1">Joined</p>
                <p className="text-mist text-sm">{selectedEmployee.joinedAt}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalMode === 'add' || modalMode === 'edit'} onClose={closeModal} title={modalMode === 'add' ? 'Add Employee' : 'Edit Employee'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-mist/70 mb-1.5">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-mist/70 mb-1.5">Phone</label>
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-mist/70 mb-1.5">Role</label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value as StaffRole })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
              >
                <option value="manager">Manager</option>
                <option value="chef">Chef</option>
                <option value="waiter">Waiter</option>
                <option value="receptionist">Receptionist</option>
                <option value="cashier">Cashier</option>
                <option value="cleaner">Cleaner</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-mist/70 mb-1.5">Shift</label>
              <select
                value={editForm.shift}
                onChange={(e) => setEditForm({ ...editForm, shift: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-mist/70 mb-1.5">Salary ($)</label>
              <input
                type="number"
                min={0}
                value={editForm.salary}
                onChange={(e) => setEditForm({ ...editForm, salary: parseInt(e.target.value) || 0 })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-mist/70 mb-1.5">Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as EmployeeStatus })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
              >
                <option value="active">Active</option>
                <option value="sick">Sick</option>
                <option value="vacation">Vacation</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-mist/70 mb-1.5">Working Hours</label>
              <input
                type="number"
                min={0}
                value={editForm.workingHours}
                onChange={(e) => setEditForm({ ...editForm, workingHours: parseInt(e.target.value) || 0 })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-mist/70 mb-1.5">Performance (0-100)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={editForm.performance}
              onChange={(e) => setEditForm({ ...editForm, performance: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
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
            onClick={modalMode === 'add' ? handleAddSave : handleEditSave}
            className="btn-3d flex-1"
          >
            <span className="btn-3d-layer justify-center text-sm">
              {modalMode === 'add' ? 'Add Employee' : 'Save Changes'}
            </span>
            <span className="btn-3d-depth" />
          </button>
        </div>
      </Modal>

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
