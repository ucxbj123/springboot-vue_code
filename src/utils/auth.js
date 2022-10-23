import Cookies from 'js-cookie'


// const TokenKey = 'vue_admin_template_token'
const TokenKey = 'USERTOKEN'

export function getToken() {
  // return Cookies.get(TokenKey)
  Cookies.get(TokenKey)
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  Cookies.set(TokenKey, token)
  return localStorage.setItem(TokenKey,token)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  Cookies.remove(TokenKey)
  return localStorage.removeItem(TokenKey)
}
