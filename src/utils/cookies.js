import Cookies from 'js-cookie'

//暂存用户输入的参数
export function setField(key, value) {
    Cookies.set(key, value, {expires: 60});
}

//读取用户存储的参数
export function getField(key) {
    console.log(Cookies.get(key))
    return Cookies.get(key) ? Cookies.get(key) : null;
}