import store from '@/store'
export default {
  SET_GUIDE_STORAGE(state, params) {
    state.guideStorage = params
  },

  SET_AFFAIRS_STORAGE(state, params) {
    state.affairsStorage = params
  },

  SET_AFFAIRS_MODULE(state, params) {
    state.affairsModule = params
  },

  SET_XML_STORAGE(state, params) {
    state.processBpmnXml = params
  },

  setUser(state, params) {
    state.user = params || {}
  },

  resetState: (_, params) => {
    if (params === 'logout') {
      store.commit('account/setAccountInfo', {})
      store.commit('account/setRolesList', [])
      store.commit('account/setAuthorities', [])
      store.commit('account/setMenus', [])
      store.commit('account/setPublicUserInfo', {})

      Object.keys(store.state).forEach(key => {
        if (store.state[key] && store.state[key].contents && store.state[key].contents.length) {
          store.state[key] = { contents: [], total: 0 }
        }
      })
    } else {
      Object.keys(params).forEach(key => {
        if (store.state[key] && store.state[key].contents && store.state[key].contents.length) {
          store.state[key] = { contents: [], total: 0 }
        } else {
          store.state[key] = params[key]
        }
      })
    }
  },

  setUrlStorage: (state, params) => {
    state.urlStorage = params
  },

  setDynamicRoutes: (state, routes) => {
    state.dynamicRoutes = routes
  },

  setMemoryDynamicRoutes: (state, { routes, memoryId }) => {
    state.memoryDynamicRoutes = { ...state.memoryDynamicRoutes, ...{ [memoryId]: routes } }
  },

  // 获取修改密码的结果
  // modifyPassword: (state, params) => {
  //   state.modifyPasswordResult = params
  // },
  // 上传文件
  uploadFile: (state, uploadResult) => {
    state.uploadResult = uploadResult
  },

  // 登陆状态控制
  // setLoginState: (state, { loading = false, loged = false } = {}) => {
  //   state.loginState = { loading, loged }
  // }
  setComponentsKeepAlive(state, components) {
    state.componentsKeepAlive = components
  },

  // 设置是否刷新消息铃铛
  setIsRefreshMultistageExamineMessageBell(state, isRefreshMultistageExamineMessageBell) {
    state.isRefreshMultistageExamineMessageBell = isRefreshMultistageExamineMessageBell
  },

  setJailsMeetingFloorStatus(state, jailsMeetingFloorStatus) {
    state.jailsMeetingFloorStatus = jailsMeetingFloorStatus
  },

  setLoginHavePrisonerIn(state, loginHavePrisonerIn) {
    state.loginHavePrisonerIn = loginHavePrisonerIn
  },

  setSubtaskPhone: (state, data) => {
    state.processInstanceIdSubtaskOptions = data
  },

  setCurrentProcessTaskInformation: (state, currentProcessTaskInformation) => {
    state.currentProcessTaskInformation = Object.assign({}, currentProcessTaskInformation)
  },

  setCacheImageURLS: (state, cacheImageURLS) => {
    state.cacheImageURLS = cacheImageURLS
  },

  setIsSameProcessDefinition: (state, isSameProcessDefinition) => {
    state.isSameProcessDefinition = isSameProcessDefinition
  }
}
