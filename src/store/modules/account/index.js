import { login, getUserInfo, getMenus } from '@/service-public/api/account'
import jwtDecode from 'jwt-decode'

const state = {
  accountInfo: {}
}

const mutations = {
  setAccountInfo: (state, accountInfo) => { state.accountInfo = accountInfo }
}

const actions = {
  async login({ commit, dispatch }, { username, password }) {
    try {
      const res = await login({ username, password })
      commit('setAccountInfo', res.data)
      console.log('login', jwtDecode(res.data.access_token))
      dispatch('getUserInfo')
      dispatch('getMenus')
      return res
    }
    catch (err) {
      throw err
    }
  },
  async getUserInfo({ commit, dispatch }) {
    try {
      const res = await getUserInfo()
      console.log('getUserInfo', res)
      return res
    }
    catch (err) {
      throw err
    }
  },
  async getMenus({ commit, dispatch }) {
    try {
      const res = await getMenus()
      console.log('getMenus', res)
      return res
    }
    catch (err) {
      throw err
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
