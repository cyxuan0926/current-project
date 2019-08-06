import { resetRouter } from '@/router/index'
import store from '@/store'
import { Message } from 'element-ui'

const logout = () => {
  localStorage.clear()
  store.dispatch('resetState', 'logout')
  // store.commit('account/setAccountInfo', {})
  // store.commit('account/setRolesList', [])
  // store.commit('account/setAuthorities', [])
  // store.commit('account/setMenus', [])
  // store.commit('account/setPublicUserInfo', {})
  resetRouter()
  Message({
    showClose: true,
    message: '退出登陆成功',
    duration: 3000,
    type: 'success'
  })
}

export default logout
