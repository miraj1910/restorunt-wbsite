'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { BookingConfirmation } from '@/lib/types'

interface Props {
  confirmation: BookingConfirmation
  onClose: () => void
}

export default function BookingConfirmationModal({ confirmation, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const lines = [
      '━━━ BISTRO AURELIA ━━━',
      'Reservation Confirmed',
      '',
      `ID: ${confirmation.id}`,
      `Name: ${confirmation.customerName}`,
      `Table: ${confirmation.tableNumber}`,
      `Guests: ${confirmation.guests}`,
      `Date: ${confirmation.date}`,
      `Time: ${confirmation.time}`,
    ]
    if (confirmation.specialRequests) {
      lines.push(`Requests: ${confirmation.specialRequests}`)
    }
    lines.push('')
    lines.push('━━━━━━━━━━━━━━━━━━━━')

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reservation-${confirmation.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <div
        className="section-panel rounded-2xl p-8 max-w-md w-full animate-fade-in"
        style={{
          animation: 'fadeInScale 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#22c55e]/15 border-2 border-[#22c55e] flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="font-display text-3xl text-amber">Reservation Confirmed</h2>
          <p className="text-mist/50 text-sm mt-2">Your table has been secured</p>
        </div>

        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-mist/50">Reservation ID</span>
            <span className="text-mist font-mono text-xs">{confirmation.id}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-mist/50">Name</span>
            <span className="text-mist">{confirmation.customerName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-mist/50">Table</span>
            <span className="text-mist">Table {confirmation.tableNumber}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-mist/50">Guests</span>
            <span className="text-mist">{confirmation.guests}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-mist/50">Date</span>
            <span className="text-mist">{confirmation.date}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-mist/50">Time</span>
            <span className="text-mist">{confirmation.time}</span>
          </div>
          {confirmation.specialRequests && (
            <div className="flex justify-between py-2">
              <span className="text-mist/50">Requests</span>
              <span className="text-mist text-right max-w-[200px]">{confirmation.specialRequests}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-8 justify-center">
          <button onClick={handlePrint} className="btn-3d">
            <span className="btn-3d-depth" aria-hidden="true" />
            <span className="btn-3d-layer">Print</span>
          </button>
          <button onClick={handleDownload} className="btn-3d">
            <span className="btn-3d-depth" aria-hidden="true" />
            <span className="btn-3d-layer">Download</span>
          </button>
          <Link href="/" className="btn-3d" onClick={onClose}>
            <span className="btn-3d-depth" aria-hidden="true" />
            <span className="btn-3d-layer">Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
