// import { Notification, Message } from 'element-ui'
import { Notification } from 'element-ui'

const wsUrl = jailId => `ws://120.78.190.101/ws/${ jailId }` // 测试
// const wsUrl = jailId => `ws://123.57.7.159/ws-demo/${ jailId }` // 演示
// const wsUrl = jailId => `wss://www.yuwugongkai.com/ws/${ jailId }`

export default {
  getWebsocketResult: ({ commit, state }, params) => {
    let socket,
      lockReconnect = false,
      heartCheck = {
        timeout: 6000,
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
          socket = new WebSocket(wsUrl(params))
          initWS()
        }
        catch (e) {
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
            Notification({
              title: res.data.meetings.name,
              type: 'success',
              message: `已调整至${ res.data.meetings.meetingTime }，终端号是${ res.data.meetings.terminalNumber }`,
              duration: 8000
            })
          }
          else if (res.code !== 200) {
            Notification({
              title: `${ res.data.meetings.name }会见调整失败`,
              type: 'error',
              message: `会见时间：${ res.data.meetings.meetingTime }，终端号：${ res.data.meetings.terminalNumber }，失败原因：${ res.msg }`,
              duration: 8000
            })
          }
        }
        socket.onclose = function(e, r) {
          if (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === '1') reconnect()
        }
        socket.onerror = (event) => {
          // Message.error('Socket发生了错误')
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
