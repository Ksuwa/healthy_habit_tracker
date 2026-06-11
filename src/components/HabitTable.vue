<!-- components/HabitTable.vue -->
<script setup lang="ts">
  import { onMounted, computed } from 'vue'
  import { useHabitsStore } from '@/stores/habits'
  import { getMonthDays } from '@/utils/dates'

  const habitsStore = useHabitsStore()

  onMounted(() => {
    habitsStore.load()
  })

  const today = new Date()
  const days = computed(() =>
      getMonthDays(today.getFullYear(), today.getMonth())
  )

  function toggle(id: string, date: string) {
    habitsStore.toggleDay(id, date)
  }
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
}

.table {
  min-width: 600px;
}

.row {
  display: flex;
}

.cell {
  padding: 4px 6px;
}

.habit-col {
  min-width: 140px;
  flex-shrink: 0;
}

.day-col {
  width: 32px;
  text-align: center;
  flex-shrink: 0;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 auto;
}

.checkbox.active {
  background: #4caf50;
  border-color: #4caf50;
}

.streak {
  font-size: 14px;
  margin-left: 6px;
}
</style>

<template>
  <div class="table-wrapper">
    <div class="table">

      <!-- HEADER -->
      <div class="row header">
        <div class="cell habit-col">Привычка</div>

        <div
            v-for="day in days"
            :key="day"
            class="cell day-col"
        >
          {{ new Date(day).getDate() }}
        </div>
      </div>

      <!-- ROWS -->
      <div
          v-for="habit in habitsStore.habits"
          :key="habit.id"
          class="row"
      >
        <div class="cell habit-col">
          {{ habit.name }}
          <span class="streak">🔥 {{ habitsStore.getStreak(habit) }}</span>
        </div>

        <div
            v-for="day in days"
            :key="day"
            class="cell day-col"
        >
          <div
              class="checkbox"
              :class="{ active: habit.completedDates.includes(day) }"
              @click="toggle(habit.id, day)"
          />
        </div>
      </div>

    </div>
  </div>
</template>
