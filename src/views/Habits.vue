<script setup lang="ts">
import { ref } from 'vue'
import { useHabitsStore } from '@/stores/habits'
import HabitTable from '@/components/HabitTable.vue'

const habitsStore = useHabitsStore()
const showModal = ref(false)
const newName = ref('')

function openModal() {
    newName.value = ''
    showModal.value = true
}

function add() {
    if (!newName.value.trim()) return
    habitsStore.addHabit(newName.value)
    showModal.value = false
}

function cancel() {
    showModal.value = false
}
</script>

<template>
    <div class="habits-container">
        <div class="habits-header">
            <h2>мои привычки</h2>
            <button @click="openModal">+ Добавить</button>
        </div>
        <HabitTable />

        <Teleport to="body">
            <div v-if="showModal" class="modal-overlay" @click.self="cancel">
                <div class="modal-card">
                    <h3>Новая привычка</h3>
                    <input
                        v-model="newName"
                        placeholder="Название привычки"
                        @keyup.enter="add"
                        autofocus
                    />
                    <div class="modal-actions">
                        <button class="btn-cancel" @click="cancel">Отмена</button>
                        <button class="btn-add" @click="add">Добавить</button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped lang="scss">
.habits-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f5f0e4;
}

.habits-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

  h2 {
    font-size: 28px;
  }

  button {
    background: transparent;
    border: 2px dashed #e6dccd;
    border-radius: 12px;
    padding: 8px 20px;
    font-family: 'Caveat', cursive;
    font-size: 22px;
    cursor: pointer;
    color: #5a4a3a;
    transition: 0.2s;
  }

  button:hover {
    background: #e6dccd;
  }
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.3);
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
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    font-family: 'Caveat', cursive;

    h3 {
      font-size: 28px;
      margin-bottom: 16px;
    }

    input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e6dccd;
      border-radius: 12px;
      font-size: 22px;
      font-family: 'Caveat', cursive;
      background: transparent;
      outline: none;
    }

    input:focus {
      border-color: #c4b5a0;
    }
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;

  button {
    padding: 8px 24px;
    border-radius: 12px;
    font-family: 'Caveat', cursive;
    font-size: 22px;
    cursor: pointer;
    border: none;
  }
}

.btn-cancel {
    background: transparent;
    color: #999;
}

.btn-add {
    background: #e6dccd;
    color: #3a2a1a;
}

.btn-add:hover {
    background: #d4c9b5;
}
</style>
