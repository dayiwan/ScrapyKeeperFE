<template>
    <div class="container">
        <el-form ref="configForm" :model="configForm" :rules="formRules" label-width="150px" label-position="left">
            <label class="tips"> 基本信息</label>
            <div class="block">
                <el-form-item label="scrapy工程名" prop="projectName" label-width="120px" >
                    <el-input v-model="configForm.projectName" class="input"></el-input>
                </el-form-item>
                <el-form-item label="scrapy蜘蛛名" prop="spiderName" label-width="120px">
                    <el-input v-model="configForm.spiderName" ></el-input>
                </el-form-item>
                <el-form-item label="数据存储地址" prop="dbAddress" label-width="120px">
                    <el-input v-model="configForm.dbAddress"></el-input>
                </el-form-item>
                <el-form-item label="数据库名" prop="dbName"  label-width="120px">
                    <el-input v-model="configForm.dbName"></el-input>
                </el-form-item>
            </div>

            <div class="block">
                <el-form-item label="数据库用户名" prop="dbUserName" label-width="120px" >
                    <el-input v-model="configForm.dbUserName"></el-input>
                </el-form-item>
                <el-form-item label="数据库密码" prop="dbPassword" label-width="120px"  >
                    <el-input v-model="configForm.dbPassword"></el-input>
                </el-form-item>
                <el-form-item label="数据库表名" prop="bdTableName"  label-width="120px" >
                    <el-input v-model="configForm.bdTableName"></el-input>
                </el-form-item>
                <el-form-item label="数据库表备注" prop="bdTableComment"  label-width="120px" >
                    <el-input v-model="configForm.bdTableComment" placeholder="如：裁判文书网-公益诉讼主题数据"></el-input>
                </el-form-item>
            </div>
            <div class="block">
                 <el-form-item label="数据采集类型" prop="dataType" label-width="120px" >
                    <el-radio-group v-model="configForm.dataType">
                        <el-radio label="STRUCTURED">仅结构化</el-radio>
                        <el-radio label="UNSTRUCTURED">仅非结构化</el-radio>
                        <el-radio label="BOTH">结构化+非结构化</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>

            <label class="tips"> 字段信息</label>
            <div class="block"
                v-for="(param, index) in configForm.items"
                :key="index">
                    <el-form-item 
                        label="字段名" 
                        label-width="120px" 
                        :prop="'items.' + index + '.name'"
                        :rules="[
                            { required: true, message: '小写字符、数字、_组成！', trigger: 'blur' },
                            { pattern: /^[a-z0-9_]*$/g, message: '不允许输入空格等特殊符号' }
                            ]"
                        >
                        <el-input v-model="param.name" >  
                    </el-input>
                    </el-form-item>
                    <el-form-item 
                        label="字段备注" 
                        label-width="120px"
                        >
                        <el-input v-model="param.value" ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button 
                            @click.prevent="removeItem(configForm, index)" 
                            class="button" 
                            type="danger" 
                            size="small">删除
                        </el-button>
                    </el-form-item>
            </div>
            <el-form-item >
                <el-button @click="addItem(configForm)">新增参数</el-button>
            </el-form-item>
            <el-button id="addprojectbtn" @click="fasterScrapy(configForm)" type="primary">快速生成</el-button>
            <a :href="downloadurl" class="download">下载</a>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
.container{
    margin: 10px 10px 0px 20px;
    .block{
        display: flex;
        flex-wrap: wrap;
        margin: 10px 0px 0px 40px;
        .el-form-item{
            margin-left: 20px;
        }
    }
}

.tips {
    border-left: 4px solid rgb(26, 135, 236);
    padding-left: 5px;
}
.download{
    display: none;
}

</style>


<script>
import { apiFasterScrapy } from '@/api/project'
export default {
    data() {
        // 自定义的爬虫名字段表单验证
        var validateSpiderName = (rule, value, callback) => {
            const reg = /^[a-z0-9_]*$/g;
            if (value === '') {
                callback(new Error('请输入爬虫名参数！'));
            } else if (value === this.configForm.projectName) {
                callback(new Error('不能与工程名一致'));
            } else if (!reg.test(value)) {
                callback(new Error('格式只能是小写字符！'));
            }else {
                callback();
            }
        }
        return {
            configForm: {
                projectName: null,
                spiderName: null,
                dbAddress: '172.16.13.22',
                dbName: 'map',
                dbUserName: 'root',
                dbPassword: 'root',
                bdTableName: null,
                bdTableComment: null,
                dataType: 'STRUCTURED',
                items: [
                    {name: 'title', value: '文章标题'}
                ]
            },
            formRules: {
                projectName: [
                    { required: true, message: '字符、数字、_组成！', trigger: 'blur' },
                    { pattern: /^[A-Za-z0-9_]+$/, message: '不允许输入空格等特殊符号' }
                ],
                spiderName: [
                    { validator: validateSpiderName, trigger: 'blur' , message: '字符、数字、_组成,不能与工程名一致！'}
                ],
                dbAddress: [
                    { required: true, message: '字符、数字、_组成！', trigger: 'blur' },
                    { pattern: /((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/, message: '不允许输入空格等特殊符号' }
                ],
                dbName: [
                    { required: true, message: '小写字符、数字、_组成！', trigger: 'blur' },
                    { pattern: /^[a-z0-9_]*$/g, message: '不允许输入空格等特殊符号' }
                ],
                dbUserName: [{ required: true, message: '数据库用户名', trigger: 'blur' }],
                dbPassword: [{ required: true, message: '数据库密码', trigger: 'change' }],
                bdTableName: [  
                    { required: true, message: '小写字符、数字、_组成！', trigger: 'blur' },
                    { pattern: /^[a-z0-9_]*$/g, message: '不允许输入空格等特殊符号' }
                ],
                bdTableComment: [{ required: true, message: '表备注', trigger: 'change' }],
            },
            downloadurl: ''
        }
    },
    methods: {
        // 添加表单参数子选项
        addItem(selfForm) {
            selfForm.items.push({name: '', value: ''})
        },
        // 删除表单参数子选项
        removeItem(selfForm, index) {
            if (index !== -1) {
                selfForm.items.splice(index, 1)
            }
        },
        // 向后端提交api请求
        fasterScrapy(configForm){
            this.$refs['configForm'].validate(async (valid) => {
                
                if(valid) {
                    if (await this.createScript(configForm)){
                        let url = ''
                        if ( process.env.NODE_ENV === "development") {
                            url = 'http://172.16.13.22:5000/download/' + configForm['projectName']
                        } else {
                            url = 'http://172.16.119.6:5000/download/' + configForm['projectName']
                        }                        
                        document.querySelector('.download').href = url
                        document.querySelector('.download').click()
                    } else{
                        this.$message.error('后端创建scrapy工程出错！')
                    }
                }else {
                    this.$message.error('请填写正确的配置信息! ')
                }
               
            })
        },
        async createScript(configForm ){
            try{
                const res = await apiFasterScrapy(configForm)
                if (res.code === 200) {
                    return true
                }else{
                    return false
                }
            }catch (e) {
               return false
            }
        }

    }
    
}
</script>