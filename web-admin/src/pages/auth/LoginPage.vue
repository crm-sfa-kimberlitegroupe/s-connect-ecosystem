<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const tenantId = ref(localStorage.getItem('tenantId') || '')
const error = ref('')
const showPassword = ref(false)

interface Tenant {
  id: string
  companyName: string
  industry: string
}

const tenants = ref<Tenant[]>([])
const tenantsLoading = ref(false)

onMounted(async () => {
  tenantsLoading.value = true
  try {
    const { data } = await api.get<{ success: boolean; tenants: Tenant[] }>('/tenants/public/list')
    tenants.value = data.tenants
    if (!tenantId.value && data.tenants.length === 1) {
      tenantId.value = data.tenants[0].id
    }
  } catch {
    // Fallback: allow manual tenant ID input
  } finally {
    tenantsLoading.value = false
  }
})

async function handleLogin() {
  error.value = ''
  if (!tenantId.value) {
    error.value = 'Veuillez sélectionner votre organisation'
    return
  }
  try {
    localStorage.setItem('tenantId', tenantId.value)
    await authStore.login(email.value, password.value, tenantId.value)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Identifiants incorrects'
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
      <!-- Logo -->
      <div class="mb-8 text-center">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-2xl font-bold text-white shadow-lg shadow-primary/30">
          S
        </div>
        <h1 class="mt-4 text-2xl font-bold text-gray-900">SalesConnect</h1>
        <p class="mt-1 text-sm text-gray-500">Administration &bull; Gestion commerciale</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
        {{ error }}
      </div>

      <!-- Form -->
      <form class="space-y-5" @submit.prevent="handleLogin">
        <!-- Organization selector -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">Organisation</label>
          <select
            v-if="tenants.length > 0"
            v-model="tenantId"
            required
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="" disabled>Sélectionner votre entreprise</option>
            <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
              {{ tenant.companyName }}
            </option>
          </select>
          <input
            v-else
            v-model="tenantId"
            type="text"
            required
            placeholder="ID Organisation (UUID)"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="email@example.com"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">Mot de passe</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="••••••••"
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              @click="showPassword = !showPassword"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span v-if="authStore.loading" class="flex items-center justify-center gap-2">
            <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Connexion...
          </span>
          <span v-else>Se connecter</span>
        </button>
      </form>
    </div>
  </div>
</template>
