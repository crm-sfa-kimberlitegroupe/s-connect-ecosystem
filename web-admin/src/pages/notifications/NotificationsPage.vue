<script setup lang="ts">
const notifications = [
  { id: 1, type: 'info', title: 'Nouvelle commande enregistrée', desc: 'Fan Milk International - Commande #1241', time: 'il y a 2 heures', read: false },
  { id: 2, type: 'warning', title: 'PDV en attente de validation', desc: '3 points de vente nécessitent votre approbation', time: 'il y a 4 heures', read: false },
  { id: 3, type: 'success', title: 'Visite complétée', desc: 'Rep Kouamé a terminé sa tournée (8/8 visites)', time: 'il y a 6 heures', read: true },
  { id: 4, type: 'info', title: 'Rapport hebdomadaire disponible', desc: 'Consultez les performances de la semaine', time: 'il y a 1 jour', read: true },
]
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-xl font-bold text-text-primary">Notifications</h1>
      <div class="flex items-center gap-2">
        <button class="rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-sidebar-hover">
          Tout marquer comme lu
        </button>
      </div>
    </div>

    <div class="divide-y divide-border rounded-lg border border-border bg-white">
      <div v-for="n in notifications" :key="n.id" class="flex items-start gap-3 p-4 transition-colors hover:bg-surface" :class="!n.read && 'bg-meta-blue-light/30'">
        <div class="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" :class="n.read ? 'bg-transparent' : 'bg-primary'" />
        <div class="flex-1">
          <p class="text-sm font-semibold text-text-primary">{{ n.title }}</p>
          <p class="text-sm text-text-secondary">{{ n.desc }}</p>
          <p class="mt-1 text-xs text-text-secondary">{{ n.time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
