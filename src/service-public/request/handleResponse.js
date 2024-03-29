import { Message } from 'element-ui'
import logout from '@/utils/logout'
import router from '@/router'
import apiUrls from '@/service/urls'

const tip = (message = '操作失败！', type = 'error', duration = 3000) => {
  Message.closeAll()
  Message({ type, message, duration, showClose: true })
}

const verificationCodesLists = ['/sms/verification-codes/username', '/sms/verification-codes/username-modifypassword']
const plainUrl = url => url.replace(apiUrls.publicApiHost, '')

const responseHandlers = {
  // 有些接口正向成功是200
  200: res => {
    const { url } = res.config
    if (url.includes('/oauth/token')) {}
    else if (verificationCodesLists.includes(plainUrl(url))) {
      tip(res.data, 'success', 0)
      return { code: 'SMS_SEND_OK' }
    }

    return res.data
  },
  // 有些接口正向成功是201
  201: res => {
    // eslint-disable-next-line
    const { url } = res.config
    return res.data
  },
  // 请求成功 无返回体成功分为正向成功和反向成功 需要区别处理
  204: res => {
    const { url } = res.config
    if (url.includes('/users/me/password/by-old-password')) {
      tip('重置用户密码成功', 'success')
      return true
    } else if (url.includes('/users/usernames')) {
      tip('该用户已经存在，请另选用户名', 'success')
      return false
    } else if (url.includes('/users/security-question-answers/my')) {
      tip('设置安全问题答案成功', 'success')
      return true
    } else if (url.includes('/users/password/by-token')) {
      tip('密码重置成功，请登录国科服务系统！', 'success')
      return true
    } else if (url.includes('/sms/verification-codes')) {
      tip('短信验证码发送成功', 'success')
      return { code: 'SMS_SEND_OK' }
    } else if (url.includes('/users/updatephone')) {
      tip('手机号绑定成功', 'success')
      return { code: 'SMS_BIND_OK' }
    } else if (url.includes('/users/password/username/by-code')) {
      tip('密码重置成功，请登录国科服务系统！', 'success')
      return true
    }
  },

  // 请求失败 有错误返回体
  400: res => {
    const { url } = res.config
    if (url.includes('/users/security-question-answers/by-username')) {
      return 'user.CanNotRecoverDisabledUserPassword'
    } else if (url.includes('/users/security-question-answers/verification')) {
      return false
    } else if (verificationCodesLists.includes(plainUrl(url))) {
      tip(res.data)
      return { code: 'SMS_SEND_ERR', msg: res.data }
    } else if (url.includes('/users/password/username/by-code')) {
      tip(res.data)
      return false
    } else {
      if (res.data) {
        tip(res.data.message || res.data)
      }

      return res.data
    }
  },
  // 根据账号发送短信验证码 未绑定手机号
  417: res => {
    const { url } = res.config
    if (verificationCodesLists.includes(plainUrl(url))) {
      return { code: 'SMS_NO_BIND', msg: '用户未配置手机号码' }
    } else {
      if (res.data) {
        tip(res.data.message)
      }

      return res.data
    }
  },
  // 未授权
  401: res => {
    const { url } = res.config

    if (!url.includes('image-server')) {
      tip('请求未授权')
      logout()

      if (router.currentRoute.path !== '/login') {
        router.push({ path: '/login', query: { redirect: router.currentRoute.fullPath } })
      }
    }

    return false
  },
  // 请求被拒绝
  403: res => {
    tip('请求被拒绝')
    return false
  },
  // 请求资源找不到
  404: res => {
    const { url } = res.config

    if (url.includes('/users/usernames')) {
      tip('该用户没有被注册，可以使用', 'success')
      return true
    } else if (url.includes('/users/security-question-answers/by-username')) {
      return false
    }
    // tip('请求的资源不存在')
    // res.data && tip(res.data.message)
  },
  // 服务器报错
  500: res => {
    tip('公共服务问题')
    // tip('请求失败，服务器错误')
    return false
  }
}

export default res => responseHandlers[res.status](res)
