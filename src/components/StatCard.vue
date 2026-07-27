<script setup lang="ts">
  interface Props {
  title: string;
  value: string | number;
  type?: string;
  description?: string | number;
}

  defineProps<Props>();
</script>

<template>
  <div v-if="type === 'progress'" class="stat-card" :class="`stat-card--${type}`">
    <div class="progress-ring">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle
            cx="70" cy="70" r="58"
            fill="none"
            stroke="#eadfce"
            stroke-width="10"
        />
        <circle
            cx="70" cy="70" r="58"
            fill="none"
            stroke="#ff58af"
            stroke-width="10"
            stroke-linecap="round"
            :stroke-dasharray="`${value * 3.644} 364.4`"
            transform="rotate(-90 70 70)"
            style="transition: stroke-dasharray 0.6s ease"
        />
      </svg>
      <span class="progress-text">{{ value }}%</span>
    </div>
    <div class="card-title">{{ title }}</div>
  </div>

  <div v-else class="stat-card" :class="`stat-card--${type}`">
    <slot name="icon" />

    <div class="stat-card__value">
      {{ value }}
    </div>

    <div class="stat-card__title">
      {{ title }}
    </div>

    <div v-if="description" class="stat-card__description">
      {{ description }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stat-card {
  display: flex;
  position: relative;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border-radius: 22px 18px 20px 16px;
  border: 1px solid #eadfce;
  box-shadow:
      0 3px 10px rgba(90, 70, 40, .08),
      inset 0 1px rgba(255,255,255,.6);
  align-items: center;
  text-align: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
  color: #5a4a3a;

  &:hover {
    transform: translateY(-6px);
    box-shadow:
        0 8px 20px rgba(90, 70, 40, .15),
        inset 0 1px rgba(255,255,255,.6);
  }
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: .3;
    background:
        radial-gradient(circle at 20% 30%, rgba(255,255,255,.8) 2px, transparent 4px),
        radial-gradient(circle at 70% 80%, rgba(255,255,255,.6) 2px, transparent 4px);

    pointer-events: none;
  }

  &__description {
    font-size: 32px;
  }
}

.stat-card__icon {
  font-size: 24px;
}

.stat-card__value {
  font-size: 38px;
  font-weight: 700;
}

.stat-card__title {
  font-size: 18px;
  margin-bottom: 20px;
}
.card-title {
  font-size: 19px;
  margin-bottom: 20px;
}

.progress-ring {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-text {
  position: absolute;
  font-size: 38px;
  font-weight: 700;
}

</style>