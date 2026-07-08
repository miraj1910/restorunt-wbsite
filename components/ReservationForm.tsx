'use client'

import { useState, useId } from 'react'
import { TableData, ReservationFormData, TableStatus } from '@/lib/types'

interface Props {
  table: TableData
  onSubmit: (data: ReservationFormData) => void
  onCancel: () => void
}

interface FormErrors {
  customerName?: string
  email?: string
  phone?: string
  date?: string
  time?: string
  guests?: string
}

const statusColor: Record<TableStatus, string> = {
  available: '#22c55e',
  reserved: '#ef4444',
  disabled: '#6b7280',
}

const statusLabel: Record<TableStatus, string> = {
  available: 'Available',
  reserved: 'Reserved',
  disabled: 'Maintenance',
}

function validate(data: ReservationFormData, table: TableData): FormErrors {
  const errors: FormErrors = {}
  if (!data.customerName.trim() || data.customerName.trim().length < 2) {
    errors.customerName = 'Full name is required (min 2 characters)'
  }
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email'
  }
  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required'
  } else {
    const digits = data.phone.replace(/\D/g, '')
    if (digits.length < 10) errors.phone = 'Phone must have at least 10 digits'
  }
  if (!data.date) {
    errors.date = 'Date is required'
  } else {
    const selected = new Date(data.date + 'T12:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selected < today) errors.date = 'Date cannot be in the past'
    else if (selected.getDay() === 1) errors.date = 'Closed on Mondays'
  }
  if (!data.time) {
    errors.time = 'Time is required'
  } else {
    const [h] = data.time.split(':').map(Number)
    if (h < 18 || h >= 23) errors.time = 'Hours 18:00–23:00'
  }
  if (!data.guests || data.guests < 1) {
    errors.guests = 'Number of guests is required'
  } else if (data.guests > table.capacity) {
    errors.guests = `Max ${table.capacity} guests at this table`
  }
  return errors
}

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/50 transition-colors duration-300'
const errorClass = 'text-red-400 text-[11px] mt-1'

export default function ReservationForm({ table, onSubmit, onCancel }: Props) {
  const uid = useId()
  const [form, setForm] = useState<ReservationFormData>({
    customerName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 1,
    specialRequests: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const handleChange = (field: keyof ReservationFormData, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate(form, table)
    if (Object.keys(v).length > 0) {
      setErrors(v)
      return
    }
    setSubmitting(true)
    onSubmit(form)
  }

  return (
    <div
      className="section-panel rounded-2xl overflow-hidden"
      style={{ animation: 'fadeInScale 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
    >
      <div className="p-5 border-b border-white/8">
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold font-display"
            style={{
              background: `${statusColor[table.status]}15`,
              border: `2px solid ${statusColor[table.status]}`,
              color: statusColor[table.status],
            }}
          >
            {String(table.number).padStart(2, '0')}
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-xl text-amber">Table {String(table.number).padStart(2, '0')}</h3>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-mist/60 mt-1">
              <span>{table.capacity} seats</span>
              <span>&middot;</span>
              <span>{table.area === 'vip' ? 'VIP Lounge' : table.area === 'outdoor' ? 'Outdoor Patio' : 'Main Dining'}</span>
              {table.nearWindow && <><span>&middot;</span><span>Window</span></>}
              {table.stageDistance && <><span>&middot;</span><span>Stage {table.stageDistance}</span></>}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: statusColor[table.status] }} />
              <span className="text-xs" style={{ color: statusColor[table.status] }}>{statusLabel[table.status]}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-3.5" noValidate>
        <div>
          <input
            id={`${uid}-name`}
            className={inputClass + (errors.customerName ? ' border-red-400/50' : '')}
            placeholder="Full Name"
            value={form.customerName}
            onChange={e => handleChange('customerName', e.target.value)}
            autoComplete="name"
          />
          {errors.customerName && <p className={errorClass}>{errors.customerName}</p>}
        </div>
        <div>
          <input
            id={`${uid}-email`}
            type="email"
            className={inputClass + (errors.email ? ' border-red-400/50' : '')}
            placeholder="Email"
            value={form.email}
            onChange={e => handleChange('email', e.target.value)}
            autoComplete="email"
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>
        <div>
          <input
            id={`${uid}-phone`}
            type="tel"
            className={inputClass + (errors.phone ? ' border-red-400/50' : '')}
            placeholder="Phone"
            value={form.phone}
            onChange={e => handleChange('phone', e.target.value)}
            autoComplete="tel"
          />
          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              id={`${uid}-date`}
              type="date"
              className={inputClass + (errors.date ? ' border-red-400/50' : '')}
              min={today}
              value={form.date}
              onChange={e => handleChange('date', e.target.value)}
            />
            {errors.date && <p className={errorClass}>{errors.date}</p>}
          </div>
          <div>
            <input
              id={`${uid}-time`}
              type="time"
              className={inputClass + (errors.time ? ' border-red-400/50' : '')}
              min="18:00"
              max="23:00"
              value={form.time}
              onChange={e => handleChange('time', e.target.value)}
            />
            {errors.time && <p className={errorClass}>{errors.time}</p>}
          </div>
        </div>
        <div>
          <input
            id={`${uid}-guests`}
            type="number"
            className={inputClass + (errors.guests ? ' border-red-400/50' : '')}
            min={1}
            max={table.capacity}
            value={form.guests}
            onChange={e => handleChange('guests', Math.max(1, parseInt(e.target.value) || 1))}
          />
          {errors.guests && <p className={errorClass}>{errors.guests}</p>}
        </div>
        <div>
          <textarea
            id={`${uid}-requests`}
            className={`${inputClass} resize-none h-18`}
            placeholder="Special requests (optional)"
            value={form.specialRequests}
            onChange={e => handleChange('specialRequests', e.target.value)}
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={submitting} className="btn-3d">
            <span className="btn-3d-depth" aria-hidden="true" />
            <span className="btn-3d-layer">{submitting ? 'Booking...' : 'Confirm Reservation'}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-full border border-white/15 text-mist/70 text-sm hover:bg-white/5 hover:text-mist transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
