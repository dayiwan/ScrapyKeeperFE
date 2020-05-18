<template>
  <div
    class="app-container"
    v-loading.loading="false"
    element-loading-text="添加服务器中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <el-table
      :data="list"
      v-loading.body="loading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="服务器ip">
        <template slot-scope="scope">{{scope.row.url}}</template>
      </el-table-column>
      <el-table-column label="服务器类型" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.is_master == 1">主服务器</span>
          <span v-else>从服务器</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="155">
        <template slot-scope="scope">
          <span style="font-weight: 700;" v-if="scope.row.status == 1">可用</span>
          <span style="color: #999999;" v-else>不可用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="onEditBtnClick(scope.row)">编辑</el-button>
          <el-button size="mini" @click="delMachine(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button id="add_server" type="primary" @click="dialogShow = true; handler.type='ADD'">添加服务器</el-button>

    <el-dialog title="添加服务器" :visible.sync="dialogShow">
      <machineForm
        :url.sync="machineForm.url"
        :isMaster.sync="machineForm.is_master"
        :status.sync="machineForm.status"
        @confirm="onMachineFormConfirm"
      />
    </el-dialog>
  </div>
</template>

<style rel="stylesheet/scss" lang="scss">
#add_server {
  margin-top: 20px;
}
</style>

<script>
import {
  apiListMachine,
  apiAddmachine,
  apiDelMachine,
  apiEditMachine
} from "@/api/machine";
import machineForm from "./components/MachineForm";
export default {
  components: { machineForm },
  data() {
    return {
      list: [],
      machineForm: {
        url: "",
        status: 1,
        is_master: 0
      },
      // 操作【新增、编辑】
      handler: {
        type: "ADD",
        id: null
      },
      loading: false,
      dialogShow: false
    };
  },
  created() {
    this.listMachine();
  },
  mounted() {},
  methods: {
    onEditBtnClick(row) {
      this.handler.type = "EDIT"
      this.handler.id = row.id;
      this.machineForm.url = row.url;
      this.machineForm.status = row.status;
      this.machineForm.is_master = row.is_master;

      this.dialogShow = true;
    },

    // 获取服务器列表
    async listMachine() {
      this.loading = true;
      try {
        const res = await apiListMachine();
        this.list = [];
        for (const machRes of res) {
          this.list.push(machRes);
        }
      } catch (e) {
        this.$message.error("服务器列表获取错误 " + e);
      }
      this.loading = false;
    },

    // 添加服务器
    async addMachine(form) {
      this.dialogShow = false;
      this.loading = true;
      try {
        await apiAddmachine(form);
        await this.listMachine();
        const res = this.$message.success("添加成功");
      } finally {
        this.loading = false;
      }
    },

    // 编辑服务器
    async editMachine(form) {
      this.loading = true;
      this.dialogShow = false;
      try {
        await apiEditMachine(form);
        await this.listMachine();
        this.$message.success("操作成功");
      } finally {
         this.loading = false;
      }
    },

    // 删除服务器
    delMachine: function(id) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await apiDelMachine(id);
        this.$message.success("删除成功");
        await this.listMachine();
      }).catch(() => {});
    },
    onMachineFormConfirm: function() {
      const _form = this.$deepcopy(this.machineForm);
      if (this.handler.type == "ADD") {
        this.addMachine(_form);
      } else if (this.handler.type == "EDIT") {
        _form.id = this.handler.id
        this.editMachine(_form)
      } else {
        this.$message.error("错误的操作类型！");
      }
    }
  }
};
</script>
