'use client'

import { useState, useMemo } from 'react'
import { useRequireAuth } from '@/lib/admin/auth'
import type { AdminReview } from '@/lib/admin/types'
import { reviews as mockReviews } from '@/lib/admin/data'

type ModalMode = 'view' | 'reply' | null
type StatusFilter = 'All' | 'Approved' | 'Pending' | 'Hidden'

interface ToastItem {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  message: string
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" title={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map(star => (
        <svg key={star} width={size} height={size} viewBox="0 0 24 24" fill={star <= rating ? '#c8a76a' : 'rgba(244,239,230,0.15)'} stroke={star <= rating ? '#c8a76a' : 'rgba(244,239,230,0.25)'} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  )
}

export default function AdminReviewsPage() {
  useRequireAuth()

  const [reviews, setReviews] = useState<AdminReview[]>(mockReviews)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [replyText, setReplyText] = useState('')
  const [toasts, setToasts] = useState<ToastItem[]>([])

  function addToast(type: ToastItem['type'], message: string) {
    const id = Date.now().toString(36)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  function dismissToast(id: string) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchesSearch = !searchTerm || r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || r.comment.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRating = ratingFilter === null || r.rating === ratingFilter
      const matchesStatus =
        statusFilter === 'All' ? true :
        statusFilter === 'Approved' ? r.approved && !r.hidden :
        statusFilter === 'Pending' ? !r.approved && !r.hidden :
        statusFilter === 'Hidden' ? r.hidden : true
      return matchesSearch && matchesRating && matchesStatus
    })
  }, [reviews, searchTerm, ratingFilter, statusFilter])

  const ratingOptions = [null, 5, 4, 3, 2, 1]

  function openView(review: AdminReview) {
    setSelectedReview(review)
    setModalMode('view')
  }

  function openReply(review: AdminReview) {
    setSelectedReview(review)
    setReplyText(review.reply || '')
    setModalMode('reply')
  }

  function closeModal() {
    setSelectedReview(null)
    setModalMode(null)
    setReplyText('')
  }

  function handleApprove(review: AdminReview) {
    setReviews(prev => prev.map(r => r.id === review.id ? { ...r, approved: true, hidden: false } : r))
    addToast('success', `Review by ${review.customerName} approved`)
  }

  function handleHide(review: AdminReview) {
    setReviews(prev => prev.map(r => r.id === review.id ? { ...r, hidden: true } : r))
    addToast('warning', `Review by ${review.customerName} hidden`)
  }

  function handleDelete(review: AdminReview) {
    setReviews(prev => prev.filter(r => r.id !== review.id))
    addToast('info', `Review by ${review.customerName} deleted`)
    if (selectedReview?.id === review.id) closeModal()
  }

  function handleSaveReply() {
    if (!selectedReview) return
    setReviews(prev => prev.map(r => r.id === selectedReview.id ? { ...r, reply: replyText } : r))
    addToast('success', 'Reply saved')
    closeModal()
  }

  function truncate(text: string, max: number) {
    return text.length > max ? text.slice(0, max) + '...' : text
  }

  function getStatusBadge(review: AdminReview) {
    if (review.hidden) return <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/15 text-gray-400">Hidden</span>
    if (review.approved) return <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400">Approved</span>
    return <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/15 text-yellow-400">Pending</span>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-mist">Reviews</h1>
      </div>

      <div className="section-panel rounded-2xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist/30">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search by customer or comment..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all" />
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="flex gap-1 items-center bg-white/5 rounded-xl px-3 py-1.5 border border-white/10">
              {ratingOptions.map(r => (
                <button key={r ?? 'all'} type="button" onClick={() => setRatingFilter(r)} className={`px-2 py-1 rounded-lg text-xs transition-all ${ratingFilter === r ? 'bg-amber/20 text-amber font-medium' : 'text-mist/50 hover:text-mist'}`}>
                  {r === null ? 'All' : `${r}★`}
                </button>
              ))}
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StatusFilter)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all min-w-[130px]">
              <option value="All">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-mist/50">
          Total: <span className="text-amber font-semibold">{filteredReviews.length}</span> reviews
        </div>
      </div>

      <div className="section-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Customer</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Rating</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Comment</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Date</th>
                <th className="text-left px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Status</th>
                <th className="text-right px-4 py-3.5 text-mist/50 font-medium uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-mist/30">No reviews found</td></tr>
              )}
              {filteredReviews.map(review => (
                <tr key={review.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="text-mist font-medium">{review.customerName}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StarRating rating={review.rating} />
                  </td>
                  <td className="px-4 py-3.5 text-mist/70 max-w-[240px]">
                    <span className="truncate block">{truncate(review.comment, 60)}</span>
                  </td>
                  <td className="px-4 py-3.5 text-mist/60 text-xs whitespace-nowrap">{formatDate(review.date)}</td>
                  <td className="px-4 py-3.5">{getStatusBadge(review)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => openView(review)} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-amber hover:bg-amber/10 transition-all" title="View">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      </button>
                      {!review.approved && !review.hidden && (
                        <button type="button" onClick={() => handleApprove(review)} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-green-400 hover:bg-green-400/10 transition-all" title="Approve">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
                        </button>
                      )}
                      {!review.hidden && (
                        <button type="button" onClick={() => handleHide(review)} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-gray-400 hover:bg-gray-400/10 transition-all" title="Hide">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M14.12 14.12a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                        </button>
                      )}
                      <button type="button" onClick={() => handleDelete(review)} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      </button>
                      <button type="button" onClick={() => openReply(review)} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-blue-400 hover:bg-blue-400/10 transition-all" title="Reply">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalMode === 'view' && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative section-panel rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto animate-[fadeInScale_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-mist">Review Details</h2>
              <button type="button" onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-mist hover:bg-white/5 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-mist/50 text-sm">Customer</span>
                <span className="text-mist font-medium">{selectedReview.customerName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-mist/50 text-sm">Rating</span>
                <StarRating rating={selectedReview.rating} size={18} />
              </div>
              <div className="pb-3 border-b border-white/10">
                <div className="text-mist/50 text-sm mb-1">Comment</div>
                <div className="text-mist text-sm bg-white/5 rounded-xl px-4 py-3 leading-relaxed">{selectedReview.comment}</div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-mist/50 text-sm">Date</span>
                <span className="text-mist text-sm">{formatDate(selectedReview.date)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-mist/50 text-sm">Status</span>
                {getStatusBadge(selectedReview)}
              </div>
              {selectedReview.reply && (
                <div className="pb-3 border-b border-white/10">
                  <div className="text-mist/50 text-sm mb-1">Reply</div>
                  <div className="text-mist text-sm bg-amber/5 rounded-xl px-4 py-3 border border-amber/10 leading-relaxed">{selectedReview.reply}</div>
                </div>
              )}
            </div>
            <button type="button" onClick={closeModal} className="mt-6 w-full bg-white/5 border border-white/10 rounded-xl py-2.5 text-sm text-mist/70 hover:text-mist hover:bg-white/10 transition-all">Close</button>
          </div>
        </div>
      )}

      {modalMode === 'reply' && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative section-panel rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto animate-[fadeInScale_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-mist">Reply to Review</h2>
              <button type="button" onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-mist/50 hover:text-mist hover:bg-white/5 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="mb-4 p-3 bg-white/5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-mist font-medium text-sm">{selectedReview.customerName}</span>
                <StarRating rating={selectedReview.rating} size={14} />
              </div>
              <p className="text-mist/70 text-sm">{selectedReview.comment}</p>
            </div>
            <div>
              <label className="block text-sm text-mist/70 mb-1.5">Your Reply</label>
              <textarea rows={5} value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write your reply..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all resize-none" />
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={closeModal} className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 text-sm text-mist/70 hover:text-mist hover:bg-white/10 transition-all">Cancel</button>
              <button type="button" onClick={handleSaveReply} className="btn-3d flex-1">
                <span className="btn-3d-layer justify-center text-sm">Save Reply</span>
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
