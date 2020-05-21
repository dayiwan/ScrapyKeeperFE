<template>
  <div class="project-detail">
    <div class="project">
      <div class="project_info">
        <label for>
          项目名称:
          <span>{{ info.project_name_zh }}</span>
        </label>
        <label for>
          发布时间：
          <span>{{ info.date_created }}</span>
        </label>
        <label for>
          任务量：
          <span>{{ info.task_num }}</span>
        </label>
      </div>
      <div class="project_operate">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          round
          @click="del_project(info.id, info.project_name)"
        >删除工程</el-button>
      </div>
    </div>
    <JobConfig :project_name="info.project_name" />
    <div class="task-box">
      <div class="title">任务列表</div>
      <el-table :data="info.task_list" max-height="500px">
        <el-table-column label="序号" width="150" type="index" align="center"></el-table-column>
        <el-table-column label="任务类型" width="200">
          <template slot-scope="scope">{{ scope.row.run_type == 'onetime' ? '单次运行' : '周期调度' }}</template>
        </el-table-column>
        <el-table-column label="运行状态" prop="status" width="200"></el-table-column>
        <el-table-column label="起始时间" prop="start_time" width="300"></el-table-column>
        <el-table-column label="结束时间" prop="end_time" width="300"></el-table-column>
        <el-table-column label="运行时长/分钟" prop="running_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.status == '运行中'"
              @click="cancel_running(scope.row.scheduler_id)"
            >取消运行</el-button>
            <el-button type="text">日志详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
  

<script>
import JobConfig from "./components/JobConfig";
import { apiGetAllProject, apiDelProject } from "@/api/project";
import { apidCancleRunning } from "@/api/scheduler";

export default {
  components: {
    JobConfig
  },
  data() {
    return {
      info: {
        project_name: null,
        project_name_zh: null,
        date_created: "2020-05-20 12:22:24",
        status: "运行中",
        task_num: 5,
        task_list: []
      }
    };
  },
  created() {
    this.getPorject();
  },
  methods: {
    async getPorject() {
      var params = {
        page_size: 1,
        page_index: 1,
        project_name: this.$route.params.project_name,
        type: "info"
      };
      const res = await apiGetAllProject(params);
      this.info = res.data[0];
      
    },
    async cancel_running(scheduler_id) {
      let res = await apidCancleRunning(scheduler_id);
    },
    // 删除工程
    del_project: function(project_id, project_name) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        var form = {
          project_id: project_id,
          project_name: project_name
        };
        await apiDelProject(form);
        this.$message.success("删除成功！");
        this.$router.push({
          path: "/project"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.project-detail {
  padding: 20px 15px;
  .project {
    @include flex();
    justify-content: space-between;
    padding: 30px 15px;
    border: 1px solid #cccccc;
    font-size: 16px;
    margin-bottom: 20px;
    label {
      margin-right: 80px;
      color: #909399;
      font-size: 15px;
      span {
        color: #606266;
        font-size: 15px;
      }
    }
    .project_operate {
      margin-top: 50px;
    }
  }
  .task-box {
    border: 1px solid rgb(218, 215, 215);
    margin-top: 20px;
    .title {
      text-align: center;
      margin: 10px 0;
      font-size: 18px;
    }
    .content {
      margin: 0 10px;
      overflow-y: auto;
    }
  }
}
</style>