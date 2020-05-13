import { request } from '@/api/init.js'
const querystring = require('querystring')

export function getAllProject(form) {
    return request({
        url: '/project',
        method: 'get',
        params: form
    })
}

export function apiEditProjectInfo(form) {
    return new Promise((resolve, reject) => {
        request({
            url: '/project',
            method: 'put',
            data: querystring.stringify(form)
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}

export function delProject(form) {
    return request({
        url: '/project',
        method: 'delete',
        data: querystring.stringify({
            id: form.id,
            project_name: form.project_name
        })
    })
}

export function apiAddProject(form) {
    return new Promise((resolve, reject) => {
        request({
            url: '/project',
            method: 'post',
            data: querystring.stringify(form)
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}

// 获取趋势图
export function getDataTrend(params) {
    return request({
        url: '/data_trend',
        method: 'get',
        params: params
    })
}

//获取待采队列
export function apiGetSpareUrl(params) {
    return new Promise((resolve, reject) => {
        request({
            url: '/redis',
            method: 'post',
            data: querystring.stringify(params)
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}

//获取mysql数据样例
export function apiGetDataDetail(params) {
    return new Promise((resolve, reject) => {
        request({
            url: '/data_example',
            method: 'post',
            data: querystring.stringify(params)
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}

//处理日志信息
export function delJournakApi(params) {
    return request({
        url: '/log_manage/error',
        method: 'delete',
        data: querystring.stringify(params)
    })
}