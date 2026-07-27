import type { Habit } from '@/types/habits'

export function getAllDatesRange(habits: Habit[]): string[] {
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

export function longestStreak(dates: string[]): number {
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
