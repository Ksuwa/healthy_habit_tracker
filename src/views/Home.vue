<script setup lang="ts">
  import StatCard from "@/components/StatCard.vue";
  import WelcomeCard from "@/components/WelcomeCard.vue";
  import HabitsListByDate from "@/components/HabitsListByDate.vue";

  const date = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long'})
  const week = new Date().toLocaleDateString('ru-RU', { weekday: 'long' })
  const today = new Date().toISOString().slice(0, 10)
</script>

<template>
  <div class="home-content">
    <div class="home-left">
      <img class="potted-plant-img" src="/src/assets/img/potted-plant.png" alt="plant">
      <div class="habits-today-card">
       <img class="flower-img" src="/src/assets/img/flower.png" alt="flower">
        <h2 class="title">Today's habits</h2>
        <HabitsListByDate :date="today"></HabitsListByDate>
      </div>
    </div>

    <aside class="home-right dashboard">
      <div class="note-card">
        <div class="note-text">
          <span class="note-label">сегодня:</span>
          <span class="note-date">{{ date }}, {{week}}</span>
        </div>
      </div>
      <WelcomeCard />

      <div class="stats-grid">
        <StatCard
            title="Выполнено"
            value="3/12"
            icon="📈"
            type="completed"
        />

        <StatCard
            title="Прогресс"
            value="25%"
            icon="🔥"
            type="progress"

        />

        <StatCard
            title="Серия"
            value="7 дней"
            icon="✅"
            type="streak"
        />
      </div>

      <div class="motivation-card">
        🌷 Маленькие шаги каждый день
        приводят к большим результатам.
      </div>
    </aside>
  </div>
</template>

<style scoped lang="scss">
.motivation-card {
  padding: 24px;
  border-radius: 24px;
  background: #fff9fb;
  font-size: 18px;
  line-height: 1.5;
  font-family:  'Nunito', sans-serif;
}

.home-content {
    flex: 1;
    display: flex;
    gap: 40px;
    padding: 0 40px;
    background: #f5f0e4;
    justify-content: flex-start
}

.home-left {
  flex: 1;
  position: relative;

  h2 {
    text-align: center;
  }
}

.potted-plant-img {
  position: absolute;
  left: -52px;
  bottom: 0;
  width: 134px;
  z-index: 0;
  pointer-events: none;
}


.home-right, .home-left {
    flex-shrink: 0;
}

.note-card {
    width: 233px;
    height: 146px;
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

.habits-today-card {
  padding: 85px 100px;
  position: relative;
  z-index: 1;
  height: 543px;
  width: 483px;
  background: url('/src/assets/img/note-today.png') center / contain no-repeat;
}

.tape-img {
  position: absolute;
  top: -18px;

  img{
    width: 160px;
  }
}

.flower-img{
  position: absolute;
  right: 107px;
  top: 52px;
  height: 104px;
}

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
