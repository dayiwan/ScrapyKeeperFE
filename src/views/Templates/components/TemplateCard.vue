<template>
  <div class="template-card">
    <h4>{{ name }}</h4>
    <img :src="imgSrc">
  </div>
</template>

<script>
export default {
  props: {
    name: { type: String },
    imgSrc: { type: String }
  }
}
</script>

<style lang="scss">
.template-card {
  @include flex(column);
  @include shadow-card();
  
  width: 200px;
  height: 200px;
  padding: 5px;
  cursor: pointer;
  position: relative;

  h4 {
    margin-top: 0;
  }

  img {
    width: 100px;
    height: 100px;
  }

  &::before {
    content: '';
    position: absolute;
    border-left: 4px solid #1389b4;
    border-top: 4px solid #1389b4;
    border-bottom: 4px solid #1389b4;
    width: 15%;
    height: 100%;
    top: 0;
    left: -15%;
    transition: 0.3s;
    opacity: 0;
  }

  &::after {
    content: '';
    position: absolute;
    border-right: 4px solid #1389b4;
    border-bottom: 4px solid #1389b4;
    border-top: 4px solid #1389b4;
    width: 15%;
    height: 100%;
    top: 0;
    right: -15%;
    transition: 0.3s;
    opacity: 0;
  }

  &:hover {
    &::before {
      left: 0%;
      opacity: 1;
    }
    &::after {
      right: 0;
      opacity: 2;
    }
  }
}
</style>