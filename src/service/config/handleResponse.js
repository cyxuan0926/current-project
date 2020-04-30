import { Message } from 'element-ui'
import router from '@/router'
import logout from '@/utils/logout'
// import store from '@/store'

const tips = (msg = '操作失败！', type = 'error') => {
  Message.closeAll()
  Message({
    showClose: true,
    message: msg,
    duration: 3000,
    type: type
  })
}

/**
  * 接口响应处理
  * next: Function数据处理
  * resData: Boolean是否将相应的数据返回，默认false
**/
const codes = {
  200: {
    resData: true,
    next: (params, url) => {
      if (url.indexOf('/prisoners/processing') > -1 || url.indexOf('/upload/uploadfile') > -1 || url.indexOf('/prisoners/validate') > -1) {
        Message.closeAll()
        // tips('导入的Excel罪犯数据解析完成', 'success')
      }
      else tips(params.msg || '操作成功', 'success')
    }
  },
  400: {
    next: params => {
      tips('请求无效')
    }
  },
  401: {
    next: params => {
      tips(params.msg || '身份验证失败，请重新登录')
      logout()
      router.push({ path: '/login', query: { redirect: router.currentRoute.fullPath } })
    }
  },
  403: {
    next: params => {
      tips(typeof params === 'string' ? params : '权限不足，请重新登录')
      router.replace({ path: '/dashboard' })
    }
  },
  404: {
    next: params => {
      tips('找不到对应的资源！')
    }
  },
  405: {
    next: params => {
      tips('请求方法错误！')
    }
  },
  413: {
    next: params => {
      tips('文件过大，请重新上传')
    }
  },
  415: {
    next: params => {
      tips('提交的数据格式错误！')
    }
  },
  500: {
    next: params => {
      tips(params.msg || '服务器内部错误！')
    }
  },
  502: {
    next: params => {
      tips('Bad Gateway,网关错误！')
    }
  },
  504: {
    next: params => {
      tips('请检查服务是否启动！')
    }
  },
  10006: {
    next: params => {
      tips(params.msg || '账号不存在，请确认用户名或密码错误')
    }
  },
  20002: {
    next: params => {
      tips(params.msg || '登录超时')
      logout()
      router.push({ path: '/login', query: { redirect: router.currentRoute.fullPath } })
    }
  },
  99998: {
    next: params => {
      tips(params.msg || '无相应权限，请重新登录')
    }
  },
  '-1': {
    next: (params, url) => {
      if (url.indexOf('/jails/updateJails') > -1 && params.data && Object.keys(params.data).length) {
        if (params.data.canNotAddDay ||
          params.data.canNotDeleteDay ||
          params.data.delList ||
          params.data.addList ||
          params.data.updList) {
          Object.keys(params.data).forEach(key => {
            tips(`${ params.msg }, 日期为：${ params.data[key].join('，') }`)
          })
          return
        }
        tips(params.msg)
      }
      else tips(params.msg)
    }
  }
}
const enToZh = {
  timeout: '请求超时，请稍后重试'
}

const handleErrorMessage = (message) => {
  let word = Object.keys(enToZh).find(w => {
    return message.indexOf(w) > -1
  })
  return word ? enToZh[word] : message
}
export default params => {
  if (params.config.url.includes('/feedbacks/download') || params.config.url.includes('/authorFamily/export')) if (params.status === 200 && !params.data.code) return params
  // if (params.config.url.includes('/meetings/batchAuthorize')) if (params.status === 200) return params.data
  let result = codes[params.status === 200 ? params.data.code : params.status]
  if (!result) {
    tips(params.data ? params.data.msg : handleErrorMessage(params.message))
    return false
  }
  result.next && result.next(params.data, params.config.url)
  if (result.resData) return params.data
}
