export function getMonthDays(year: number, month: number) {
    const days = []
    const date = new Date(year, month, 1)

    while (date.getMonth() === month) {
        days.push(new Date(date).toISOString().slice(0, 10))
        date.setDate(date.getDate() + 1)
    }

    return days
}

