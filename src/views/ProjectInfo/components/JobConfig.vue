<template>
  <div class="jobconfig">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="种子管理" name="种子管理">
        <div class="add-seed">
          <div class="new-feed">
            <el-form label-position="right" label-width="50px">
              <el-form-item label="种子" prop="addFeed">
                <el-input
                  style="width:300px; margin-right: 20px"
                  placeholder="种子"
                  v-model="addFeed">
                </el-input>
                <el-button size="small" type="primary" @click="seed_form_add">添加种子</el-button>
              </el-form-item>
              <el-form-item></el-form-item>
            </el-form>
          </div>
          <div class="old-feed">
            <span>已有种子</span>
          </div>
          <el-form style="margin-left:20px">
            <el-form-item>
              <el-input type="textarea" v-model="seed_str" :rows="6" style="width:500px;"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="下载参数配置" name="下载参数配置">
        <el-form ref="form" :model="form" label-width="200px">
          <el-form-item label="下载失败重试次数">
            <el-input-number v-model="form.RETRY_TIMES" :step="1" :max="5"></el-input-number>
          </el-form-item>
          <el-form-item label="请求线程数">
            <el-input-number v-model="form.CONCURRENT_REQUESTS" :step="1" :max="32"></el-input-number>
          </el-form-item>
          <el-form-item label="下载延迟">
            <el-input-number v-model="form.DOWNLOAD_DELAY" :step="0.2" :max="5"></el-input-number>
          </el-form-item>
          <el-form-item label="连接超时时间">
            <el-input
              v-model="form.DOWNLOAD_TIMEOUT"
              placeholder="单位 / 秒"
              style="width:300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="下载速度">
            <el-input
              v-model="form.DOWNLOAD_SPEED"
              placeholder="单位 / KB"
              style="width:300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="单个文件下载最大的大小">
            <el-input
              v-model="form.DOWNLOAD_SIZE"
              placeholder="单位 / MB"
              style="width:300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="DNS缓存的大小">
            <el-input
              v-model="form.DNSCACHE_SIZE"
              placeholder="单位 / MB"
              style="width:300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="访问代理的配置">
            <el-radio-group v-model="form.MIDDLEWARES_PROXY_OPEN">
              <el-radio :label="false">无代理</el-radio>
              <el-radio :label="true">启用代理</el-radio>
            </el-radio-group>
            <div v-if="form.MIDDLEWARES_PROXY_OPEN==true">
              <el-select v-model="form.MIDDLEWARES_PROXY_VALUE" placeholder="请选择">
                <el-option v-for="item in ip_proxy_option" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <br />
              <el-input
                placeholder="请求输入代理接口地址"
                v-model="form.MIDDLEWARES_PROXY_URL"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">代理接口地址</template>
              </el-input>
              <br />
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="采集范围配置" name="采集范围配置">
        <el-form ref="form" :model="form" label-width="200px">
          <el-form-item label="广度优先方式的层级配置">
            <el-input-number v-model="form.DEPTH_LIMIT" :step="1" :max="5"></el-input-number>
          </el-form-item>
          <el-form-item label="采集后缀过滤">
            <el-input v-model="form.CRAWL_RANGE_SUFFIX" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="采集层数过滤">
            <el-input v-model="form.CRAWL_RANGE_DEEP_NUM" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="站点过滤">
            <el-input v-model="form.CRAWL_RANGE_SIZE_FILTERING" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="URL正则过滤">
            <el-input v-model="form.CRAWL_RANGE_URL_REGULAR" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="协议过滤">
            <el-input v-model="form.CRAWL_RANGE_PROTOCOL_FILTERING" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="站点最大页面数量">
            <el-input v-model="form.CRAWL_RANGE_MAX_PAGE" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="站点子域名数量">
            <el-input v-model="form.CRAWL_RANGE_SUBDOMAINS" style="width:600px"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="采集策略配置" name="采集策略配置">
        <el-form ref="form" :model="form" label-width="200px">
          <el-form-item label="页面优先级选择">
            <el-radio-group v-model="form.DEPTH_PRIORIT">
              <el-radio :label="0">深度优先</el-radio>
              <el-radio :label="-1">广度优先</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="日志等级">
            <el-select v-model="form.LOG_LEVEL" placeholder="请选择">
              <el-option key="DEBUG" label="调试信息" value="DEBUG"></el-option>
              <el-option key="INFO" label="一般信息" value="INFO"></el-option>
              <el-option key="WARNING" label="警告信息" value="WARNING"></el-option>
              <el-option key="ERROR" label="一般错误" value="ERROR"></el-option>
              <el-option key="CRITICAL" label="严重错误" value="CRITICAL"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="资源抽取配置" name="资源抽取配置">
        <el-form
          ref="form"
          :model="form"
          label-width="200px"
        >
          <el-form-item label="后缀模式">
            <el-input v-model="form.SUFFIX" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="协议类型">
            <el-input v-model="form.AGREEMENT_TYPE" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="正则表达式">
            <el-input v-model="form.REGULAR" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="关键代码">
            <el-input v-model="form.KEYWORD_CODE" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="关键字限定">
            <el-input
              v-model="form.KEYWORD"
              placeholder="多个关键词空格分开"
              id="keyword"
              style="width:600px"
            >
              <el-select
                v-model="form.KEYWORD_LOGIC"
                slot="prepend"
                placeholder="请选择"
                style="width:100px"
              >
                <el-option label="与" value="and"></el-option>
                <el-option label="或" value="or"></el-option>
                <el-option label="非" value="non"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="存储模式配置" name="存储模式配置">
        <el-form ref="form" :model="form" label-width="200px">
          <el-form-item label="全部页面">
            <el-radio-group v-model="form.ALL_PAGE">
              <el-radio :label="1">无</el-radio>
              <el-radio :label="2">保存</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="目标页面存储">
            <el-radio-group v-model="form.TARGET_PAGE">
              <el-radio :label="1">无</el-radio>
              <el-radio :label="2">保存</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="redis选项">
            <el-input
              placeholder="请输入内容"
              v-model="form.REDIS_HOST"
              style="margin:5px 0px; width:600px"
            >
              <template slot="prepend">地址</template>
            </el-input>
            <br />
            <el-input
              placeholder="请输入内容"
              v-model="form.REDIS_PORT"
              style="margin:5px 0px; width:600px"
            >
              <template slot="prepend">端口</template>
            </el-input>
            <br />
            <el-select v-model="form.REDIS_TYPE" filterable placeholder="请选择">
              <template slot="prefix">
                <span class="prefixSlot">类型</span>
              </template>
              <el-option key="set" label="集合" value="set"></el-option>
              <el-option key="list" label="列表" value="list"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容存储">
            <el-input
              placeholder="请输入内容"
              v-model="form.MYSQL_HOST"
              style="margin:5px 0px ; width:600px"
            >
              <template slot="prepend">地址</template>
            </el-input>
            <br />
            <el-input
              placeholder="请输入内容"
              v-model="form.MYSQL_PORT"
              style="margin:5px 0px; width:600px"
            >
              <template slot="prepend">端口</template>
            </el-input>
            <br />
            <el-input
              placeholder="请输入内容"
              v-model="form.MYSQL_USERNAME"
              style="margin:5px 0px; width:600px"
            >
              <template slot="prepend">用户</template>
            </el-input>
            <br />
            <el-input
              placeholder="请输入内容"
              v-model="form.MYSQL_PASSWORD"
              style="margin:5px 0px; width:600px"
            >
              <template slot="prepend">密码</template>
            </el-input>
            <br />
            <el-input
              placeholder="请输入内容"
              v-model="form.MYSQL_DB"
              style="margin:5px 0px; width:600px"
            >
              <template slot="prepend">库名</template>
            </el-input>
            <br />
            <el-input
              placeholder="请输入内容"
              v-model="form.MYSQL_TABLE"
              style="margin:5px 0px; width:600px"
            >
              <template slot="prepend">表名</template>
            </el-input>
          </el-form-item>
          <el-form-item label="文件存储方式">
            <el-radio-group v-model="form.STORAGE_TYPE">
              <el-radio :label="1">本地模式</el-radio>
              <el-radio :label="2">FTP模式</el-radio>
              <el-radio :label="3">分布式文件系统</el-radio>
              <el-radio :label="4">数据库存储</el-radio>
            </el-radio-group>
            <div v-if="form.STORAGE_TYPE == 1">
              <el-input
                placeholder="请输入内容"
                v-model="form.DIRS"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">本地路径</template>
              </el-input>
            </div>
            <div v-if="form.STORAGE_TYPE == 2">
              <el-input
                placeholder="请输入内容"
                v-model="form.FTP_IP"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">地址</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="form.FTP_PORT"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">端口</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="form.FTP_USERNAME"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">用户</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="form.FTP_PASSWORD"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">密码</template>
              </el-input>
            </div>
            <div v-if="form.STORAGE_TYPE == 3">
              <el-input
                placeholder="请输入内容"
                v-model="form.FILE_UPLOAD_URL"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">上传接口</template>
              </el-input>
            </div>
            <div v-if="form.STORAGE_TYPE == 4">
              <el-input
                placeholder="请输入内容"
                v-model="form.DATABASE_IP"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">地址</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="form.DATABASE_PORT"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">端口</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="form.DATABASE_USERNAME"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">用户</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="form.DATABASE_PASSWORD"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">密码</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="form.DATABASE_DBNAME"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">库名</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="form.DATABASE_TABLENAME"
              >
                <template slot="prepend">表名</template>
              </el-input>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="数据回传" name="数据回传">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="回传地址">
            <el-input
              placeholder="请输入系统接口内容"
              v-model="form.DATA_CALLBACK_URL"
              style="margin:5px 0px; width:450px"
            ></el-input>
          </el-form-item>
          <el-form-item label="回传大小">
            <el-input-number v-model="form.DATA_CALLBACK_SIZE" :step="50" :max="1000"></el-input-number>
          </el-form-item>
          <label
            for
            style="font-size:8px; margin-left:30px; color:#909399"
          >回传大小，指没采集数据量达到设定回传值时，更新数据统计!</label>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="APP key管理" name="APP key管理">
        <el-form ref="form" :model="form">
          <el-form-item
            v-for="(domain, index) in form.APP_KEY"
            :label="'key' + index"
            :key="index"
            :rules="{ required: true, message: '值不能为空', trigger: 'blur' }"
          >
            <el-input
              v-model="domain.key"
              style="width:300px;margin-right:15px; line-height: 15px"
            ></el-input>
            <el-button @click.prevent="removeDomain(domain)" size="mini">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="addDomain" size="mini">新增key</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="账号管理" name="账号管理">
        <el-form ref="form" :model="form">
          <el-form-item
            v-for="(domain, index) in form.ACCOUNT_LIST"
            :label="'用户' + index"
            :key="index"
            :rules="{ required: true, message: '值不能为空', trigger: 'blur'}"
          >
            <el-input
              v-model="domain.username"
              style="width:300px; margin-right: 10px"
              placeholder="用户名"
            ></el-input>
            <el-input
              v-model="domain.password"
              style="width:300px; margin-right: 15px"
              placeholder="密码"
            ></el-input>
            <el-button size="mini" @click.prevent="account_form_remove(domain)">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="account_form_add" size="mini">新增账户</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="启停策略" name="启停策略">
        <el-form ref="form" :model="form">
          <el-form-item label="启动方式">
            <el-radio-group v-model="form.SCHEDULER_TYPE">
              <el-radio :label="1">手动-立即运行</el-radio>
              <el-radio :label="2">自动</el-radio>
            </el-radio-group>
            <div v-if="form.SCHEDULER_TYPE == 2">
              <div class="tip">时间参数</div>
              <div class="sub">
                <el-tabs type="border-card">
                  <el-tab-pane label="月份选择">
                    <el-checkbox-group v-model="form.SCHEDULER_MOUNTH">
                      <el-checkbox
                        v-for="month in 12"
                        :label="month"
                        :key="month"
                      >{{ month >= 10 ? month:'0'+String(month) }}</el-checkbox>
                    </el-checkbox-group>
                  </el-tab-pane>
                  <el-tab-pane label="天选择">
                    <el-checkbox-group v-model="form.SCHEDULER_DAY">
                      <el-checkbox
                        v-for="day in 31"
                        :label="day"
                        :key="day"
                      >{{ day >= 10 ? day:'0'+String(day) }}</el-checkbox>
                    </el-checkbox-group>
                  </el-tab-pane>
                  <el-tab-pane label="小时选择">
                    <el-checkbox-group v-model="form.SCHEDULER_HOUR">
                      <el-checkbox
                        v-for="hour in 24"
                        :label="hour-1"
                        :key="hour-1"
                      >{{ hour-1 >= 10 ? hour-1:'0'+String(hour-1) }}</el-checkbox>
                    </el-checkbox-group>
                  </el-tab-pane>
                  <el-tab-pane label="分钟选择">
                    <el-checkbox-group v-model="form.SCHEDULER_MINUTE">
                      <el-checkbox
                        v-for="minute in 60"
                        :label="minute-1"
                        :key="minute-1"
                      >{{ minute-1 >= 10 ? minute-1:'0'+String(minute-1) }}</el-checkbox>
                    </el-checkbox-group>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <div class="tip">描述</div>
              <div class="sub">
                <el-input
                  type="text"
                  v-model="form.SCHEDULER_DESCRIPTION"
                  maxlength="30"
                  :show-word-limit="true"
                  placeholder="请输入简短的调度描述，如，每天12点"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-check"
              size="mini"
              type="primary"
              round
              @click="submitscheduler"
            >提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { apiAddScheduler } from "@/api/scheduler";
import deepcopy from "deepcopy";
export default {
  props: ["project_name", "current_config"],
  watch: {
    current_config: function(val) {
      if (val != null) {
        this.form = JSON.parse(val)
        if (this.form.SEED_LIST.length > 0) {
          for (let seed of this.form.SEED_LIST ) {
            this.seed_str += seed + '\n'
          }
        }
        // let jsonVal = JSON.parse(val);
        // this.form.SEED_LIST = JSON.parse(jsonVal.seed_form);
        // if (this.seed_form.length > 0) {
        //   for (let seed of this.form.SEED_LIST ) {
        //     this.seed_str += seed + '\n'
        //   }
        // }
        // this.download_params_form = JSON.parse(jsonVal.download_params_form);
        // this.crawl_range_form = JSON.parse(jsonVal.crawl_range_form);
        // this.crawl_stratege_form = JSON.parse(jsonVal.crawl_stratege_form);
        // this.resource_extraction_form = JSON.parse(
        //   jsonVal.resource_extraction_form
        // );
        // this.storage_management_form = JSON.parse(
        //   jsonVal.storage_management_form
        // );
        // this.appkey_form = JSON.parse(jsonVal.appkey_form);
        // this.account_form = JSON.parse(jsonVal.account_form);
        // this.data_return_form = JSON.parse(jsonVal.data_return_form);
        // this.scheduler_form = JSON.parse(jsonVal.scheduler_form);
      }
    },
    // 监听已有种子的变化
    seed_str: function(val) {
      this.form.SEED_LIST = val.split('\n')
      this.form.SEED_LIST.pop(-1)
    }
  },
  data() {
    return {
      addFeed: "",
      activeName: "下载参数配置",
      ip_proxy_option: ["所有请求", "随机"],
      seed_str:'',
      form: {
        //种子管理
        SEED_LIST: [],
        // 下载参数配置
        RETRY_TIMES: 1,  // 下载失败重试次数
        CONCURRENT_REQUESTS: 8, // 请求线程数
        DOWNLOAD_DELAY: 0.5, // 下载延迟
        DOWNLOAD_TIMEOUT: 180, //连接超时时间
        DOWNLOAD_SPEED: 1024, //下载速度
        DOWNLOAD_SIZE: 32, //单个文件下载最大的大小
        DNSCACHE_SIZE: 10000,  //DNS内存缓存大小
        MIDDLEWARES_PROXY_OPEN: false, //是否开启ip代理
        MIDDLEWARES_PROXY_VALUE: '所有请求',  //启用代理方式
        MIDDLEWARES_PROXY_URL: 'http://10.5.9.119:5060/proxy_ip', //代理接口ip地址
        //采集范围配置
        DEPTH_LIMIT: 0,  //广度有限方式的层级配置
        CRAWL_RANGE_SUFFIX: "html,shtml", //采集后缀过滤
        CRAWL_RANGE_DEEP_NUM: 3, // 采集层数过滤
        CRAWL_RANGE_SIZE_FILTERING: 50,  // 站点过滤
        CRAWL_RANGE_URL_REGULAR: "http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*,]|(?:%[0-9a-fA-F][0-9a-fA-F]))+",  //url正则过滤
        CRAWL_RANGE_PROTOCOL_FILTERING: "http,https", //协议过滤
        CRAWL_RANGE_MAX_PAGE: 100000,  //站点最大页面数量
        CRAWL_RANGE_SUBDOMAINS: 5,  //站点子域名数量
        //采集策略配置
        LOG_LEVEL: 'INFO', //日志等级
        DEPTH_PRIORIT: 0,  //遍历方法，0为深度优先，-1为广度优先
        //资源抽取配置
        SUFFIX:'html,shtml',  //后缀模式
        AGREEMENT_TYPE: 'http,https', //协议类型
        REGULAR: '', //正则表达式
        KEYWORD_CODE: '', //关键代码
        KEYWORD: '', //关键字
        KEYWORD_LOGIC: 'and', //关键字选项
        //存储模式配置
        ALL_PAGE: 1, //全部页面
        TARGET_PAGE: 2, //目标页面存储
        REDIS_HOST: '172.16.13.22',  //redis地址
        REDIS_PORT: '6379', //redis端口
        REDIS_TYPE: 'set', //redis类型
        MYSQL_HOST: '172.16.13.22', //mysql地址
        MYSQL_DB: 'duocaiyunspider', //mysql数据库名
        MYSQL_TABLE: "", //mysql表名
        MYSQL_USERNAME: "root", //mysql用户名
        MYSQL_PASSWORD: 'root', //mysql密码
        MYSQL_PORT: "3306", //mysql端口
        STORAGE_TYPE: 3, //文件存储方式
        DIRS: 'D://pythonWorkSpace//spider//test_debug//debug', //本地存储路径
        FTP_IP: "http://10.5.9.84:8084/fdfs/uploads",  //ftp ip
        FTP_PORT: '3360', // ftp端口号
        FTP_USERNAME: 'root', //ftp用户名
        FTP_PASSWORD: "root", //ftp密码
        FILE_UPLOAD_URL: 'http://172.16.119.13/dcy-file/fdfs/upload', //分布式存储文件上传接口
        DATABASE_IP: '172.16.13.22', ///数据库ip
        DATABASE_PORT: '3360', ///数据库端口
        DATABASE_USERNAME: 'root',  ///数据库用户名
        DATABASE_PASSWORD: 'root', ///数据库密码
        DATABASE_DBNAME: 'duocaiyunDB', //数据库名
        DATABASE_TABLENAME: 'duocaiyun', // /数据库表名
        //数据回传
        DATA_CALLBACK_URL: "http://172.16.13.22:5060/data_storage", //数据回传url
        DATA_CALLBACK_SIZE: '300', //回传大小
        //APP key管理
        APP_KEY: [{ key: '' }],  // APP key列表
        //账号管理
        ACCOUNT_LIST: [{"username": "taozi926494@sina.com", "password": "taozi926494!@#$%"}],  //账号管理
        //启停策略
        SCHEDULER_TYPE: 1,   //启动方式1手动 2自动
        SCHEDULER_MOUNTH: [1,2,3,4,5,6,7,8,9,10,11,12], //月份
        SCHEDULER_DAY: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31], //天
        SCHEDULER_HOUR: [12], //小时
        SCHEDULER_MINUTE: [0], //分钟
        SCHEDULER_DESCRIPTION: '每天12点执行'  //描述
      }
    };
  },
  methods: {
    async submitscheduler() {
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading"
      });
      try {
        this.form.PROJECT_NAME = this.project_name
        var config = deepcopy(this.form)
        // config.CRAWL_RANGE = JSON.stringify(config.CRAWL_RANGE);
        // config.FTP_FORM = JSON.stringify(config.FTP_FORM)
        // config.DATABASE_FORM = JSON.stringify(config.DATABASE_FORM)
        // config.SCHEDULER.month = JSON.stringify(config.SCHEDULER.month)
        // config.SCHEDULER = JSON.stringify(config.SCHEDULER)
        // config.SEED_LIST = JSON.stringify(config.SEED_LIST)
        // config.APP_KEY = JSON.stringify(config.APP_KEY)
        const res = await apiAddScheduler({params: JSON.stringify(config)});
        if (res) {
          this.$message.success("调度成功！");
          this.$emit("refresh");
        }
      } finally {
        loading.close();
      }
    },
    seed_form_add() {
      if (this.addFeed == "") {
        this.$message.info({ message: "不能添加空的种子!", showClose: true });
      } else if( this.form.SEED_LIST.indexOf(this.addFeed) > -1 ) {
        this.$message.info({ message: '该种子已存在!', showClose: true })
      } else {
        this.seed_str += this.addFeed + '\n';
        this.form.SEED_LIST = this.seed_str.split('\n');
        this.form.SEED_LIST.pop(-1)
        this.addFeed = "";
      }
    },
    // seed_form_remove(item) {
    //   var index = this.seed_form.domains.indexOf(item);
    //   if (index !== -1) {
    //     this.seed_form.domains.splice(index, 1);
    //   }
    // },
    account_form_add() {
      this.form.ACCOUNT_LIST.push({
        username: '',
        password: ''
      });
    },
    account_form_remove(item) {
      var index = this.form.ACCOUNT_LIST.indexOf(item);
      if (index !== -1) {
        this.form.ACCOUNT_LIST.splice(index, 1);
      }
    },
    removeDomain(item) {
      var index = this.form.APP_KEY.indexOf(item);
      if (index !== -1) {
        this.form.APP_KEY.splice(index, 1);
      }
    },
    addDomain() {
      this.form.APP_KEY.push({ key: '' });
    }
    // handleClick(tab, event) {
    //     console.log(tab, event);
    // }
  }
};
</script>



<style lang="scss" >
.add-seed {
  display: flex;
  flex-direction: row;
  .new-feed,
  .old-feed {
    display: flex;
    align-items: center;
  }
  .old-feed {
    span {
      margin-left: 40px;
      font-size: 14px;
      color: #606266;
      font-weight: 700;
    }
  }
}
.jobconfig {
  .el-select .el-input__inner {
    width: 300px;
  }

  .el-tabs--border-card {
    box-shadow: none;
  }
  .el-input--prefix {
    padding-left: 72px;
    background-color: #f5f7fa;
    color: #909399;
  }
  .el-input--prefix {
    border: 1px solid #dcdfe6;
  }
  .el-input__inner {
    background-color: white;
  }
  .prefixSlot {
    margin-left: 16px;
    color: #909399;
  }
}
.el-form-item {
  margin-bottom: 5px;
}
</style>
