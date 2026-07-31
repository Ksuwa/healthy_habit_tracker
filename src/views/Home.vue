<script setup lang="ts">
  import StatCard from "@/components/StatCard.vue";
  import HabitsListByDate from "@/components/HabitsListByDate.vue";
  import { onMounted, computed, ref } from 'vue'
  import { useHabitsStore } from '@/stores/habits'
  import { useHomeAnimation } from '@/composables/useHomeAnimation'
  import EmptyHabits from "@/components/EmptyHabits.vue";

  const formattedDate = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long'})
  const formattedWeekday = new Date().toLocaleDateString('ru-RU', { weekday: 'long' })
  const today = new Date().toISOString().slice(0, 10)

  const habitsStore = useHabitsStore()

  //------ for GSAP-animation------
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
  //----------------------------------

  const todayCompletedHabits = computed(() => {
    let todayHabits = habitsStore.habits.filter( h => h.completedDates.includes(today) )
    return todayHabits.length
  })

  const todayProgress = computed(() => {
    if (habitsStore.habits.length === 0) return 0
    return Math.round(todayCompletedHabits.value / habitsStore.habits.length * 100)
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
  <div class="habit-dashboard">
    <div class="habit-dashboard__habits">
      <img ref="plant" class="habit-dashboard__plant-decoration" src="/src/assets/img/potted-plant.webp" alt="plant">
      <div ref="habitsCard" class="habit-dashboard__habits-card">
        <EmptyHabits v-if="habitsStore.isHabitsEmpty"></EmptyHabits>
        <HabitsListByDate v-else :date="today" title="Привычки на сегодня"></HabitsListByDate>
      </div>
    </div>

    <aside class="habit-dashboard__overview">
      <div ref="noteCard" class="habit-dashboard__welcome-card">
        <div class="habit-dashboard__welcome-content">
          <span class="habit-dashboard__date">{{ formattedDate }}, {{ formattedWeekday }}</span>
          <h2> Доброе утро!</h2>
          <p class="habit-dashboard__subtitle"> Сегодня отличный день, чтобы продолжить серию!</p>
        </div>
      </div>

      <div ref="statsGrid" class="habit-dashboard__stats">
        <StatCard
            title="привычек выполнено сегодня"
            :value="`${todayCompletedHabits}/${habitsStore.habits.length}`"
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

      <div class="habit-dashboard__motivation">
        <div ref="motivationCard" class="habit-dashboard__quote-card">
          <img class="habit-dashboard__quote-flower" src="/src/assets/img/yellow-flower.png" alt="" />
          <img class="habit-dashboard__quote-heart" src="/src/assets/img/heart.png" alt="" />
           Маленькие шаги каждый день приводят к большим результатам
        </div>
        <img ref="cup" class="habit-dashboard__cup-decoration" src="/src/assets/img/cup.webp" alt="cup" />
      </div>
    </aside>
  </div>
</template>

<style scoped lang="scss">

.habit-dashboard__quote-card {
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
  font-size: 21px;
  font-family: 'Caveat', cursive;
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

.habit-dashboard {
    flex: 1;
    display: flex;
    padding-top: 40px;
    gap: 30px;

  :deep(.empty-habits__img) {
    display: block;
    width: 100%;
    max-width: 260px;
    height: auto;
    margin: 21px auto;
    object-fit: contain;
  }

  .stat-card--completed,
  .stat-card--progress,
  .stat-card--streak {
    background: #FFFBF7;
  }

  h1 {
    display: block;
    margin-bottom: 40px;

    &:after {
      content:"";
      position:absolute;
      top:40px;
      right: 28px;
      transform:translateX(-50%) rotate(-7deg);
      width:55px;
      height:90px;
      background:url("/src/assets/img/flower.png") center/contain no-repeat;
    }
  }

    &__quote-flower {
      position: absolute;
      left: 16px;
      top: 24px;
      height: 62%;
      width: auto;
      pointer-events: none;
      z-index: 0;
      opacity: 0.7;
    }

    &__quote-heart {
      position: absolute;
      right: 10px;
      bottom: 10px;
      width: 28px;
      pointer-events: none;
      z-index: 0;
    }

    &__habits h2 {
      text-align: center;
    }
}

.habit-dashboard__habits,
.habit-dashboard__overview {
  flex: 1;
  min-width: 0;
  position: relative;
}

.habit-dashboard__plant-decoration {
  position: absolute;
  left: -29px;
  bottom: 0;
  width: 134px;
  z-index: 2;
  pointer-events: none;
}

.habit-dashboard__welcome-card {
  transform-origin: top center;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  padding: 40px;
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
    cursor: pointer;
    box-shadow:
        0 8px 20px rgba(90, 70, 40, .15),
        inset 0 1px rgba(255,255,255,.6);
  }
}

.habit-dashboard__welcome-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
}

.habit-dashboard__date {
    font-size: 17px;
    color: #807e7c;
    font-weight: 600;
    align-self: flex-end;
    padding-bottom: 20px;
}

.habit-dashboard__subtitle {
  font-size: 20px;
}

.habit-dashboard__habits-card {
  min-width: 250px;
  padding: 72px 79px;
  position: relative;
  z-index: 1;
  height: 646px;
  max-width: 492px;
  width: 100%;
  margin-left: auto;
  background: url('/src/assets/img/note-today.webp') center / contain no-repeat;
  box-sizing: border-box;
  transform-origin: top center;

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

.habit-dashboard__flower-decoration{
  position: absolute;
  right: 148px;
  top: 25px;
  height: 104px;
}

.habit-dashboard__stats {
  display: flex;
  gap: 37px;
  align-items:flex-start;
  margin-bottom: 30px;

  .stat-card:nth-child(1){
    transform:rotate(-2deg);
  }

  .stat-card:nth-child(2){
    transform:rotate(.8deg);
  }

  .stat-card:nth-child(3){
    transform:rotate(-1deg);
  }
}

.habit-dashboard__overview {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;
}

.habit-dashboard__motivation {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;

  &:hover {
    cursor: pointer;
  }
}

.habit-dashboard__cup-decoration {
  width: 130px;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .habit-dashboard {
    flex-direction: column;
    align-items: center;
  }

  .habit-dashboard__habits,
  .habit-dashboard__overview {
    max-width: 100%;
    width: 100%;
  }

  .habit-dashboard__habits-card {
    margin-right: auto;

    &::after {
      width: 73px;
    }
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .habit-dashboard__stats .stat-card {
    flex: 1;
  }
}

@media (max-width: 640px) {
  .habit-dashboard {
    &__stats {
      flex-direction: column;
      width: 100%;
    }

    &__habits-card {
      height: auto;
      background-size: cover;

      &::after {
        width: 60px;
        height: 22px;
        top: -6px;
      }

      &:has(.empty-habits) {
        padding: 32px 20px;
      }
    }

    &__welcome-card {
      height: 100%;
      min-height: 257px;
      padding: 70px 20px 20px;
    }

    &__flower-decoration {
      display: none;
    }

    &__motivation {
      flex-direction: column;
      align-items: center;
    }

    &__plant-decoration {
      width: 100px;
    }

    .empty-habits {
      :deep(.empty-habits__title) {
        font-size: 20px;
      }

      :deep(.empty-habits__img) {
        max-width: 160px;
      }

      :deep(.empty-habits__description) {
        padding: 0 37px;
      }

      :deep(.base-btn) {
        padding: 8px 16px;
      }
    }
  }

  @media (max-width: 450px) {
    .habit-dashboard__plant-decoration {
      width: 75px;
    }
  }
}
</style>
