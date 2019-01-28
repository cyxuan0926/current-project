// import { Notification, Message } from 'element-ui'
import { Notification } from 'element-ui'
import urls from '@/service/urls'

const wsUrl = jailId => `${ urls.socketUrl }/${ jailId }`
let socket

export default {
  getWebsocketResult: ({ commit, state, dispatch }, params) => {
    let lockReconnect = false,
      heartCheck = {
        timeout: 10000,
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
            socket.send('test')
            self.serverTimeout = setTimeout(function() {
              socket.close()
            }, self.timeout)
          }, this.timeout)
        }
      },
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
          console.log(999, e)
          reconnect()
        }
      },
      initWS = () => {
        socket.onopen = () => {
          heartCheck.reset().start()
        }
        socket.onmessage = response => {
          heartCheck.reset().start()
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
      reconnect = () => {
        if (lockReconnect) return
        lockReconnect = true
        setTimeout(function() {
          createWS()
          lockReconnect = false
        }, 2000)
      }
    createWS()
  }
}
