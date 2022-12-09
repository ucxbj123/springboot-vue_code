//封装了请求头与响应拦截，一般使用这个
import request from '@/utils/request'



//处理一些不需要进行权限拦截或者返回状态拦截的请求，使用原始的axios。例如文件下载
import requestv2 from '@/utils/requestv2'


/**
 * @param {JSON} data JSON包含当前页、每页显示的数据、姓名、教师账号，账号是否正常
 */
 export function getTeacherPage(data) {
    return request({
      url: '/teacher/getTeacherPage',
      method: 'post',
      responseType:'json',
      data
    })
}

/**
 * @param {JSON} data JSON包含当教师的信息
 * 修改教师信息
 */
 export function updateTeacher(data){
  return request({
    url: '/teacher/updateTeacher',
    method: 'post',
    responseType:'json',
    data
  })
}

/**
 * @param {String} tno 教师编号
 * 获取教师的任职班级信息与所有班级信息
 */
 export function getClass(tno){
  return request({
    url: '/teacher/getClass',
    method: 'get',
    responseType:'json',
    params:{
      tno:tno
    }
  })
}


/**
 * @param {Array} data 批量添加教师任课班级信息
 * 
 */
 export function insertClassBatch(data){
  return request({
    url: '/teacher/insertClassBatch',
    method: 'post',
    responseType:'json',
    data
  })
}


/**
 * @param {Array} data 批量删除教师任课班级信息
 * 
 */
 export function deleteClassBatch(data){
  return request({
    url: '/teacher/deleteClassBatch',
    method: 'post',
    responseType:'json',
    data
  })
}

/**
 * @param {String} content 提交教师班级的授课内容
 * @param {String} tno  教师编号
 * @param {String} cno  班级编号
*/
 export function updateContent(content,tno,cno){
  return request({
    url: '/teacher/updateContent',
    method: 'post',
    responseType:'json',
    params:{
      content: content,
      tno: tno,
      cno: cno
    }
  })
}

/** 获取教师班级的授课内容
 * @param {String} tno  教师编号
 * @param {String} cno  班级编号
*/
export function getContentByTnoAndCno(tno,cno){
  return request({
    url: '/teacher/getContentByTnoAndCno',
    method: 'post',
    responseType:'json',
    params:{
      tno: tno,
      cno: cno
    }
  })
}