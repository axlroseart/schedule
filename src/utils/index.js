//获取cookie
export function getCookie(name) {
  //获取name在Cookie中起止位置
  var start = document.cookie.indexOf(name + '=')
  if ( start != -1 ) {
    start = start + name.length + 1
    //获取value的终止位置
    var end = document.cookie.indexOf(";", start)
    if ( end == -1 )
        end = document.cookie.length
    //截获cookie的value值,并返回
    return unescape(document.cookie.substring(start,end))
  }
  return ''
}

//设置cookie,增加到vue实例方便全局调用
export function setCookie(c_name, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? ";path=/" : ";path=/;expires=" + exdate.toGMTString())
}

//删除cookie
export function delCookie(name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null)
   document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()
}

/**
 ** 获取数据状态处理
 ** @param {object} data
 * */
export const checkData = (data) => {
  return new Promise((resolve, reject) => {
    if (typeof data !== 'undefined') {
      if (data.code === 200 || data.code === 0) {
        resolve(data)
      } else {
        reject(data)
      }
    }
  })
}

// 时间戳格式化
export const dateFormat = (stamp) => {
  let date = new Date(stamp)
  let Y = date.getFullYear() + '-'
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
  let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  let m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  let s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds())
  return Y+M+D+h+m+s
}