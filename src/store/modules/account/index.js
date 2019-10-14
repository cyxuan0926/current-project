import { login, getPublicUserInfo, getMenus, modifyMyPassword, getRoles, estimateUsername, getAllTenants, getSecurityQuestions,
  getUserSecurityQuestions, setUserSecurityQuestionAnswers, getUserSecurityQuestionAnswers, verificateSecurityQuestionAnswers,
  modifyMyPasswordByToken } from '@/service-public/api/account'
import { helper } from '@/utils'
import jwtDecode from 'jwt-decode'

const state = {
  accountInfo: (localStorage.getItem('accountInfo') && JSON.parse(localStorage.getItem('accountInfo'))) || {},
  menus: (localStorage.getItem('menus') && JSON.parse(localStorage.getItem('menus'))) || [],
  authorities: (localStorage.getItem('authorities') && JSON.parse(localStorage.getItem('authorities'))) || [],
  publicUserInfo: (localStorage.getItem('publicUserInfo') && JSON.parse(localStorage.getItem('publicUserInfo'))) || {},
  rolesList: [], // 监狱超级管理员的角色列表
  modifyMyPasswordResult: false,
  allTenants: [],
  securityQuestions: [] // 所有的安全问题
}

const mutations = {
  setAccountInfo: (state, accountInfo) => { state.accountInfo = accountInfo },
  setModifyMyPasswordResult: (state, modifyPasswordResult) => { state.modifyMyPasswordResult = modifyPasswordResult },
  setMenus: (state, menus) => { state.menus = menus },
  setPublicUserInfo: (state, publicUserInfo) => { state.publicUserInfo = publicUserInfo },
  setRolesList: (state, rolesList) => { state.rolesList = rolesList },
  setAllTenants: (state, allTenants) => { state.allTenants = allTenants },
  setAuthorities: (state, authorities) => { state.authorities = authorities },
  setSecurityQuestions: (state, securityQuestions) => { state.securityQuestions = securityQuestions }
}

const actions = {
  async login({ commit, dispatch }, { username, password }) {
    try {
      let loginRes = await login({ username, password }), userInfoRes = false, MenusRes = false, baseInfoRes = false
      if (loginRes) {
        commit('setAccountInfo', loginRes)
        commit('setAuthorities', (jwtDecode(loginRes.access_token).authorities || []))
        userInfoRes = await dispatch('getPublicUserInfo')
        MenusRes = await dispatch('getMenus')
        baseInfoRes = await dispatch('getBaseInfo', null, { root: true })
      }
      return loginRes && userInfoRes && MenusRes && baseInfoRes
    }
    catch (err) {
      throw err
    }
  },
  // 获取用户信息
  async getPublicUserInfo({ commit, dispatch }) {
    try {
      const res = await getPublicUserInfo()
      if (res) commit('setPublicUserInfo', res)
      return res
    }
    catch (err) {
      throw err
    }
  },
  // 获取菜单
  async getMenus({ commit, dispatch }) {
    try {
      const res = await getMenus()
      if (res) commit('setMenus', res)
      return res
    }
    catch (err) {
      throw err
    }
  },
  // 修改密码
  async modifyMyPassword({ commit, dispatch }, { oldPassword, newPassword }) {
    try {
      const res = await modifyMyPassword({ oldPassword, newPassword })
      if (res) commit('setModifyMyPasswordResult', res)
      return res
    }
    catch (err) {
      throw err
    }
  },
  // 获取角色列表
  async getRolesList({ commit, dispatch }) {
    try {
      const res = await getRoles()
      if (res && res.content && res.content.length) {
        let result = []
        for (let val of res.content.values()) {
          result.push(helper.transitionRolesList(val))
        }
        commit('setRolesList', result)
      }
      return res
    }
    catch (err) {
      throw err
    }
  },
  // 根据用户判断用户是否已经存在
  async estimateUsername({ commit, dispatch }, { username }) {
    try {
      const res = await estimateUsername({ username })
      return res
    }
    catch (err) {
      throw err
    }
  },
  // 获取所有租户列表(不分页)
  async getAllTenants({ commit }) {
    try {
      const res = await getAllTenants()
      if (res && res.content && res.content.length) commit('setAllTenants', res.content)
      return res && res.content && res.content.length
    }
    catch (err) {
      throw err
    }
  },
  // 获取所有的安全问题
  async getSecurityQuestions({ commit }) {
    try {
      const res = await getSecurityQuestions()
      res.unshift({ name: '请选择', id: '' })
      if (res) commit('setSecurityQuestions', res)
      return res
    }
    catch (err) {
      throw err
    }
  },
  // 获取用户的安全问题
  async getUserSecurityQuestions({ commit }, { username }) {
    try {
      const res = await getUserSecurityQuestions({ username })
      return res
    }
    catch (err) {
      throw err
    }
  },
  // 设置用户的安全问题答案
  async setUserSecurityQuestionAnswers({ commit }, questionAnswers) {
    try {
      const res = await setUserSecurityQuestionAnswers(questionAnswers)
      return res
    }
    catch (err) {
      throw err
    }
  },
  // 获取用户安全问题答案
  async getUserSecurityQuestionAnswers({ commit }) {
    try {
      const res = await getUserSecurityQuestionAnswers()
      return res
    }
    catch (err) {
      throw err
    }
  },
  // 检验用户安全问题答案
  async verificateSecurityQuestionAnswers({ commit }, { username, questionAnswers }) {
    try {
      const res = await verificateSecurityQuestionAnswers({ username, questionAnswers })
      console.log(res)
    }
    catch (err) {
      throw err
    }
  },
  // 根据用户安全问题校验码重置用户密码
  async modifyMyPasswordByToken({ commit }, { token, newPassword }) {
    try {
      const res = await modifyMyPasswordByToken({ token, newPassword })
      console.log(res)
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
