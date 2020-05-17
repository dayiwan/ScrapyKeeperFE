import { request } from '@/api/init'
const querystring = require('querystring')


// 获取服务器节点详情
export function apiDetailMachine(params) {
    return new Promise((resolve, reject) => {
        request({
            url: 'server_machine',
            method: 'get',
            params: params
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}

// 新的请求函数， 获取服务器列表请求
export function apiListMachine() {
    return new Promise((resolve, reject) => {
        request({
            url: 'server_machine',
            method: 'get'
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}

// 添加服务器
export function apiAddmachine(machine) {
    return new Promise((resolve, reject) => {
        request({
            url: 'server_machine',
            method: 'post',
            data: querystring.stringify(machine)
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}

// 删除服务器
export function apiDelMachine(id) {
    return new Promise((resolve, reject) => {
        request({
            url: 'server_machine',
            method: 'delete',
            params: { id }
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}

// 编辑服务器
export function apiEditMachine(machine) {
    return new Promise((resolve, reject) => {
        request({
            url: 'server_machine',
            method: 'put',
            data: querystring.stringify(machine)
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}