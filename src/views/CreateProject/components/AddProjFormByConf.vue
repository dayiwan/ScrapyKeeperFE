<template>
  <el-form class="fast-proj-form" :model="form" label-position="top">
    <el-form-item label="项目标识（英文）">
      <el-input size="small" v-model="form.project_name" style="width: 320px;"></el-input>
    </el-form-item>
    <el-form-item label="项目名称">
      <el-input size="small" v-model="form.project_name_zh" style="width: 320px;"></el-input>
    </el-form-item>

    <el-form-item label="数据存储字段">
      <div class="field" v-for="(field, index) in form.fields" :key="index">
        <el-select style="width: 120px;" v-model="field.type" size="small" placeholder="请选择">
          <el-option label="字符串" value="String(255)"></el-option>
          <el-option label="数字" value="Float"></el-option>
          <el-option label="长文本" value="Text"></el-option>
          <el-option label="媒体链接" value="Media"></el-option>
        </el-select>
        <el-input size="small" v-model="field.name" style="width: 300px;" placeholder="请输入字段名"></el-input>

        <div class="field-title">提取规则</div>
        <el-select
          style="width: 120px;"
          v-model="field.extract_rule_type"
          size="small"
          placeholder="请选择"
        >
          <el-option label="xpath" value="xpath"></el-option>
          <el-option label="css" value="css"></el-option>
          <el-option label="正则表达式" value="regexp"></el-option>
        </el-select>

        <el-input size="small" v-model="field.extract_rule" style="width: 300px;"></el-input>

        <el-button type="text" icon="el-icon-delete" class="del-btn" @click="delField(index)"></el-button>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button type="text" @click="addField">+添加参数</el-button>
    </el-form-item>

    <el-button size="small" @click="onSubmit">提交</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        project_name: null,
        project_name_zh: null,
        fields: [
          {
            name: null,
            type: "String(255)",
            extract_rule_type: "xpath",
            extract_rule: null
          }
        ]
      }
    };
  },
  methods: {
    addField() {
      this.form.fields.push({
        name: null,
        type: "String(255)",
        extract_rule_type: "xpath",
        extract_rule: null
      });
    },
    delField(i) {
      this.form.fields.splice(i, 1)
    },
    onSubmit() {
      const _form = this.$deepcopy(this.form)
      this.$emit('submit', _form)
    }
  }
};
</script>

<style lang="scss">
.fast-proj-form {
  .field {
    @include flex(row, flex-start);

    .del-btn {
      margin-left: 20px;
      font-size: 20px;
      color: #ff3d3d;
    }
  }
  .field-title {
    width: 60px;
    color: black;
    margin-left: 30px;
    margin-right: 10px;
    &:first-child {
      margin-left: 0;
    }
  }
}
</style>