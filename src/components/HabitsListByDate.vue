<script setup lang="ts">
import { useHabitsStore } from '@/stores/habits'

const habitsStore = useHabitsStore()
defineProps<{
  date: string
}>()

</script>

<template>
  <div class="check-list">
    <label
        v-for="habit in habitsStore.habits"
        :key="habit.id"
        class="check-row"
    >
      <span class="habit-calendar__dot" :style="{ background: habit.color }" />
      <span class="check-name">{{ habit.name }}</span>
      <span class="custom-checkbox">
        <input
            type="checkbox"
            :checked="habit.completedDates.includes(date)"
            @change="habitsStore.toggleDay(habit.id, date)"
        />
        <span class="checkmark"></span>
      </span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.check-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 330px;
  overflow-y: auto;
}

.check-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  font-size: 22px;
  color: #5a4a3a;
  border-bottom: 1px solid #e6dccd;
}

.check-name {
  flex: 1;
}

.custom-checkbox {
  position: relative;
  width: 22px;
  height: 22px;
  flex-shrink: 0;

  input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 1;
    margin: 0;

    &:checked + .checkmark {
      background: #c1debd;
      border-color: #67a95f;

      &::after {
        content: "✓";
        position: absolute;
        color: white;
        font-size: 16px;
        line-height: 1;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

.checkmark {
  display: block;
  width: 100%;
  height: 100%;
  border: 2px solid #9c9c9c;
  border-radius: 4px;
  background: white;
  position: relative;
  box-sizing: border-box;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>