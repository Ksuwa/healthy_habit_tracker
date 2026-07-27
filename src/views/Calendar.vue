<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHabitsStore } from '@/stores/habits'
import { getMonthDays } from '@/utils/dates'
import HabitsListByDate from "@/components/HabitsListByDate.vue";
import EmptyHabits from "@/components/EmptyHabits.vue";

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
  if (date > todayKey.value) return
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

const emptyHabitsContent = {
  title: 'Пока у тебя нет привычек.',
  description: 'Добавь первую привычку и начни свой путь к маленьким победам!',
}
</script>

<template>
  <div class="habbit-page">
    <h1>Календарь моих привычек</h1>
    <div class="habit-calendar">
      <section class="habit-calendar__panel">
        <header class="habit-calendar__header">
          <button class="habit-calendar__nav-btn" @click="shiftMonth(-1)">‹</button>
          <h2 class="habit-calendar__month-title">{{ monthLabel }}</h2>
          <button class="habit-calendar__nav-btn" @click="shiftMonth(1)">›</button>
        </header>

        <div class="habit-calendar__week-row">
          <div v-for="d in weekdays" :key="d" class="habit-calendar__weekday">{{ d }}</div>
        </div>

        <div class="habit-calendar__grid">
          <div v-for="n in startPadding" :key="'p' + n" class="habit-calendar__day empty" />

          <div
            v-for="day in days"
            :key="day"
            class="habit-calendar__day"
            :class="{ 'habit-calendar__day--selected': day === selectedDate, 'habit-calendar__day--disabled': day > todayKey }"
            @click="selectDate(day)"
          >
            <span class="habit-calendar__date">{{ new Date(day).getDate() }}</span>
            <div class="habit-calendar__indicators">
              <span
                v-for="habit in habitsForDate(day)"
                :key="habit.id"
                class="habit-calendar__dot"
                :style="{ background: habit.color }"
              />
            </div>
          </div>
        </div>
      </section>

      <aside v-if="selectedDate" class="habit-calendar__sidebar">
        <EmptyHabits v-if="habitsStore.isHabitsEmpty">
        </EmptyHabits>
        <div v-else class="habit-calendar__sidebar-wrap">
            <h3 class="habit-calendar__sidebar-title">{{ formatDateRu(selectedDate) }}</h3>
            <HabitsListByDate :date="selectedDate"></HabitsListByDate>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.habit-calendar {
  flex: 1;
  display: flex;
  gap: 40px;
  padding: 40px;
  min-width: 0;

  :deep(.empty-habits__img) {
    width: 246px;
    margin: 20px 30px 30px;
  }

  h1 {
    margin-bottom: 40px ;
  }

  &__panel {
    flex: 1;
    min-width: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin-bottom: 20px;
  }

  &__nav-btn {
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

    &:hover {
      background: #f3eadb;
    }
  }

  &__month-title {
    font-size: 28px;
    font-weight: 700;
    color: #5a4a3a;
    min-width: 200px;
    text-align: center;
  }

  &__week-row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    margin-bottom: 6px;
  }

  &__weekday {
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    color: #8e7d6a;
    padding: 8px 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
  }

  &__day {
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

    &:hover {
      background: #f3eadb;
      border-color: #d4c9b5;
    }

    &--selected{
      background: #e8dfce;
      border-color: #c4b5a0;
      box-shadow: 0 0 0 2px #c4b5a0;
    }

    &.empty {
      background: transparent;
      border: none;
      cursor: default;
    }

    &--disabled {
      opacity: 0.4;
      cursor: default;
      pointer-events: none;
    }
  }

  &__date {
    font-size: 20px;
    font-weight: 600;
    color: #5a4a3a;
  }

  &__indicators {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__sidebar {
    width: 280px;
    flex-shrink: 0;
    background: #fffdf7;
    border: 1px solid #eadfce;
    border-radius: 18px;
    padding: 28px 24px;
    height: fit-content;
  }

  &__sidebar-title {
    font-size: 24px;
    font-weight: 700;
    color: #5a4a3a;
    margin-bottom: 20px;
    text-align: center;
  }
}

@media (max-width: 1024px) {
  .habit-calendar {
    flex-direction: column;

    &__sidebar {
      width: 100%;
    }
  }
}

@media (max-width: 768px) {
  .habit-calendar {
    padding: 16px 20px;
    gap: 24px;

    &__day {
      min-height: unset;
      padding: 4px;
      gap: 4px;
    }

    &__date {
      font-size: 16px;
    }

    &__weekday {
      font-size: 13px;
      padding: 4px 0;
    }

    &__dot {
      width: 7px;
      height: 7px;
    }

    &__grid,
    &__week-row {
      gap: 4px;
    }
  }
}

@media (max-width: 480px) {
  .habit-calendar {
    padding: 12px;

    &__header {
      gap: 12px;
    }

    &__month-title {
      font-size: 20px;
      min-width: unset;
    }

    &__nav-btn {
      width: 32px;
      height: 32px;
      font-size: 20px;
    }

    &__day {
      min-height: unset;
      aspect-ratio: 1;
      padding: 2px;
      border-radius: 8px;
      gap: 2px;
    }

    &__date {
      font-size: 13px;
    }

    &__weekday {
      font-size: 11px;
    }

    &__sidebar {
      padding: 16px;
    }

    :deep(.check-row) {
      font-size: 18px;
    }

    :deep(.check-list) {
      gap: 12px;
    }
  }
}

@media (max-width: 360px) {
  .habit-calendar {
    padding: 8px;
    gap: 16px;

    &__grid,
    &__week-row {
      gap: 3px;
    }

    &__date {
      font-size: 11px;
    }

    :deep(.check-row) {
      font-size: 15px;
    }
  }
}

</style>
