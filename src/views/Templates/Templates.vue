<template>
  <div class="app-container">
    <div class="tpl-list">
      <TemplateCard
        v-for="tpl in tplArr"
        :key="tpl.id"
        :name="tpl.tpl_zh"
        :imgSrc="`data:image/jpg;base64,${tpl.tpl_img}`"
        :id="tpl.id"
        @del="onDelete"
        @click="onTmplCardClick(tpl)"
      />
      <div class="template-card add-template" @click="dialogShow = true">+</div>
    </div>

    <el-dialog :visible.sync="dialogShow" title="模板管理">
      <TemplateForm @confirm="onTmplFormConfirm" />
    </el-dialog>

    <el-dialog :visible.sync="editDialogShow" title="模板管理">
      <TemplateEditForm @confirm="onTmplEditConfirm" :template="editForm" />
    </el-dialog>
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
  apiAddTmpl,
  apiGetTmpl,
  delTmpl,
  apiEditTmpl,
  apiDelTmpl
} from "@/api/templates";
import {
  apidRunImmediately,
  apidCancleRunning,
  apiAddScheduler,
  apiCancelScheduler
} from "@/api/scheduler";
import { apiOriginalLog } from "@/api/originalLog";
import TemplateEditForm from "./components/TemplateEditForm";
import TemplateCard from "./components/TemplateCard";
import TemplateForm from "./components/TemplateForm";

export default {
  name: "templates",
  components: { TemplateEditForm, TemplateCard, TemplateForm },
  data() {
    return {
      modelMap: new Map([
        ["news", "通用型新闻网页"],
        ["weibo", "新浪微博"],
        ["gongzhonghao", "微信公众号"]
      ]),
      tplArr: [],
      editForm: {
        id: null,
        tpl_name: this.tplName,
        tpl_zh: this.tplZh,
        tpl_type: this.type,
        tpl_input: {}
      },
      editDialogShow: false,
      dialogShow: false
    };
  },
  created() {
    this.listTmpl();
  },
  methods: {
    // 取消编辑事件
    cancle() {
      this.editDialog = false;
    },
    // 获取模板列表
    async listTmpl() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.9)"
      });
      const data = await apiGetTmpl();
      this.tplArr = data;
      loading.close();
    },
    // 删除
    async del_project(id) {
      await delTmpl(id);
      this.listTmpl();
      this.$message.success("删除成功！");
    },

    async onTmplFormConfirm(form) {
      const loading = this.$loading({
        lock: true,
        text: "正在添加, 请耐心等候！",
        spinner: "el-icon-loading"
      });
      try {
        const res = await apiAddTmpl(form);
        await this.listTmpl();
        this.$message.success("添加成功！");
      } catch (e) {
        console.error(e);
      } finally {
        loading.close();
        this.dialogShow = false;
      }
    },
    async onDelete(id) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const loading = this.$loading({
            lock: true,
            spinner: "el-icon-loading"
          });
          try {
            await apiDelTmpl(id);
          } finally {
            this.listTmpl();
            loading.close();
          }
        })
        .catch(() => {});
    },
    async onTmplCardClick(tpl) {
      this.editForm.id = tpl.id;
      this.editForm.tpl_name = tpl.tpl_name;
      this.editForm.tpl_zh = tpl.tpl_zh;
      this.editForm.tpl_input = JSON.parse(tpl.tpl_input);
      this.editForm.tpl_type = tpl.tpl_type;
      this.editDialogShow = true;
    },
    async onTmplEditConfirm(form) {
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading"
      });
      try {
        await apiEditTmpl(form);
        this.$message.success("操作成功");
      } finally {
        this.listTmpl();
        loading.close();
        this.editDialogShow = false;
      }
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
    @include flex(column);
    @include shadow-card();
    font-size: 80px;
  }
}
</style>
