import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Habit } from '@/types/habits'

export const useHabitsStore = defineStore('habits', () => {
    const habits = ref<Habit[]>([])

    const load = () => {
        const data = localStorage.getItem('habits')

        if (data) {
            habits.value = JSON.parse(data)
        }
    }

    watch(
        habits,
        (val) => {
            localStorage.setItem('habits', JSON.stringify(val))
        },
        { deep: true }
    )
    const addHabit = (name: string) => {
        habits.value.push({
            id: crypto.randomUUID(),
            name,
            color: randomColor(),
            createdAt: new Date().toISOString(),
            completedDates: []
        })
    }

    const toggleDay = (
        habitId: string,
        date: string
    ) => {
        const habit = habits.value.find(
            h => h.id === habitId
        )

        if (!habit) return

        const index =
            habit.completedDates.indexOf(date)

        if (index === -1)
            habit.completedDates.push(date)
        else
            habit.completedDates.splice(index, 1)
    }

    const getStreak = (habit: Habit) => {
        let streak = 0
        const current = new Date()

        while (true) {
            const date = current.toISOString().split('T')[0]

            if (habit.completedDates.includes(date)) {
                streak++
                current.setDate(current.getDate() - 1)
            } else {
                break
            }
        }

        return streak
    }

    return {
        habits,
        load,
        addHabit,
        toggleDay,
        getStreak
    }
})

function randomColor() {
    const colors = [
        '#ffb6c1',
        '#b5e48c',
        '#cdb4db',
        '#a2d2ff',
        '#ffd166'
    ]

    return colors[
        Math.floor(Math.random() * colors.length)
        ]
}