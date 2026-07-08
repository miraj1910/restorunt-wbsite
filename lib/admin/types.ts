export type StaffRole = 'manager' | 'chef' | 'waiter' | 'receptionist' | 'cashier' | 'cleaner'
export type EmployeeStatus = 'active' | 'sick' | 'vacation' | 'terminated'
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'partially-paid'
export type MenuCategory = 'starters' | 'main-course' | 'pizza' | 'pasta' | 'burgers' | 'desserts' | 'drinks' | 'coffee' | 'specials'
export type InventoryUnit = 'kg' | 'g' | 'l' | 'ml' | 'pcs' | 'boxes' | 'bottles'
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance' | 'blocked'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: StaffRole
  avatar?: string
}

export interface AdminEmployee {
  id: string
  name: string
  role: StaffRole
  email: string
  phone: string
  shift: string
  salary: number
  status: EmployeeStatus
  photo?: string
  joinedAt: string
  workingHours: number
  performance: number
}

export interface AdminReservation {
  id: string
  customerName: string
  phone: string
  email: string
  date: string
  time: string
  guests: number
  tableNumber: number
  status: ReservationStatus
  specialRequests?: string
  createdAt: string
}

export interface AdminMenuItem {
  id: string
  name: string
  description: string
  category: MenuCategory
  price: number
  discount: number
  available: boolean
  prepTime: number
  calories: number
  image?: string
  featured: boolean
  hidden: boolean
  createdAt: string
}

export interface AdminOrder {
  id: string
  customerName: string
  tableNumber: number
  items: { name: string; qty: number; price: number }[]
  total: number
  paymentStatus: PaymentStatus
  status: OrderStatus
  waiterName: string
  createdAt: string
  completedAt?: string
}

export interface AdminCustomer {
  id: string
  name: string
  email: string
  phone: string
  totalReservations: number
  totalOrders: number
  totalSpent: number
  loyaltyPoints: number
  joinedAt: string
  notes: string
  lastVisit: string
}

export interface AdminInventoryItem {
  id: string
  name: string
  quantity: number
  unit: InventoryUnit
  supplier: string
  expiryDate: string
  lowStockAlert: number
}

export interface AdminReview {
  id: string
  customerName: string
  rating: number
  comment: string
  date: string
  approved: boolean
  hidden: boolean
  reply?: string
}

export interface RevenueData {
  date: string
  gross: number
  net: number
  tax: number
  discounts: number
  refunds: number
}

export interface DashboardStats {
  todayRevenue: number
  weeklyRevenue: number
  monthlyRevenue: number
  totalReservations: number
  activeReservations: number
  cancelledReservations: number
  tablesOccupied: number
  availableTables: number
  totalCustomers: number
  newCustomers: number
  totalEmployees: number
  todayOrders: number
  pendingOrders: number
}

export interface KPITrend {
  value: number
  change: number
  trend: number[]
}

export interface Notification {
  id: string
  type: 'reservation' | 'cancellation' | 'stock' | 'review' | 'customer' | 'revenue'
  message: string
  time: string
  read: boolean
}

export interface RestaurantSettings {
  name: string
  logo: string
  address: string
  contact: string
  openingHours: { day: string; open: string; close: string; closed: boolean }[]
  tax: number
  currency: string
  timezone: string
  maxGuestsPerReservation: number
  autoConfirmReservations: boolean
  reservationNotice: number
}
