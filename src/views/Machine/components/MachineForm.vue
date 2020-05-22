<template>
  <div class="machine-form">
    <el-form>
      <el-form-item label="服务器ip" label-width="200">
        <el-input
          v-model="url_"
          @input="chgServerIp"
          auto-complete="off"
          placeholder="格式: http://172.10.10.183:6800"
        ></el-input>
      </el-form-item>

      <el-form-item label="服务器状态" label-width="200">
        <el-radio-group v-model="status_" @change="chgServerStatus">
          <el-radio :label="1">可用</el-radio>
          <el-radio :label="0">不可用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="服务器类型" label-width="200">
        <el-radio-group v-model="is_master" @change="chgIsMaster">
          <el-radio :label="1">主服务器</el-radio>
          <el-radio :label="0">从服务器</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <el-button @click="onConfirm">提交</el-button>
  </div>
</template>


<script>
export default {
  props: {
    url: { type: String },
    status: { type: Number },
    isMaster: { type: Number }
  },
  data() {
    return {
      url_: this.url,
      status_: this.status,
      is_master: this.isMaster,
    };
  },
  watch: {
    url: function(val) {
      this.url_ = val;
    },
    status: function(val) {
      this.status_ = val;
    },
    isMaster: function(val) {
      this.is_master = val;
    }
  },
  methods: {
    onConfirm() {
      if (this.url_ == "") {
        this.$message.error("请输入服务器ip地址");
      } else {
        this.$emit("confirm");
      }
    },
    chgServerIp(val) {
      this.$emit("update:url", val);
    },
    chgServerStatus(val) {
      this.$emit("update:status", val);
    },
    chgIsMaster(val) {
      this.$emit("update:isMaster", val);
    }
  }
};
</script>