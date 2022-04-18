import api from './service'

export default {
  login: ({ commit, dispatch }, params) => {
    return api.login(params).then(res => {
      if (!res) return
      if (res.users.role === '1') dispatch('getWebsocketResult', res.users.jailId)
      dispatch('setUser', res.users)
      commit('login', res)
      return true
    })
  },

  setCookie: (_, params) => {
    let expires = new Date()
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000)
    Object.keys(params).forEach(key => {
      document.cookie = `${ key }=${ params[key] };expires=${ expires.toUTCString() };path=/`
    })
  },

  getCookie: () => {
    let cookie = {}
    if (document.cookie) {
      document.cookie.replace(/\s/g, '').split(';').forEach(cook => {
        cookie[cook.split('=')[0]] = cook.split('=')[1]
      })
    }

    return cookie
  },

  removeCookie: (_, params) => {
    let time = new Date()
    time.setTime(time.getTime() - 1000)
    Object.keys(params).forEach(key => {
      document.cookie = `${ key }=; expires=${ time.toGMTString() }`
    })
  },

  getBaseInfo: ({ dispatch }) => {
    return api.getBaseInfo().then(res => {
      if (!res) return false
      dispatch('setUser', res.user)
      return true
    })
  }
}
