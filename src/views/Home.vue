<script setup lang="ts">
const date = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long'})
const week = new Date().toLocaleDateString('ru-RU', { weekday: 'long' })
</script>

<template>
  <div class="home-content">
    <div class="home-left"></div>
    <aside class="home-note">
      <div class="note-card">
        <div class="note-text">
          <span class="note-label">сегодня:</span>
          <span class="note-date">{{ date }}, {{week}}</span>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.home-content {
    flex: 1;
    display: flex;
    gap: 40px;
    padding: 0 40px;
    min-width: 0;
    background: #f5f0e4;
  justify-content: flex-start
}

.home-left {
    flex: 1;
    min-width: 0;
}

.home-note {
    flex-shrink: 0;
}

.note-card {
    width: 199px;
    height: 125px;
    background: url('/src/assets/img/note-bg.png') center / cover no-repeat;
    padding: 36px 24px;
    display: flex;
    flex-direction: column;
}

.note-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  align-items: center;
}

.note-label {
    font-size: 29px;
    color: #5a4a3a;
}

.note-date {
    font-size: 24px;
    color: #3a2a1a;
    font-weight: 600;
}
</style>
