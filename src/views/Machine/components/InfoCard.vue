<template>
  <div class="info-card">
    <span class="left">{{data.name}}</span>
    <div class="num">
      <span class="big">{{data.value}}</span>个
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    }
  }
};
</script>


<style lang="scss" scoped>
.info-card {
  @include flex(column, center, center);
  border-radius: 5px;
  border: 1px solid #cccccc;
  height: 70px;
  width: 180px;
  font-size: 14px;
  font-weight: normal;
}
.left {
    margin-left: 5px;
    margin-right: auto;
}
span {
  margin: 5px 0;
}
.big {
  font-weight: bold;
  font-size: 25px;
  color: #409eff;
  margin: 3px 5px;
}
</style>