<template>
  <div class="machine-statis-card" :style="`border-left: 6px solid ${color};`">
    <section v-for="(item, index) in data" :key="index">
      <span>{{ item.name }}</span>
      <em>{{ item.value }}</em>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    data: { type: Array },
    color: { type: String }
  }
};
</script>

<style lang="scss">
.machine-statis-card {
  @include flex(column, center, flex-start);
  border-radius: 5px;
  border: 1px solid #cccccc;
  height: 70px;
  width: 180px;
  section {
      margin: 5px 0;
  }
  span {
    margin-left: 10px;
  }
  em {
      color: #409EFF;
  }
}
</style>