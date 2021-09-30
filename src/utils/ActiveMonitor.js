import throttle from 'lodash/throttle'
import { Message } from 'element-ui'
import router from '@/router'

import logout from '@/utils/logout'

export default class ActiveMonitor {
  constructor(maxTime = 30 * 60, types = ['click', 'keydown']) {
    this.isActive = true
    this.MAX_TIME = this.timeRemaining = maxTime
    this.TYPES = types
  }

  start() {
    const handler = throttle(this._handler.bind(this), 10 * 1000)

    this.TYPES.forEach(type => window.addEventListener(type, handler))

    this._startInterval()
  }

  _handler() {
    if (this.isActive) {
      this.timeRemaining = this.MAX_TIME
    }
    else {
      this._reset()
      logout()
      Message.closeAll()
      if (router.currentRoute.path !== '/login') {
        router.push('/login')
        Message({
          type: 'warning',
          message: '您长时间未进行操作，请重新登录',
          duration: 3000
        })
      }
    }
  }

  _startInterval() {
    this.timer = setInterval(() => {
      this.timeRemaining = this.timeRemaining - 10

      if (this.timeRemaining <= 0) {
        this.isActive = false
        clearInterval(this.timer)
      }
    }, 10 * 1000)
  }

  _reset() {
    this.isActive = true
    this.timeRemaining = this.MAX_TIME
    clearInterval(this.timer)
    this._startInterval()
  }
}
