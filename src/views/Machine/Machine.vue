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
          <span style="font-weight: 700;" v-if="scope.row.status == 1">
            可用
            <el-button type="text" style="padding-left: 10px" @click="watchDetail(scope.row.url)">查看详情</el-button>
          </span>
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
    <el-button id="add_server" size="small" plain @click="dialogShow = true; handler.type='ADD'">+添加服务器</el-button>

    <!-- 添加服务器弹框  -->
    <el-dialog title="添加服务器" :visible.sync="dialogShow">
      <machineForm
        :url.sync="machineForm.url"
        :isMaster.sync="machineForm.is_master"
        :status.sync="machineForm.status"
        @confirm="onMachineFormConfirm"
      />
    </el-dialog>

    <!-- 查看服务器节点详情弹框 -->
    <el-dialog title="节点详情" :visible.sync="dialogDetailShow">
      <machineDetail :detailForm="detailForm" />
    </el-dialog>
  </div>
</template>

<style rel="stylesheet/scss" lang="scss">
#add_server {
  margin-top: 20px;
}
</style>

<script>
import apiMachine from '@/api/machine'
import machineForm from "./components/MachineForm";
import machineDetail from "./components/MachineDetail"
export default {
  components: { machineForm, machineDetail },
  data() {
    return {
      detailForm: {},
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
      dialogShow: false,
      dialogDetailShow: false,
      apiMachine
    };
  },
  created() {
    this.listMachine();
  },
  mounted() {},
  methods: {
    //查看服务器节点详情
    async watchDetail(ip) {
      this.loading = true
      try {
        const rawdata = await apiMachine.get({url: ip})
        const data = {
          cpu: [
            {
              name: 'CPU使用率：',
              value: rawdata.cpu.percent
            }
          ],
          memory: [
            {
              name: '内存使用率：',
              value: rawdata.memory.percent
            },
            {
              name: '内存总量：',
              value: rawdata.memory.total
            }
          ],
          disk: [
            {
              name: '硬盘使用率：',
              value: rawdata.disk.percent
            },
            {
              name: '硬盘总量：',
              value: rawdata.disk.total
            }
          ],
          network: [
            {
              name: '带宽上传量：',
              value: rawdata.network.send
            },
            {
              name: '带宽下载量：',
              value: rawdata.network.receive
            }
          ],
          info: [
            {
              name: '运行中：',
              value: rawdata.running
            },
            {
              name: '休眠中：',
              value: rawdata.pending
            },
            {
              name: '已完成：',
              value: rawdata.finished
            }
          ],
          node_name: rawdata.node_name,
        }
        this.dialogDetailShow = true
        this.detailForm = data
      } catch(e) {
        this.$$message.error("获取详情失败" + e)
      }
      this.loading = false
    },
    onEditBtnClick(row) {
      this.handler.type = "EDIT";
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
        const res = await this.apiMachine.get();
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
        await this.apiMachine.post(form);
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
        await this.apiMachine.put(form);
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
        await this.apiMachine.delete({ id })
        this.$message.success("删除成功");
        await this.listMachine();
      }).catch(() => {});
    },
    onMachineFormConfirm: function() {
      const _form = this.$deepcopy(this.machineForm);
      if (this.handler.type == "ADD") {
        this.addMachine(_form);
      } else if (this.handler.type == "EDIT") {
        _form.id = this.handler.id;
        this.editMachine(_form);
      } else {
        this.$message.error("错误的操作类型！");
      }
    }
  }
};
</script>

