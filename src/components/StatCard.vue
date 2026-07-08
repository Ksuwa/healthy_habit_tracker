<script setup lang="ts">
  interface Props {
  title: string;
  value: string | number;
  icon?: string;
  type?: string;
}

  defineProps<Props>();
</script>

<template>
  <div class="stat-card" :class="`stat-card--${type}`">
    <span
        v-if="icon"
        class="stat-card__icon"
    >
      {{ icon }}
    </span>

    <div class="stat-card__value">
      {{ value }}
    </div>

    <div class="stat-card__title">
      {{ title }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.stat-card--completed {
  background:
      linear-gradient(
              180deg,
              #FFF5F7 0%,
              #FCECEF 100%
      );
}

.stat-card--progress {
  background:
      linear-gradient(
              180deg,
              #FAF7FF 0%,
              #F2ECFC 100%
      );
}

.stat-card--streak {
  background:
      linear-gradient(
              180deg,
              #FFFDF7 0%,
              #F8F2E7 100%
      );
}
.stat-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border-radius: 24px;
  background: #fff8fb;
  box-shadow: 0 4px 10px rgb(0 0 0 / 5%);
}

.stat-card__icon {
  font-size: 24px;
}

.stat-card__value {
  font-size: 32px;
  font-weight: 700;
}

.stat-card__title {
  font-size: 14px;
  opacity: 0.7;
}
:root {
  --card-pink: #FCECEF;
  --card-purple: #F2ECFC;
  --card-cream: #F8F2E7;

  --card-shadow: rgba(0, 0, 0, 0.05);
}
.stat-card--completed {
  background: #FCECEF;
}
.stat-card--progress {
  background: #F2ECFC;
}
.stat-card--streak {
  background: #F8F2E7;
}
</style>