<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps<{ collapsed: boolean }>()
defineEmits<{ toggle: [] }>()

const route = useRoute()
const authStore = useAuthStore()

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'chart-bar' },
  { name: 'Utilisateurs', path: '/users', icon: 'users' },
  { name: 'Territoires', path: '/territories', icon: 'map' },
  { name: 'Points de Vente', path: '/outlets', icon: 'building-storefront' },
  { name: 'Routes', path: '/routes', icon: 'map-pin' },
]

function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>

<template>
  <aside
    class="flex flex-col bg-sidebar text-white transition-all duration-300"
    :class="collapsed ? 'w-16' : 'w-64'"
  >
    <!-- Logo -->
    <div class="flex h-16 items-center gap-3 border-b border-white/10 px-4">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
        S
      </div>
      <span v-if="!collapsed" class="text-lg font-semibold">SConnect</span>
    </div>

    <!-- Navigation -->
    <nav class="mt-4 flex-1 space-y-1 px-2">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
        :class="isActive(item.path)
          ? 'bg-primary text-white shadow-lg shadow-primary/25'
          : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'"
      >
        <!-- Icons -->
        <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="item.icon === 'chart-bar'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          <path v-else-if="item.icon === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          <path v-else-if="item.icon === 'map'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          <path v-else-if="item.icon === 'building-storefront'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72" />
          <path v-else-if="item.icon === 'map-pin'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        <span v-if="!collapsed">{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- User info -->
    <div class="border-t border-white/10 p-4">
      <div v-if="!collapsed" class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
          {{ authStore.user?.firstName?.[0] }}{{ authStore.user?.lastName?.[0] }}
        </div>
        <div class="overflow-hidden">
          <p class="truncate text-sm font-medium">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</p>
          <p class="truncate text-xs text-gray-400">{{ authStore.user?.email }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>
