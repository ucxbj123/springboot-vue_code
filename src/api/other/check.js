
//其他模块的请求服务
import requestcheck from '@/utils/requestCheck'
//封装了header信息
import request from '@/utils/request'



/**
 * @param {JSON} data 添加新的检验项目
 */
export function insertproject(project, standardname, checklength, createuser) {
  var data = {project: project, standardname: standardname, checklength: checklength, createuser: createuser}
  return request({
    url: '/inspect/insertproject',
    method: 'post',
    responseType:'json',
    data
  })
}

/**
 * @param {JSON} data 查询项目
 */
 export function getproject() {
  return request({
    url: '/inspect/getTestprojects',
    method: 'post',
    responseType:'json',
  })
}