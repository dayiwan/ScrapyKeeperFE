<template>
  <div class="base-info">
    <el-dialog
      title="编辑项目"
      :visible.sync="visible"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form :model="editeForm" label-position="top">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="project_name_zh">
          <el-input v-model="editeForm.project_name_zh" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="分类" prop="category">
          <el-select v-model="editeForm.category" placeholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option label="通用型新闻网页" value="news"></el-option>
            <el-option label="新浪微博" value="weibo"></el-option>
            <el-option label="微信公众号" value="gongzhonghao"></el-option>
          </el-select>
          <!-- <el-input v-model="editeForm.category" auto-complete="off"></el-input> -->
        </el-form-item>

        <el-form-item label="类型" :label-width="formLabelWidth" prop="is_msd">
          <el-select v-model="editeForm.is_msd" placeholder="请选择">
            <el-option label="单机" value="0"></el-option>
            <el-option label="分布式" value="1"></el-option>
          </el-select>
          <!-- <el-input v-model="editeForm.is_msd" auto-complete="off"></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["visible", "form"],
  data() {
    return {
      formLabelWidth: "200"
    };
  },
  computed: {
    editeForm: function() {
      return this.form;
    }
  },
  methods: {
    submit() {
      this.$emit("editInfo", this.editeForm);
    },
    cancle() {
      this.$emit("cancle");
    }
  }
};
</script>