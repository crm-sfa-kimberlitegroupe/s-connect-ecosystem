import api from './api'
import type { AuthResponse, User } from '@/types'

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
    return data
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/auth/profile')
    return data
  },

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    const { data } = await api.post('/auth/refresh', { refresh_token: refreshToken })
    return data
  },
}
