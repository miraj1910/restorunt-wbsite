'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRequireAuth } from '@/lib/admin/auth'
import { orders as mockOrders } from '@/lib/admin/data'
import type { AdminOrder, OrderStatus, PaymentStatus } from '@/lib/admin/types'
import DataTable from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

type ModalMode = 'view' | null

const STATUS_FLOW: OrderStatus[] = ['pending', 'preparing', 'ready', 'served', 'completed']

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400',
  preparing: 'bg-orange-500/15 text-orange-400',
  ready: 'bg-blue-500/15 text-blue-400',
  served: 'bg-purple-500/15 text-purple-400',
  completed: 'bg-green-500/15 text-green-400',
  cancelled: 'bg-red-500/15 text-red-400',
}

const paymentColors: Record<PaymentStatus, string> = {
  unpaid: 'bg-red-500/15 text-red-400',
  paid: 'bg-green-500/15 text-green-400',
  refunded: 'bg-white/10 text-mist/50',
  'partially-paid': 'bg-yellow-500/15 text-yellow-400',
}

const statusOptions = ['All', ...STATUS_FLOW, 'cancelled'] as const

function getRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'yesterday'
  return `${diffDays} days ago`
}

function formatOrderId(id: string): string {
  const num = id.replace('o', '')
  return `#ORD-${num.padStart(4, '0')}`
}

export default function OrdersPage() {
  useRequireAuth()

  const [orders, setOrders] = useState<AdminOrder[]>(() => [...mockOrders])
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((type: Toast['type'], message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = searchTerm === '' ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [orders, searchTerm, statusFilter])

  const openView = useCallback((order: AdminOrder) => {
    setSelectedOrder(order)
    setModalMode('view')
  }, [])

  const closeModal = useCallback(() => {
    setSelectedOrder(null)
    setModalMode(null)
  }, [])

  const handleNextStatus = useCallback((order: AdminOrder) => {
    const currentIdx = STATUS_FLOW.indexOf(order.status)
    if (currentIdx === -1 || currentIdx >= STATUS_FLOW.length - 1) return
    const nextStatus = STATUS_FLOW[currentIdx + 1]
    setOrders(prev =>
      prev.map(o =>
        o.id === order.id
          ? { ...o, status: nextStatus, completedAt: nextStatus === 'completed' ? new Date().toISOString() : o.completedAt }
          : o
      )
    )
    showToast('success', `Order ${formatOrderId(order.id)} moved to "${nextStatus}"`)
  }, [showToast])

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      showToast('info', 'Orders refreshed')
    }, 1200)
  }, [showToast])

  const canAdvance = useCallback((status: OrderStatus): boolean => {
    const idx = STATUS_FLOW.indexOf(status)
    return idx >= 0 && idx < STATUS_FLOW.length - 1
  }, [])

  const activeStatusLabel = useCallback((status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      pending: 'Pending',
      preparing: 'Preparing',
      ready: 'Ready',
      served: 'Served',
      completed: 'Complete',
      cancelled: 'Cancelled',
    }
    return labels[status]
  }, [])

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/50 transition-colors'

  const labelClass = 'block text-xs font-medium text-mist/60 uppercase tracking-wider mb-1.5'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-display text-3xl text-mist tracking-wide">Orders</h1>
      </div>

      <div className="section-panel rounded-2xl p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="relative flex-1">
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-mist/30"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by customer name or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/50 transition-colors"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm text-mist focus:outline-none focus:border-amber/50 transition-colors appearance-none"
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt} className="bg-ink text-mist">
                  {opt === 'All' ? 'All Statuses' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mist/30 pointer-events-none"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          <span className="text-sm text-mist/50 whitespace-nowrap font-body">
            {filteredOrders.length} / {orders.length} orders
          </span>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-3d shrink-0"
          >
            <span className="btn-3d-depth" />
            <span className="btn-3d-layer flex items-center gap-1.5 text-xs md:text-sm whitespace-nowrap">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={refreshing ? 'animate-spin' : ''}
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: 'id',
            header: 'Order ID',
            sortable: true,
            width: '120px',
            render: (item: Record<string, unknown>) => {
              const o = item as unknown as AdminOrder
              return <span className="font-display text-amber font-semibold tracking-wide">{formatOrderId(o.id)}</span>
            },
          },
          {
            key: 'customerName',
            header: 'Customer',
            sortable: true,
            render: (item: Record<string, unknown>) => {
              const o = item as unknown as AdminOrder
              return <span className="text-mist/90 font-medium">{o.customerName}</span>
            },
          },
          {
            key: 'tableNumber',
            header: 'Table #',
            sortable: true,
            width: '80px',
            render: (item: Record<string, unknown>) => {
              const o = item as unknown as AdminOrder
              return <span className="text-mist/70">T{o.tableNumber}</span>
            },
          },
          {
            key: 'items',
            header: 'Items',
            render: (item: Record<string, unknown>) => {
              const o = item as unknown as AdminOrder
              const firstTwo = o.items.slice(0, 2)
              const remaining = o.items.length - 2
              return (
                <div className="text-sm text-mist/70">
                  {firstTwo.map((it, idx) => (
                    <span key={idx}>
                      {idx > 0 && ', '}
                      {it.qty}x {it.name}
                    </span>
                  ))}
                  {remaining > 0 && (
                    <span className="text-mist/40 ml-1">+{remaining} more</span>
                  )}
                </div>
              )
            },
          },
          {
            key: 'total',
            header: 'Total',
            sortable: true,
            width: '100px',
            render: (item: Record<string, unknown>) => {
              const o = item as unknown as AdminOrder
              return <span className="font-body font-medium text-mist">${o.total.toFixed(2)}</span>
            },
          },
          {
            key: 'paymentStatus',
            header: 'Payment',
            width: '110px',
            render: (item: Record<string, unknown>) => {
              const o = item as unknown as AdminOrder
              return (
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${paymentColors[o.paymentStatus]}`}>
                  {o.paymentStatus.replace('-', ' ')}
                </span>
              )
            },
          },
          {
            key: 'status',
            header: 'Status',
            width: '110px',
            render: (item: Record<string, unknown>) => {
              const o = item as unknown as AdminOrder
              return (
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${statusColors[o.status]}`}>
                  {o.status}
                </span>
              )
            },
          },
          {
            key: 'waiterName',
            header: 'Waiter',
            sortable: true,
            render: (item: Record<string, unknown>) => {
              const o = item as unknown as AdminOrder
              return <span className="text-mist/70">{o.waiterName}</span>
            },
          },
          {
            key: 'createdAt',
            header: 'Time',
            sortable: true,
            width: '100px',
            render: (item: Record<string, unknown>) => {
              const o = item as unknown as AdminOrder
              return <span className="text-mist/50 text-xs">{getRelativeTime(o.createdAt)}</span>
            },
          },
          {
            key: 'actions',
            header: 'Actions',
            width: '150px',
            render: (item: Record<string, unknown>) => {
              const o = item as unknown as AdminOrder
              return (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); openView(o) }}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-mist/40 hover:text-amber hover:bg-amber/10 transition-all"
                    title="View"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  {canAdvance(o.status) && (
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); handleNextStatus(o) }}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber/15 text-amber hover:bg-amber/25 transition-all whitespace-nowrap"
                      title="Advance to next status"
                    >
                      {activeStatusLabel(STATUS_FLOW[STATUS_FLOW.indexOf(o.status) + 1])}
                    </button>
                  )}
                  {o.status === 'completed' && (
                    <span className="text-[11px] text-mist/30 italic px-2">Done</span>
                  )}
                  {o.status === 'cancelled' && (
                    <span className="text-[11px] text-mist/30 italic px-2">Cancelled</span>
                  )}
                </div>
              )
            },
          },
        ]}
        data={filteredOrders as unknown as Record<string, unknown>[]}
        emptyMessage="No orders match your filters."
        pageSize={10}
      />

      <Modal isOpen={modalMode === 'view'} onClose={closeModal} title="Order Details" size="xl">
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="font-display text-2xl text-amber tracking-wide">{formatOrderId(selectedOrder.id)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${paymentColors[selectedOrder.paymentStatus]}`}>
                  {selectedOrder.paymentStatus.replace('-', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <span className={labelClass}>Customer</span>
                <p className="text-sm text-mist font-medium mt-1">{selectedOrder.customerName}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <span className={labelClass}>Table</span>
                <p className="text-sm text-mist font-medium mt-1">Table #{selectedOrder.tableNumber}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <span className={labelClass}>Waiter</span>
                <p className="text-sm text-mist font-medium mt-1">{selectedOrder.waiterName}</p>
              </div>
            </div>

            <div>
              <h3 className="font-display text-mist text-base tracking-wide mb-3">Order Items</h3>
              <div className="bg-white/5 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-2.5 text-[11px] font-body font-medium text-mist/50 uppercase tracking-wider">#</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-body font-medium text-mist/50 uppercase tracking-wider">Item</th>
                      <th className="text-right px-4 py-2.5 text-[11px] font-body font-medium text-mist/50 uppercase tracking-wider">Qty</th>
                      <th className="text-right px-4 py-2.5 text-[11px] font-body font-medium text-mist/50 uppercase tracking-wider">Price</th>
                      <th className="text-right px-4 py-2.5 text-[11px] font-body font-medium text-mist/50 uppercase tracking-wider">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-white/5 last:border-0">
                        <td className="px-4 py-2.5 text-sm text-mist/40">{idx + 1}</td>
                        <td className="px-4 py-2.5 text-sm text-mist/90">{item.name}</td>
                        <td className="px-4 py-2.5 text-sm text-mist/70 text-right">{item.qty}</td>
                        <td className="px-4 py-2.5 text-sm text-mist/70 text-right">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-sm text-mist font-medium text-right">${(item.qty * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-white/10">
                      <td colSpan={4} className="px-4 py-3 text-sm text-mist/60 text-right font-medium">Total</td>
                      <td className="px-4 py-3 text-sm font-display text-amber text-right text-lg">${selectedOrder.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-display text-mist text-base tracking-wide mb-3">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm text-mist/90">Order created</p>
                      <p className="text-xs text-mist/40">{new Date(selectedOrder.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  {selectedOrder.status !== 'pending' && selectedOrder.status !== 'cancelled' && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber mt-1.5 shrink-0" />
                      <div>
                        <p className="text-sm text-mist/90">Status changed to &quot;{selectedOrder.status}&quot;</p>
                        <p className="text-xs text-mist/40">Ongoing</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.completedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-sm text-emerald-400">Completed</p>
                        <p className="text-xs text-mist/40">{new Date(selectedOrder.completedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === 'cancelled' && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-sm text-red-400">Cancelled</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-display text-mist text-base tracking-wide mb-3">Summary</h3>
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-mist/60">Subtotal</span>
                    <span className="text-mist/90">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-mist/60">Payment Status</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${paymentColors[selectedOrder.paymentStatus]}`}>
                      {selectedOrder.paymentStatus.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-mist/60">Order Status</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${statusColors[selectedOrder.status]}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
          {toasts.map(toast => {
            const typeStyles: Record<string, { bg: string; border: string; icon: React.ReactNode }> = {
              success: {
                bg: 'bg-emerald-500/15',
                border: 'border-emerald-500/30',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 shrink-0">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ),
              },
              info: {
                bg: 'bg-amber-500/15',
                border: 'border-amber-500/30',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                ),
              },
              error: {
                bg: 'bg-red-500/15',
                border: 'border-red-500/30',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                ),
              },
              warning: {
                bg: 'bg-yellow-500/15',
                border: 'border-yellow-500/30',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 shrink-0">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                ),
              },
            }
            const style = typeStyles[toast.type] || typeStyles.info
            return (
              <div key={toast.id} className="pointer-events-auto animate-[fadeInScale_0.25s_ease-out]">
                <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${style.bg} ${style.border} backdrop-blur-md shadow-lg`}>
                  {style.icon}
                  <p className="text-sm text-mist flex-1 min-w-0">{toast.message}</p>
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    className="shrink-0 text-mist/30 hover:text-mist transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
