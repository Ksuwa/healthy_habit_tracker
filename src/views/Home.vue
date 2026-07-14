<script setup lang="ts">
  import StatCard from "@/components/StatCard.vue";
  import HabitsListByDate from "@/components/HabitsListByDate.vue";
  import { onMounted, computed, ref } from 'vue'
  import { useHabitsStore } from '@/stores/habits'
  import { useHomeAnimation } from '@/composables/useHomeAnimation'

  const date = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long'})
  const week = new Date().toLocaleDateString('ru-RU', { weekday: 'long' })
  const today = new Date().toISOString().slice(0, 10)

  const habitsStore = useHabitsStore()

  // for GSAP-animation
  const habitsCard = ref<HTMLElement | null>(null)
  const noteCard = ref<HTMLElement | null>(null)
  const statsGrid = ref<HTMLElement | null>(null)
  const motivationCard = ref<HTMLElement | null>(null)
  const cup = ref<HTMLElement | null>(null)
  const plant = ref<HTMLElement | null>(null)

  const { play } = useHomeAnimation({
    habitsCard,
    noteCard,
    statsGrid,
    motivationCard,
    cup,
    plant
  })

  onMounted(() => {
    habitsStore.load()
    play()
  })

  const todayHabitsLength = computed(() => {
    let todayHabits = habitsStore.habits.filter( h => h.completedDates.includes(today) )
    return todayHabits.length
  })

  const todayProgress = computed(() => {
    if (habitsStore.habits.length === 0) return 0
    return Math.round(todayHabitsLength.value / habitsStore.habits.length * 100)
  })

  const currentStreak = computed(() => {
    let streak = 0
    const date = new Date()

    while (true) {
      const key = date.toISOString().slice(0, 10)
      const hasCompletion = habitsStore.habits.some(h => h.completedDates.includes(key))
      if (!hasCompletion) break
      streak++
      date.setDate(date.getDate() - 1)
    }

    return streak
  })
</script>

<template>
  <div class="home-content">
    <div class="home-left">
      <img ref="plant" class="potted-plant-img" src="/src/assets/img/potted-plant.png" alt="plant">
      <div ref="habitsCard" class="habits-today-card">
       <img class="flower-img" src="/src/assets/img/flower.png" alt="flower">
        <h2 class="title">Today's habits</h2>
        <HabitsListByDate :date="today"></HabitsListByDate>
      </div>
    </div>

    <aside class="home-right dashboard">
      <div ref="noteCard" class="note-card">
        <div class="note-text">
          <span class="note-date">{{ date }}, {{week}}</span>
          <h1> Доброе утро!</h1>
          <p class="note-description"> Сегодня отличный день, чтобы продолжить серию!</p>
        </div>
      </div>

      <div ref="statsGrid" class="stats-grid">
        <StatCard
            title="привычек выполнено сегодня"
            :value="`${todayHabitsLength}/${habitsStore.habits.length}`"
            type="completed">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#80b918" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
          </template>
        </StatCard>

        <StatCard
            title="Дневной прогресс"
            :value="todayProgress"
            type="progress">
        </StatCard>

        <StatCard
            title="дней подряд"
            :value="currentStreak"
            type="streak">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#f5c31e" viewBox="0 0 256 256"><path d="M143.38,17.85a8,8,0,0,0-12.63,3.41l-22,60.41L84.59,58.26a8,8,0,0,0-11.93.89C51,87.53,40,116.08,40,144a88,88,0,0,0,176,0C216,84.55,165.21,36,143.38,17.85Zm40.51,135.49a57.6,57.6,0,0,1-46.56,46.55A7.65,7.65,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68Z"></path></svg>
        </template>
        </StatCard>
      </div>

      <div class="bottom-row">
        <div ref="motivationCard" class="motivation-card">
          <img class="flower-left" src="/src/assets/img/yellow-flower.png" alt="" />
          <img class="heart-bottom" src="/src/assets/img/heart.png" alt="" />
           Маленькие шаги каждый день приводят к большим результатам
        </div>
        <img ref="cup" class="cup-img" src="/src/assets/img/cup.png" alt="cup" />
      </div>
    </aside>
  </div>
</template>

<style scoped lang="scss">

.motivation-card {
  position: relative;
  padding: 28px 31px 28px 60px;
  background:
      radial-gradient(circle at top left,
          rgba(255,255,255,.6),
          transparent 45%),
      #fffaf2;
  background-size: 8px 8px;
  border-radius: 8px 4px 7px 3px;
  transform: rotate(-1.4deg);
  box-shadow:
      0 3px 12px rgba(90,60,20,.12),
      inset 0 0 30px rgba(181,145,90,.08);
  border: 1px solid rgba(180,150,110,.15);
  font-size: 18px;
  font-family: 'Nunito', sans-serif;
  color: #5a4a3a;

  &:hover {
    animation: swing 0.6s ease-in-out infinite alternate;
    box-shadow:
        0 8px 20px rgba(90, 70, 40, .15),
        inset 0 1px rgba(255,255,255,.6);
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
        radial-gradient(circle, rgba(120,90,50,.025) 1px, transparent 1px);
    background-size: 8px 8px;
    opacity: .6;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow:
        inset 0 0 40px rgba(170,120,60,.08);
    pointer-events: none;
    top: -18px;
    left: 50%;
    transform: translateX(-50%) rotate(-7deg);
    width: 59px;
    height: 41px;
    background:url("/src/assets/img/tape.png") center/contain no-repeat;
  }
}

@keyframes swing {
  0% {
    transform: rotate(-2.5deg);
  }
  100% {
    transform: rotate(0.5deg);
  }
}

.flower-left {
  position: absolute;
  left: 16px;
  top: 24px;
  height: 62%;
  width: auto;
  pointer-events: none;
  z-index: 0;
  opacity: 0.7;
}

.heart-bottom {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 28px;
  pointer-events: none;
  z-index: 0;
}

.home-content {
    flex: 1;
    display: flex;
    padding-top: 40px;
    gap: 30px;
    background: #f5f0e4;
}

.home-left,
.home-right {
  flex: 1;
  min-width: 0;
  position: relative;
}

.home-left h2 {
  text-align: center;
}

.potted-plant-img {
  position: absolute;
  left: -29px;
  bottom: 0;
  width: 134px;
  z-index: 0;
  pointer-events: none;
}

.note-card {
  transform-origin: top center; //new
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  padding: 50px;
  border-radius: 9px;
  box-shadow:
      0 3px 10px rgba(90, 70, 40, .08),
      inset 0 1px rgba(255,255,255,.6);
  background:
      radial-gradient(circle at 30% 20%, rgba(255,255,255,.7) 2px, transparent 4px),
      radial-gradient(circle at 70% 80%, rgba(255,255,255,.5) 2px, transparent 4px),
      linear-gradient(
              180deg,
              #f4ebff,
              #efe5fd
      );

  border: 1px solid rgba(80,60,80,.08);
  transform: rotate(-1deg);

  &::before {
    content: "";
    position: absolute;
    top: 25px;
    left: 40px;
    width: 60px;
    height: 60px;
    background: url("/src/assets/img/stars.png") center/contain no-repeat;
    z-index: 1;
    pointer-events: none;
  }

  &::after{
    content:"";
    position:absolute;
    top:-18px;
    left:50%;
    transform:translateX(-50%) rotate(7deg);
    width:95px;
    height:34px;
    background:url("/src/assets/img/tape-purple.png") center/contain no-repeat;

  }

  &:hover {
    transform: translateY(-6px);
    box-shadow:
        0 8px 20px rgba(90, 70, 40, .15),
        inset 0 1px rgba(255,255,255,.6);
  }
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
    font-size: 18px;
    color: #807e7c;
    font-weight: 600;
    align-self: flex-end;
    padding-bottom: 20px;
}

.note-description {
  font-size: 25px;
}

.habits-today-card {
  padding: 60px 79px;
  position: relative;
  z-index: 1;
  height: 673px;
  max-width: 492px;
  width: 100%;
  margin-left: auto;
  background: url('/src/assets/img/note-today.png') center / contain no-repeat;
  box-sizing: border-box;

  transform-origin: top center; //new

  &::after{
    content:"";
    position:absolute;
    top:-9px;
    left:50%;
    transform:translateX(-50%) rotate(-7deg);
    width:95px;
    height:34px;
    background:url("/src/assets/img/tape.png") center/contain no-repeat;

  }
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
  top: 14px;
  height: 104px;
}

.stats-grid {
  display: flex;
  //grid-template-columns: repeat(3, 1fr);
  gap: 37px;
  align-items:flex-start;

  .stat-card:nth-child(1){
    transform:rotate(-2deg);
  }

  .stat-card:nth-child(2){
    margin-top:18px;
    transform:rotate(.8deg);
  }

  .stat-card:nth-child(3){
    transform:rotate(-1deg);
  }
}

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;
}

.bottom-row {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
}

.cup-img {
  width: 130px;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .home-content {
    flex-direction: column;
    padding: 0 20px;
    align-items: center;
  }

  .home-left,
  .home-right {
    max-width: 100%;
    width: 100%;
  }

  .habits-today-card {
    margin-right: auto;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .stats-grid .stat-card {
    flex: 1;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    flex-direction: column;
  }

  .habits-today-card {
    padding: 50px 105px;
    height: auto;
  }

  .note-card {
    height: 100%;
    min-height: 257px;
    padding: 70px 0 0;
  }

  .flower-img {
    display: none;
  }
}
</style>
