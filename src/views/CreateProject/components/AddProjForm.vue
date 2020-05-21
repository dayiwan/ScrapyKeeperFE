<template>
  <el-form class="add-proj-form" :model="form" label-width="80px">
    <el-form-item label="项目名称">
      <el-input size="small" v-model="form.project_name_zh" @input="chgNameZh"  style="width: 320px;"></el-input>
    </el-form-item>

    <el-form-item label="项目标识（英文）">
      <el-input size="small" v-model="form.project_name" style="width: 320px;"></el-input>
    </el-form-item>

    <el-form-item label="项目名称">
      <div class="upload-area">
        <el-upload
          ref="tplFile"
          action
          :file-list="masterEggs"
          :auto-upload="false"
          :limit="1"
          :on-change="chgMasterEgg"
        >
          <el-button slot="trigger" size="small" type="primary">上传模板代码（zip压缩文件）</el-button>
        </el-upload>

        <el-upload
          ref="tplFile"
          action
          :file-list="slaveEggs"
          :auto-upload="false"
          :limit="1"
          :on-change="chgSlaveEgg"
        >
          <el-button slot="trigger" size="small" type="primary">上传模板代码（zip压缩文件）</el-button>
        </el-upload>
      </div>
    </el-form-item>
    <el-button size="small" @click="onSubmit">提交</el-button>
  </el-form>
</template>


<script>
import PinyinMixin from './PinyinMixin'
export default {
  mixins: [PinyinMixin],
  data() {
    return {
      form: {
        project_name: null,
        project_name_zh: null,
        master_egg: null,
        slave_egg: null
      },
      masterEggs: [],
      slaveEggs: []
    };
  },
  methods: {
    async chgMasterEgg(file, fileList) {
      const rawFile = file.raw;
      this.form.master_egg = file.raw;
      this.masterEggs = fileList;
    },
    chgSlaveEgg(file, fileList) {
      const rawFile = file.raw;
      this.form.slave_egg = file.raw;
      this.slaveEggs = fileList;
    },
    onSubmit() {
      let formData = new FormData();
      for (let key in this.form) {
        if (this.form[key] instanceof File) {
          formData.append(key, null);
          formData.set(key, this.form[key]);
        } else {
          formData.append(key, this.form[key]);
        }
      }
      this.$emit("submit", formData);
    }
  }
};
</script>

<style lang="scss">
.add-proj-form {
  .upload-area {
    @include flex(row, flex-start, flex-start);
    margin-bottom: 20px;
    .el-upload {
      margin-right: 50px;
    }
  }
}
</style>