<template>
  <el-form class="add-proj-bytpl"  :model="form" label-width="100px" label-position="top">
    <el-form-item prop="project_name_zh" label="工程名称" :rules="[{ required: true, message: '请输入工程名称', trigger: 'blur' }]">
      <el-input size="small" v-model="form.project_name_zh"  @input="chgNameZh" auto-complete="off" style="width: 320px;"></el-input>
    </el-form-item>

    <el-form-item label="工程标识（英文）">
      <el-input size="small" v-model="form.project_name" style="width: 320px;"></el-input>
    </el-form-item>
    

    <el-form-item label="模板名称">
      <el-select v-model="form.template" size="small" placeholder="请选择">
        <el-option
          v-for="item in tplList"
          :key="item.tpl_name"
          :label="item.tpl_zh"
          :value="item.tpl_name"
        ></el-option>
      </el-select>
    </el-form-item>
    
    <el-button size="small" @click="onSubmit">提交</el-button>
  </el-form>
</template>

<script>
import PinyinMixin from './PinyinMixin'
export default {
  mixins: [PinyinMixin],
  props: {
    tplList: { type: Array }
  },
  data() {
    return {
      form: {
        project_name_zh: null,
        template: null
      },
    }
  },
  methods: {
    onSubmit() {
      const _form = this.$deepcopy(this.form)
      this.$emit('submit', _form)
    }
  }
}
</script>