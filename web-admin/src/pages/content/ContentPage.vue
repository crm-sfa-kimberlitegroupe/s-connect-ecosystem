<script setup lang="ts">
const contents = [
  { id: 1, title: 'Catalogue produits Q3 2026', type: 'Document', date: '22 juin 2026', status: 'published' },
  { id: 2, title: 'Guide des promotions été', type: 'Document', date: '20 juin 2026', status: 'published' },
  { id: 3, title: 'Nouveaux tarifs zone Ouest', type: 'Tarif', date: '18 juin 2026', status: 'draft' },
  { id: 4, title: 'Formation merchandising', type: 'Formation', date: '15 juin 2026', status: 'published' },
]
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-text-primary">Contenu</h1>
        <p class="text-sm text-text-secondary">Gérez vos documents, catalogues et contenus commerciaux</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="flex items-center gap-1 rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-sidebar-hover">
          Filtrer
        </button>
        <button class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
          Créer un contenu
        </button>
      </div>
    </div>

    <div class="overflow-hidden rounded-lg border border-border bg-white">
      <table class="w-full">
        <thead class="border-b border-border bg-surface">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-text-secondary">Titre</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-text-secondary">Type</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-text-secondary">Date</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-text-secondary">Statut</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="c in contents" :key="c.id" class="hover:bg-surface">
            <td class="px-4 py-3 text-sm font-medium text-text-primary">{{ c.title }}</td>
            <td class="px-4 py-3 text-sm text-text-secondary">{{ c.type }}</td>
            <td class="px-4 py-3 text-sm text-text-secondary">{{ c.date }}</td>
            <td class="px-4 py-3">
              <span
                class="rounded-full px-2 py-0.5 text-xs font-medium"
                :class="c.status === 'published' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'"
              >
                {{ c.status === 'published' ? 'Publié' : 'Brouillon' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
