<script setup lang="ts">
import { ref } from 'vue'
import { useHabitsStore } from '@/stores/habits'
import { useModal } from '@/composables/useModal'

const { isVisible, close } = useModal()
const habitsStore = useHabitsStore()
const newName = ref('')

function add() {
  if (!newName.value.trim()) return
  habitsStore.addHabit(newName.value)
  newName.value = ''
  close()
}

function cancel() {
  newName.value = ''
  close()
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isVisible" class="modal-overlay" @click.self="cancel">
      <div class="modal-card">
        <h3>Новая привычка</h3>
        <input
            class="modal-input"
            v-model="newName"
            placeholder="Название привычки"
            @keyup.enter="add"
            autofocus
        />
        <div class="modal-actions">
          <button class="modal-btn modal-btn--secondary" @click="cancel">Отмена</button>
          <button class="modal-btn modal-btn--primary" @click="add">Добавить</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-card {
  background: #fffdf7;
  border-radius: 20px;
  padding: 32px;
  width: 360px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);

  h3 {
    font-size: 25px;
    margin-bottom: 16px;
  }
}

.modal-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e6dccd;
  border-radius: 12px;
  font-size: 15px;
  background: transparent;
  outline: none;

  &:focus {
    border-color: #c4b5a0;
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.modal-btn {
  padding: 8px 24px;
  border-radius: 12px;
  font-size: 20px;
  cursor: pointer;
  border: none;

  &--secondary {
    background: transparent;
    color: #999;
  }

  &--primary {
    background: #e6dccd;
    color: #3a2a1a;

    &:hover {
      background: #d4c9b5;
    }
  }
}
</style>
