<template>
  <div class="add-field">
    <el-dialog :visible.sync="visible" :show-close="false" :close-on-click-modal="false">
      <!-- <div class="add-field-section" v-for="(item, k) in fieldToAdd" :key="k">
        <div class="add-field-row">
          <div class="content">
            <div class="content-title">{{ item.tip }}</div>
          </div>

          <div class="content">
            <div class="content-title">已有参数</div>
            <div class="old-field" ref="msg">
              <p>{{item.value}}</p>
            </div>
          </div>

          <div class="content">
            <div class="content-title">添加参数</div>
            <el-input @input="val => item.recentVal = val"></el-input>
            <el-button type="primary" plain @click="add(k)">添加</el-button>
          </div>
        </div>
      </div>-->
      <div class="title">添加参数</div>
      <div class="add-field-section" v-for="(item, i) in fieldToAdd" :key="i">
          <div class="content">
            <div class="content-title">{{ item.tip }}</div>
            <div class="old-field" ref="msg">
              <p>{{item.value}}</p>
            </div>
          </div>
          <div class="content">
            <div class="content-title">添加参数</div>
            <el-input v-model="item.recentVal"></el-input>
            <el-button type="primary" plain @click="add(i)">添加</el-button>
          </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submit">确认添加</el-button>
        <el-button size="small" @click="cancle">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import deepcopy from "deepcopy";
export default {
  data() {
    return {
      newField: "",
      logList: [],
      fieldToAdd: [],
      recentVal: ""
    };
  },
  props: ["visible", "tpl_input"],
  watch: {
    tpl_input: function(newVal) {
      if (newVal != null) {
        const tplInput = JSON.parse(newVal);
        for (const key in tplInput) {
          if (tplInput[key].type == 1) {
            let tmp = {};
            tmp = deepcopy(tplInput[key]);
            tmp.recentVal = null;
            tmp.key = key;
            tmp.value = tplInput[key].value.split(",");
            this.fieldToAdd.push(tmp);
          }
        }
      }
    }
  },
  methods: {
    // 添加
    add(i) {
      if (
        this.fieldToAdd[i].value.indexOf(this.fieldToAdd[i].recentVal) == -1
      ) {
        this.fieldToAdd[i].value.push(this.fieldToAdd[i].recentVal);
        this.fieldToAdd[i].recentVal = '';
      } else {
        this.$message.info("该参数已存在");
      }
    },
    // 确认添加
    submit() {
      this.$emit("addFieldSubmit", this.fieldToAdd)
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
  margin-top: 20px;
  &-title {
    font-weight: bold;
    margin-bottom: 10px;
  }
  .el-input {
    width: 300px;
    margin-right: 30px;
  }
  .old-field {
    width: 100%;
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