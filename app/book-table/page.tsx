'use client'

import { useState, useCallback } from 'react'
import FloorPlan from '@/components/FloorPlan'
import ReservationForm from '@/components/ReservationForm'
import BookingConfirmationModal from '@/components/BookingConfirmation'
import { TableData, ReservationFormData, BookingConfirmation } from '@/lib/types'

export default function BookTablePage() {
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null)
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null)

  const handleTableSelect = useCallback((table: TableData) => {
    setSelectedTable(prev => (prev?.id === table.id ? null : table))
  }, [])

  const handleFormSubmit = useCallback(
    (formData: ReservationFormData) => {
      if (!selectedTable) return
      const id = `BR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      setConfirmation({
        id,
        tableNumber: selectedTable.number,
        customerName: formData.customerName,
        guests: formData.guests,
        date: formData.date,
        time: formData.time,
        specialRequests: formData.specialRequests || undefined,
      })
    },
    [selectedTable],
  )

  const handleCloseConfirmation = useCallback(() => {
    setConfirmation(null)
    setSelectedTable(null)
  }, [])

  const handleCancelForm = useCallback(() => {
    setSelectedTable(null)
  }, [])

  return (
    <>
      <section className="pt-28 md:pt-36 px-6 md:px-10 pb-10">
        <div className="max-w-6xl mx-auto section-panel reveal rounded-[2rem] p-8 md:p-12 text-center">
          <p className="uppercase tracking-[0.3em] text-xs text-amber">Interactive Booking</p>
          <h1 className="font-display text-6xl md:text-7xl mt-3">Choose Your Table</h1>
          <p className="mt-5 text-mist/80 max-w-2xl mx-auto">
            Select an available table from the floor plan below. Drag to pan, scroll or pinch to zoom.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">
          <FloorPlan
            selectedTableId={selectedTable?.id ?? null}
            onTableSelect={handleTableSelect}
          />

          <div className="lg:sticky lg:top-32">
            {selectedTable ? (
              <ReservationForm
                table={selectedTable}
                onSubmit={handleFormSubmit}
                onCancel={handleCancelForm}
              />
            ) : (
              <div className="section-panel rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center mx-auto mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8a76a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <p className="text-mist/60 text-sm">
                  Tap any <span style={{ color: '#22c55e' }}>green</span> table on the floor plan to start your reservation.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {confirmation && (
        <BookingConfirmationModal
          confirmation={confirmation}
          onClose={handleCloseConfirmation}
        />
      )}
    </>
  )
}
