import http from '@/service'

export default {
  login: ({ commit, dispatch }, params) => {
    return http.login(params).then(res => {
      if (!res) return
      if (res.users.role === '1') dispatch('getWebsocketResult', res.users.jailId)
      commit('login', res)
      return true
    })
  },
  setCookie: ({ commit }, params) => {
    Object.keys(params).forEach(key => {
      document.cookie = `${ key }=${ params[key] };`
    })
  },
  getCookie: ({ commit }, params) => {
    let cookie = {}
    if (document.cookie) {
      document.cookie.replace(/\s/g, '').split(';').forEach(cook => {
        cookie[cook.split('=')[0]] = cook.split('=')[1]
      })
    }
    return cookie
  },
  removeCookie: ({ commit }, params) => {
    let time = new Date()
    time.setTime(time.getTime() - 1000)
    Object.keys(params).forEach(key => {
      document.cookie = `${ key }=; expires=${ time.toGMTString() }`
    })
  }
}
