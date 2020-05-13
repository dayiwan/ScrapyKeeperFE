<template>
  <div class="base-info">
    <el-dialog
      title="添加模板"
      :visible.sync="visible"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="tplFile"
        action
        :file-list="tplZips"
        :auto-upload="false"
        :limit="1"
        :on-change="fileChange"
      >
        <el-button slot="trigger" size="small" type="primary">上传模板代码（zip文件）</el-button>
      </el-upload>

      <el-upload
        class="avatar-uploader"
        action
        :show-file-list="false"
        :on-change="imgChange"
        :auto-upload="false"
      >
        <img v-if="tplImg" :src="tplImg" class="tpl-img" />
        <el-button v-else size="small" type="primary">上传模板图片</el-button>
      </el-upload>

      <el-form :model="form" label-position="top">
        <el-form-item label="模板名称(英文|与模板工程名相同)" prop="tpl_name" v-if="form.tpl_name != null">
          <el-input size="mini" v-model="form.tpl_name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="模板中文名" prop="tpl_zh" v-if="form.tpl_zh != null">
          <el-input size="mini" v-model="form.tpl_zh" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="模板类型" prop="category" v-if="form.tpl_type != null">
          <el-radio v-model="form.tpl_type" :label="0">添加即创建工程</el-radio>
          <el-radio v-model="form.tpl_type" :label="1">从已有工程动态添加数据</el-radio>
        </el-form-item>

        <el-form-item label="模板输入" class="tpl-input" v-if="tplInput!= null">
          <div class="tpl-input-row" v-for="(inputItem, k) in tplInput" :key="k">
            <span class="tpl-input-title">录入key：</span>
            <span>{{ k }}</span>
            <span class="tpl-input-title">提示语：</span>
            <span>{{ inputItem.tip }}</span>
            <span class="tpl-input-title">默认值：</span>
            <span>{{ inputItem.value }}</span>
          </div>
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
import { apiParseTmpl } from "@/api/templates";
export default {
  props: ["visible"],
  data() {
    return {
      form: {
        tpl_name: null,
        tpl_zh: null,
        tpl_type: null,
        tpl_input: null,
        tpl_zip: null,
        tpl_img: null
      },
      tplInput: null,
      tplZips: [],
      tplImg: null,
      options: [
        {
          value: "news",
          label: "通用型新闻网页"
        },
        {
          value: "weibo",
          label: "新浪微博"
        },
        {
          value: "gongzhonghao",
          label: "微信公众号"
        }
      ],
      formLabelWidth: "200"
    };
  },
  methods: {
    submit() {
      if (!this.form.tpl_zip) {
        this.$message({
          type: "error",
          message: "请上传文件!"
        });
        return;
      }
      if (!this.form.tpl_img) {
        this.$message({
          type: "error",
          message: "请上传图片!"
        });
        return;
      }
      this.form.tpl_input = JSON.stringify(this.tplInput);
      this.$emit("addProjectSubmit", this.form);
    },
    cancle() {
      this.$emit("addProjectCancle");
    },
    async fileChange(file, fileList) {
      this.form.tpl_zip = file.raw;
      const data = await apiParseTmpl(file.raw);
      this.form.tpl_name = data.name;
      this.form.tpl_zh = data.name_zh;
      this.form.tpl_type = data.type;
      this.tplInput = data.tpl_input;
      this.form.tpl_input = JSON.stringify(data.tpl_input);
    },
    imgChange(file) {
      this.form.tpl_img = file.raw;
      this.tplImg = URL.createObjectURL(file.raw);
    }
  }
};
</script>

<style lang="scss">
.tpl-input {
  margin-bottom: 10px;
  .tpl-input-title {
    display: inline;
    font-weight: bolder;
    margin-left: 15px;
    &:first-child {
      margin-left: 0;
    }
  }
}
.tpl-img {
  width: 100px;
  height: 100px;
}
</style>