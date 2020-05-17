<template>
  <div class="machine-detail">
    <div class="node_info">服务器名称：{{ detailForm.node_name }}</div>
    <div class="detail">
      <div class="name">节点任务概览
        <div class="content">
          <InfoCard v-for="(item, index) in detailForm.info" :key="index" :data="item" />
        </div>
      </div>
    </div>
    <div class="detail">
      <div class="name">资源使用情况</div>
      <div class="content">
          <StatisCard :data="detailForm.cpu" :color="colors[0]" />
          <StatisCard :data="detailForm.memory" :color="colors[1]"/>
          <StatisCard :data="detailForm.disk" :color="colors[2]"/>
          <StatisCard :data="detailForm.network" :color="colors[3]" />
      </div>
    </div>
  </div>
</template>

<script>
import StatisCard from "./MachineStatisCard.vue";
import InfoCard from "./InfoCard.vue"
export default {
  components: { StatisCard, InfoCard },
  props: {
    detailForm: {
      type: Object
    }
  },
  data() {
    return {
      colors: ['#409EFF', "#67C23A", "#303133", "#909399"]
    }
  }
};
</script>

<style lang="scss" scoped>
.node_info {
  font-weight: bold;
  padding: 2px 0;
}
.detail {
  border: 1px solid #c2c0c0;
  margin-top: 20px;
  .name {
    text-align: center;
    font-size: 16px;
    font-weight: bolder;
    margin-top: 15px;
  }
}
.content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 30px 20px;
  .card {
    @include flex(column, center, flex-start);
    border-radius: 10px;
    border: 1px solid #cccccc;
    border-left: 6px solid aqua;
    height: 70px;
    width: 180px;
    span {
      margin-left: 10px;
    }
  }
}
</style>