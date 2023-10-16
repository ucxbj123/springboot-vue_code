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


/**
 * @param {Blob} 
 * 导出excel功能：主要用于接收后端的文件流然后进行下载
 */
 export function exportExcel(blob) {
  let url = window.URL.createObjectURL(blob);
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute(
    "download",
    decodeURI(res.headers["content-disposition"].split("=")[1])
  );
  document.body.appendChild(link);
  link.click()
  //释放资源
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
}


/**
 * @param {Array} filterVal ['id','name'] 需要下载的属性名
 * @param {Array} jsonData [{id:1,name:'june',sex:'男'},{id:1,name:'lucy',sex:'女'}] 原始的数据，内包含对象；只会导出id,name的值
 * 前端导出excel用于JSON数据字段的选取并格式化为table类型的数据进行导出
 */
export function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => {   //map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。
    if (j === 'timestamp') {                      //map() 方法按照原始数组元素顺序依次处理元素
      return parseTime(v[j])                      //总结：map方法主要就是改变原来每一个值的展示形式，整个的数据类型Array是没有改变的;map()内使用map()逆向梳理会比较好理解
    } else {
      return v[j]
    }
  }))
}

/**
 * @param {JSON} obj 
 * @param {Array} keys
 * 用于获取json数据内特定的值，过滤掉不需要的的属性
 * hasOwnProperty(propertyName)方法 是用来检测属性是否为对象的自有属性，如果是，返回true，否者false; 参数propertyName指要检测的属性名；
 */
 export function partObject(obj, keys) {
  if(!keys instanceof Array || keys.length === 0){
    return
  }
  let returnObj = {}
  keys.forEach(item => {
    if(obj.hasOwnProperty(item)){
      returnObj[item] = obj [item]
    }
  })
  return returnObj
}


/**
 * @param {String} obj 
 * 根据是否配置hostname为localip进行处理，若配置为localip，则获取浏览器的host把url中的hostname进行替换，进行url重写
 */
export function rewirteurl(obj) {
  if (obj.indexOf('localip') != -1){
      //获取当前网页访问的hostname作为新url组成部分
      let str = window.location.hostname
      //replace()替换第一个匹配到的字符
      return obj.replace('localip',str)
  }
  return obj
}
