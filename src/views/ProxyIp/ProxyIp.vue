<template>
  <div class="proxy-ip">
    <el-table :data="agentData" element-loading-text="加载中..." v-loading.body="loading">
      <el-table-column label="序号" width="50" type="index" align="center"></el-table-column>

      <el-table-column label="代理名称" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.agency_name }}</template>
      </el-table-column>

      <el-table-column label="请求类型" width="140" align="center">
        <template slot-scope="scope">{{ scope.row.method }}</template>
      </el-table-column>

      <el-table-column label="最大IP量 (天)" width="140" align="center">
        <template slot-scope="scope">{{ scope.row.req_num_max }}</template>
      </el-table-column>

      <el-table-column label="存活时间 (分钟)" width="140" align="center">
        <template slot-scope="scope">{{ scope.row.live_time }}</template>
      </el-table-column>

      <el-table-column label="IP带宽（个 / 次）" width="140" align="center">
        <template slot-scope="scope">{{ scope.row.req_num_per }}</template>
      </el-table-column>

      <el-table-column label width="30"></el-table-column>

      <el-table-column label="代理URL">
        <template slot-scope="scope">{{ scope.row.req_url }}</template>
      </el-table-column>

      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="onEditBtnClick(scope.row)">编辑</el-button>
          <el-button slot="reference" size="mini" @click="delAgency(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" size="small" plain @click="onAddBtnClick" class="add-btn">
      添加代理
      <i class="el-icon-plus el-icon--right"></i>
    </el-button>

    <el-dialog title="添加代理" :visible.sync="dialogShow" width="800px">
      <ProxyIpForm :agent="agent" @submit="onSubmit" />
    </el-dialog>
  </div>
</template>

<style>
.proxy-ip {
  padding: 20px;
}

.add-btn {
  margin-top: 15px;
}
</style>

<script>
import {
  apiDelAgency,
  apiAddAgency,
  apiListAgency,
  apiEditAgency
} from "@/api/proxyIp";
import * as deepcopy from "deepcopy";
import ProxyIpForm from "./components/ProxyIpForm";
export default {
  components: { ProxyIpForm },
  data() {
    return {
      agentData: [],
      dialogShow: false,
      hanlder: {
        type: "ADD",
        id: null
      },
      agent: {
        agency_name: null,
        req_url: null,
        method: "GET",
        req_num_max: 1,
        req_num_per: 1,
        live_time: 1,
        params: [],
        headers: [],
        body: []
      },
      loading: false
    };
  },
  mounted() {
    this.listAgency();
  },
  methods: {
    // 代理商
    async listAgency() {
      this.loading = true;
      try {
        const data = await apiListAgency();
        this.agentData = data;
      } finally {
        this.loading = false;
      }
    },
    onAddBtnClick() {
      this.hanlder.type = "ADD";
      this.dialogShow = true;
    },
    onEditBtnClick(row) {
      this.hanlder.id = row.id;
      this.hanlder.type = "EDIT";
      this.agent = deepcopy(row);
      this.agent.params = JSON.parse(this.agent.params);
      this.agent.headers = JSON.parse(this.agent.headers);
      this.agent.body = JSON.parse(this.agent.body);
      this.dialogShow = true;
    },
    async onSubmit(form) {
      this.dialogShow = false;
      this.loading = true;
      try {
        if (this.hanlder.type == "ADD") {
          await apiAddAgency(form);
        } else {
          await apiEditAgency(form);
        }
        await this.listAgency()
        this.$message.success('操作成功')
      } finally {
        this.loading = false;
      }
    },
    async delAgency(id) {
      try {
        this.loading = true;
        await apiDelAgency(id);
        this.$message.success('删除成功');
      } finally {
        await this.listAgency()
        this.loading = false;
      }
    }
  }
};
</script>
