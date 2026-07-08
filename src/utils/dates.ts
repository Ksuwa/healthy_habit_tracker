export function getMonthDays(year: number, month: number) {
    const days = []
    const date = new Date(year, month, 1)

    while (date.getMonth() === month) {
        days.push(formatDateKey(date))
        date.setDate(date.getDate() + 1)
    }

    return days
}

function formatDateKey(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}
