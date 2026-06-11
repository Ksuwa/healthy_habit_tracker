<script setup lang="ts">
import { onMounted } from 'vue'
import { ref } from 'vue'
import {useHabitsStore} from '@/stores/habits'
import HabitTable from "@/components/HabitTable.vue";

const habitsStore = useHabitsStore()
onMounted(() => {
  habitsStore.load()
})
const name = ref('')

function add() {
  if (!name.value.trim()) return

  habitsStore.addHabit(name.value)
  name.value = ''
}
</script>

<template>

      <div class="habits-container">
        <h2>мои привычки</h2>
        <div class="add-habit">
          <input
              v-model="name"
              placeholder="Новая привычка"
          />

          <button @click="add">Добавить</button>
        </div>
        <HabitTable></HabitTable>

      </div>
</template>

