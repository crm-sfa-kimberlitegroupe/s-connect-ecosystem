<script setup lang="ts">
const conversations = [
  { id: 1, name: 'Kouamé Jean', role: 'REP', lastMsg: 'Tournée zone Nord terminée. 6 commandes enregistrées.', time: 'il y a 30 min', unread: true },
  { id: 2, name: 'Diallo Fatou', role: 'ADMIN', lastMsg: 'Les tarifs de la zone Ouest ont été mis à jour.', time: 'il y a 2h', unread: true },
  { id: 3, name: 'Traoré Ibrahim', role: 'REP', lastMsg: 'PDV Chez Mariam validé. Photo envoyée.', time: 'il y a 5h', unread: false },
  { id: 4, name: 'Koné Aminata', role: 'SUP', lastMsg: 'Rapport mensuel disponible dans l\'espace documents.', time: 'Hier', unread: false },
]
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-xl font-bold text-text-primary">
        Messagerie
        <span class="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-[11px] font-bold text-white">2</span>
      </h1>
    </div>

    <div class="divide-y divide-border rounded-lg border border-border bg-white">
      <div
        v-for="c in conversations"
        :key="c.id"
        class="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-surface"
        :class="c.unread && 'bg-meta-blue-light/30'"
      >
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          {{ c.name.split(' ').map(n => n[0]).join('') }}
        </div>
        <div class="flex-1 overflow-hidden">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-text-primary">{{ c.name }}</span>
            <span class="rounded-full bg-surface px-1.5 py-0.5 text-[10px] font-medium text-text-secondary">{{ c.role }}</span>
          </div>
          <p class="truncate text-sm text-text-secondary">{{ c.lastMsg }}</p>
        </div>
        <div class="shrink-0 text-right">
          <p class="text-xs text-text-secondary">{{ c.time }}</p>
          <div v-if="c.unread" class="mt-1 ml-auto h-2 w-2 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  </div>
</template>
