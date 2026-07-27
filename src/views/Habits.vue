<script setup lang="ts">
import { useHabitsStore } from '@/stores/habits'
import HabitTable from '@/components/HabitTable.vue'
import BaseButton from '@/components/BaseButton.vue'
import EmptyHabits from "@/components/EmptyHabits.vue";
import { useModal } from '@/composables/useModal'

const { open } = useModal()
const habitsStore = useHabitsStore()

</script>

<template>
    <div class="habits-page">
      <EmptyHabits v-if="habitsStore.isHabitsEmpty"></EmptyHabits>
      <template v-else class="habit-page__wrap">
        <div class="habits-page__header">
          <h1>Мои привычки</h1>
          <BaseButton text="Добавить" icon="+" @click="open" />
        </div>
        <HabitTable />
      </template>
    </div>
</template>

<style scoped lang="scss">
.habits-page {
  flex: 1;
  display: flex;
  flex-direction: column;

  :deep(.empty-habits__img) {
    width: 300px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;

    .base-btn {
      padding: 8px 20px;
      font-size: 18px;
    }
  }
}
</style>
