//封装了请求头与响应拦截，一般使用这个
import request from '@/utils/request'



//处理一些不需要进行权限拦截或者返回状态拦截的请求，使用原始的axios。例如文件下载
import requestv2 from '@/utils/requestv2'



/**
 * 
 * @param {Array} data 班级级信息info列表，导出excel功能
 * @returns 
 */
 export function exportExcel(data){
  return requestv2({
    url: '/clazz/download',
    method: 'post',
    responseType: 'blob',
    data
  })
}

/**
 * 
 * @param {JSON} data 用户信息 用于账号添加
 * @returns 
 */
 export function insertUser(data){
  return request({
    url: '/system/insertUser',
    method: 'post',
    responseType: 'json',
    data
  })
}

/**
 * 
 * @param {JSON} data 用户信息 用于账号修改
 * @returns 
 */
 export function updateUser(data){
  return request({
    url: '/system/updatetUser',
    method: 'post',
    responseType: 'json',
    data
  })
}

/**
 * 
 * @param {JSON} data 用户信息 用于账号删除
 * @returns 
 */
 export function deleteUser(data){
  return request({
    url: '/system/deletetUser',
    method: 'post',
    responseType: 'json',
    data
  })
}
