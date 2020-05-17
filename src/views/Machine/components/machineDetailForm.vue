<template>
  <div class="machine-detail">
    <div class="node_name">服务器名称:{{nodeName}}</div>
    <div class="pie-picture">
      <div class="name">资源使用情况</div>
      <div class="content">
        <div class="cpu">
          <div class="title">cup使用量</div>
          <ve-pie :data="cpuData" :setting="chartsSettings" />
        </div>
        <div class="memory">
          <div class="title">内存使用量</div>
          <ve-pie :data="memoryData" :setting="chartsSettings" />
        </div>
        <div class="disk">
          <div class="title">硬盘使用量</div>
          <ve-pie :data="diskData" :setting="chartsSettings"></ve-pie>
        </div>
      </div>
    </div>
    <div class="guge-picture">
      <div class="finish"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    this.chartsSettings = {
      dataType: "percent"
    };
    return {
      nodeName: "LAPTOP-JHKR1M78",
      cpuData: {
        columns: ["名称", "占比"],
        rows: [
          { 名称: "已使用", 占比: 63.7 },
          { 名称: "未使用", 占比: 36.3 }
        ]
      },
      memoryData: {
        columns: ["名称", "占比"],
        rows: [
          { 名称: "已使用", 占比: 63.7 },
          { 名称: "未使用", 占比: 36.3 }
        ]
      },
      diskData: {
        columns: ["名称", "占比"],
        rows: [
          { 名称: "已使用", 占比: 63.7 },
          { 名称: "未使用", 占比: 36.3 }
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.node_name {
  font-size: 18px;
  font-weight: bolder;
}
.pie-picture {
  border: 1px solid rgb(160, 156, 156);
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
  padding: 30px 20px 0px 50px;
  .cpu,
  .memory,
  .disk {
    width: 50%;
    height: 350px;
    .title {
      text-align: center;
      font-weight: bold;
      margin-bottom: 10px;
    }
  }
}
</style>