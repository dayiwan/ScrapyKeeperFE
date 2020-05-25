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
      <el-table-column label="序号" width="100" type="index" align="center"></el-table-column>
      <el-table-column label="名称"  width="350" prop="project_name_zh"></el-table-column>
      <el-table-column label="分类">
        <template
          slot-scope="scope">{{ categoryMap[scope.row.category]? categoryMap[scope.row.category]:'其他' }}
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="date_created"></el-table-column>
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
      <el-table-column align="center" label="健康状态">
        <template slot-scope="scope">
          <span class="error-info" @click="elk_error_log_click(scope.row.project_name)" v-if="scope.row.error > 0">{{ scope.row.error | ellipsis }}</span>
          <label for="">{{ scope.row.error | rangeRank }}</label>
        </template>
      </el-table-column>
      <el-table-column align="center" label="详情">
        <template slot-scope="scope">
          <router-link style="color:#409EFF;" :to="`/project/${scope.row.project_name}`">查看详情</router-link>
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
    <!-- 编辑工程对话框 -->
    <EditBaseInfo
      :visible="editDialog"
      :form="editForm"
      @cancle="cancle"
      @editInfo="editInfoSubmit"
    />
    <!-- 日志详情&&待采队列对话框共用组件 -->
    <RedisDialog
      :visible="redisDialogShow"
      :logList="redisUrlList"
      :title="redisTitle"
      @logViewCancle="redisDagViewCancle"
    />
    <!-- 数据趋势图对话框 -->
    <DataTrend
      :visible="dataTrendShow"
      :pictureData="pictureData"
      @dataTrendCancle="dataTrendCancle"
    />


    <el-dialog :visible.sync="elk.elk_error_log" :show-close="false" :close-on-click-modal="false">
      <div class="title">错误日志信息</div>
      <div class="content">
        <p v-for="(log_line, i) in elk.elk_error_log_list" :key="i">{{log_line}}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleJournal">提交处理</el-button>
        <el-button size="small" @click="close_elk_error_log">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  apiGetAllProject,
  apiEditProjectInfo,
  apiGetDataDetail,
  apiAddProject,
  getDataTrend,
  apiGetSpareUrl,
  delJournakApi,
  getJournakApi,
  apiUploadProject
} from "@/api/project";
import { apiScheduler, apiOriginalLog, apiTemplate } from "@/api";
import EditBaseInfo from "./components/EditBaseInfo";
import RedisDialog from "./components/LogDialog";
import Toolbar from "./components/Toolbar";
import DataTrend from "./components/DataTrend";
import DataDetail from "./components/DataDetail";

export default {
  name: "project",
  components: {
    EditBaseInfo,
    RedisDialog,
    Toolbar,
    DataTrend,
    DataDetail,
  },
  data() {
    return {
      redisDialogShow: false,
      redisUrlList: [],
      redisTitle: "redis队列",
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
      schedulerForm: {},
      dataTrendShow: false,
      pictureData: {
        rows: [],
        columns: []
      },
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
      elk: {
        project_name: null,
        elk_error_log: false,
        elk_error_log_list: []
      }
     
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
    },
    rangeRank(value) { 
      if (value < 1) {
        return '良好'
      } else if (value >= 1 && value < 50) {
        return '存在错误'
      } else if (value >= 50 && value < 100) {
        return '一般错误'
      } else if (value >= 100 && value < 500) {
        return '较多错误'
      } else {
        return '严重错误'
      }
    }
  },
  methods: {
    // 点开elk的错误信息
    async elk_error_log_click(project_name) {
      this.elk.elk_error_log  = true;
      this.elk.project_name = project_name;
      var form = {
        project_name: this.elk.project_name,
        page: 1,
        page_size: 50
      }
      const res = await getJournakApi(form);
      this.elk.elk_error_log_list = res;
    },
    // 关闭elk的错误信息对话框
    close_elk_error_log(project_name) {
      this.elk.elk_error_log  = false;
      this.elk.elk_error_log_list = [];
      this.elk.project_name = null;
    },

    // 处理日志详情
    async handleJournal() {
      var params = {
        project_name: this.elk.project_name
      };
      const res = await delJournakApi(params);
      this.$message.success("提交成功！");
      this.elk.elk_error_log  = false;
      await this.listProject();
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
        project_id: parseInt(form.id) 
      };
      var res;
      try{
        res = await apiGetDataDetail(params);
      }catch(err) {
        this.Detail.detail = true;
        this.listLoading = false;
      } 
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
      this.redisTitle = "待采队列";
      this.listLoading = true;
      var params = {
        project_name: form.project_name,
        project_id: parseInt(form.id) 
      };
      console.log(params)
      const res = await apiGetSpareUrl(params);
      this.redisUrlList = res;
      this.redisDialogShow = true;
      this.listLoading = false;
    },
    redisDagViewCancle(){
      this.redisDialogShow = false;
      this.redisTitle = "";
      this.redisUrlList = [];
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
      const data = await apiTemplate.get();
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
      const res = await apiGetAllProject(params);
      this.listLoading = false;
      this.list = res.data;
      this.pagination.total = res.total;
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
    //取消调度
    async cancelScheduler(project_id) {
      await apiScheduler.delete(project_id);
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
