<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { analyticsService } from '@/services/analytics.service'
import type { DashboardMetrics } from '@/types'

const activeTab = ref('overview')
const metrics = ref<DashboardMetrics | null>(null)
const loading = ref(true)

const tabs = [
  { key: 'overview', label: 'Vue d\'ensemble' },
  { key: 'plan', label: 'Plan' },
  { key: 'results', label: 'Résultats' },
  { key: 'audience', label: 'Audience' },
  { key: 'prospects', label: 'Prospects' },
  { key: 'messages', label: 'Messages' },
  { key: 'benchmarking', label: 'Benchmarking' },
]

const contentTabs = [
  { key: 'presentation', label: 'Présentation' },
  { key: 'content', label: 'Contenu' },
  { key: 'ads', label: 'Publicités' },
]

onMounted(async () => {
  try {
    metrics.value = await analyticsService.getDashboardMetrics()
  } catch {
    metrics.value = {
      totalUsers: 24, activeUsers: 18, totalOutlets: 156, pendingOutlets: 12,
      totalOrders: 1240, totalRevenue: 45600000, todayVisits: 34, todaySales: 890000,
    }
  } finally {
    loading.value = false
  }
})

function formatNumber(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n)
}
function formatCurrency(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(n)
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-text-primary">Statistiques</h1>
        <p class="text-sm text-text-secondary">Consultez vos performances et plus encore.</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="flex items-center gap-1 rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-sidebar-hover">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          28 derniers jours
        </button>
      </div>
    </div>

    <div class="flex gap-6">
      <!-- Sub-navigation sidebar (Meta Statistics style) -->
      <div class="w-56 shrink-0">
        <nav class="space-y-0.5">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors"
            :class="activeTab === tab.key ? 'bg-sidebar-active text-white' : 'text-text-primary hover:bg-sidebar-hover'"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </nav>

        <div class="mt-4 border-t border-border pt-4">
          <p class="mb-2 px-3 text-xs font-semibold uppercase text-text-secondary">Contenus</p>
          <nav class="space-y-0.5">
            <button
              v-for="tab in contentTabs"
              :key="tab.key"
              class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-text-primary transition-colors hover:bg-sidebar-hover"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Content area -->
      <div class="flex-1">
        <!-- Info banner -->
        <div class="mb-4 flex items-center justify-between rounded-lg border border-border bg-white p-4">
          <div class="flex items-center gap-2">
            <svg class="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
            <span class="text-sm text-text-primary">Nouvel indicateur relatif aux performances terrain après le mois dernier</span>
          </div>
          <button class="text-sm font-medium text-primary hover:underline">Voir plus</button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-40 animate-pulse rounded-lg bg-white" />
        </div>

        <!-- Overview tab -->
        <template v-else-if="activeTab === 'overview'">
          <!-- Plan de la semaine -->
          <div class="mb-4 rounded-lg border border-border bg-white p-5">
            <div class="mb-3 flex items-center justify-between">
              <h3 class="text-base font-semibold text-text-primary">
                Plan de la semaine
                <span class="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">3 jours restants</span>
              </h3>
              <button class="flex items-center gap-1 rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-sidebar-hover">
                Voir le plan complet
              </button>
            </div>
            <div class="mb-2">
              <p class="mb-1 text-sm font-semibold text-text-primary">Terminez au moins 5 tâches pour finir ce plan.</p>
              <div class="h-2.5 overflow-hidden rounded-full bg-gray-200">
                <div class="h-full rounded-full bg-success" style="width: 43%" />
              </div>
              <p class="mt-1 text-xs text-text-secondary">3 tâche(s) terminée(s) sur 7</p>
            </div>
          </div>

          <!-- Performances -->
          <div class="mb-4 rounded-lg border border-border bg-white p-5">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-base font-semibold text-text-primary">Performances</h3>
              <button class="flex items-center gap-1 rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-sidebar-hover">
                Personnaliser la vue
              </button>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <!-- Ventes card -->
              <div class="rounded-lg border border-border p-4">
                <div class="mb-1 flex items-center justify-between">
                  <h4 class="font-semibold text-text-primary">Ventes</h4>
                  <svg class="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </div>
                <p class="mb-1 text-xs text-text-secondary">Chiffre d'affaires</p>
                <p class="text-3xl font-bold text-text-primary">{{ formatCurrency(metrics?.totalRevenue ?? 0) }}</p>
                <div class="mt-2 flex items-center gap-1 text-sm">
                  <span class="font-medium text-success">+12,5%</span>
                </div>
                <p class="mt-1 text-xs text-text-secondary">
                  Commandes : {{ formatNumber(metrics?.totalOrders ?? 0) }}
                </p>
              </div>

              <!-- Visites card -->
              <div class="rounded-lg border border-border p-4">
                <div class="mb-1 flex items-center justify-between">
                  <h4 class="font-semibold text-text-primary">Visites terrain</h4>
                  <svg class="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </div>
                <p class="mb-1 text-xs text-text-secondary">Aujourd'hui</p>
                <p class="text-3xl font-bold text-text-primary">{{ metrics?.todayVisits ?? 0 }}</p>
                <div class="mt-2 text-sm">
                  <span class="text-text-secondary">Total PDV : </span>
                  <span class="font-medium text-text-primary">{{ formatNumber(metrics?.totalOutlets ?? 0) }}</span>
                </div>
                <p class="mt-1 text-xs text-text-secondary">
                  En attente : {{ metrics?.pendingOutlets ?? 0 }}
                </p>
              </div>
            </div>
          </div>
        </template>

        <!-- Other tabs placeholder -->
        <template v-else>
          <div class="flex h-64 items-center justify-center rounded-lg border border-border bg-white">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-text-secondary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
              <p class="mt-3 text-sm text-text-secondary">Section en cours de développement</p>
              <p class="text-xs text-text-secondary">Connectez le backend pour afficher les données</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
