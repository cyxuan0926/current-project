import { helper } from '@/utils'
let fillPre = (val) => {
  return `00${ val }`.slice(-2)
}
export default {
  // 日期过滤器 特定格式化的
  Date(time) {
    if (!time) return ''
    else if (time < 0) return ''

    let date = new Date(time),
      year = date.getFullYear(),
      month = fillPre(date.getMonth() + 1),
      day = fillPre(date.getDate()),
      hour = fillPre(date.getHours()),
      minute = fillPre(date.getMinutes()),
      second = fillPre(date.getSeconds())

    return `${ year }-${ month }-${ day } ${ hour }:${ minute }:${ second }`
  },

  // 日期格式化 原生的 可能不全面的
  dateFormate(date, fmt = 'yyyy-MM-dd') {
    if (!date) return
    if (date instanceof Date === false) date = new Date(date)

    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }

    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${ date.getFullYear() }`).substr(4 - RegExp.$1.length))

    for (let k in o) {
      if (new RegExp(`(${ k })`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${ o[k] }`).substr((`${ o[k] }`).length)))
    }

    return fmt
  },

  // 通过Moment库来封装的日期格式化
  momentDateFormate(date, formate) {
    return helper.DateFormat(date, formate)
  }
}
