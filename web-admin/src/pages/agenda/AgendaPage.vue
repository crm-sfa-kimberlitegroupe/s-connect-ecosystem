<script setup lang="ts">
const today = new Date()
const currentMonth = today.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const events = [
  { time: '09:00', title: 'Tournée Zone Nord', type: 'visit' },
  { time: '11:00', title: 'Réunion équipe ventes', type: 'meeting' },
  { time: '14:00', title: 'Validation PDV secteur Est', type: 'task' },
  { time: '16:00', title: 'Rapport performance hebdomadaire', type: 'report' },
]
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-xl font-bold text-text-primary">Agenda</h1>
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-text-primary capitalize">{{ currentMonth }}</span>
        <div class="flex gap-1">
          <button class="rounded-md border border-border bg-white p-1.5 text-text-secondary hover:bg-sidebar-hover">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <button class="rounded-md border border-border bg-white p-1.5 text-text-secondary hover:bg-sidebar-hover">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>
      </div>
    </div>

    <div class="flex gap-6">
      <!-- Calendar grid -->
      <div class="flex-1 rounded-lg border border-border bg-white p-5">
        <div class="mb-4 grid grid-cols-7 gap-1">
          <div v-for="d in days" :key="d" class="py-2 text-center text-xs font-medium text-text-secondary">{{ d }}</div>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="i in 35"
            :key="i"
            class="flex h-16 flex-col items-center justify-start rounded-md p-1 text-sm transition-colors hover:bg-surface"
            :class="i === 24 ? 'bg-primary/10 font-semibold text-primary' : 'text-text-primary'"
          >
            <span>{{ ((i - 1 + 28) % 31) + 1 }}</span>
          </div>
        </div>
      </div>

      <!-- Today's events -->
      <div class="w-72 shrink-0">
        <div class="rounded-lg border border-border bg-white p-5">
          <h3 class="mb-4 text-base font-semibold text-text-primary">Aujourd'hui</h3>
          <div class="space-y-3">
            <div v-for="ev in events" :key="ev.title" class="flex gap-3">
              <span class="shrink-0 text-xs font-medium text-text-secondary">{{ ev.time }}</span>
              <div class="flex-1 rounded-md border-l-2 border-primary bg-surface px-3 py-2">
                <p class="text-sm font-medium text-text-primary">{{ ev.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
