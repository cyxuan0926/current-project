// import { Notification, Message } from 'element-ui'
import { Notification } from 'element-ui'
import urls from '@/service/urls'
import throttle from 'lodash/throttle'

const wsUrl = jailId => `${ urls.socketUrl }/${ jailId }`

let socket
const ONE_MINUTES = 60 * 1000
const heartCheck = {
  heartInterval: 5 * ONE_MINUTES,
  frontTimeout: null,
  serverTimeout: null,
  reset: function() {
    clearTimeout(this.serverTimeout)
    clearTimeout(this.frontTimeout)
    return this
  },
  start: function() {
    if (socket.logout) return
    var self = this
    this.frontTimeout = setTimeout(function() {
      socket.send('PING')
      self.serverTimeout = setTimeout(function() {
        socket.close()
      }, 0.2 * ONE_MINUTES)
    }, this.heartInterval)
  }
}

export default {
  getWebsocketResult: ({ commit, state, dispatch }, params) => {
    let lockReconnect = false,
      createWS = () => {
        try {
          if (socket && socket.readyState !== 3) {
            socket.close()
          }
          else {
            socket = new WebSocket(wsUrl(params))
            initWS()
          }
        }
        catch (e) {
          console.log(e)
          reconnect()
        }
      },
      initWS = () => {
        socket.onopen = () => {
          heartCheck.reset().start()
        }
        socket.onmessage = response => {
          heartCheck.reset().start()

          if (response.data === 'PONG') {
            return
          }

          let res = JSON.parse(response.data)

          if (res.code === 200 && res.data && res.data.meetings) {
            dispatch('meetingAdjustDealing', res.data.meetings.meetingTime.split(' ')[0])
            Notification({
              title: res.data.meetings.name,
              type: 'success',
              message: `已调整至${ res.data.meetings.meetingTime }，终端号是${ res.data.meetings.terminalNumber }`,
              duration: 8000
            })
          }
          else if (res.code === 200 && res.data && res.data.meetingId) {
            dispatch('meetingApplyDealing', parseInt(res.data.meetingId))
            Notification({
              title: '处理成功',
              type: 'success',
              message: `${ res.data.info }`,
              duration: 8000
            })
          }
          else if (res.code !== 200) {
            if (res.data && res.data.meetings) {
              dispatch('meetingAdjustDealing', res.data.meetings.meetingTime.split(' ')[0])
              Notification({
                title: `${ res.data.meetings.name }会见调整失败`,
                type: 'error',
                message: `会见时间：${ res.data.meetings.meetingTime }，终端号：${ res.data.meetings.terminalNumber }，失败原因：${ res.msg }`,
                duration: 8000
              })
            }
            else if (res.data && res.data.meetingId) {
              dispatch('meetingApplyDealing', parseInt(res.data.meetingId))
              Notification({
                title: `处理失败`,
                type: 'error',
                message: `${ res.data.info }`,
                duration: 8000
              })
            }
          }
        }
        socket.onclose = function(e, r) {
          if (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === '1') reconnect()
        }
        socket.onerror = (event) => {
          console.log('Socket发生了错误', event)
          if (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === '1') reconnect()
        }
      },
      reconnect = throttle(() => {
        if (lockReconnect) return
        lockReconnect = true
        createWS()
        lockReconnect = false
      }, ONE_MINUTES)
    createWS()
  },
  closeWebsocket() {
    if (socket) {
      socket.close()
      heartCheck.reset()
    }
  }
}
