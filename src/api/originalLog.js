import { request } from '@/api/init.js'

// 日志分析接口
export function apiOriginalLog(id) {
    return new Promise((resolve, reject) => {
        request({
            url: 'original_log',
            method: 'get',
            params: { id }
        }).then((res) => {
            resolve(res)
        }).catch((e) => {
            reject(e)
        })
    })
}