<template>
  <div class="project-detail">
    <div class="project">
        <label for="">项目名称: <span>{{ info.project_name_zh }}</span></label>
        <label for="">发布时间：<span>{{ info.date_created }}</span></label>
        <label for="">运行状态：<span>{{ info.status }}</span></label>
        <label for="">任务量：<span>{{ info.task_num  }}</span></label>
    </div>
    <JobConfig :project_name="info.project_name" />
    <div class="task-box">
      <div class="title">任务列表</div>
      <el-table :data="info.task_list" max-height="500px">
          <el-table-column label="任务名称" prop="name"></el-table-column>
          <el-table-column label="运行状态" prop="state"></el-table-column>
          <el-table-column label="创建时间" prop="start_time"></el-table-column>
          <el-table-column label="剩余时间" prop="rest_time"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

import JobConfig from "./components/JobConfig";
import { getAllProject } from "@/api/project";
export default {
    components: {
        JobConfig
    },
    data() {
        return {
            info:{
                project_name: "xxxxxxxx",
                date_created: "2020-05-20 12:22:24",
                status: "运行中",
                task_num: 5,
                task_list: []
            },
        }
    },
    created() {
       this.getPorject()
    },
    methods: {
        async getPorject() {
            var params = {
                page_size: 1,
                page_index: 1,
                project_name: this.$route.params.project_name
            };
            const res = await getAllProject(params);
            this.info = res.data[0]
        }
    }
}
</script>

<style lang="scss" scoped>
.project-detail{
    padding: 20px 15px;
    .project {
        @include flex();
        justify-content: space-between;
        padding: 30px 15px;
        border: 1px solid #cccccc;
        font-size: 16px;
        margin-bottom: 20px;
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
            height: 500px;
        }
    }
}


</style>