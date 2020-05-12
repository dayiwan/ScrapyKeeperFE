import request from '@/utils/request'
const querystring = require('querystring')

//编辑模板
export function apiEditTmpl(form) {
    return new Promise((resolve, reject) => {
        request({
            url: '/template',
            method: 'put',
            data: querystring.stringify(form)
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}

// 删除模板
export function delTmpl(id) {
    return request({
        url: '/template',
        method: 'delete',
        data: querystring.stringify({
            id: id
        })
    })
}
//获取模板列表
export function apiGetTmpl() {
    return new Promise((resolve, reject) => {
        request({
            url: '/template',
            method: 'get',
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}
//添加模板
export function apiAddTmpl(form) {
    return new Promise((resolve, reject) => {
        request({
            url: '/template',
            method: 'post',
            data: querystring.stringify(form)
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}