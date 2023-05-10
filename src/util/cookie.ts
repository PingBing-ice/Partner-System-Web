import cookie from 'js-cookie'
const TokenKey = 'token'
//cookie有三个值 分别是 名字、值、作用域
export function getToken() {
    return cookie.get(TokenKey)
}

export function setToken(token:string) {
    return cookie.set(TokenKey, token)
}

export function removeToken() {
    return cookie.remove(TokenKey)
}