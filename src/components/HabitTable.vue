<!-- components/HabitTable.vue -->
<script setup lang="ts">
  import { onMounted, computed, ref } from 'vue'
  import { useHabitsStore } from '@/stores/habits'
  import { getMonthDays } from '@/utils/dates'
  import type { Habit } from '@/types/habits'

  const habitsStore = useHabitsStore()
  const fallbackColors = [
    '#f6b7c8',
    '#b9dfc8',
    '#b8d7f5',
    '#d8c2ef',
    '#f5d59f',
    '#bfe3df',
    '#f2b9ae',
    '#cfdca7'
  ]

  onMounted(() => {
    habitsStore.load()
  })

  const today = new Date()
  const selectedMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))
  const days = computed(() =>
      getMonthDays(
          selectedMonth.value.getFullYear(),
          selectedMonth.value.getMonth()
      )
  )
  const todayKey = formatDateKey(today)
  const hoveredIndex = ref<number | null>(null)
  const todayColIndex = computed(() => days.value.indexOf(todayKey))
  const dayGridStyle = computed(() => ({
    gridTemplateColumns: `repeat(${days.value.length}, 42px)`
  }))
  const monthLabel = computed(() => {
    const label = selectedMonth.value.toLocaleDateString('ru-RU', {
      month: 'long',
      year: 'numeric'
    })

    return label.charAt(0).toUpperCase() + label.slice(1)
  })

  function toggle(id: string, date: string) {
    if (isFutureDate(date)) return

    habitsStore.toggleDay(id, date)
  }

  function habitColor(habit: Habit, index: number) {
    return habit.color || fallbackColors[index % fallbackColors.length]
  }

  function hexToRgb(hex: string) {
    const normalized = hex.replace('#', '')
    const value = normalized.length === 3
        ? normalized.split('').map(char => char + char).join('')
        : normalized

    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16)
    }
  }

  function withAlpha(hex: string, alpha: number) {
    const { r, g, b } = hexToRgb(hex)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  function rowStyle(habit: Habit, index: number) {
    const color = habitColor(habit, index)

    return {
      '--habit-color': color,
      '--habit-color-soft': withAlpha(color, 0.24)
    }
  }

  function formatDateKey(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  function isFutureDate(date: string) {
    return date > todayKey
  }

  function shiftMonth(step: number) {
    selectedMonth.value = new Date(
        selectedMonth.value.getFullYear(),
        selectedMonth.value.getMonth() + step,
        1
    )
  }
</script>

<style scoped lang="scss">
.table-wrapper {
  padding: 20px 40px 0;
  overflow-x: hidden;
  min-width: 0;
}

.month-switcher {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-bottom: 16px;
  color: #5a4a3a;
}

.month-switcher button {
  width: 34px;
  height: 34px;
  border: 1px solid #e3d6c4;
  border-radius: 50%;
  background: #fffdf7;
  color: #6c5a46;
  cursor: pointer;
  font-family: inherit;
  font-size: 28px;
  line-height: 1;
  transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
}

.month-switcher button:hover {
  background: #f3eadb;
  box-shadow: 0 6px 14px rgba(113, 92, 67, 0.12);
  transform: translateY(-1px);
}

.month-label {
  min-width: 160px;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
}

.table {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  width: 100%;
  min-width: 0;
  padding: 14px;
  border: 1px solid #eadfce;
  border-radius: 18px;
  background: rgba(255, 253, 247, 0.78);
  box-shadow: 0 14px 35px rgba(113, 92, 67, 0.08);
  max-width: 100%;
  overflow: hidden;
}

.habit-list {
  position: relative;
  z-index: 2;
  background: transparent;
  box-shadow: 8px 0 18px rgba(113, 92, 67, 0.05);
}

.dates-scroll {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.dates-inner {
  display: inline-flex;
  flex-direction: column;
  min-width: max-content;
}

.habit-cell,
.date-row {
  display: flex;
  align-items: center;
  height: 54px;
}

.habit-cell {
  justify-content: flex-start;
  padding: 0 14px 0 12px;
  color: #5a4a3a;
}

.habit-item,
.date-row {
  background: rgba(255, 253, 247, 0.92);
  border-top: 1px solid #eadfce;
  border-bottom: 1px solid #eadfce;
  box-shadow: 0 7px 16px rgba(113, 92, 67, 0.06);
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.habit-item {
  border-left: 1px solid #eadfce;
  border-radius: 10px 0 0 10px;
}

.date-row {
  border-right: 1px solid #eadfce;
  border-radius: 0 10px 10px 0;
  width: max-content;
}

.habit-item + .habit-item,
.date-row + .date-row {
  margin-top: 8px;
}

.habit-item.row-hover,
.date-row.row-hover {
  background: var(--habit-color-soft);
  box-shadow: 0 9px 18px rgba(113, 92, 67, 0.09);
}

.header {
  color: #8e7d6a;
  font-size: 18px;
  font-weight: 700;
  height: 36px;
}

.dates-header {
  display: grid;
  height: 36px;
}

.dates-header-row {
  display: grid;
  height: 100%;
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.day-col {
  width: 42px;
  text-align: center;
}

.habit-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 20px;
}

.habit-dot {
  width: 10px;
  height: 10px;
  margin-right: 8px;
  border-radius: 50%;
  background: var(--habit-color);
  box-shadow: 0 0 0 4px var(--habit-color-soft);
  flex-shrink: 0;
}

.circle-toggle {
  width: 20px;
  height: 20px;
  border: 2px solid var(--habit-color);
  border-radius: 50%;
  background: #fffaf2;
  cursor: pointer;
  margin: 0 auto;
  padding: 0;
  transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}

.circle-toggle:hover {
  transform: scale(1.08);
  box-shadow: 0 0 0 5px var(--habit-color-soft);
}

.circle-toggle.active {
  background: var(--habit-color);
}

.circle-toggle:disabled {
  border-color: #cfc8bc;
  background: #e1ddd5;
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

.circle-toggle:disabled:hover {
  box-shadow: none;
  transform: none;
}

.streak {
  font-size: 16px;
  margin-left: auto;
  color: #9a8065;
  white-space: nowrap;
}

.delete-btn {
  margin-left: 8px;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #c4b5a0;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease, background 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
  padding: 0;
}

.habit-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #fce4ec;
  color: #e53935;
}

.today-col {
  position: relative;
  background: rgba(128, 185, 24, 0.12);
  box-shadow: 0 -9px 0 0 rgba(128, 185, 24, 0.12);
}

</style>

<template>
  <div class="table-wrapper">
    <div class="month-switcher" aria-label="Переключение месяца">
      <button
          type="button"
          aria-label="Предыдущий месяц"
          @click="shiftMonth(-1)"
      >
        ‹
      </button>
      <div class="month-label">{{ monthLabel }}</div>
      <button
          type="button"
          aria-label="Следующий месяц"
          @click="shiftMonth(1)"
      >
        ›
      </button>
    </div>

    <div class="table">
      <div class="habit-list">
        <div class="habit-cell header">Привычка</div>
        <div
            v-for="(habit, habitIndex) in habitsStore.habits"
            :key="habit.id"
            class="habit-cell habit-item"
            :class="{ 'row-hover': hoveredIndex === habitIndex }"
            :style="rowStyle(habit, habitIndex)"
            @mouseenter="hoveredIndex = habitIndex"
            @mouseleave="hoveredIndex = null"
        >
          <span class="habit-dot" />
          <span class="habit-name">{{ habit.name }}</span>
          <span class="streak">🔥 {{ habit.completedDates.length }}</span>
          <button
              class="delete-btn"
              title="Удалить привычку"
              @click.stop="habitsStore.removeHabit(habit.id)"
          >✕</button>
        </div>
      </div>

      <div class="dates-scroll">
        <div class="dates-inner">
          <div class="dates-header header" :style="dayGridStyle">
            <div
                v-for="(day, dayIndex) in days"
                :key="day"
                class="cell day-col"
                :class="{ 'today-col': dayIndex === todayColIndex }"
            >
              {{ new Date(day).getDate() }}
            </div>
          </div>

          <div
              v-for="(habit, habitIndex) in habitsStore.habits"
              :key="habit.id"
              class="date-row"
              :class="{ 'row-hover': hoveredIndex === habitIndex }"
              :style="rowStyle(habit, habitIndex)"
              @mouseenter="hoveredIndex = habitIndex"
              @mouseleave="hoveredIndex = null"
          >
            <div class="dates-header-row" :style="dayGridStyle">
              <div
                  v-for="(day, dayIndex) in days"
                  :key="day"
                  class="cell day-col"
                  :class="{ 'today-col': dayIndex === todayColIndex }"
              >
                <button
                    class="circle-toggle"
                    :class="{ active: habit.completedDates.includes(day) }"
                    :disabled="isFutureDate(day)"
                    :aria-label="`${habit.name}: ${new Date(day).getDate()}`"
                    @click="toggle(habit.id, day)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
