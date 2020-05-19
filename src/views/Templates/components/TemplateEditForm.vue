<template>
  <div class="template-form">
    <el-form label-position="top">
      <el-form-item label="模板名称" prop="tpl_zh">
        <el-input v-model="form.tpl_zh" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>

    <div class="tpl-info" v-show="form.tpl_zip !== null">
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
            默认值：
            <el-input size="small" style="width: 250px;" v-model="inputItem.value"></el-input>
          </div>
        </div>
      </section>
    </div>
    <el-button
      @click="onConfirm"
      v-show="form.tpl_zip !== null"
      style="width: 100%; margin-top: 15px;"
    >提 交</el-button>
  </div>
</template>

<script>
import { apiParseTmpl } from "@/api/templateAdd";
import deepcopy from "deepcopy";
export default {
  props: {
    template: {
      type: Object,
      default: function() {
        return {
          id: null,
          tpl_name: this.tplName,
          tpl_zh: this.tplZh,
          tpl_type: this.type,
          tpl_input: JSON.parse(this.tplInput)
        };
      }
    }
  },
  data() {
    return {
      form: deepcopy(this.template)
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
    template: function(val) {
      this.form = deepcopy(val);
    }
  },
  methods: {
    onConfirm() {
      if (this.form.tpl_zh == '') {
        this.$message.error('请输入模板名称')
        return;
      }
      let _form = deepcopy(this.form);
      _form.tpl_input = JSON.stringify(_form.tpl_input);
      this.$emit("confirm", _form);
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