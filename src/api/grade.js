import request from '@/utils/request'


/**
 * @param {JSON} data JSON包含当前页、每页显示的数据、年级名称、年级编号
 * 分页功能：通过向后端传输分页参数与查询的字段，获取分页的数据（分页功能由后端完成）
 * 注意：系统用户管理模块是获取匹配条件的数据，在前端完成分页功能
 */
export function getPage(data) {
  return request({
    url: '/grade/getPage',
    method: 'post',
    responseType:'json',
    data
  })
}

/**
 * 获取所有老师信息
 * @returns 
 */
export function getTeachers(){
  return request({
    url: '/teacher/getTeachers',
    method: 'post',
    responseType: 'json'
  })
}

/**
 * 
 * @param {JSON} data 年级信息info 添加新的年级信息
 * @returns 
 */
export function insertGrade(data){
  return request({
    url: '/grade/insertGrade',
    method: 'post',
    responseType: 'json',
    data
  })
}

/**
 * 
 * @param {JSON} data 年级信息info 修改年级信息
 * @returns 
 */
export function updateGrade(data){
  return request({
    url: '/grade/updateGrade',
    method: 'post',
    responseType: 'json',
    data
  })
}

/**
 * 
 * @param {JSON} data 年级信息info 删除年级信息
 * @returns 
 */
 export function deleteGrade(data){
  return request({
    url: '/grade/deleteGrade',
    method: 'post',
    responseType: 'json',
    data
  })
}
