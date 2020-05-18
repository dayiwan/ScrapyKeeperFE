<template>
  <div class="template-form">
    <div class="upload-area">
      <el-upload
        ref="tplFile"
        action
        :file-list="zipList"
        :auto-upload="false"
        :limit="1"
        :on-change="chgZip"
      >
        <el-button slot="trigger" size="small" type="primary">上传模板代码（zip压缩文件）</el-button>
      </el-upload>

      <el-upload
        class="avatar-uploader"
        action
        :show-file-list="false"
        :on-change="chgImg"
        :auto-upload="false"
      >
        <img v-if="imgSrc" :src="imgSrc" class="tpl-img" />
        <el-button v-else size="small" type="primary">上传模板图片</el-button>
      </el-upload>
    </div>

    <el-form label-position="top" v-if="form.tpl_zip != null">
      <el-form-item label="模板名称" prop="tpl_zh">
        <el-input v-model="form.tpl_zh" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>

    <div class="tpl-info" v-show="form.tpl_zip !== null">
      <h3>以下模板信息为自动解析</h3>
      <section>
        <span class="title">
          <i class="el-icon-folder-opened"></i> 模板文件夹：
        </span>
        <span>{{ form.tpl_name }}</span>
      </section>

      <section>
        <span class="title">
          <i class="el-icon-cpu"></i> 模板类型：
        </span>
        <span>{{ form.tpl_type | tplTypeFilter }}</span>
      </section>

      <section>
        <span class="title">
          <i class="el-icon-edit"></i> 模板输入
        </span>
        <div class="tpl-input">
          <div class="tpl-input-row" v-for="(inputItem, k) in form.tpl_input" :key="k">
            <span class="tpl-input-row-title">{{ inputItem.tip }} （{{ k }}）</span>
            默认值：<el-input size="small" style="width: 250px;" v-model="inputItem.value"></el-input>
          </div>
        </div>
      </section>
    </div>
    <el-button @click="onConfirm"  v-show="form.tpl_zip !== null" style="width: 100%; margin-top: 15px;">提 交</el-button>
  </div>
</template>

<script>
import { apiParseTmpl } from "@/api/templates";
import deepcopy from "deepcopy"
export default {
  props: {
    tplInput: { type: String, default: "{}" },
    tplName: { type: String, default: null },
    tplZh: { type: String },
    type: { type: Number }
  },
  data() {
    return {
      zipList: [],
      imgSrc: null,
      form: {
        tpl_zip: null,
        tpl_img: null,
        tpl_name: this.tplName,
        tpl_zh: this.tplZh,
        tpl_type: this.type,
        tpl_input: JSON.parse(this.tplInput)
      }
    };
  },
  filters: {
    tplTypeFilter: val => {
      switch (val) {
        case 0:
          return "添加即创建工程";
        case 1:
          return "从已有工程动态添加数据";
      }
    }
  },
  watch: {
    tpl_name: function(val) {
      this.form.tpl_name = val;
    },
    tpl_zh: function(val) {
      this.form.tpl_zh = val;
    },
    tplType: function(val) {
      this.form.tpl_type = val;
    },
    tplInput: function(val) {
      this.form.tplInput = JSON.parse(val);
    }
  },
  methods: {
    async chgZip(file, fileList) {
      const rawFile = file.raw;
      this.zipList = fileList;
      const data = await apiParseTmpl(rawFile);
      this.form.tpl_zip = rawFile;
      this.form.tpl_name = data.name;
      this.form.tpl_zh = data.name_zh;
      this.form.tpl_type = data.type;
      this.form.tpl_input = data.tpl_input;
    },
    chgImg(file, fileList) {
      this.form.tpl_img = file.raw;
      this.imgSrc = URL.createObjectURL(file.raw);
    },
    validate() {
      if (this.form.tpl_zip == null) {
        this.$message.error("请上传模板文件");
        return false;
      }
      if (this.form.tpl_img == null) {
        this.$message.error("请上传模板图片");
        return false;
      }
      if (this.form.tpl_zh == "") {
        this.$message.error("输入模板名称");
        return false;
      }
      return true;
    },
    onConfirm() {
      if (this.validate()) {
        let _form = deepcopy(this.form)
        _form.tpl_input = JSON.stringify(_form.tpl_input)
        this.$emit("confirm", _form);
      }
    }
  }
};
</script>

<style lang="scss">
.template-form {
  .upload-area {
    @include flex(row, flex-start, flex-start);
    margin-bottom: 20px;
    .el-upload {
      margin-right: 50px;
    }
  }

  .tpl-img {
    width: 65px;
    height: 65px;
  }

  .tpl-info {
    padding: 0 20px;
    border: 1px solid #cccccc;
    border-radius: 5px;

    section {
      margin: 20px 0;
      font-size: 16px;
    }
    .title {
      font-size: 16px;
      font-weight: bolder;
      margin-right: 5px;
    }

    .tpl-input-row {
      padding: 10px 0;

      &:first-child {
        padding-top: 20px;
      }

      &-title {
        display: inline-block;
        width: 350px;
      }
    }
  }
}
</style>