//封装了请求头与响应拦截，一般使用这个
import request from '@/utils/request'



//处理一些不需要进行权限拦截或者返回状态拦截的请求，使用原始的axios。例如文件下载
import requestv2 from '@/utils/requestv2'

//获取Cookies中的的token信息
import { getToken } from '@/utils/auth'



/**
 * @param {JSON} data JSON包含当前页、每页显示的数据、年级名称、年级编号  { gno: this.gno, name: this.name, pagesize: pagesize2, currentPage: currentPage2 }
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



/**
 * 
 * @param {Array} data 年级信息info列表，导出excel功能
 * @returns 
 */
 export function exportExcel(data){
  return requestv2({
    url: '/grade/download',
    method: 'post',
    responseType: 'blob',
    data
  })
}
