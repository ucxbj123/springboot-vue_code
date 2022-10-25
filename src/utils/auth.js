import Cookies from 'js-cookie'

//超期时间
const expiresTime = 7

// const TokenKey = 'vue_admin_template_token'
const TokenKey = 'USERTOKEN'

export function getToken() {

  return Cookies.get(TokenKey)
  // return localStorage.getItem(TokenKey)
}

/**
 * @param {string} token 口令
 * @param {boolean} expiresTime 是否开启rememberMe：默认是7天，若不设置超期时间，默认是会话cookie，浏览器关闭则失效
 */
export function setToken(token,isexpiresTime) {
  if(isexpiresTime){
    return Cookies.set(TokenKey, token, { expires: expiresTime})
  }else{
    return Cookies.set(TokenKey, token)
  }
  // return localStorage.setItem(TokenKey,token)
}

export function removeToken() {
 
   return Cookies.remove(TokenKey)
  // return localStorage.removeItem(TokenKey)
}
