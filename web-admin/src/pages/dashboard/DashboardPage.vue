<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { analyticsService } from '@/services/analytics.service'
import type { DashboardMetrics } from '@/types'
import MetricCard from '@/components/ui/MetricCard.vue'

const authStore = useAuthStore()
const metrics = ref<DashboardMetrics | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    metrics.value = await analyticsService.getDashboardMetrics()
  } catch {
    // fallback mock for demo
    metrics.value = {
      totalUsers: 24,
      activeUsers: 18,
      totalOutlets: 156,
      pendingOutlets: 12,
      totalOrders: 1240,
      totalRevenue: 45600000,
      todayVisits: 34,
      todaySales: 890000,
    }
  } finally {
    loading.value = false
  }
})

const metricCards = [
  { key: 'totalUsers', label: 'Utilisateurs', icon: 'users', color: 'primary' },
  { key: 'totalOutlets', label: 'Points de Vente', icon: 'store', color: 'secondary' },
  { key: 'totalOrders', label: 'Commandes', icon: 'orders', color: 'warning' },
  { key: 'totalRevenue', label: 'Chiffre d\'Affaires', icon: 'revenue', color: 'success', format: 'currency' },
  { key: 'todayVisits', label: 'Visites Aujourd\'hui', icon: 'visits', color: 'primary' },
  { key: 'todaySales', label: 'Ventes Jour', icon: 'active', color: 'secondary', format: 'currency' },
]

function formatValue(value: number, format?: string) {
  if (format === 'currency') return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(value)
  return new Intl.NumberFormat('fr-FR').format(value)
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
      <p class="text-sm text-gray-500">Bienvenue, {{ authStore.user?.firstName }}. Voici un aperçu de l'activité.</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="h-28 animate-pulse rounded-xl bg-gray-200" />
    </div>

    <!-- Metrics Grid -->
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        v-for="card in metricCards"
        :key="card.key"
        :label="card.label"
        :value="formatValue((metrics as any)?.[card.key] || 0, card.format)"
        :color="card.color"
        :icon="card.icon"
      />
    </div>

    <!-- Charts section placeholder -->
    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 class="mb-4 text-lg font-semibold text-gray-900">Ventes par période</h3>
        <div class="flex h-64 items-center justify-center text-gray-400">
          <p>Graphique des ventes (connectez le backend pour les données)</p>
        </div>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 class="mb-4 text-lg font-semibold text-gray-900">Performance par zone</h3>
        <div class="flex h-64 items-center justify-center text-gray-400">
          <p>Graphique performance (connectez le backend pour les données)</p>
        </div>
      </div>
    </div>
  </div>
</template>
