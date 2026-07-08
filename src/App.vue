<script setup lang="ts">
import { onMounted } from 'vue'
import {useHabitsStore} from './stores/habits'
import { routes } from '@/router'

const habitsStore = useHabitsStore()
onMounted(() => {
  habitsStore.load()
})
</script>

<template>
  <div class="app">
    <div class="notebook">
      <header class="notebook-header">
        <img src="/src/assets/img/logo.png" alt="logo" class="logo" />
        <nav>
          <RouterLink
              v-for="route in routes"
              :key="route.path"
              :to="route.path"
              :data-icon="route.icon"
          >
            {{ route.name }}
          </RouterLink>
        </nav>
      </header>
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

