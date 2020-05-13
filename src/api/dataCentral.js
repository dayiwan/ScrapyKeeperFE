import { request } from '@/api/init.js'
const querystring = require('querystring')

export function apiGetStatus() {
    return request({
        url: '/data_central',
        method: 'get',
    })
}

export function apiGetProjectWeekData() {
    return request({
        url: '/data_central',
        method: 'post',
    })
}