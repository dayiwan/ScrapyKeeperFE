import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'

// 创建axios实例
const service = axios.create({
    baseURL: 'http://172.16.13.22:5060', // api的base_url
    timeout: 15000, // 请求超时时间
    headers: { 'Content-Type': 'multipart/form-data' }
})

// respone拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非20000是抛错 可结合自己业务进行修改
         */
        const res = response.data
        if (res.status !== 'ok') {
            Message({
                message: '服务器响应错误: ' + res.msg,
                type: 'error',
                duration: 5 * 1000
            })

            // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload() // 为了重新实例化vue-router对象 避免bug
                    })
                })
            }
            return Promise.reject(res.msg)
        } else {
            return res.data
        }
    },
    error => {
        if (error.response && error.response.data && error.response.data.message) {
            Message.error({
                message: error.response.data.message
            })
        } else {
            Message.error({
                message: error
            })
        }
        console.log('err ' + error) // for debug
        return Promise.reject(error)
    }
)

export default service