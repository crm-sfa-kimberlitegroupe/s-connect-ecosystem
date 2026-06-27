<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const settingsSections = [
  { key: 'account', label: 'Configuration du compte', active: true },
  { key: 'pages', label: 'Pages' },
  { key: 'billing', label: 'Facturation et paiements' },
  { key: 'notifications', label: 'Paramètres de notification' },
]
</script>

<template>
  <div>
    <h1 class="mb-6 text-xl font-bold text-text-primary">Paramètres</h1>

    <div class="flex gap-6">
      <!-- Settings nav (Meta style) -->
      <div class="w-56 shrink-0">
        <nav class="space-y-0.5">
          <button
            v-for="s in settingsSections"
            :key="s.key"
            class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium transition-colors"
            :class="s.active ? 'bg-sidebar-active text-white' : 'text-text-primary hover:bg-sidebar-hover'"
          >
            {{ s.label }}
          </button>
        </nav>
      </div>

      <!-- Settings content -->
      <div class="flex-1">
        <div class="rounded-lg border border-border bg-white p-6">
          <h2 class="mb-4 text-lg font-semibold text-text-primary">Configuration du compte</h2>

          <div class="space-y-6">
            <div>
              <h3 class="mb-2 text-sm font-semibold text-text-primary">Profil</h3>
              <div class="flex items-center gap-4">
                <div class="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  {{ authStore.user?.firstName?.[0] || 'S' }}{{ authStore.user?.lastName?.[0] || 'C' }}
                </div>
                <div>
                  <p class="text-sm font-medium text-text-primary">
                    {{ authStore.user?.firstName || 'Utilisateur' }} {{ authStore.user?.lastName || '' }}
                  </p>
                  <p class="text-sm text-text-secondary">{{ authStore.user?.email || 'admin@salesconnect.ci' }}</p>
                  <p class="text-xs text-text-secondary">Rôle : {{ authStore.user?.role || 'ADMIN' }}</p>
                </div>
              </div>
            </div>

            <div class="border-t border-border pt-4">
              <h3 class="mb-2 text-sm font-semibold text-text-primary">Organisation</h3>
              <p class="text-sm text-text-secondary">
                Tenant ID : {{ authStore.tenantId || 'Non configuré' }}
              </p>
            </div>

            <div class="border-t border-border pt-4">
              <h3 class="mb-2 text-sm font-semibold text-text-primary">Coordonnées</h3>
              <p class="text-sm text-text-secondary">
                Gérez vos informations de contact et vos préférences de notification.
              </p>
              <button class="mt-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-text-primary hover:bg-sidebar-hover">
                Modifier les paramètres
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
