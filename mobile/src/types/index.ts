export type Role = 'SUP' | 'ADMIN' | 'REP'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  phone?: string
  isActive: boolean
  assignedSectorId?: string
}

export interface Outlet {
  id: string
  name: string
  address: string
  channel: string
  latitude?: number
  longitude?: number
  phone?: string
  status: 'PENDING' | 'VALIDATED' | 'REJECTED'
}

export interface Visit {
  id: string
  userId: string
  outletId: string
  checkinAt: string
  checkoutAt?: string
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  notes?: string
  outlet?: Outlet
}

export interface Order {
  id: string
  orderNumber: string
  outletId: string
  status: 'DRAFT' | 'SUBMITTED' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED'
  totalHt: number
  totalTtc: number
  items: OrderItem[]
}

export interface OrderItem {
  id?: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  product?: Product
}

export interface Product {
  id: string
  name: string
  sku: string
  price: number
  category?: string
  brand?: string
  isActive: boolean
}

export interface RouteDay {
  id: string
  date: string
  outlets: Outlet[]
  completedVisits: number
  totalVisits: number
}
