import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Habit } from '@/types/habits'

export const useHabitsStore = defineStore('habits', () => {
    const habits = ref<Habit[]>([])

    const load = () => {
        const data = localStorage.getItem('habits')

        if (data) {
            habits.value = JSON.parse(data)
            normalizeHabitColors()
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
            color: nextHabitColor(),
            createdAt: new Date().toISOString(),
            completedDates: []
        })
    }

    const removeHabit = (id: string) => {
        habits.value = habits.value.filter(h => h.id !== id)
    }

    const toggleDay = (
        habitId: string,
        date: string
    ) => {
        if (!date) return
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

    function nextHabitColor() {
        const usedColors = new Set(
            habits.value
                .map(habit => habit.color)
                .filter(Boolean)
        )

        return firstUnusedColor(usedColors)
    }

    function normalizeHabitColors() {
        const usedColors = new Set<string>()

        habits.value = habits.value.map((habit) => {
            if (habit.color && !usedColors.has(habit.color)) {
                usedColors.add(habit.color)
                return habit
            }

            const color = firstUnusedColor(usedColors)
            usedColors.add(color)

            return {
                ...habit,
                color
            }
        })
    }

    return {
        habits,
        load,
        addHabit,
        removeHabit,
        toggleDay
    }
})

const habitColors = [
    '#ff8fab',
    '#80b918',
    '#4dabf7',
    '#b197fc',
    '#f59f00',
    '#20c997',
    '#ff6b6b',
    '#74c0fc',
    '#cc5de8',
    '#51cf66',
    '#ffa94d',
    '#66d9e8',
    '#f06595',
    '#94d82d',
    '#748ffc',
    '#ffd43b'
]

function firstUnusedColor(usedColors: Set<string>) {
    const color = habitColors.find(color => !usedColors.has(color))

    if (color) {
        return color
    }

    let index = 0
    let generated = ''

    do {
        const hue = (index * 137) % 360
        generated = hslToHex(hue, 68, 62)
        index++
    } while (usedColors.has(generated))

    return generated
}

function hslToHex(hue: number, saturation: number, lightness: number) {
    const s = saturation / 100
    const l = lightness / 100
    const chroma = (1 - Math.abs(2 * l - 1)) * s
    const x = chroma * (1 - Math.abs((hue / 60) % 2 - 1))
    const match = l - chroma / 2
    const [red, green, blue] = hue < 60
        ? [chroma, x, 0]
        : hue < 120
            ? [x, chroma, 0]
            : hue < 180
                ? [0, chroma, x]
                : hue < 240
                    ? [0, x, chroma]
                    : hue < 300
                        ? [x, 0, chroma]
                        : [chroma, 0, x]

    return `#${[red, green, blue]
        .map(channel => Math.round((channel + match) * 255).toString(16).padStart(2, '0'))
        .join('')}`
}
