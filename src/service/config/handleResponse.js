import { Message } from 'element-ui'
import router from '@/router'

const tips = (msg = '操作失败！', type = 'error') => {
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
    next: params => {
      tips(params.msg || '操作成功', 'success')
    }
  },
  401: {
    next: params => {
      tips('身份验证失败，请重新登录')
    }
  },
  403: {
    next: params => {
      tips('权限不足，请重新登录')
    }
  },
  404: {
    next: params => {
      console.log(params)
      tips('找不到对应的资源！')
    }
  },
  405: {
    next: params => {
      tips('请求方法错误！')
    }
  },
  415: {
    next: params => {
      tips('提交的数据格式错误！')
    }
  },
  500: {
    next: params => {
      tips('服务器内部错误！')
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
      localStorage.removeItem('user')
      localStorage.removeItem('routes')
      tips(params.msg || '登录超时')
      router.push({ path: '/new-login' })
    }
  },
  99998: {
    next: params => {
      localStorage.removeItem('user')
      localStorage.removeItem('routes')
      tips(params.msg || '无相应权限，请重新登录')
      router.push({ path: '/new-login' })
    }
  }
}

export default params => {
  let result = codes[params.status === 200 ? params.data.code : params.status]
  if (!result) {
    tips(params.data ? params.data.msg : '')
    return false
  }
  result.next && result.next(params.data)
  if (result.resData) return params.data
}
