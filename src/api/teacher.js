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