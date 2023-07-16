import cookie from 'js-cookie'
const TokenKey = 'token'
//cookie有三个值 分别是 名字、值、作用域
export function getToken() {
   // return  localStorage.getItem(TokenKey);
    return cookie.get(TokenKey)
}

export function setToken(token:string) {
    // localStorage.setItem(TokenKey, token);
    return cookie.set(TokenKey, token)
}

export function removeToken() {
    // localStorage.removeItem(TokenKey);
    return cookie.remove(TokenKey)
}