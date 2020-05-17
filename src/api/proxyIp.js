import { request } from '@/api/init.js'
const querystring = require('querystring');

// 查询
export function apiListAgency() {
    return new Promise((resolve, reject) => {
        request({
            url: 'proxy_ip_agency',
            method: 'get'
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}

// 添加
export function apiAddAgency(agency) {
    return new Promise((resolve, reject) => {
        request({
            url: 'proxy_ip_agency',
            method: 'post',
            data: querystring.stringify(agency)
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}

// 编辑
export function apiEditAgency(agency) {
    return new Promise((resolve, reject) => {
        request({
            url: 'proxy_ip_agency',
            method: 'put',
            data: querystring.stringify(agency)
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}
// 删除
export function apiDelAgency(id) {
    return new Promise((resolve, reject) => {
        request({
            url: 'proxy_ip_agency',
            method: 'delete',
            params: {
                id: id
            }
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}