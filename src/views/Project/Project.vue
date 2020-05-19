<template>
  <div class="app-container">
    <!-- 筛选、搜索、添加项目 -->
    <Toolbar
      :options="toolOptions"
      @Cate="Cate"
      @State="State"
      @Search="Search"
    />
    <!-- 项目列表 -->
    <el-table
      :data="list"
      v-loading.body="listLoading"
      element-loading-text="Loading"
      border
      style="width: 100%"
    >
      <el-table-column label="序号" width="50" type="index" align="center"></el-table-column>
      <el-table-column label="名称" prop="project_name_zh">
        <template slot-scope="scope"><a :href="'#/project/'+ scope.row.project_name_zh" style="color: #409EFF" > {{ scope.row.project_name_zh }}</a></template>
      </el-table-column>
      <el-table-column label="分类">
        <template
          slot-scope="scope"
        >{{ categoryMap[scope.row.category]? categoryMap[scope.row.category]:'其他' }}</template>
      </el-table-column>
      <el-table-column label="周期" prop="time"></el-table-column>
      <el-table-column label="发布时间" prop="date_created"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">{{ scope.row.status | statusMapping }}</template>
      </el-table-column>
      <el-table-column align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.category !== 'news'"
            type="text"
            @click="addFieldClick(scope.row)"
          >添加参数</el-button>
          <el-dropdown placement="bottom" trigger="click">
            <span class="el-dropdown-link">调度</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a" @click.native="runImmediately(scope.row.id)">立即运行</el-dropdown-item>
              <el-dropdown-item command="b" @click.native="cancleRunning(scope.row.id)">取消运行</el-dropdown-item>
              <el-dropdown-item command="c" @click.native="schedulerClick(scope.row)">周期调度</el-dropdown-item>
              <el-dropdown-item command="d" @click.native="cancelScheduler(scope.row.id)">取消调度</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button type="text" @click="editeClick(scope.row)">编辑</el-button> -->
          <el-button type="text" style="color: red" @click="del_project(scope.row)">删除</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="待采队列">
        <template slot-scope="scope">
          <!-- <svg-icon icon-class="watch"></svg-icon> -->
          <el-button type="text" @click="spareUrl(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据详情">
        <template slot-scope="scope">
          <!-- <svg-icon icon-class="watch"></svg-icon> -->
          <el-button type="text" @click="dataDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据趋势图">
        <template slot-scope="scope">
          <el-button type="text" @click="dataTrendClick(scope.row.project_name_zh)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="日志">
        <template slot-scope="scope">
          <span class="error-info" v-if="scope.row.error > 0">{{ scope.row.error | ellipsis }}</span>
          <el-button type="text" @click="ViewLogClick(scope.row)">日志详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        background
        @current-change="pageChange"
        layout="total, prev, pager, next, jumper"
        :page-size="pagination.pageSize"
        :total="pagination.total"
      ></el-pagination>
    </div>

    <!-- 数据详情对话框 -->
    <DataDetail
      :visible="Detail.detail"
      :header="Detail.header"
      :content="Detail.content"
      @dataDetailCancle="dataDetailCancle"
    />
    <!-- 添加参数对话框 -->
    <AddField
      :visible="addField"
      :tpl_input="tpl_input"
      @addFieldCancle="addFieldCancle"
      @addFieldSubmit="addFieldSubmit"
    />
    <!-- 编辑工程对话框 -->
    <EditBaseInfo
      :visible="editDialog"
      :form="editForm"
      @cancle="cancle"
      @editInfo="editInfoSubmit"
    />
    <!-- 添加工程对话框 -->
    <AddProjectDialog
      :visible="addProjectDialog"
      :tplList="tplList"
      @addProjectCancle="addProjectCancle"
      @addProjectSubmit="addProjectSubmit"
    />
    <!-- 添加调度对话框 -->
    <SchedulerDialog
      :visible="schedulerDialog"
      :form="schedulerForm"
      @addScheduler="addScheduler"
      @schedulerClickCancle="schedulerClickCancle"
    />
    <!-- 日志详情&&待采队列对话框共用组件 -->
    <LogDialog
      :visible="dialog"
      :logList="logList"
      :title="title"
      @logViewCancle="logViewCancle"
      @handleJournal="handleJournal"
    />
    <!-- 数据趋势图对话框 -->
    <DataTrend
      :visible="dataTrendShow"
      :pictureData="pictureData"
      @dataTrendCancle="dataTrendCancle"
    />
  </div>
</template>

<script>
import {
  getAllProject,
  apiEditProjectInfo,
  apiGetDataDetail,
  delProject,
  apiAddProject,
  getDataTrend,
  apiGetSpareUrl,
  delJournakApi,
  apiUploadProject
} from "@/api/project";
import {
  apidRunImmediately,
  apidCancleRunning,
  apiAddScheduler,
  apiCancelScheduler
} from "@/api/scheduler";
import { apiGetTmpl } from "@/api/templates";
import { apiOriginalLog } from "@/api/originalLog";
import EditBaseInfo from "./components/EditBaseInfo";
import AddProjectDialog from "./components/AddProjectDialog";
import SchedulerDialog from "./components/SchedulerDialog";
import LogDialog from "./components/LogDialog";
import Toolbar from "./components/Toolbar";
import DataTrend from "./components/DataTrend";
import AddField from "./components/AddField";
import DataDetail from "./components/DataDetail";

export default {
  name: "project",
  components: {
    EditBaseInfo,
    AddProjectDialog,
    SchedulerDialog,
    LogDialog,
    Toolbar,
    DataTrend,
    AddField,
    DataDetail,
  },
  data() {
    return {
      addProjShow: true,
      query: {
        category: "",
        status: "",
        project_name_zh: ""
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      categoryMap: {},
      is_msdMap: { 0: "单机", 1: "分布式" },
      list: [],
      listLoading: true,
      editDialog: false,
      editForm: {
        id: null,
        category: null,
        is_msd: null,
        project_name_zh: null
      },
      addProjectDialog: false,
      schedulerDialog: false,
      schedulerForm: {},
      dialog: false,
      dataTrendShow: false,
      pictureData: {
        rows: [],
        columns: []
      },
      logList: [],
      title: "",
      addField: false,
      tplList: [],
      toolOptions: [{ key: "全部", value: "" }],
      Detail: {
        header: [],
        content: [],
        detail: false
      },
      journalName: "",
      tpl_input: null,
      fieldToAdd: {},
      fieldToAddId: null,
    };
  },
  mounted() {
    this.init();
  },
  filters: {
    statusMapping: function(value) {
      if (value === "running") {
        return "运行中";
      } else {
        return "休眠";
      }
    },
    ellipsis(value) {
      if (value > 100) {
        return "100+";
      } else {
        return value;
      }
    }
  },
  methods: {
    // 处理日志详情
    async handleJournal() {
      var params = {
        project_name: this.journalName
      };
      const res = await delJournakApi(params);
      this.logViewCancle();
      this.$message.success("提交成功！");
      this.listProject();
    },
    // 确认添加参数
    async addFieldSubmit(fields) {
      let fieldAdded = {};
      let tpl_input = JSON.parse(this.tpl_input);
      for (let field of fields) {
        tpl_input[field.key] = {
          tip: field.tip,
          type: field.type,
          value: field.value.join(",")
        };
      }

      var params = {
        id: this.fieldToAddId,
        tpl_input: JSON.stringify(tpl_input)
      };
      await apiEditProjectInfo(params);
      this.$message.success("添加成功!");
      this.addField = false;
      this.listProject();
    },
    // 关闭添加参数弹框
    addFieldCancle() {
      this.addField = false;
    },
    // 添加参数弹框
    addFieldClick(project) {
      this.fieldToAddId = project.id;
      this.tpl_input = project.tpl_input;
      this.addField = true;
    },
    //查看日志详情
    async ViewLogClick(form) {
      this.listLoading = true;
      this.dialog = true;
      this.title = "日志详情";
      this.journalName = form.project_name;
      const res = await apiOriginalLog(form.id);
      this.logList = res;
      this.listLoading = false;
    },
    //退出日志详情 || 待采队列对话框
    logViewCancle() {
      this.dialog = false;
      this.title = "";
      this.logList = [];
    },
    //退出数据详情对话框
    dataDetailCancle() {
      this.Detail.detail = false;
    },
    //查看数据详情
    async dataDetail(form) {
      this.title = "数据详情";
      this.listLoading = true;
      var params = {
        project_name: form.project_name,
        tpl_input: form.tpl_input
      };
      const res = await apiGetDataDetail(params);
      if (res !== []) {
        this.Detail.content = res;
        for (let item in res[0]) {
          this.Detail.header.push(item);
        }
      } else {
        this.Detail.header = [];
        this.Detail.content = [];
      }
      this.Detail.detail = true;
      this.listLoading = false;
    },
    // 查看待采队列
    async spareUrl(form) {
      this.title = "待采队列";
      this.listLoading = true;
      var params = {
        project_name: form.project_name,
        tpl_input: form.tpl_input
      };
      const res = await apiGetSpareUrl(params);
      this.logList = res;
      this.dialog = true;
      this.listLoading = false;
    },
    //退出数据趋势对话框
    dataTrendCancle() {
      this.dataTrendShow = false;
    },
    //查看数据趋势图
    async dataTrendClick(project_name_zh) {
      this.listLoading = true;
      var params = {
        project_name_zh: project_name_zh
      };
      const data = await getDataTrend(params);
      if (data.length > 0) {
        this.pictureData.rows = data;
        this.pictureData.columns = ["日期", "入库量"];
      } else {
        this.pictureData = {
          rows: [],
          columns: []
        };
      }
      this.dataTrendShow = true;
      this.listLoading = false;
    },
    //根据分类进行筛选
    Cate(value) {
      this.query.category = value;
      this.pagination.currentPage = 1;
      this.listProject();
    },
    //根据状态筛选
    State(value) {
      this.query.status = value;
      this.pagination.currentPage = 1;
      this.listProject();
    },
    //搜索项目
    Search(name) {
      this.query.project_name_zh = name;
      this.pagination.currentPage = 1;
      this.listProject();
    },
    // 翻页
    pageChange(page) {
      this.pagination.currentPage = page;
      this.listProject();
    },
    // 点击编辑响应事件
    editeClick(form) {
      this.editForm.id = form.id;
      this.editForm.category = form.category;
      this.editForm.is_msd = this.is_msdMap[form.is_msd];
      this.editForm.project_name_zh = form.project_name_zh;
      this.editDialog = true;
    },
    // 向后端提交编辑编辑事件
    async editInfoSubmit(form) {
      await apiEditProjectInfo(form);
      this.editDialog = false;
      this.$message.success("信息更新成功！");
      this.listProject();
    },
    // 取消编辑事件
    cancle() {
      this.editDialog = false;
    },
    // 获取模板列表,将模板列表传入筛选组件和categoryMap,
    async init() {
      const data = await apiGetTmpl();
      this.tplList = data;
      for (let item of this.tplList) {
        var item_obj = {};
        this.categoryMap[item.tpl_name] = item.tpl_zh;
        item_obj["key"] = item.tpl_zh;
        item_obj["value"] = item.tpl_name;
        this.toolOptions.push(item_obj);
      }
      await this.listProject();
    },
    //  分页获取所有工程数据事件
    async listProject() {
      var params = {
        page_size: this.pagination.pageSize,
        page_index: this.pagination.currentPage,
        category: this.query.category,
        status: this.query.status,
        project_name_zh: this.query.project_name_zh
      };
      const res = await getAllProject(params);
      this.listLoading = false;
      this.list = res.data;
      this.pagination.total = res.total;
    },
    // 删除工程
    del_project: function(form) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await delProject(form);
        this.listProject();
        this.$message.success("删除成功！");
      });
    },

    // 添加工程
    async addProject(form) {
      this.addProjShow = false;
      const loading = this.$loading({
        lock: true,
        text: "工程部署中, 请耐心等候！",
        spinner: "el-icon-loading"
      });
      try {
        await apiUploadProject(form);
        await this.listProject();
      } catch (e) {
        console.error(e);
      } finally {
        loading.close();
      }
    },

    async addProjectByTpl(form) {
      this.addProjShow = false;
      const loading = this.$loading({
        lock: true,
        text: "工程部署中, 请耐心等候！",
        spinner: "el-icon-loading"
      });
      try {
        await apiAddProject(form);
        await this.listProject();
      } catch (e) {
        console.error(e);
      } finally {
        loading.close();
      }
    },

    // 提交添加工程
    async addProjectSubmit(form) {
      this.addProjectDialog = false;
      const loading = this.$loading({
        lock: true,
        text: "工程添加中, 该过程大约需要30s, 请耐心等候！",
        spinner: "el-icon-loading"
      });
      form.tpl_input = JSON.stringify(form.tpl_input);
      try {
        await apiAddProject(form);
        await this.listProject();
      } catch (e) {
        console.error(e);
      } finally {
        loading.close();
      }
    },
    // 取消添加工程
    addProjectCancle() {
      this.addProjectDialog = false;
    },
    // 立即运行事件
    async runImmediately(id) {
      var params = {
        id: id,
        run_type: "onetime"
      };
      await apidRunImmediately(params);
      this.$message.success("调度成功！");
      this.listProject();
    },
    // 取消运行事件
    async cancleRunning(id) {
      await apidCancleRunning(id);
      this.$message.success("取消成功！");
      this.listProject();
    },
    // 点击周期调度按钮， 显示对话框
    schedulerClick(project) {
      this.schedulerForm = this.$deepcopy(project);
      this.schedulerDialog = true;
    },
    // 关闭周期调度对话框
    schedulerClickCancle() {
      this.schedulerDialog = false;
    },
    // 提交添加调度事件
    async addScheduler(form) {
      form.cron_month = form.cron_month.join(",");
      form.cron_day_of_month = form.cron_day_of_month.join(",");
      form.cron_hour = form.cron_hour.join(",");
      form.cron_minutes = form.cron_minutes.join(",");
      await apiAddScheduler(form);
      this.$message.success("添加成功！");
      this.listProject();
      this.schedulerDialog = false;
    },
    //取消调度
    async cancelScheduler(project_id) {
      await apiCancelScheduler(project_id);
      this.$message.success("取消成功！");
      this.listProject();
    }
  }
};
</script>


<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  margin-left: 9px;
  margin-right: 9px;
}
.pagination {
  margin-top: 20px;
}
.el-button--text {
  padding: 0px 0px;
}
.error-info {
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  padding: 0 6px;
  text-align: center;
  border: 1px solid #fff;
  height: 18px;
  line-height: 18px;
  cursor: pointer;
}
</style>
