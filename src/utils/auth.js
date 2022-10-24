import Cookies from 'js-cookie'


// const TokenKey = 'vue_admin_template_token'
const TokenKey = 'USERTOKEN'

export function getToken() {
  Cookies.get(TokenKey)
  return Cookies.get(TokenKey)
  // return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  
  Cookies.set(TokenKey, token)
  return Cookies.set(TokenKey, token)
  // return localStorage.setItem(TokenKey,token)
}

export function removeToken() {
 
  Cookies.remove(TokenKey)
   return Cookies.remove(TokenKey)
  // return localStorage.removeItem(TokenKey)
}
