<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <router-view class="app-main-container"></router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
}
</script>

<style lang="scss">
.app-main {
    padding: 10px;

    .app-main-container {
      padding: 20px;
      background-color: white;
    }
  }
</style>
