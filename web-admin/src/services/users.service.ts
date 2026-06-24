import api from './api'
import type { User, PaginatedResponse } from '@/types'

export const usersService = {
  async getAll(params?: { page?: number; limit?: number; role?: string }): Promise<PaginatedResponse<User>> {
    const { data } = await api.get<PaginatedResponse<User>>('/users', { params })
    return data
  },

  async getById(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`)
    return data
  },

  async create(user: Partial<User> & { password: string }): Promise<User> {
    const { data } = await api.post<User>('/users', user)
    return data
  },

  async update(id: string, user: Partial<User>): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}`, user)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
  },

  async assignToSector(userId: string, sectorId: string): Promise<User> {
    const { data } = await api.patch<User>(`/users/${userId}/assign-sector`, { sectorId })
    return data
  },
}
