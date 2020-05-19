<template>
  <div class="data-center" v-if="flag">
    <!-- 服务器状态饼图组件 -->
    <!-- <ServerStatus :data="pieChartList" /> -->

    <!-- 数据概览组件 -->
    <DataOverview :num="num" :totalSize="totalSize" :fileSize="fileSize" />

    <!-- 一周内数据采集总量 -->
    <AllData :pictureData="pictureData" />

    <!-- 近一周采集量组件 -->
    <ProjectData :data="weekData" :timeline="timeline" :xAxislLabel="xAxislLabel" />

    <div class="email-fixed" @click="drawerShow = true">
      <i class="el-icon-s-promotion"></i>
      <span>邮件通知</span>
    </div>

    <el-drawer :visible.sync="drawerShow" :show-close="false">
      <el-form label-position="top" class="email-form">
        <h3>邮件通知配置</h3>
        <div class="email-tips">
          系统会对爬虫任务进程、节点健康情况、任务采集数量进行监控
          <br />配置邮件用于接收爬虫进程、爬虫节点的健康异常告警，采集数量统计邮件
        </div>
        <div class="email-form-area">
          <h4>已添加邮箱</h4>
          <div v-if="emailArr.length > 0">
            <el-row v-for="email in emailArr" :key="email.id">
              <el-col :span="12">{{ email.email }}</el-col>
              <el-col :span="12">
                <i
                  class="el-icon-delete"
                  style="color: #ff3d3d; cursor: pointer;"
                  @click="delEmail(email.id)"
                ></i>
              </el-col>
            </el-row>
          </div>
          <div v-else>无</div>
        </div>

        <el-form-item label="通知邮箱">
          <el-input v-model="emailInputing" size="small">
            <template slot="append">@qq.com</template>
          </el-input>
        </el-form-item>

        <el-button size="small" @click="addEmail">添加</el-button>
      </el-form>
    </el-drawer>
  </div>
  <div v-else class="data-center-loading">加载中...</div>
</template>

<style lang="scss" >
.data-center-loading {
  height: 400px;
  @include flex();
  font-size: 18px;
}
.email-fixed {
  @include flex(column);
  width: 64px;
  height: 64px;
  position: fixed;
  bottom: 30%;
  right: 20px;

  background-color: royalblue;
  color: white;
  border-radius: 64px;
  cursor: pointer;
  i {
    font-size: 25px;
  }
  span {
    font-size: 12px;
  }
}

.email-form {
  padding: 20px;

  h3 {
    margin-bottom: 5px;
  }

  &-area {
    padding: 10px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    margin-top: 20px;

    h4 {
      margin-top: 0;
    }
  }

  .email-tips {
    font-size: 10px;
    color: #666;
  }
}
</style>

<script>
import DataOverview from "./components/DataOverview/DataOverview";
import ProjectData from "./components/ProjectData/ProjectData";
import AllData from "./components/AllData/AllData";

import apiDataCentral from "@/api/dataCentral";
import { getDataTrend } from "@/api/project";
import apiEmail from "@/api/email";

export default {
  components: {
    DataOverview,
    ProjectData,
    AllData
  },
  data() {
    return {
      apiDataCentral,
      num: 0,
      totalSize: 0,
      fileSize: 0,
      weekData: [],
      timeline: [],
      xAxislLabel: [],
      flag: false,
      pictureData: {
        rows: [],
        columns: []
      },
      drawerShow: false,
      emailArr: [],
      emailInputing: "",
      apiEmail

      // pieChartList: [
      //   {
      //     domId: "cpu-chart",
      //     title: "CPU使用量",
      //     legendData: ["已使用", "未使用"],
      //     seriesData: [
      //       { value: 0, name: "已使用" },
      //       { value: 0, name: "未使用" }
      //     ]
      //   },
      //   {
      //     domId: "RAM-chart",
      //     title: "内存使用量",
      //     legendData: ["已使用", "未使用"],
      //     seriesData: [
      //       { value: 0, name: "已使用" },
      //       { value: 0, name: "未使用" }
      //     ]
      //   },
      //   {
      //     domId: "project-running-chart",
      //     title: "运行率",
      //     legendData: ["正在运行", "等待"],
      //     seriesData: [
      //       { value: 0, name: "正在运行" },
      //       { value: 0, name: "等待" }
      //     ]
      //   },
      //   {
      //     domId: "project-running-status-chart",
      //     title: "错误率",
      //     legendData: ["正常", "错误"],
      //     seriesData: [
      //       { value: 0, name: "错误" },
      //       { value: 0, name: "正常" }
      //     ]
      //   }
      // ],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      // this.getStatus();
      this.getProjectWeekData();
      this.getDataTrend();
      this.listEmail();
    },
    // 获取七天内数据总入库量趋势
    async getDataTrend() {
      const res = await getDataTrend({});
      this.flag = true;
      if (res.length > 0) {
        this.pictureData.rows = res;
        this.pictureData.columns = ["日期", "入库量"];
      } else {
        this.pictureData = {
          rows: [],
          columns: []
        };
      }
    },
    async getProjectWeekData() {
      var res = await this.apiDataCentral.post();
      this.flag = true;
      var options = [];
      for (var j = 0, len = res.xAxis.length; j < len; j++) {
        var temp = {
          title: { text: res.xAxis[j] + "数据入库量" },
          series: [{ data: res.yAxis[res.xAxis[j]] }]
        };
        options.push(temp);
      }
      this.weekData = options;
      this.timeline = res.xAxis;
      this.xAxislLabel = res.label_data;
    },
    async listEmail() {
      this.emailArr = await this.apiEmail.get();
    },

    async addEmail() {
      if (!this.emailInputing.match(/^\d+$/)) {
        this.$message.error("请填写QQ邮箱");
        return;
      }
      const email = this.emailInputing + "@qq.com";
      for (const mail of this.emailArr) {
        if (mail.email == email) {
          this.$message.info("已经添加过该邮箱");
          return;
        }
      }

      const loading = this.$loading();
      await this.apiEmail.post({ email });
      await this.listEmail();
      loading.close();
    },
    async delEmail(id) {
      const loading = this.$loading();
      await this.apiEmail.delete({ id });
      await this.listEmail();
      loading.close();
    }

    // async getStatus() {
    //   const res = await apiGetStatus();
    //   this.flag = true;
    //   this.pieChartList[0].seriesData[0].value = parseInt(res.cupStatus.used);
    //   this.pieChartList[0].seriesData[1].value = parseInt(res.cupStatus.Unused);
    //   this.pieChartList[1].seriesData[0].value = parseInt(res.memorystate.used);
    //   this.pieChartList[1].seriesData[1].value = parseInt(
    //     res.memorystate.Unused
    //   );
    //   this.pieChartList[2].seriesData[0].value = parseInt(
    //     res.project_running_status.running
    //   );
    //   this.pieChartList[2].seriesData[1].value = parseInt(
    //     res.project_running_status.waitting
    //   );
    //   this.pieChartList[3].seriesData[0].value = parseInt(
    //     res.project_error_rate_status.error
    //   );
    //   this.pieChartList[3].seriesData[1].value = parseInt(
    //     res.project_error_rate_status.normal
    //   );
    //   this.num = res.dataCount;
    //   this.fileSize = res.file_size;
    //   this.totalSize = res.data_size;
    // },
  }
};
</script>
