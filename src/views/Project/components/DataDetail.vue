<template>
  <div class="data-detail">
    <el-dialog :visible.sync="visible" :show-close="false" :close-on-click-modal="false">
      <div class="title">数据详情</div>
      <div class="table" v-if="content.length > 0">
          <el-table :data="content" max-height="500px" border>
              <el-table-column v-for="( item, index ) in header" :key="index" align="center" :label="item" show-overflow-tooltip>
                  <!-- <template>{{ index }}</template> -->
                  <template slot-scope="scope">{{ scope.row[item] ? scope.row[item] : 'null'}}</template>
              </el-table-column>
          </el-table>
      </div>
      <div class="no-table" v-else>暂无数据</div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancle">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    props:{
        header: {
            type: Array
        },
        content: {
            type: Array
        },
        visible: {
            type:Boolean
        }
    },
    methods: {
        cancle() {
            this.$emit("dataDetailCancle");
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  margin-bottom: 20px;
  margin-top: -30px;
  font-weight: bolder;
  font-size: 18px;
}

</style>