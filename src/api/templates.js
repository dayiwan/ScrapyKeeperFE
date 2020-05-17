import { request, requestMultipart } from '@/api/init'
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
    const formData = new FormData();
    for (let key in form) {
        if (form[key] instanceof File) {
            formData.append(key, null);
            formData.set(key, form[key]);
        } else {
            formData.append(key, form[key]);
        }
    }
    return new Promise((resolve, reject) => {
        requestMultipart
            .post("/template", formData)
            .then(data => {
                resolve(data)
            })
            .catch(e => {
                reject(e)
            })
    })
}

// 解析模板
export function apiParseTmpl(rawFile) {
    const formData = new FormData();
    formData.append("tpl_zip", null);
    formData.set("tpl_zip", rawFile);
    return new Promise((resolve, reject) => {
        requestMultipart
            .post("/template_parser", formData)
            .then(data => {
                resolve(data)
            })
            .catch(e => {
                console.error(e);
                reject(e)
            });
    })
}

// 删除
export function apiDelTmpl(id) {
    return new Promise((resolve, reject) => {
        request({
            url: 'template',
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