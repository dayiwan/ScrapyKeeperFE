<template>
  <div class="add-field">
    <el-dialog :visible.sync="visible" :show-close="false" :close-on-click-modal="false">
      <div class="title">添加参数</div>
      <div class="content">
        <div class="content-title">已有参数</div>
        <div class="old-field" ref="msg">
          <p v-for="log_line in logList" :key="log_line">{{log_line}}</p>
        </div>
      </div>

      <div class="content">
        <div class="content-title">添加参数</div>
        <el-input v-model="newField"></el-input>
        <el-button type="primary" plain @click="add">添加</el-button>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary">确认添加</el-button>
        <el-button size="small" @click="cancle">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newField: "",
      logList: []
    };
  },
  props: ["visible"],
  methods: {
    // 添加
    add() {
      if (this.logList.indexOf(this.newField) > -1) {
        this.$message.error("该参数已存在，请重新输入!");
      } else {
        this.logList.push(this.newField);
        this.newField = "";
        let _self = this;
        setTimeout(function() {
          _self.$refs.msg.scrollTo({
            top: _self.$refs.msg.scrollHeight,
            behavior: "smooth"
          });
        }, 30);
      }
    },
    // 退出
    cancle() {
      this.$emit("addFieldCancle");
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  margin-bottom: 20px;
  margin-top: -30px;
  font-weight: bolder;
  font-size: 18px;
}
.content {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
  &-title {
    font-weight: bold;
    width: 80px;
  }
  .el-input {
    width: 300px;
    margin-right: 30px;
  }
  .old-field {
    width: 100%;
    height: 200px;
    overflow-y: auto;
    border: 1px solid #ebeef5;
    p {
      padding: 0 5px 0 5px;
      word-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
    }
  }
}
</style>>