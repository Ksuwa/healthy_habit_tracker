import { computed } from 'vue'
import { useHabitsStore } from '@/stores/habits'
import { getAllDatesRange, longestStreak } from '@/utils/statistics'
import type { Habit } from '@/types/habits'

export function useStatistics() {
  const habitsStore = useHabitsStore()

  const overallProgress = computed(() => {
    if (habitsStore.habits.length === 0) return 0

    const dates = getAllDatesRange(habitsStore.habits)
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

  return { overallProgress, recordHabit, bestStreakHabit, habitCompletions }
}
