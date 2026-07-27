<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {useHabitsStore} from './stores/habits'
import { routes } from '@/router'
import AddHabitModal from '@/components/AddHabitModal.vue'

const habitsStore = useHabitsStore()
onMounted(() => {
  habitsStore.load()
})

const menuOpen = ref(false)
</script>

<template>
  <div class="app">
    <div class="notebook">
      <header class="notebook-header">
        <div class="notebook-header__inner">
          <button
              class="burger"
              :class="{ open: menuOpen }"
              @click="menuOpen = !menuOpen"
              aria-label="Меню"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <RouterLink to="/">
            <img src="/src/assets/img/logo.png" alt="logo" class="logo" />
          </RouterLink>
          <nav :class="{ open: menuOpen }">
            <RouterLink
                v-for="route in routes"
                :key="route.path"
                :to="route.path"
                :data-icon="route.icon"
                @click="menuOpen = false"
            >
              {{ route.name }}
            </RouterLink>
          </nav>
          <div v-if="menuOpen" class="menu-backdrop" @click="menuOpen = false" />
        </div>
      </header>
      <main class="content">
        <router-view />
      </main>
    </div>
    <AddHabitModal />
  </div>
</template>

