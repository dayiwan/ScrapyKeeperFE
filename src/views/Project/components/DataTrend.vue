<template>
  <div class="data-trend">
    <el-dialog :visible.sync="visible" :show-close="false" :close-on-click-modal="false">
      <div class="title">数据趋势图</div>
      <div class="picture" v-if="pictureData.rows.length > 0">
        <ve-line
          :data="pictureData"
          :settings="chartSettings"
          :width="lineWidth"
          :height="lineHeight"
          :legend-visible="false"
        ></ve-line>
      </div>
      <div class="no-picture" v-else>暂无数据</div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancle">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDataTrend } from "@/api/project";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    pictureData: { type: Object }
  },
  data() {
    this.chartSettings = {
      yAxisName: ["数据入库量/条"],
      xAxisName: ["日期"],
      area: true, //是否显示为面积图
      itemStyle: {
        //面积图颜色设置
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "#7bc0ff" // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#edf4ff" // 100% 处的颜色
            }
          ],
          globalCoord: true // 缺省为 false
        }
      }
    };
    return {
      lineWidth: "100%", //宽度
      lineHeight: "100%" //高度
    };
  },
  methods: {
    cancle() {
      this.$emit("dataTrendCancle");
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  margin-bottom: 20px;
  margin-top: -30px;
  font-weight: bolder;
  font-size: 18px;
}
.picture {
  height: 500px;
  border: 1px solid #ebeef5;
}
</style>