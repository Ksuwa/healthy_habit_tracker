<script setup lang="ts">
interface Props {
  text?: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  text: 'Добавить',
  icon: '+'
})

defineEmits<{
  click: []
}>()
</script>

<template>
  <button class="base-btn" @click="$emit('click')">
    {{ icon }} {{ text }}
  </button>
</template>

<style scoped lang="scss">
.base-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 8px 15px;
    font-size: 19px;
    line-height: 1.35;
    background: #eef8e8;
    color: #4b5a4f;
    border: 2px dashed #98b38f;
    border-radius: 18px;
    cursor: pointer;
    user-select: none;
  box-shadow:
      0 3px 10px rgba(0,0,0,.05),
      inset 0 1px 0 rgba(255,255,255,.8);
  transition:
      transform .2s ease,
      box-shadow .2s ease,
      background .2s ease;

  &:hover {
    background: #f3fbef;
    transform: translateY(-2px);
    box-shadow:
        0 8px 18px rgba(0,0,0,.08),
        inset 0 1px 0 rgba(255,255,255,.9);
  }
  &:active {
    transform: translateY(1px);
    box-shadow:
        0 3px 8px rgba(0,0,0,.06),
        inset 0 2px 4px rgba(0,0,0,.05);
  }
}
</style>
