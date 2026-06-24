import api from './api'
import type { Territory } from '@/types'

export const territoriesService = {
  async getAll(): Promise<Territory[]> {
    const { data } = await api.get<Territory[]>('/territories')
    return data
  },

  async getById(id: string): Promise<Territory> {
    const { data } = await api.get<Territory>(`/territories/${id}`)
    return data
  },

  async create(territory: { name: string; type: string; parentId?: string; description?: string }): Promise<Territory> {
    const { data } = await api.post<Territory>('/territories', territory)
    return data
  },

  async update(id: string, territory: Partial<Territory>): Promise<Territory> {
    const { data } = await api.patch<Territory>(`/territories/${id}`, territory)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/territories/${id}`)
  },

  async assignAdmin(territoryId: string, adminId: string): Promise<Territory> {
    const { data } = await api.post<Territory>(`/territories/${territoryId}/assign-admin`, { adminId })
    return data
  },

  async getSectors(zoneId: string): Promise<Territory[]> {
    const { data } = await api.get<Territory[]>(`/territories/${zoneId}/sectors`)
    return data
  },
}
