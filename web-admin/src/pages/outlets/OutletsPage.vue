<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { outletsService } from '@/services/outlets.service'
import type { Outlet } from '@/types'

const outlets = ref<Outlet[]>([])
const loading = ref(true)
const statusFilter = ref('')

onMounted(async () => {
  await fetchOutlets()
})

async function fetchOutlets() {
  loading.value = true
  try {
    const params: any = { page: 1, limit: 50 }
    if (statusFilter.value) params.status = statusFilter.value
    const response = await outletsService.getAll(params)
    outlets.value = response.data
  } catch {
    outlets.value = []
  } finally {
    loading.value = false
  }
}

async function validateOutlet(id: string) {
  try {
    await outletsService.validate(id)
    await fetchOutlets()
  } catch {
    // handle error
  }
}

async function rejectOutlet(id: string) {
  const reason = prompt('Raison du rejet :')
  if (!reason) return
  try {
    await outletsService.reject(id, reason)
    await fetchOutlets()
  } catch {
    // handle error
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'VALIDATED': return { class: 'bg-success/10 text-success', label: 'Validé' }
    case 'PENDING': return { class: 'bg-warning/10 text-warning', label: 'En attente' }
    case 'REJECTED': return { class: 'bg-danger/10 text-danger', label: 'Rejeté' }
    default: return { class: 'bg-gray-100 text-gray-700', label: status }
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Points de Vente</h1>
      <p class="text-sm text-gray-500">Gestion et validation des PDV</p>
    </div>

    <!-- Filters -->
    <div class="mb-4 flex gap-3">
      <select
        v-model="statusFilter"
        class="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none"
        @change="fetchOutlets()"
      >
        <option value="">Tous les statuts</option>
        <option value="PENDING">En attente</option>
        <option value="VALIDATED">Validé</option>
        <option value="REJECTED">Rejeté</option>
      </select>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div v-if="loading" class="p-8 text-center text-gray-400">Chargement...</div>
      <table v-else class="w-full">
        <thead class="border-b border-gray-200 bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Nom</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Adresse</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Type</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Statut</th>
            <th class="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="outlet in outlets" :key="outlet.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ outlet.name }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ outlet.address }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ outlet.channel }}</td>
            <td class="px-4 py-3">
              <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="getStatusBadge(outlet.status).class">
                {{ getStatusBadge(outlet.status).label }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <div v-if="outlet.status === 'PENDING'" class="flex justify-end gap-2">
                <button
                  class="rounded bg-success/10 px-2 py-1 text-xs font-medium text-success hover:bg-success/20"
                  @click="validateOutlet(outlet.id)"
                >
                  Valider
                </button>
                <button
                  class="rounded bg-danger/10 px-2 py-1 text-xs font-medium text-danger hover:bg-danger/20"
                  @click="rejectOutlet(outlet.id)"
                >
                  Rejeter
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="outlets.length === 0">
            <td colspan="5" class="px-4 py-8 text-center text-sm text-gray-400">Aucun point de vente</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
