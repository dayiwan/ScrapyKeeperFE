<template>
  <el-form :model="form" :rules="rules" ref="form" class="template-form">
    <el-form-item label-width="50" prop="agency_name">
      <el-col :span="4">
        <span>代理名称</span>
      </el-col>
      <el-col :span="13">
        <el-input name="agency_name" v-model="form.agency_name"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label-width="50" prop="req_url">
      <el-col :span="4">
        <span>代理URL</span>
      </el-col>
      <el-col :span="13">
        <el-input name="req_url" v-model="form.req_url"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label-width="50" prop="req_num_max">
      <el-col :span="4">
        <span>最大IP量 （天）</span>
      </el-col>
      <el-col :span="13">
        <el-input-number name="req_num_max" :min="1" v-model="form.req_num_max"></el-input-number>
      </el-col>
    </el-form-item>

    <el-form-item label-width="50" prop="live_time">
      <el-col :span="4">
        <span>IP存活时长（分）</span>
      </el-col>
      <el-col :span="13">
        <el-input-number name="live_time" :min="1" v-model="form.live_time"></el-input-number>
      </el-col>
    </el-form-item>

    <el-form-item label-width="50" prop="req_num_per">
      <el-col :span="4">
        <span>IP带宽（个 / 次）</span>
      </el-col>
      <el-col :span="13">
        <el-input-number name="req_num_per" :min="1" v-model="form.req_num_per"></el-input-number>
      </el-col>
    </el-form-item>

    <el-form-item label-width="50">
      <el-col :span="4">
        <span>请求类型</span>
      </el-col>
      <el-col :span="10">
        <el-select v-model="form.method" placeholder="请选择">
          <el-option key="GET" label="GET" value="GET"></el-option>
          <el-option key="POST" label="POST" value="POST"></el-option>
          <el-option key="PUT" label="PUT" value="PUT"></el-option>
        </el-select>
      </el-col>
    </el-form-item>

    <el-menu
      default-active="params"
      mode="horizontal"
      active-text-color="black"
      @select="chgParamType"
      style="margin-bottom: 15px;"
    >
      <el-menu-item index="params">GET参数</el-menu-item>
      <el-menu-item index="headers">请求头</el-menu-item>
      <el-menu-item index="body">请求body</el-menu-item>
    </el-menu>

    <el-form-item
      v-for="paramKey in ['params', 'headers', 'body']"
      :key="paramKey"
      v-show="paramType == paramKey"
    >
      <el-row :gutter="20" v-for="(paramRow, index) in form[paramKey]" :key="index">
        <el-col :span="4">
          <el-input size="small" v-model="paramRow.key" placeholder="参数名"></el-input>
        </el-col>
        <el-col :span="5">
          <el-input size="small" v-model="paramRow.value" placeholder="参数值"></el-input>
        </el-col>
        <el-col :span="2" class="delbnt">
          <el-button size="small" @click.prevent="delParamRow(index)">删除</el-button>
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item>
      <el-button @click="addParamRow" size="small" type="text">+ 新增参数</el-button>
    </el-form-item>

    <el-form-item style="margin-bottom: 0;">
      <el-button @click="onSubmit" size="small" type="primary">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
var isUrl = require("is-url");

export default {
  props: {
    agent: {
      type: Object,
      default: function() {
        return {
          agency_name: null,
          req_url: null,
          method: "GET",
          req_num_max: 1,
          req_num_per: 1,
          live_time: 1,
          params: [],
          headers: [],
          body: []
        };
      }
    }
  },
  watch: {
    agent: function(val) {
      this.form = this.$deepcopy(val);
    }
  },
  data() {
    return {
      type: "params",
      paramType: "params",
      form: this.$deepcopy(this.agent),
      rules: {
        agency_name: [
          { required: true, message: "请输入代理名称", trigger: "blur" }
        ],
        req_url: [
          { required: true, message: "请输入正确URL", trigger: "blur" },
          {
            min: 3,
            max: 100,
            message: "长度在 3 到 100 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    addParamRow() {
      this.form[this.paramType].push({
        key: "",
        value: ""
      });
    },
    delParamRow(i) {
      this.form[this.paramType].splice(i, 1);
    },
    chgParamType(val) {
      this.paramType = val;
    },
    onSubmit() {
      if (!isUrl(this.form.req_url)) {
        this.$message.error("请输入合法url");
        return;
      }

      if (this.form.agency_name == "") {
        this.$message.error("请输入代理名称");
        return;
      }

      let form = this.$deepcopy(this.form);
      form.params = JSON.stringify(form.params);
      form.headers = JSON.stringify(form.headers);
      form.body = JSON.stringify(form.body);
      this.$emit("submit", form);
    }
  }
};
</script>