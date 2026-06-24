import { api } from './api'
import type { Order, OrderItem, Product } from '../types'

export const ordersService = {
  async create(outletId: string, items: Omit<OrderItem, 'id' | 'totalPrice' | 'product'>[]): Promise<Order> {
    return api.post<Order>('/orders', { outletId, items })
  },

  async getMyOrders(params?: { page?: string; limit?: string }): Promise<Order[]> {
    return api.get<Order[]>('/orders/mine', params)
  },

  async getProducts(): Promise<Product[]> {
    return api.get<Product[]>('/products')
  },
}
