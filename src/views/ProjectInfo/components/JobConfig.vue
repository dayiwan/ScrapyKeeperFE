<template>
  <div class="jobconfig">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="种子管理" name="种子管理">
        <el-form ref="seed_form" :model="seed_form">
          <el-form-item
            v-for="(domain, index) in seed_form.domains"
            :label="'种子' + index"
            :key="domain.key"
            :prop="'domains.' + index + '.value'"
            :rules="{required: true, message: '值不能为空', trigger: 'blur'}"
          >
            <el-input
              v-model="domain.value"
              style="width:300px; margin-right: 10px"
              placeholder="种子"
            ></el-input>
            <el-button size="mini" @click.prevent="seed_form_remove(domain)">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="seed_form_add">添加种子</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="下载参数配置" name="下载参数配置">
        <el-form ref="download_params_form" :model="download_params_form" label-width="200px">
          <el-form-item label="下载失败重试次数">
            <el-input-number v-model="download_params_form.reapt_num" :step="1" :max="5"></el-input-number>
          </el-form-item>
          <el-form-item label="请求线程数">
            <el-input-number v-model="download_params_form.request_num" :step="1" :max="32"></el-input-number>
          </el-form-item>
          <el-form-item label="下载延迟">
            <el-input-number v-model="download_params_form.download_delay" :step="0.2" :max="5"></el-input-number>
          </el-form-item>
          <el-form-item label="连接超时时间">
            <el-input
              v-model="download_params_form.timeout"
              placeholder="单位 / 秒"
              style="width:300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="下载速度">
            <el-input
              v-model="download_params_form.download_speed"
              placeholder="单位 / KB"
              style="width:300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="单个文件下载最大的大小">
            <el-input
              v-model="download_params_form.max_file_size"
              placeholder="单位 / MB"
              style="width:300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="DNS缓存的大小">
            <el-input
              v-model="download_params_form.DNS_size"
              placeholder="单位 / MB"
              style="width:300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="访问代理的配置">
            <el-radio-group v-model="download_params_form.ip_proxy">
              <el-radio :label="1">无代理</el-radio>
              <el-radio :label="2">启用代理</el-radio>
            </el-radio-group>
            <div v-if="download_params_form.ip_proxy==2">
              <el-select v-model="download_params_form.ip_proxy_value" placeholder="请选择">
                <el-option v-for="item in ip_proxy_option" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <br />
              <el-input
                placeholder="请求输入代理接口地址"
                v-model="download_params_form.PROXY_CENTER_URL"
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
        <el-form ref="crawl_range_form" :model="crawl_range_form" label-width="200px">
          <el-form-item label="广度优先方式的层级配置">
            <el-input-number v-model="crawl_range_form.level" :step="1" :max="5"></el-input-number>
          </el-form-item>
          <el-form-item label="采集后缀过滤">
            <el-input v-model="crawl_range_form.suffix" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="采集层数过滤">
            <el-input v-model="crawl_range_form.url_deep_num" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="站点过滤">
            <el-input v-model="crawl_range_form.size_filtering" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="URL正则过滤">
            <el-input v-model="crawl_range_form.url_regular_filtering" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="协议过滤">
            <el-input v-model="crawl_range_form.protocol_filtering" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="站点最大页面数量">
            <el-input v-model="crawl_range_form.max_page_num" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="站点子域名数量">
            <el-input v-model="crawl_range_form.subdomains_num" style="width:600px"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="采集策略配置" name="采集策略配置">
        <el-form ref="crawl_stratege_form" :model="crawl_stratege_form" label-width="200px">
          <el-form-item label="页面优先级选择">
            <el-radio-group v-model="crawl_stratege_form.stratege">
              <el-radio :label="1">深度优先</el-radio>
              <el-radio :label="2">广度优先</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="日志等级">
            <el-select v-model="crawl_stratege_form.log_level" placeholder="请选择">
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
          ref="resource_extraction_form"
          :model="resource_extraction_form"
          label-width="200px"
        >
          <el-form-item label="后缀模式">
            <el-input v-model="resource_extraction_form.suffix" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="协议类型">
            <el-input v-model="resource_extraction_form.agreement_type" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="正则表达式">
            <el-input v-model="resource_extraction_form.regular" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="关键代码">
            <el-input v-model="resource_extraction_form.keyword_code" style="width:600px"></el-input>
          </el-form-item>
          <el-form-item label="关键字限定">
            <el-input
              v-model="resource_extraction_form.keyword"
              placeholder="多个关键词空格分开"
              id="keyword"
              style="width:600px"
            >
              <el-select
                v-model="resource_extraction_form.keyword_logic"
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
        <el-form ref="storage_management_form" :model="storage_management_form" label-width="200px">
          <el-form-item label="全部页面">
            <el-radio-group v-model="storage_management_form.all_page">
              <el-radio :label="1">无</el-radio>
              <el-radio :label="2">保存</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="目标页面存储">
            <el-radio-group v-model="storage_management_form.target_page">
              <el-radio :label="1">无</el-radio>
              <el-radio :label="2">保存</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="redis选项">
            <el-input
              placeholder="请输入内容"
              v-model="storage_management_form.redis.ip"
              style="margin:5px 0px; width:600px"
            >
              <template slot="prepend">地址</template>
            </el-input>
            <br />
            <el-input
              placeholder="请输入内容"
              v-model="storage_management_form.redis.port"
              style="margin:5px 0px; width:600px"
            >
              <template slot="prepend">端口</template>
            </el-input>
            <br />
            <el-select v-model="storage_management_form.redis.type" filterable placeholder="请选择">
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
              v-model="storage_management_form.storage_content.ip"
              style="margin:5px 0px ; width:600px"
            >
              <template slot="prepend">地址</template>
            </el-input>
            <br />
            <el-input
              placeholder="请输入内容"
              v-model="storage_management_form.storage_content.port"
              style="margin:5px 0px; width:600px"
            >
              <template slot="prepend">端口</template>
            </el-input>
            <br />
            <el-input
              placeholder="请输入内容"
              v-model="storage_management_form.storage_content.username"
              style="margin:5px 0px; width:600px"
            >
              <template slot="prepend">用户</template>
            </el-input>
            <br />
            <el-input
              placeholder="请输入内容"
              v-model="storage_management_form.storage_content.password"
              style="margin:5px 0px; width:600px"
            >
              <template slot="prepend">密码</template>
            </el-input>
            <br />
            <el-input
              placeholder="请输入内容"
              v-model="storage_management_form.storage_content.dbname"
              style="margin:5px 0px; width:600px"
            >
              <template slot="prepend">库名</template>
            </el-input>
            <br />
            <el-input
              placeholder="请输入内容"
              v-model="storage_management_form.storage_content.tablename"
              style="margin:5px 0px; width:600px"
            >
              <template slot="prepend">表名</template>
            </el-input>
          </el-form-item>
          <el-form-item label="文件存储方式">
            <el-radio-group v-model="storage_management_form.storage_type">
              <el-radio :label="1">本地模式</el-radio>
              <el-radio :label="2">FTP模式</el-radio>
              <el-radio :label="3">分布式文件系统</el-radio>
              <el-radio :label="4">数据库存储</el-radio>
            </el-radio-group>
            <div v-if="storage_management_form.storage_type == 1">
              <el-input
                placeholder="请输入内容"
                v-model="storage_management_form.storage_type_1.dirs"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">本地路径</template>
              </el-input>
            </div>
            <div v-if="storage_management_form.storage_type == 2">
              <el-input
                placeholder="请输入内容"
                v-model="storage_management_form.storage_type_2.ip"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">地址</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="storage_management_form.storage_type_2.port"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">端口</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="storage_management_form.storage_type_2.username"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">用户</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="storage_management_form.storage_type_2.password"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">密码</template>
              </el-input>
            </div>
            <div v-if="storage_management_form.storage_type == 3">
              <el-input
                placeholder="请输入内容"
                v-model="storage_management_form.storage_type_3.interface_address"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">上传接口</template>
              </el-input>
            </div>
            <div v-if="storage_management_form.storage_type == 4">
              <el-input
                placeholder="请输入内容"
                v-model="storage_management_form.storage_type_4.ip"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">地址</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="storage_management_form.storage_type_4.port"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">端口</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="storage_management_form.storage_type_4.username"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">用户</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="storage_management_form.storage_type_4.password"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">密码</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="storage_management_form.storage_type_4.dbname"
                style="margin:5px 0px; width:600px"
              >
                <template slot="prepend">库名</template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入内容"
                v-model="storage_management_form.storage_type_4.tablename"
              >
                <template slot="prepend">表名</template>
              </el-input>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="数据回传" name="数据回传">
        <el-form ref="data_return_form" :model="data_return_form" label-width="100px">
          <el-form-item label="回传地址">
            <el-input
              placeholder="请输入系统接口内容"
              v-model="data_return_form.url"
              style="margin:5px 0px; width:450px"
            ></el-input>
          </el-form-item>
          <el-form-item label="回传大小">
            <el-input-number v-model="data_return_form.batch_size" :step="50" :max="1000"></el-input-number>
          </el-form-item>
          <label
            for
            style="font-size:8px; margin-left:30px; color:#909399"
          >回传大小，指没采集数据量达到设定回传值时，更新数据统计!</label>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="APP key管理" name="APP key管理">
        <el-form ref="appkey_form" :model="appkey_form">
          <el-form-item
            v-for="(domain, index) in appkey_form.domains"
            :label="'key' + index"
            :key="domain.key"
            :prop="'domains.' + index + '.value'"
            :rules="{
                        required: true, message: '值不能为空', trigger: 'blur'
                        }"
          >
            <el-input
              v-model="domain.value"
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
        <el-form ref="account_form" :model="account_form">
          <el-form-item
            v-for="(domain, index) in account_form.domains"
            :label="'用户' + index"
            :key="domain.key"
            :prop="'domains.' + index + '.value'"
            :rules="{
                        required: true, message: '值不能为空', trigger: 'blur'
                        }"
          >
            <el-input
              v-model="domain.value"
              style="width:300px; margin-right: 10px"
              placeholder="用户名"
            ></el-input>
            <el-input
              v-model="domain.value"
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
        <el-form ref="scheduler_form" :model="scheduler_form">
          <el-form-item label="启动方式">
            <el-radio-group v-model="scheduler_form.type">
              <el-radio :label="1">手动-立即运行</el-radio>
              <el-radio :label="2">自动</el-radio>
            </el-radio-group>
            <div v-if="scheduler_form.type == 2">
              <div class="tip">时间参数</div>
              <div class="sub">
                <el-tabs type="border-card">
                  <el-tab-pane label="月份选择">
                    <el-checkbox-group v-model="scheduler_form.scheduler.cron_month">
                      <el-checkbox
                        v-for="month in 12"
                        :label="month"
                        :key="month"
                      >{{ month >= 10 ? month:'0'+String(month) }}</el-checkbox>
                    </el-checkbox-group>
                  </el-tab-pane>
                  <el-tab-pane label="天选择">
                    <el-checkbox-group v-model="scheduler_form.scheduler.cron_day_of_month">
                      <el-checkbox
                        v-for="day in 31"
                        :label="day"
                        :key="day"
                      >{{ day >= 10 ? day:'0'+String(day) }}</el-checkbox>
                    </el-checkbox-group>
                  </el-tab-pane>
                  <el-tab-pane label="小时选择">
                    <el-checkbox-group v-model="scheduler_form.scheduler.cron_hour">
                      <el-checkbox
                        v-for="hour in 24"
                        :label="hour-1"
                        :key="hour-1"
                      >{{ hour-1 >= 10 ? hour-1:'0'+String(hour-1) }}</el-checkbox>
                    </el-checkbox-group>
                  </el-tab-pane>
                  <el-tab-pane label="分钟选择">
                    <el-checkbox-group v-model="scheduler_form.scheduler.cron_minutes">
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
                  v-model="scheduler_form.scheduler.description"
                  maxlength="30"
                  show-word-limit="true"
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
import {
  apidRunImmediately,
  apidCancleRunning,
  apiAddScheduler,
  apiCancelScheduler
} from "@/api/scheduler";

export default {
  props: ["project_name", "current_config"],
  watch: {
    current_config: function(val) {
      if (val != null) {
        let jsonVal = JSON.parse(val);
        this.seed_form = JSON.parse(jsonVal.seed_form);
        this.download_params_form = JSON.parse(jsonVal.download_params_form);
        this.crawl_range_form = JSON.parse(jsonVal.crawl_range_form);
        this.crawl_stratege_form = JSON.parse(jsonVal.crawl_stratege_form);
        this.resource_extraction_form = JSON.parse(
          jsonVal.resource_extraction_form
        );
        this.storage_management_form = JSON.parse(
          jsonVal.storage_management_form
        );
        this.appkey_form = JSON.parse(jsonVal.appkey_form);
        this.account_form = JSON.parse(jsonVal.account_form);
        this.data_return_form = JSON.parse(jsonVal.data_return_form);
        this.scheduler_form = JSON.parse(jsonVal.scheduler_form);
      }
    }
  },
  data() {
    return {
      activeName: "下载参数配置",
      ip_proxy_option: ["所有请求", "随机"],
      seed_form: {
        domains: []
      },
      download_params_form: {
        reapt_num: 1,
        request_num: 8,
        download_delay: 0.5,
        timeout: 10,
        download_speed: 1024,
        max_file_size: 16,
        DNS_size: 10,
        ip_proxy: 1,
        ip_proxy_value: "所有请求",
        PROXY_CENTER_URL: "http://10.5.9.119:5060/proxy_ip"
      },
      crawl_range_form: {
        level: 1,
        suffix: "",
        url_deep_num: 3,
        size_filtering: 50,
        url_regular_filtering:
          "http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*,]|(?:%[0-9a-fA-F][0-9a-fA-F]))+",
        protocol_filtering: "http,htpps",
        max_page_num: 100000,
        subdomains_num: 5
      },
      crawl_stratege_form: {
        stratege: 1,
        log_level: "INFO"
      },
      resource_extraction_form: {
        suffix: "html,shtml",
        agreement_type: "http,htpps",
        regular: null,
        keyword_code: null,
        keyword: null,
        keyword_logic: "and"
      },
      storage_management_form: {
        all_page: 1,
        target_page: 2,
        storage_type: 3,
        redis: {
          ip: "10.5.9.87",
          port: 6379,
          type: "set"
        },
        storage_content: {
          ip: "10.5.9.110",
          port: 3306,
          username: "root",
          password: "cetc@2019",
          dbname: "duocaiyunspider_dataresource",
          tablename: this.project_name
        },
        storage_type_1: {
          dirs: "D://pythonWorkSpace//spider//test_debug//debug1"
        },
        storage_type_2: {
          ip: "http://10.5.9.84:8084/fdfs/upload",
          port: 3302,
          username: "root",
          password: "root"
        },
        storage_type_3: {
          interface_address: "http://10.5.9.84:8084/fdfs/upload"
        },
        storage_type_4: {
          ip: "10.5.9.84",
          port: 3306,
          username: "root",
          password: "root",
          dbname: "files",
          tablename: "files"
        }
      },
      appkey_form: {
        domains: []
      },
      account_form: {
        domains: []
      },
      scheduler_form: {
        type: 1,
        scheduler: {
          cron_month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          cron_day_of_month: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31
          ],
          cron_hour: [0],
          cron_minutes: [0],
          description: "每天 22 点执行"
        }
      },
      data_return_form: {
        batch_size: 200,
        url: "http://10.5.9.119:5060/data_storage"
      }
    };
  },
  methods: {
    async submitscheduler() {
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading"
      });
      var form = {
        seed_form: JSON.stringify(this.seed_form),
        download_params_form: JSON.stringify(this.download_params_form),
        crawl_range_form: JSON.stringify(this.crawl_range_form),
        crawl_stratege_form: JSON.stringify(this.crawl_stratege_form),
        resource_extraction_form: JSON.stringify(this.resource_extraction_form),
        storage_management_form: JSON.stringify(this.storage_management_form),
        appkey_form: JSON.stringify(this.appkey_form),
        account_form: JSON.stringify(this.account_form),
        data_return_form: JSON.stringify(this.data_return_form),
        scheduler_form: JSON.stringify(this.scheduler_form)
      };
      var params = {
        project_name: this.project_name,
        config: JSON.stringify(form)
      };

      try {
        const res = await apiAddScheduler(params);
        if (res) {
          this.$message.success("调度成功！");
          this.$emit("refresh");
        }
      } finally {
          loading.close();
      }
    },
    seed_form_add() {
      this.seed_form.domains.push({
        value: "",
        key: Date.now()
      });
    },
    seed_form_remove(item) {
      var index = this.seed_form.domains.indexOf(item);
      if (index !== -1) {
        this.seed_form.domains.splice(index, 1);
      }
    },
    account_form_add() {
      this.account_form.domains.push({
        value: "",
        key: Date.now()
      });
    },
    account_form_remove(item) {
      var index = this.account_form.domains.indexOf(item);
      if (index !== -1) {
        this.account_form.domains.splice(index, 1);
      }
    },
    removeDomain(item) {
      var index = this.appkey_form.domains.indexOf(item);
      if (index !== -1) {
        this.appkey_form.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.appkey_form.domains.push({
        value: "",
        key: Date.now()
      });
    }
    // handleClick(tab, event) {
    //     console.log(tab, event);
    // }
  }
};
</script>



<style lang="scss" >
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
