<template>
  <div class="base-info">
    <el-dialog
      title="添加工程"
      :visible.sync="visible"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="100px" label-position="top">
        <el-form-item label="项目名称">
          <el-input v-model="form.project_name_zh" auto-complete="off" style="width: 320px;"></el-input>
        </el-form-item>

        <el-form-item label="模板名称">
          <el-select v-model="form.template" placeholder="请选择" @change="change">
            <el-option
              v-for="item in tplList"
              :key="item.tpl_name"
              :label="item.tpl_zh"
              :value="item.tpl_name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-for="(item, _key) in form.tpl_input" :key=_key :label="item.tip">
          <el-input v-model="item.value" :placeholder="item.tip"></el-input>
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
import { setField, getField } from "@/utils/cookies"
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tplList: {
      type: Array  // 模板列表 
    }
  },
  // props: ["visible", "tplList"],
  data() {
    return {
      form: {
        project_name_zh: '',
        template:'',
        tpl_input: {},
      }
    };
  },
  methods: {
    change() {
      for (let item of this.tplList) {
        if (item.tpl_name === this.form.template ) {
          this.form.tpl_input = JSON.parse(item.tpl_input)
          let recentInput = getField(item.tpl_name)
          if (recentInput) {
            recentInput =  JSON.parse(recentInput)
            // 这里不用Object.assgin 是因为cookies里面的key可能是过期的,要优先保证form.tplInput的key
            for (const key in this.form.tpl_input) {
              if (recentInput[key]) {
                this.form.tpl_input[key] = recentInput[key]
              } 
            }
          }
        }
      }
    },
    filterMethod(query, item) {
      return item;
    },
    submit() {
      setField(this.form.template, this.form.tpl_input)
      this.$emit("addProjectSubmit", this.form);
    },
    cancle() {
      this.$emit("addProjectCancle");
    }
  }
};
</script>