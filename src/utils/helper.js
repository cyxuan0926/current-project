import Moment from 'moment'
import switches from '@/filters/modules/switches'
import urls from '@/service/urls'

let fillPre = (val) => {
  return `00${ val }`.slice(-2)
}

export const isEmptyObject = (options, query = []) => {
  if (!options) return false
  let result = {}
  Object.keys(options).forEach(k => {
    if (options[k] && !query.find((n) => n === k)) {
      result[k] = options[k]
    }
  })
  if (!Object.keys(result).length) return false
  return result
}

export const trimObject = (options, query = []) => {
  if (!options || !Object.keys(options).length) return false
  let result = Object.assign({}, options)
  Object.keys(options).forEach(k => {
    if (options[k] && typeof options[k] === 'string' && !query.find((n) => n === k)) {
      let reSpace = /^\s*(.*?)\s*$/
      result[k] = options[k].replace(reSpace, '$1')
    }
  })
  if (!Object.keys(result).length) return false
  return result
}

export const trimString = (str) => {
  if ([undefined, null].indexOf(str) > -1) return str
  else if (String.prototype.trim) return str.trim()
  else return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
}

export const durationFormat = (duration, { format = 'HH:mm:ss', unit = 's' }) => {
  if ([undefined, null, ''].indexOf(duration) > -1) {
    return duration
  }
  if (unit !== 's') {
    return 'unkown-unit'
  }
  duration = parseInt(duration)
  let ss, mm, hh
  ss = duration % 60
  if (unit === 's' && format === 'HH:mm:ss') {
    mm = parseInt(duration / 60) % 60
    hh = parseInt(duration / 60 / 60)
    return `${ fillPre(hh) }:${ fillPre(mm) }:${ fillPre(ss) }`
  }
  if (unit === 's' && format === 'mm:ss') {
    mm = (duration - ss) / 60
    return `${ mm >= 100 ? mm : fillPre(mm) }:${ fillPre(ss) }`
  }
}

// 简单克隆
export const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

// 角色名称转化角色信息对象(理想的情况下)
export const transitionRolesList = (val) => {
  let { name, id } = val, result = { value: id }, data = {},
    isOwn = switches['role'].some(role => {
      if (role.label === name) {
        data = role
        return true
      }
    })
  if (isOwn) result = Object.assign(result, data)
  else result = Object.assign(result, { label: name, role: '-1' }) // 以后别的角色需要
  return result
}

/**
 * 角色名称列表转角色id 现在的用户都只有单个角色
 * -1 租户管理员
 * 0 狱务通管理员
 * 1 审核人员
 * 3 信息人员
 * 4 监狱管理
 * -9999 其余角色人员(暂时)
 * arr 角色数组 roles 角色列表对应的角色id
 * controlArg
 */
export const transitionRoleId = (val) => {
  if (!val.length) return { role: '-1' } // 租户管理员
  let arr = [], result = {}, roles = [
      { roleList: [0], role: '0' },
      { roleList: [1], role: '1' },
      { roleList: [3], role: '3' },
      { roleList: [4], role: '4' },
      { roleList: [5], role: '5' },
      { roleList: [6], role: '6' }
    ], controlArg = true
  for (let value of val) {
    let { roleName } = value, roleId, isOwn = switches['role'].filter(roles => {
      if (roles.label === roleName) {
        roleId = roles.role
        return true
      }
    })
    if (isOwn) arr.push(Number(roleId))
  }
  arr = Array.from(new Set(arr))
  for (let index in roles) {
    if (roles[index].roleList.length !== arr.length) {
      controlArg = false
      continue
    }
    else {
      controlArg = true
      for (let value of roles[index].roleList) {
        if (arr.some((item, index) => value === item)) continue
        else {
          controlArg = false
          break
        }
      }
    }
    if (controlArg) {
      result = { role: roles[index].role }
      break
    }
    else result = { role: '-9999' } // 没有对应的角色列表 暂时的角色id
  }
  return result
}

// // 懒加载路由
// export function loadView(path) {
//   return resolve => require([`@/views/${ path }`], resolve)
// }

/**
 * 动态加载组件
 * @param {String} path 组件相对于@/views目录的路径
 */
export const loadView = path => () => import(`@/views/${ path }`)

// 日期格式化
export function DateFormat(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  return Moment(date).format(format)
}
// 兼容URL
export function createObjectURL(object) {
  return window.URL ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object)
}
/**
 * 格式化日期
 * @param {Number || Object || String} time 时间戳或者标准格式的时间对象 || 字符串
 * @param {String} format 描述日期格式的字符串
 * @param {Boolean} isFillZero 是否需要补0
 * @return {String} 格式化之后的日期字符串，默认为当前时间
 *                  默认格式为'yyyy/MM/dd hh:mm:ss'，且会自动补零
 *
 * @example
 *
 * formatTime(new Date(2017, 5, 3, 6, 7, 8), 'yyyy年MM月dd日 hh:mm:ss')
 * // => "2017年06月03日 06:07:08"
 *
 * formatTime(1502268008000, 'yyyy年MM月dd日 hh:mm:ss', false)
 * // => "2017年8月9日 16:40:8"
 *
 * formatTime('Fri Jun 29 2018 17:20:08 GMT+0800 (中国标准时间)')
 * // => "2018/06/29 17:20:08"
 *
 * formatTime(new Date(2017, 5, 3), 'MM-dd-yy hh:mm:ss')
 * // => "06-03-17 00:00:00"
 */
export function formatTime(
  time = Date.now(),
  format = 'yyyy-MM-dd hh:mm:ss',
  isFillZero = true
) {
  if (!time) return ''

  const date = new Date(time)
  const cell = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }

  for (const key in cell) {
    if (cell.hasOwnProperty(key)) {
      format = format.replace(new RegExp(key), function(match) {
        return isFillZero ? (`0${ cell[key] }`).slice(-match.length) : cell[key]
      })
    }
  }

  return format
}

/**
 * 处理图片格式
 * @param { Array || String } images 图片数组 || 图片字符串
 * @param { Boolean } isIdentify 是否有字段来标识是哪种类型的图片
 * @param { String } cutSymbol images是字符串的时候的切割符号
 * @param { Boolean } isPublic isIdentify是有标识符的时候 公共服务图片的标识
*/
export const filterImages = ({ images, isIdentify = false, cutSymbol = ';', isPublic } = {}) => {
  if (!images || !images.length) return
  let imageUrls = images
  if (Object.prototype.toString.call(images) === '[object String]') {
    imageUrls = new Set(images.split(cutSymbol))
    if (imageUrls.has('')) imageUrls.delete('')
  }
  if (!isIdentify) {
    return [ ...imageUrls ].map(url => {
      if (url.includes('https://') || url.includes('http://')) return ` ${ url }?token=${ urls.token } `
      else return `${ urls.publicApiHost }/files/${ url }`
    })
  }
  if (isIdentify) {
    if (isPublic) return [ ...imageUrls ].map(item => `${ urls.publicApiHost }/files/${ item }`)
    else return [ ...imageUrls ]
  }
}
