import { api } from './api'
import type { Visit } from '../types'

export const visitsService = {
  async getTodayVisits(): Promise<Visit[]> {
    return api.get<Visit[]>('/visits/today')
  },

  async checkin(outletId: string, latitude: number, longitude: number): Promise<Visit> {
    return api.post<Visit>('/visits/checkin', { outletId, latitude, longitude })
  },

  async checkout(visitId: string, notes?: string): Promise<Visit> {
    return api.patch<Visit>(`/visits/${visitId}/checkout`, { notes })
  },

  async getHistory(params?: { page?: string; limit?: string }): Promise<Visit[]> {
    return api.get<Visit[]>('/visits', params)
  },
}
