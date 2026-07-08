<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useHabitsStore } from '@/stores/habits'
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
  <div class="stat-page">
    <div class="stat-cards">
      <div class="stat-card">
        <h3 class="card-title">Мой прогресс</h3>
        <div class="progress-ring">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle
              cx="70" cy="70" r="58"
              fill="none"
              stroke="#eadfce"
              stroke-width="10"
            />
            <circle
              cx="70" cy="70" r="58"
              fill="none"
              stroke="#80b918"
              stroke-width="10"
              stroke-linecap="round"
              :stroke-dasharray="`${overallProgress * 3.644} 364.4`"
              transform="rotate(-90 70 70)"
              style="transition: stroke-dasharray 0.6s ease"
            />
          </svg>
          <span class="progress-text">{{ overallProgress }}%</span>
        </div>
      </div>

      <div class="stat-card">
        <h3 class="card-title">Рекорд</h3>
        <p class="card-habit-name">{{ recordHabit?.name || '—' }}</p>
        <p class="card-value">
          <span class="value-num">{{ recordHabit?.completedDates.length || 0 }}</span> дней
        </p>
      </div>

      <div class="stat-card">
        <h3 class="card-title">Лучший стрик</h3>
        <p class="card-habit-name">{{ bestStreakHabit?.habit?.name || '—' }}</p>
        <p class="card-value">
          <span class="value-num">{{ bestStreakHabit?.streak || 0 }}</span> дней подряд
        </p>
      </div>
    </div>

    <div class="stat-habits">
      <div class="habits-list-title">Завершение привычек</div>

      <div v-for="(item, index) in habitCompletions" :key="item.id" class="habit-stat-row">
        <span class="stat-index">{{ index + 1 }}</span>
        <span class="stat-dot" :style="{ background: item.color }" />
        <span class="stat-name">{{ item.name }}</span>
        <div class="stat-bar-track">
          <div class="stat-bar-fill" :style="{ width: item.percentage + '%', background: item.color }"/>
        </div>
        <span class="stat-pct">{{ item.percentage }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stat-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 40px;
  background: #f5f0e4;
  min-width: 0;
  overflow-y: auto;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.stat-card {
  background: #fffdf7;
  border: 1px solid #eadfce;
  border-radius: 18px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 6px 18px rgba(113, 92, 67, 0.06);
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #5a4a3a;
  margin-bottom: 20px;
}

.progress-ring {
  position: relative;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-text {
  position: absolute;
  font-size: 28px;
  font-weight: 700;
  color: #5a4a3a;
}

.card-habit-name {
  font-size: 24px;
  font-weight: 600;
  color: #3a2a1a;
  margin-bottom: 8px;
}

.card-value {
  font-size: 18px;
  color: #8e7d6a;
}

.value-num {
  font-size: 32px;
  font-weight: 700;
  color: #5a4a3a;
}

.stat-habits {
  background: #fffdf7;
  border: 1px solid #eadfce;
  border-radius: 18px;
  padding: 28px 32px;
  box-shadow: 0 6px 18px rgba(113, 92, 67, 0.06);
}

.habits-list-title {
  font-size: 22px;
  font-weight: 700;
  color: #5a4a3a;
  margin-bottom: 20px;
}

.habit-stat-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0e8da;
}

.habit-stat-row:last-child {
  border-bottom: none;
}

.stat-index {
  width: 24px;
  font-size: 16px;
  font-weight: 600;
  color: #8e7d6a;
  text-align: right;
}

.stat-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.stat-name {
  width: 140px;
  font-size: 20px;
  color: #5a4a3a;
  flex-shrink: 0;
}

.stat-bar-track {
  flex: 1;
  height: 14px;
  background: #f0e8da;
  border-radius: 10px;
  overflow: hidden;
  min-width: 0;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s ease;
}

.stat-pct {
  width: 48px;
  text-align: right;
  font-size: 18px;
  font-weight: 600;
  color: #5a4a3a;
}
</style>
