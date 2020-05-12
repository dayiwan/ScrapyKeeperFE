<template>
  <div class="log-view">
    <el-dialog :visible.sync="visible" :show-close="false" :close-on-click-modal="false">
      <div class="title">{{title}}</div>
      <div class="content">
        <p v-for="log_line in logList" :key="log_line">{{log_line}}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="title === '日志详情'" type="primary" size="small" @click="submit">提交处理</el-button>
        <el-button size="small" @click="cancle">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["visible", "logList", "title"],
  methods: {
    cancle() {
      this.$emit("logViewCancle");
    },
    submit() {
      this.$emit('handleJournal')
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
  height: 500px;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  p {
    padding: 0 5px 0 5px;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
}
</style>>