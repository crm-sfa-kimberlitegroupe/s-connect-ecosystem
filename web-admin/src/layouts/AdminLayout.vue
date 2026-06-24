<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SidebarNav from '@/components/layout/SidebarNav.vue'

const authStore = useAuthStore()
const router = useRouter()
const sidebarCollapsed = ref(false)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <SidebarNav :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />

    <!-- Main content -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Top bar -->
      <header class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
        <button
          class="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          @click="sidebarCollapsed = !sidebarCollapsed"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">
            {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
          </span>
          <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {{ authStore.user?.role }}
          </span>
          <button
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-danger"
            @click="handleLogout"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
