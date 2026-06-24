<script setup lang="ts">
const campaigns = [
  { id: 1, name: 'Promotion produits laitiers Q3', status: 'active', reach: 1250, budget: 500000 },
  { id: 2, name: 'Lancement nouveau produit Fan Milk', status: 'draft', reach: 0, budget: 750000 },
  { id: 3, name: 'Campagne fidélisation PDV', status: 'completed', reach: 3400, budget: 300000 },
]

function getStatusClass(status: string) {
  switch (status) {
    case 'active': return 'bg-success/10 text-success'
    case 'draft': return 'bg-warning/10 text-warning'
    case 'completed': return 'bg-text-secondary/10 text-text-secondary'
    default: return 'bg-gray-100 text-gray-600'
  }
}
function getStatusLabel(status: string) {
  switch (status) {
    case 'active': return 'Active'
    case 'draft': return 'Brouillon'
    case 'completed': return 'Terminée'
    default: return status
  }
}
function formatCurrency(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(n)
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-text-primary">Gestionnaire de campagnes</h1>
        <p class="text-sm text-text-secondary">Gérez vos campagnes commerciales terrain</p>
      </div>
      <button class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
        + Nouvelle campagne
      </button>
    </div>

    <div class="overflow-hidden rounded-lg border border-border bg-white">
      <table class="w-full">
        <thead class="border-b border-border bg-surface">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-text-secondary">Campagne</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-text-secondary">Statut</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-text-secondary">Portée</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-text-secondary">Budget</th>
            <th class="px-4 py-3 text-right text-xs font-medium uppercase text-text-secondary">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="c in campaigns" :key="c.id" class="hover:bg-surface">
            <td class="px-4 py-3 text-sm font-medium text-text-primary">{{ c.name }}</td>
            <td class="px-4 py-3">
              <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="getStatusClass(c.status)">{{ getStatusLabel(c.status) }}</span>
            </td>
            <td class="px-4 py-3 text-sm text-text-secondary">{{ c.reach.toLocaleString('fr-FR') }}</td>
            <td class="px-4 py-3 text-sm text-text-secondary">{{ formatCurrency(c.budget) }}</td>
            <td class="px-4 py-3 text-right">
              <button class="rounded p-1 text-text-secondary hover:bg-sidebar-hover hover:text-text-primary">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
