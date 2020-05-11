<template>
  <div class="base-info">
    <el-dialog
      title="添加模板"
      :visible.sync="visible"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-position="top">
        <el-form-item label="模板名称(英文|与模板工程名相同)" prop="tpl_name">
          <el-input size="mini" v-model="form.tpl_name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="模板中文名" prop="tpl_zh">
          <el-input size="mini" v-model="form.tpl_zh" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="模板类型" prop="category">
          <el-radio v-model="form.tpl_type" :label="0">添加即创建工程</el-radio>
          <el-radio v-model="form.tpl_type" :label="1">从已有工程动态添加数据</el-radio>
        </el-form-item>

        <el-form-item label="模板输入" prop="category">
          <div class="tpl-input" v-for="(inputItem, index) in tplInput" :key="index">
            <span>要输入的项：</span>
            <el-input size="mini" v-model="inputItem.key" auto-complete="off"></el-input>
            <span>输入时的中文提示语：</span>
            <el-input size="mini" v-model="inputItem.tip" auto-complete="off"></el-input>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delInput(index)"></el-button>
          </div>

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
  props: ["visible"],
  data() {
    return {
      form: {
        tpl_name: null,
        tpl_zh: null,
        tpl_type: 0,
        tpl_input: null,
        tpl_zip: null,
        tpl_img: null
      },
      tplInput: [
        {
          key: "start_url",
          tip: "请输入url"
        }
      ],
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
      if (!this.checkTplInput()) {
        this.$message({
          type: "error",
          message: "所填字段不能为空!"
        });
      } else {
        this.form.tpl_input = JSON.stringify(this.tplInput);
        this.$emit("addProjectSubmit", this.form);
      }
    },
    cancle() {
      this.$emit("addProjectCancle");
    },
    addInput() {
      this.tplInput.push({
        key: "",
        tip: ""
      });
    },
    delInput(i) {
      if (this.tplInput.length == 1) {
        this.$message.info("至少添加一种输入");
        return;
      }
      this.tplInput.splice(i, 1);
    },
    checkTplInput() {
      if (!this.form.tpl_name || !this.form.tpl_zh) {
        return false;
      }
      for (const inputItem of this.tplInput) {
        if (inputItem.key == "" || inputItem.tip == "") {
          return false;
        }
      }
      return true;
    },
    fileChange(file, fileList) {
      this.form.tpl_zip = file.raw;
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
  @include flex(row, flex-start);
  margin-bottom: 10px;
  span {
    display: block;
    text-align: right;
    margin: 0 15px;
    &:first-child {
      margin-left: 0;
    }
  }
  .el-input {
    width: 150px !important;
  }
  .el-button {
    margin-left: 10px;
  }
}
.tpl-img {
  width: 100px;
  height: 100px;
}
</style>