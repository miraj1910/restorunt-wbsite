export type TableShape = 'round' | 'square' | 'rectangle'
export type TableStatus = 'available' | 'reserved' | 'disabled'
export type TableArea = 'indoor' | 'outdoor' | 'vip'

export interface TablePosition {
  x: number
  y: number
}

export interface TableData {
  id: number
  number: number
  shape: TableShape
  capacity: number
  area: TableArea
  nearWindow: boolean
  status: TableStatus
  position: TablePosition
  stageDistance?: string
}

export interface ReservationFormData {
  customerName: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  specialRequests: string
}

export interface BookingConfirmation {
  id: string
  tableNumber: number
  customerName: string
  guests: number
  date: string
  time: string
  specialRequests?: string
}

export interface ChairPosition {
  x: number
  y: number
}
