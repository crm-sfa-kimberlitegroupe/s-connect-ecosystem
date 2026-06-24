<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { territoriesService } from '@/services/territories.service'
import { useAuthStore } from '@/stores/auth'
import type { Territory } from '@/types'

const authStore = useAuthStore()
const territories = ref<Territory[]>([])
const loading = ref(true)
const showCreateModal = ref(false)
const newTerritory = ref({ name: '', type: 'ZONE' as string, parentId: '' })
const creating = ref(false)

onMounted(async () => {
  await fetchTerritories()
})

async function fetchTerritories() {
  loading.value = true
  try {
    territories.value = await territoriesService.getAll()
  } catch {
    territories.value = []
  } finally {
    loading.value = false
  }
}

async function handleCreate() {
  creating.value = true
  try {
    await territoriesService.create(newTerritory.value)
    showCreateModal.value = false
    newTerritory.value = { name: '', type: 'ZONE', parentId: '' }
    await fetchTerritories()
  } catch {
    // handle error
  } finally {
    creating.value = false
  }
}

function getTypeBadgeClass(type: string) {
  switch (type) {
    case 'PAYS': return 'bg-purple-100 text-purple-700'
    case 'REGION': return 'bg-blue-100 text-blue-700'
    case 'ZONE': return 'bg-primary/10 text-primary'
    case 'SECTEUR': return 'bg-secondary/10 text-secondary'
    case 'SOUS_SECTEUR': return 'bg-warning/10 text-warning'
    default: return 'bg-gray-100 text-gray-700'
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Territoires</h1>
        <p class="text-sm text-gray-500">Gestion de la hiérarchie territoriale</p>
      </div>
      <button
        v-if="authStore.isSup"
        class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark"
        @click="showCreateModal = true"
      >
        + Nouveau Territoire
      </button>
    </div>

    <!-- Territories list -->
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div v-if="loading" class="p-8 text-center text-gray-400">Chargement...</div>
      <table v-else class="w-full">
        <thead class="border-b border-gray-200 bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Nom</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Type</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Responsable</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Secteurs</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="t in territories" :key="t.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ t.name }}</td>
            <td class="px-4 py-3">
              <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="getTypeBadgeClass(t.type)">
                {{ t.type }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ t.admin ? `${t.admin.firstName} ${t.admin.lastName}` : '—' }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ t.children?.length || 0 }}
            </td>
          </tr>
          <tr v-if="territories.length === 0">
            <td colspan="4" class="px-4 py-8 text-center text-sm text-gray-400">Aucun territoire</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 class="mb-4 text-lg font-semibold text-gray-900">Créer un territoire</h2>
        <form class="space-y-4" @submit.prevent="handleCreate">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Nom</label>
            <input v-model="newTerritory.name" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Type</label>
            <select v-model="newTerritory.type" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
              <option value="PAYS">PAYS</option>
              <option value="REGION">REGION</option>
              <option value="ZONE">ZONE</option>
              <option value="SECTEUR">SECTEUR</option>
              <option value="SOUS_SECTEUR">SOUS-SECTEUR</option>
            </select>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="submit" :disabled="creating" class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
              {{ creating ? 'Création...' : 'Créer' }}
            </button>
            <button type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" @click="showCreateModal = false">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
