import axios from 'axios'
import { Message } from 'element-ui'
const querystring = require('querystring')

const baseURL = process.env.NODE_ENV == 'development' ? 'http://172.16.13.22:5060' : ''


const handelSuccess = response => {
    if (response.data.status !== 'ok') {
        Message.error({
            message: response.message,
            showClose: true,
            duration: 0
        })
        return
    } else {
        return response.data.data
    }
}

const handleError = error => {
    if (error.response && error.response.data && error.response.data.message) {
        Message.error({
            message: error.response.data.message,
            showClose: true,
            duration: 0
        })
    } else {

        Message.error({
            message: error,
            showClose: true,
            duration: 0
        })
    }
    console.error('ERROR ' + error) // for debug
    return Promise.reject(error)
}


// 创建axios实例
const request = axios.create({
    baseURL: baseURL,
    timeout: 120000, // 请求超时时间
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    withCredentials: true // 跨域session
})

// respone拦截器
request.interceptors.response.use(
    handelSuccess,
    handleError
)

const requestMultipart = axios.create({
    baseURL: baseURL, // api的base_url
    timeout: 120000, // 请求超时时间
    headers: { 'Content-Type': 'multipart/form-data' }
})

requestMultipart.interceptors.response.use(
    handelSuccess,
    handleError
)



class ApiFactory {

    constructor(url) {
        this.url = url
    }


    get(params) {
        return new Promise((resolve, reject) => {
            request({
                url: this.url,
                params: params,
                method: 'get'
            }).then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
        })
    }

    post(data) {
        return new Promise((resolve, reject) => {
            request.post(this.url, querystring.stringify(data)).then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
        })
    }

    put(data) {
        return new Promise((resolve, reject) => {
            request.put(this.url, querystring.stringify(data)).then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
        })
    }

    delete(data) {
        return new Promise((resolve, reject) => {
            request({
                url: this.url,
                method: 'delete',
                params: data
            }).then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
        })
    }
}

export {
    request,
    requestMultipart,
    ApiFactory
}