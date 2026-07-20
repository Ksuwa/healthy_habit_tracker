import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/Home.vue'
import StatsView from '../views/Statistic.vue'
import CalenderView from '../views/Calendar.vue'
import HabitsView from '../views/Habits.vue'

export const routes = [
    {
        path: '/',
        name: 'Главная',
        icon: 'home',
        component: HomeView,
    },
    {
        path: '/habits',
        name: 'Привычки',
        icon: 'habits',
        component: HabitsView,
    },
    {
        path: '/calender',
        name: 'Календарь',
        icon: 'calendar',
        component: CalenderView,
    },
    {
        path: '/statistic',
        name: 'Статистика',
        icon: 'stats',
        component: StatsView,
    }
]

const router = createRouter({
    history: createWebHistory('/healthy_habit_tracker/'),
    routes,
})

export default router