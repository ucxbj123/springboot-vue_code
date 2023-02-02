
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

/**
 * @param {Boolean} isenabled 启用/禁用项目检验
 */
 export function updateIsenabled(isenabled,id) {
  return request({
    url: '/inspect/updateIsenabled',
    method: 'post',
    responseType:'json',
    params: {
      id: id,
      isenabled: isenabled
    }
  })
}

/**
 * @param {Array} data  
 * @param {String} standardcode
 * 保存检验项
 */
export function saveStandard(data,standardcode) {
  return request({
    url: '/standard/saveStandard',
    method: 'post',
    responseType:'json',
    params: {
      standardcode: standardcode
    },
    data: data
  })
}

/** 
 * @param {String} standardcode
 * 根据检验标准编号查询检验项
 */
 export function getTeststandard(standardcode) {
  return request({
    url: '/standard/getTeststandard',
    method: 'post',
    responseType:'json',
    params: {
      standardcode: standardcode
    }
  })
}

/** 
 * @param {String} standardcode
 * 根据检验标准编号删除
 */
 export function deleteProject(standardcode) {
  return request({
    url: '/inspect/deleteProject',
    method: 'post',
    responseType:'json',
    params: {
      standardcode: standardcode
    }
  })
}