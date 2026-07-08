<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHabitsStore } from '@/stores/habits'
import { getMonthDays } from '@/utils/dates'
import HabitsListByDate from "@/components/HabitsListByDate.vue";

const habitsStore = useHabitsStore()

const weekdays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
const selectedMonth = ref(new Date())
const selectedDate = ref<string | null>(null)

const todayKey = computed(() => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})

const days = computed(() =>
  getMonthDays(selectedMonth.value.getFullYear(), selectedMonth.value.getMonth())
)

const startPadding = computed(() => {
  const first = new Date(selectedMonth.value.getFullYear(), selectedMonth.value.getMonth(), 1)
  const day = first.getDay()
  return day === 0 ? 6 : day - 1
})

onMounted(() => {
  habitsStore.load()
  selectedDate.value = todayKey.value
})

const monthLabel = computed(() => {
  return selectedMonth.value.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric'
  })
})

function habitsForDate(dateStr: string) {
  return habitsStore.habits.filter(h => h.completedDates.includes(dateStr))
}

function selectDate(date: string) {
  selectedDate.value = selectedDate.value === date ? null : date
}

function formatDateRu(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

function shiftMonth(step: number) {
  selectedMonth.value = new Date(
    selectedMonth.value.getFullYear(),
    selectedMonth.value.getMonth() + step,
    1
  )
}
</script>

<template>
  <div class="calendar-page">
    <div class="calendar-main">
      <div class="calendar-header">
        <button class="nav-btn" @click="shiftMonth(-1)">‹</button>
        <h2 class="month-label">{{ monthLabel }}</h2>
        <button class="nav-btn" @click="shiftMonth(1)">›</button>
      </div>

      <div class="weekdays">
        <div v-for="d in weekdays" :key="d" class="weekday">{{ d }}</div>
      </div>

      <div class="days-grid">
        <div v-for="n in startPadding" :key="'p' + n" class="day-cell empty" />

        <div
          v-for="day in days"
          :key="day"
          class="day-cell"
          :class="{ selected: day === selectedDate }"
          @click="selectDate(day)"
        >
          <span class="day-number">{{ new Date(day).getDate() }}</span>
          <div class="habit-dots">
            <span
              v-for="habit in habitsForDate(day)"
              :key="habit.id"
              class="dot"
              :style="{ background: habit.color }"
            />
          </div>
        </div>
      </div>
    </div>

    <aside v-if="selectedDate" class="day-details">
      <h3 class="details-title">{{ formatDateRu(selectedDate) }}</h3>
      <HabitsListByDate :date="selectedDate"></HabitsListByDate>
    </aside>
  </div>
</template>

<style scoped lang="scss">
.calendar-page {
  flex: 1;
  display: flex;
  gap: 40px;
  padding: 40px;
  background: #f5f0e4;
  min-width: 0;
}

.calendar-main {
  flex: 1;
  min-width: 0;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 20px;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e3d6c4;
  border-radius: 50%;
  background: #fffdf7;
  color: #6c5a46;
  cursor: pointer;
  font-family: inherit;
  font-size: 28px;
  line-height: 1;
  transition: 0.2s;
}

.nav-btn:hover {
  background: #f3eadb;
}

.month-label {
  font-size: 28px;
  font-weight: 700;
  color: #5a4a3a;
  min-width: 200px;
  text-align: center;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 6px;
}

.weekday {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #8e7d6a;
  padding: 8px 0;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.day-cell {
  aspect-ratio: 1;
  background: #fffdf7;
  border: 1px solid #eadfce;
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: 0.2s;
  min-height: 80px;
}

.day-cell:hover {
  background: #f3eadb;
  border-color: #d4c9b5;
}

.day-cell.selected {
  background: #e8dfce;
  border-color: #c4b5a0;
  box-shadow: 0 0 0 2px #c4b5a0;
}

.day-cell.empty {
  background: transparent;
  border: none;
  cursor: default;
}

.day-number {
  font-size: 20px;
  font-weight: 600;
  color: #5a4a3a;
}

.habit-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.day-details {
  width: 280px;
  flex-shrink: 0;
  background: #fffdf7;
  border: 1px solid #eadfce;
  border-radius: 18px;
  padding: 28px 24px;
  height: fit-content;
}

.details-title {
  font-size: 24px;
  font-weight: 700;
  color: #5a4a3a;
  margin-bottom: 20px;
  text-align: center;
}

</style>
