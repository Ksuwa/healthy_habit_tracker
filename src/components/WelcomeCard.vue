<script setup> </script>

<template>
  <div class="welcome-card">
    <img class="welcome-card__plant"
        src="@/assets/img/flower-purple.png"
        alt=""
    />

    <div class="welcome-card__note">
      <h2>Доброе утро! 🌸</h2>

      <p>
        Вот обзор ваших привычек
        на сегодня.
      </p>
    </div>
  </div>
</template>

<style>
.welcome-card {
  position: relative;
  height: 240px;

  &__plant {
    position: absolute;
    left: -20px;
    bottom: 0;
    width: 130px;
    z-index: 1;
  }

  &__note {
    position: relative;
    z-index: 2;
    margin-left: 70px;
    height: 220px;
    padding: 40px;
    background-image: url("@/assets/img/purple-note.png");
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>