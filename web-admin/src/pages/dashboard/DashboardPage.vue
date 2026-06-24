<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { analyticsService } from '@/services/analytics.service'
import type { DashboardMetrics } from '@/types'

const metrics = ref<DashboardMetrics | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    metrics.value = await analyticsService.getDashboardMetrics()
  } catch {
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

function formatNumber(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n)
}
function formatCurrency(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(n)
}

const weeklyTasks = [
  { label: 'Visiter 10 points de vente', done: 7, total: 10 },
  { label: 'Enregistrer 5 nouvelles commandes', done: 3, total: 5 },
  { label: 'Valider 4 PDV en attente', done: 1, total: 4 },
]
</script>

<template>
  <div>
    <!-- Page header -->
    <p class="mb-6 text-sm text-text-secondary">
      Consultez les dernières activités et les indicateurs qui nécessitent votre attention.
    </p>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-32 animate-pulse rounded-lg bg-white" />
    </div>

    <div v-else>
      <!-- Activity cards row (Meta Accueil style) -->
      <div class="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <!-- Commentaires / Orders -->
        <div class="rounded-lg border border-border bg-white p-5">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-base font-semibold text-text-primary">
              Commandes
              <span class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[11px] font-bold text-white">
                {{ formatNumber(metrics?.totalOrders ?? 0) }}
              </span>
            </h3>
            <a href="#" class="text-sm font-medium text-primary hover:underline">Voir tout</a>
          </div>
          <div class="space-y-3">
            <div class="flex items-center gap-3 rounded-md p-2 hover:bg-surface">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-success/10 text-success">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-text-primary">{{ formatNumber(metrics?.totalOrders ?? 0) }} commandes totales</p>
                <p class="text-xs text-text-secondary">{{ formatCurrency(metrics?.totalRevenue ?? 0) }} de CA</p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-md p-2 hover:bg-surface">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-text-primary">{{ formatCurrency(metrics?.todaySales ?? 0) }}</p>
                <p class="text-xs text-text-secondary">Ventes aujourd'hui</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Messages / Visits -->
        <div class="rounded-lg border border-border bg-white p-5">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-base font-semibold text-text-primary">
              Visites
              <span class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                {{ metrics?.todayVisits ?? 0 }}
              </span>
            </h3>
            <a href="#" class="text-sm font-medium text-primary hover:underline">Voir tout</a>
          </div>
          <div class="space-y-3">
            <div class="flex items-center gap-3 rounded-md p-2 hover:bg-surface">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-warning/10 text-warning">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-text-primary">{{ metrics?.todayVisits ?? 0 }} visites aujourd'hui</p>
                <p class="text-xs text-text-secondary">sur {{ formatNumber(metrics?.totalOutlets ?? 0) }} points de vente</p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-md p-2 hover:bg-surface">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-danger/10 text-danger">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-text-primary">{{ metrics?.pendingOutlets ?? 0 }} PDV en attente</p>
                <p class="text-xs text-text-secondary">Validation requise</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Centre de prospects / Users -->
        <div class="rounded-lg border border-border bg-white p-5">
          <h3 class="mb-3 text-base font-semibold text-text-primary">Centre d'équipe</h3>
          <div class="space-y-3">
            <div class="flex items-center gap-3 rounded-md p-2 hover:bg-surface">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-text-primary">{{ formatNumber(metrics?.totalUsers ?? 0) }} utilisateurs</p>
                <p class="text-xs text-text-secondary">{{ metrics?.activeUsers ?? 0 }} actifs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Plan de la semaine (Meta-style weekly plan) -->
      <div class="mb-6 rounded-lg border border-border bg-white p-5">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h3 class="text-base font-semibold text-text-primary">
              Plan de la semaine
              <span class="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">3 jours restants</span>
            </h3>
            <p class="mt-1 text-sm text-text-secondary">Garantissez le succès de votre entreprise en terminant les tâches recommandées.</p>
          </div>
          <button class="flex items-center gap-1 rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-sidebar-hover">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" /></svg>
            Voir le plan complet
          </button>
        </div>

        <!-- Progress bar -->
        <div class="mb-2">
          <p class="mb-1 text-sm font-semibold text-text-primary">Terminez au moins 3 tâches pour finir ce plan.</p>
          <div class="flex items-center gap-3">
            <div class="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div class="h-full rounded-full bg-success" style="width: 43%" />
            </div>
            <span class="text-xs text-text-secondary">Objectif hebdomadaire</span>
          </div>
          <p class="mt-1 text-xs text-text-secondary">3 tâche(s) terminée(s) sur 7</p>
        </div>

        <!-- Task cards -->
        <div class="mt-4 flex gap-3 overflow-x-auto">
          <div
            v-for="task in weeklyTasks"
            :key="task.label"
            class="flex min-w-[200px] items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
          >
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p class="text-sm font-medium text-text-primary">{{ task.label }}</p>
              <p class="text-xs text-text-secondary">{{ task.done }} / {{ task.total }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Performances (Meta-style) -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <!-- Conversations / Sales performance -->
        <div class="rounded-lg border border-border bg-white p-5">
          <div class="mb-1 flex items-center justify-between">
            <h3 class="text-base font-semibold text-text-primary">Ventes</h3>
            <svg class="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </div>
          <p class="mb-3 text-xs text-text-secondary">Chiffre d'affaires total</p>
          <p class="text-3xl font-bold text-text-primary">{{ formatCurrency(metrics?.totalRevenue ?? 0) }}</p>
          <div class="mt-3 flex items-center gap-1 text-sm">
            <svg class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>
            <span class="font-medium text-success">12,5%</span>
            <span class="text-text-secondary">vs semaine dernière</span>
          </div>
        </div>

        <!-- Conversions / Outlets -->
        <div class="rounded-lg border border-border bg-white p-5">
          <div class="mb-1 flex items-center justify-between">
            <h3 class="text-base font-semibold text-text-primary">Points de Vente</h3>
            <svg class="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </div>
          <p class="mb-3 text-xs text-text-secondary">Total des points de vente enregistrés</p>
          <p class="text-3xl font-bold text-text-primary">{{ formatNumber(metrics?.totalOutlets ?? 0) }}</p>
          <div class="mt-3 text-sm">
            <span class="text-text-secondary">PDV en attente :</span>
            <span class="ml-1 font-medium text-warning">{{ metrics?.pendingOutlets ?? 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
