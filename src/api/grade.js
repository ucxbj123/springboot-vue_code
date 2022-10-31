import request from '@/utils/request'


/**
 * @param {JSON} pagesize JSON包含当前页、每页显示的数据、年级名称、年级编号
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