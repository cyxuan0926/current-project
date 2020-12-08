import { login, getPublicUserInfo, getMenus, modifyMyPassword, getRoles, estimateUsername, getAllTenants, getSecurityQuestions,
  getUserSecurityQuestions, setUserSecurityQuestionAnswers, getUserSecurityQuestionAnswers, verificateSecurityQuestionAnswers,
  modifyMyPasswordByToken, getPublicUsers, getCaptcha } from '@/service-public/api/account'

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
  securityQuestions: [], // 所有的安全问题,
  passwordToken: (localStorage.getItem('passwordToken') && JSON.parse(localStorage.getItem('passwordToken'))) || '', // 安全问题密码重置的token
  findPasswordUsername: (localStorage.getItem('findPasswordUsername') && JSON.parse(localStorage.getItem('findPasswordUsername'))) || '', // 找回密码的用户名
  isStep: (localStorage.getItem('isStep') && JSON.parse(localStorage.getItem('isStep'))) || 0, // 找回密码当前的步数 0表示别的页面 1 第一页 2 第二页 3 第三页

  // 某个监狱是否配置了高级审核人员
  isHaveAdvancedAuditor: false,

  // 验证码
  captchaConfigs: {}
}

const mutations = {
  setAccountInfo: (state, accountInfo) => { state.accountInfo = accountInfo },
  setModifyMyPasswordResult: (state, modifyPasswordResult) => { state.modifyMyPasswordResult = modifyPasswordResult },
  setMenus: (state, menus) => { state.menus = menus },
  setPublicUserInfo: (state, publicUserInfo) => { state.publicUserInfo = publicUserInfo },
  setRolesList: (state, rolesList) => { state.rolesList = rolesList },
  setAllTenants: (state, allTenants) => { state.allTenants = allTenants },
  setAuthorities: (state, authorities) => { state.authorities = authorities },
  setSecurityQuestions: (state, securityQuestions) => { state.securityQuestions = securityQuestions },
  setPasswordToken: (state, passwordToken) => { state.passwordToken = passwordToken },
  setFindPasswordUsername: (state, findPasswordUsername) => { state.findPasswordUsername = findPasswordUsername },
  setIsStep: (state, isStep) => { state.isStep = isStep },

  // 设置是否配置了高级审批人员
  setIsHaveAdvancedAuditor: (state, isHaveAdvancedAuditor) => {
    state.isHaveAdvancedAuditor = isHaveAdvancedAuditor
  },

  setCaptchaConfigs: (state, captchaConfigs) => {
    state.captchaConfigs = Object.assign({}, captchaConfigs)
  }
}

const actions = {
  async slientLogin({ commit, dispatch }, accountInfo) {
    try {
      let userInfoRes = false, MenusRes = false, baseInfoRes = false
      if (accountInfo) {
        commit('setAccountInfo', accountInfo)
        commit('setAuthorities', (jwtDecode(accountInfo.access_token).authorities || []))
        userInfoRes = await dispatch('getPublicUserInfo')
        MenusRes = await dispatch('getMenus')
        baseInfoRes = await dispatch('getBaseInfo', null, { root: true })
      }
      return accountInfo && userInfoRes && MenusRes && baseInfoRes
    }
    catch (err) {
      throw err
    }
  },
  async login({ commit, dispatch }, {
    username,
    password,
    code,
    codeKey
  }) {
    try {
      let loginRes = await login({
        username,
        password,
        code,
        codeKey
      }),

      userInfoRes = false,

      MenusRes = false,

      baseInfoRes = false

      if (loginRes.code === 'user.PasswordNotMatched') {
        return loginRes
      }
      else {
        commit('setAccountInfo', loginRes)
        commit('setAuthorities', (jwtDecode(loginRes.access_token).authorities || []))
        userInfoRes = await dispatch('getPublicUserInfo')
        MenusRes = await dispatch('getMenus')
        baseInfoRes = await dispatch('getBaseInfo', null, { root: true })
        return loginRes && userInfoRes && MenusRes && baseInfoRes
      }
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
      let result = []
      const res = await getRoles()
      if (res && res.content && res.content.length) {
        for (let val of res.content.values()) {
          result.push(helper.transitionRolesList(val))
        }
      }
      commit('setRolesList', result)
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
      if (res && res.content) commit('setAllTenants', res.content)
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
      if (res && res.token) {
        commit('setPasswordToken', res.token)
        localStorage.setItem('passwordToken', JSON.stringify(res.token))
      }
      return res
    }
    catch (err) {
      throw err
    }
  },
  // 根据用户安全问题校验码重置用户密码
  async modifyMyPasswordByToken({ commit }, { token, newPassword }) {
    try {
      const res = await modifyMyPasswordByToken({ token, newPassword })
      return res
    }
    catch (err) {
      throw err
    }
  },

  // 查询某个监狱下面的是否含有特定角色用户并且用户是可用的
  async judgeAssignUsers({ commit }, arg) {
    try {
      const { params, configs } = arg

      const { userRoles, mutationName } = configs

      const { content } = await getPublicUsers(params)

      const isHaveAssignUsers = content.some(item => {
        return item.status === 'ENABLED' && item.userRoles.some(user => {
          return userRoles.includes(user.roleName)
        })
      })

      commit(mutationName, isHaveAssignUsers)

      return isHaveAssignUsers
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async getCaptcha({ commit }) {
    try {
      let res = await getCaptcha()

      res.imageCode = `data:image/jpeg;base64,${ res.imageCode }`

      commit('setCaptchaConfigs', res)

      return res
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
