<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useHabitsStore } from '@/stores/habits'
import StatCard from '@/components/StatCard.vue'
import EmptyHabits from "@/components/EmptyHabits.vue";
import type { Habit } from '@/types/habits'

const habitsStore = useHabitsStore()

onMounted(() => {
  habitsStore.load()
})

function getAllDatesRange(): string[] {
  const habits = habitsStore.habits
  if (habits.length === 0) return []

  const today = new Date()
  const dates: string[] = []

  let earliest = today
  for (const h of habits) {
    const d = new Date(h.createdAt)
    if (d < earliest) earliest = d
  }

  const cursor = new Date(earliest)
  while (cursor <= today) {
    const y = cursor.getFullYear()
    const m = String(cursor.getMonth() + 1).padStart(2, '0')
    const d = String(cursor.getDate()).padStart(2, '0')
    dates.push(`${y}-${m}-${d}`)
    cursor.setDate(cursor.getDate() + 1)
  }

  return dates
}

const overallProgress = computed(() => {
  if (habitsStore.habits.length === 0) return 0

  const dates = getAllDatesRange()
  let totalPossible = 0
  let totalCompleted = 0

  for (const dateStr of dates) {
    const activeHabits = habitsStore.habits.filter(h => {
      const created = new Date(h.createdAt)
      const date = new Date(dateStr)
      return created <= date
    })

    totalPossible += activeHabits.length
    totalCompleted += activeHabits.filter(h =>
      h.completedDates.includes(dateStr)
    ).length
  }

  return totalPossible > 0 ? Math.round(totalCompleted / totalPossible * 100) : 0
})

const recordHabit = computed<Habit | null>(() => {
  if (habitsStore.habits.length === 0) return null
  return habitsStore.habits.reduce((best, h) =>
    h.completedDates.length > best.completedDates.length ? h : best
  )
})

function longestStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  const sorted = [...new Set(dates)].sort()
  let maxStreak = 1
  let current = 1

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000)

    if (diff === 1) {
      current++
      if (current > maxStreak) maxStreak = current
    } else {
      current = 1
    }
  }

  return maxStreak
}

const bestStreakHabit = computed<{ habit: Habit; streak: number } | null>(() => {
  if (habitsStore.habits.length === 0) return null

  return habitsStore.habits
    .map(h => ({ habit: h, streak: longestStreak(h.completedDates) }))
    .reduce((best, curr) => curr.streak > best.streak ? curr : best)
})

const habitCompletions = computed(() => {
  const today = new Date()

  return habitsStore.habits.map(h => {
    const created = new Date(h.createdAt)
    const totalDays = Math.max(1, Math.round((today.getTime() - created.getTime()) / 86400000) + 1)
    const completed = h.completedDates.length
    const percentage = Math.round(completed / totalDays * 100)

    return {
      id: h.id,
      name: h.name,
      color: h.color,
      percentage: Math.min(100, percentage),
      days: completed
    }
  })
})
</script>

<template>
  <div class="statistic-page">
    <template v-if="habitsStore.isHabitsEmpty">
      <h1>Моя статистика</h1>
      <EmptyHabits/>
    </template>
    <template v-else>
      <div class="statistic-page__cards">
        <StatCard
            title="Мой прогресс"
            :value="overallProgress"
            icon="🔥"
            type="progress"

        />

        <StatCard
            title="Рекорд"
            :value="recordHabit?.name || '—'"
            type="stat-card"
            :description="`${recordHabit?.completedDates.length || 0} дней подряд`"/>

        <StatCard
            title="Лучший стрик"
            :value="bestStreakHabit?.habit?.name || '—'"
            type="streak"
            :description="`${bestStreakHabit?.streak || 0} дней подряд`"
        />
      </div>

      <div class="statistic-page__list">
        <div class="statistic-page__list-title">Завершение привычек</div>

        <div v-for="(item, index) in habitCompletions" :key="item.id" class="habit-stat">
          <span class="habit-stat__index">{{ index + 1 }}</span>
          <span class="habit-stat__dot" :style="{ background: item.color }" />
          <span class="habit-stat__name">{{ item.name }}</span>
          <div class="habit-stat__progress">
            <div class="habit-stat__progress-bar" :style="{ width: item.percentage + '%', background: item.color }"/>
          </div>
          <span class="habit-stat__percentage">{{ item.percentage }}%</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.statistic-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-width: 0;
  overflow-y: auto;

  :deep(.empty-habits__img) {
    width: 300px;
  }

  h1 {
    margin: 0 0 17px;
    align-self: flex-start;
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .stat-card--completed {
    background: #FCECEF;
  }

  .stat-card--progress {
    background: #fcf9ec;
  }

  .stat-card--streak {
    background: #e7f2f8;
  }

  &__list {
    background: #fffdf7;
    border: 1px solid #eadfce;
    border-radius: 18px;
    padding: 28px 32px;
    box-shadow: 0 6px 18px rgba(113, 92, 67, 0.06);

    &-title {
      font-size: 22px;
      font-weight: 700;
      color: #5a4a3a;
      margin-bottom: 20px;
    }
  }
}

.habit-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0e8da;

  &:last-child {
    border-bottom: none;
  }

  &__index {
    width: 24px;
    font-size: 16px;
    font-weight: 600;
    color: #8e7d6a;
    text-align: right;
  }

  &__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__name {
    width: 140px;
    font-size: 20px;
    color: #5a4a3a;
    flex-shrink: 0;
  }
  &__progress {
    flex: 1;
    height: 14px;
    background: #f0e8da;
    border-radius: 10px;
    overflow: hidden;
    min-width: 0;

    &-bar {
      height: 100%;
      border-radius: 10px;
      transition: width 0.6s ease;
    }
  }

  &__percentage {
    width: 48px;
    text-align: right;
    font-size: 18px;
    font-weight: 600;
    color: #5a4a3a;
  }
}

.stat-card--completed {
  background: #FFFBF7;
}

.stat-card--progress {
  background: #FFFBF7;
}

.stat-card--streak {
  background: #FFFBF7;
}

@media (max-width: 640px) {

  .statistic-page {
    padding: 0;

    &__cards {
      grid-template-columns: 1fr;
    }
  }
}
</style>
