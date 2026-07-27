<script setup lang="ts">
  import BaseButton from "@/components/BaseButton.vue";
  import { useModal } from "@/composables/useModal";

  defineProps<{
    title?: string
    description?: string
    buttonText?: string
  }>()

  defineEmits<{
    (e: 'create'): void
  }>()

  const { open } = useModal()

  const emptyHabitsContent = {
    title: 'Твой путь к лучшей жизни начинается здесь',
    description: 'Пока у тебя нет привычек.</br> Добавь первую привычку и начни свой путь к маленьким победам!',
    buttonText: 'Создать первую привычку',
  }

</script>
<template>
  <div class="empty-habits">
    <h2 class="empty-habits__title">{{ title || emptyHabitsContent.title }}</h2>
    <img class="empty-habits__img"
         src="@/assets/img/empty-note.webp"
         alt="Notebook"
    />
    <p class="empty-habits__description" v-html="description || emptyHabitsContent.description"></p>
    <BaseButton :text="buttonText || emptyHabitsContent.buttonText" @click="open"></BaseButton>
  </div>
</template>
<style lang="scss">
.empty-habits {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__description {
    margin-bottom: 30px;
  }
}
</style>