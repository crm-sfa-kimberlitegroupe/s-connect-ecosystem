<script setup lang="ts">
import { ref } from 'vue'

const selectedDate = ref(new Date().toISOString().split('T')[0])
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Routes & Tournées</h1>
      <p class="text-sm text-gray-500">Planification et suivi des tournées commerciales</p>
    </div>

    <!-- Date filter -->
    <div class="mb-4">
      <input
        v-model="selectedDate"
        type="date"
        class="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>

    <!-- Routes overview -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-gray-500">Tournées planifiées</p>
        <p class="mt-1 text-3xl font-bold text-gray-900">—</p>
        <p class="mt-1 text-xs text-gray-400">pour le {{ selectedDate }}</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-gray-500">Visites effectuées</p>
        <p class="mt-1 text-3xl font-bold text-success">—</p>
        <p class="mt-1 text-xs text-gray-400">terminées aujourd'hui</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-gray-500">Taux de complétion</p>
        <p class="mt-1 text-3xl font-bold text-primary">—%</p>
        <p class="mt-1 text-xs text-gray-400">objectif du jour</p>
      </div>
    </div>

    <!-- Routes list -->
    <div class="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 class="mb-4 text-lg font-semibold text-gray-900">Tournées des commerciaux</h3>
      <div class="flex h-48 items-center justify-center text-gray-400">
        <p class="text-center text-sm">
          Les tournées planifiées apparaîtront ici.<br />
          Connectez le backend pour voir les données en temps réel.
        </p>
      </div>
    </div>
  </div>
</template>
