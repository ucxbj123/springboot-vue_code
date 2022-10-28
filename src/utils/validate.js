/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 * 判断是否是外部链接，test()是对path检验是否符合正则表达式，符合则返回true
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 * 判断是否是管理员，若数组内有对应的账号或类型则返回true
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {number} pagesize 每页显示的数量
 * @param {number} currentPage 当前页
 * @param {Array} data 后端返回的数据，以数组形式
 * @returns {Array}
 * 分页功能：对原数据进行分页操作，返回当前页的数据（该方法基于elementUI的分页组件进行编写，elementUI分页组件已经根据原数据长度进行分页操作，最大页数已经限制）
 * 该方法只是根据分页情况动态切割原数据数据返回当前页数据
 */
 export function pageList(pagesize, currentPage, data) {
  let list = []
  if(data.length>0){
    let start = pagesize * (currentPage - 1)
    let end
    if((start+pagesize) <= data.length){
      end = start+pagesize
    }else{
      end = data.length
    }
    for(let i = start; i<end ; i++ ){
      list.push(data[i])
    }
    return list
  }else{
    return list
  }
}
