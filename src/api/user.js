import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}


//以下是个人重写登录请求
export function loginv2(data) {
  return request({
    baseURL: '/springboot',
    url: '/login/login',
    method: 'post',
    data
  })
}

export function getInfov2(token) {
  return request({
    url: '/login/info',
    method: 'get',
    params: { token }
  })
}
