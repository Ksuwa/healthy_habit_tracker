import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    base: '/healthy_habit_tracker/',

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    }
})