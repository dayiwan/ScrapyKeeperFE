import { request, requestMultipart } from '@/api/init'
const querystring = require('querystring')


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