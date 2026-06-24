import api from './api'
import type { Outlet, PaginatedResponse } from '@/types'

export const outletsService = {
  async getAll(params?: { page?: number; limit?: number; status?: string; sectorId?: string }): Promise<PaginatedResponse<Outlet>> {
    const { data } = await api.get<PaginatedResponse<Outlet>>('/outlets', { params })
    return data
  },

  async getById(id: string): Promise<Outlet> {
    const { data } = await api.get<Outlet>(`/outlets/${id}`)
    return data
  },

  async create(outlet: Partial<Outlet>): Promise<Outlet> {
    const { data } = await api.post<Outlet>('/outlets', outlet)
    return data
  },

  async update(id: string, outlet: Partial<Outlet>): Promise<Outlet> {
    const { data } = await api.patch<Outlet>(`/outlets/${id}`, outlet)
    return data
  },

  async validate(id: string): Promise<Outlet> {
    const { data } = await api.patch<Outlet>(`/outlets/${id}/validate`, { status: 'VALIDATED' })
    return data
  },

  async reject(id: string, reason: string): Promise<Outlet> {
    const { data } = await api.patch<Outlet>(`/outlets/${id}/reject`, { status: 'REJECTED', reason })
    return data
  },
}
