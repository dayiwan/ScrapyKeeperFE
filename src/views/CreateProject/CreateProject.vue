<template>
  <el-tabs class="create-project">
    <el-tab-pane label="按模板生成工程">
      <AddProjByTplForm :tpl-list="tplList" @submit="addProjectByTpl" />
    </el-tab-pane>

    <el-tab-pane label="按配置生成工程">
      <AddProjFormByConf @submit="addProjectByTpl" />
    </el-tab-pane>

    <el-tab-pane label="自行上传工程文件">
      <AddProjForm @submit="addProject" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AddProjForm from "./components/AddProjForm";
import AddProjByTplForm from "./components/AddProjByTplForm";
import AddProjFormByConf from "./components/AddProjFormByConf";

import { apiAddProject, apiUploadProject } from "@/api/project";
import { apiTemplate } from "@/api";

export default {
  components: { AddProjForm, AddProjByTplForm, AddProjFormByConf },
  data() {
    return {
      tplList: []
    };
  },
  mounted() {
    this.listTpl();
  },
  methods: {
    async listTpl() {
      const data = await apiTemplate.get();
      this.tplList = data;
    },
    // 添加工程
    async addProject(form) {
      const loading = this.$loading({
        lock: true,
        text: "工程部署中, 请耐心等候！",
        spinner: "el-icon-loading"
      });
      try {
        const data = await apiUploadProject(form);
        this.$router.push(`/project/${data.project_name}`)
      } catch (e) {
        console.error(e);
      } finally {
        loading.close();
      }
    },

    async addProjectByTpl(form) {
      const loading = this.$loading({
        lock: true,
        text: "工程部署中, 请耐心等候！",
        spinner: "el-icon-loading"
      });
      try {
        const data = await apiAddProject(form);
        this.$router.push(`/project/${data.project_name}`)
      } catch (e) {
        console.error(e);
      } finally {
        loading.close();
      }
    },
  }
};
</script>