//封装了请求头与响应拦截，一般使用这个
import request from '@/utils/request'



//处理一些不需要进行权限拦截或者返回状态拦截的请求，使用原始的axios。例如文件下载
import requestv2 from '@/utils/requestv2'


/**
 * @param {JSON} data JSON包含当前页、每页显示的数据、姓名、学生账号，账号是否正常
 */
 export function getStudentPage(data) {
    return request({
      url: '/student/getStudentPage',
      method: 'post',
      responseType:'json',
      data
    })
}

/**
 * @param {JSON} data JSON包含当学生的信息
 * 修改学生信息
 */
 export function updateStudent(data){
  return request({
    url: '/student/updateStudent',
    method: 'post',
    responseType:'json',
    data
  })
}