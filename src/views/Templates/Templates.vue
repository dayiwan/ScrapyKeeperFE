<template>
  <div class="app-container">
    <div class="tpl-list">
      <TemplateCard v-for="(tpl, index) in tplArr" :name="tpl.tpl_zh" :key="index" :imgSrc="`data:image/png;base64,${tpl.tpl_img}`" />
      <div class="template-card add-template" @click="addProjDialogShow = true">+</div>
    </div>

    <!-- 编辑工程对话框 -->
    <EditBaseInfo
      :visible="editDialog"
      :form="editForm"
      v-on:cancle="cancle"
      v-on:editInfo="editInfoSubmit"
    />
    <!-- 添加模板对话框 -->
    <AddProjectDialog
      :visible="addProjDialogShow"
      @addProjectCancle="addProjectCancle"
      @addProjectSubmit="addProjectSubmit"
    />
  </div>
</template>

<script>
import {
  getAllProject,
  apiEditProjectInfo,
  delProject,
  apiAddProject
} from "@/api/project";
import {
  apiAddModel,
  apiGetModel,
  delModel,
  apiEditModel
} from "@/api/templates";
import {
  apidRunImmediately,
  apidCancleRunning,
  apiAddScheduler,
  apiCancelScheduler
} from "@/api/scheduler";
import { apiOriginalLog } from "@/api/originalLog";
import EditBaseInfo from "./components/EditBaseInfo";
import AddProjectDialog from "./components/AddProjectDialog";
import Toolbar from "./components/Toolbar";
import TemplateCard from "./components/TemplateCard";

import upload from "@/utils/upload";

export default {
  name: "templates",
  components: { EditBaseInfo, AddProjectDialog, TemplateCard },
  data() {
    return {
      modelMap: new Map([
        ["news", "通用型新闻网页"],
        ["weibo", "新浪微博"],
        ["gongzhonghao", "微信公众号"]
      ]),
      tplArr: [],
      list: null,
      listLoading: true,
      editDialog: false,
      editForm: {
        id: null,
        name_zh: null,
        status: null,
        name: null,
        crawl_name: null,
        crawl_url: null
      },
      addProjDialogShow: false
    };
  },
  created() {
    this.getModelList();
  },
  methods: {
    // 点击编辑响应事件
    editeClick(form) {
      this.editForm.crawl_name = form.crawl_name;
      this.editForm.name = form.name;
      this.editForm.crawl_url = form.crawl_url;
      this.editForm.id = form.id;
      this.editForm.name_zh = form.name_zh;
      this.editForm.status = form.status;
      this.editDialog = true;
    },
    // 向后端提交编辑编辑事件
    async editInfoSubmit(form) {
      var params = form;
      params.name_zh = this.modelMap.get(params.name);
      await apiEditModel(params);
      this.editDialog = false;
      this.$message.success("编辑成功！");
      this.getModelList();
    },
    // 取消编辑事件
    cancle() {
      this.editDialog = false;
    },
    // 获取模板列表
    async getModelList() {
      this.listLoading = true;
      const res = await apiGetModel();
      this.listLoading = false;
      this.tplArr = res.data;
    },
    // 删除
    async del_project(id) {
      await delModel(id);
      this.getModelList();
      this.$message.success("删除成功！");
    },
    // 点击添加模板按钮
    addModel(add) {
      this.addProjectDialog = add;
    },
    // 提交添加模板
    async addProjectSubmit(form) {
      this.addProjectDialog = false;
      const formData = new FormData();
      for (let key in form) {
        if (form[key] instanceof File) {
          formData.append(key, '');
          formData.set(key, form[key]);
        } else {
          formData.append(key, form[key]);
        }
      }
      upload.post('/template', formData).then(res => {
        console.log(res)
      }).catch(e => {
        console.log(e)
      })
      // const loading = this.$loading({
      //   lock: true,
      //   text: "正在添加, 请耐心等候！",
      //   spinner: "el-icon-loading"
      // });
      // const res = await apiAddModel(form);

      // if (res) {
      //   this.$message.success("添加成功！");
      // }
      // loading.close();
      // this.getModelList();
    },
    // 取消添加模板
    addProjectCancle() {
      this.addProjDialogShow = false;
    }
  }
};
</script>


<style lang="scss" scoped>
.pagination {
  margin-top: 20px;
}
.el-button--text {
  padding: 0px 0px;
}
.tpl-list {
  @include flex(row, flex-start);
  .template-card {
    margin-left: 20px;
    &:first-child {
      margin-left: none;
    }
  }
  .add-template {
    font-size: 80px;
  }
}
</style>
