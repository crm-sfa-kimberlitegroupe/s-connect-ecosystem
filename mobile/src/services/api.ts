import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL, TENANT_ID } from '../constants/theme'

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_URL
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('token')
    const tenantId = TENANT_ID || (await AsyncStorage.getItem('tenantId')) || ''
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    if (tenantId) {
      headers['X-Tenant-ID'] = tenantId
    }
    return headers
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value)
      })
    }
    const response = await fetch(url.toString(), { headers: await this.getHeaders() })
    if (!response.ok) throw new Error(`API Error: ${response.status}`)
    return response.json()
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!response.ok) throw new Error(`API Error: ${response.status}`)
    return response.json()
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!response.ok) throw new Error(`API Error: ${response.status}`)
    return response.json()
  }
}

export const api = new ApiClient()
