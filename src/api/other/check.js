
//其他模块的请求服务
import request from '@/utils/requestCheck'



/**
 * @param {JSON} data 
 */
export function getPage(data) {
  return request({
    url: '/clazz/getPage',
    method: 'post',
    responseType:'json',
    data
  })
}