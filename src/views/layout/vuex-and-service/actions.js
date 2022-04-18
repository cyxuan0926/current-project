import api from './service'

export default {
  handleCollapse({ commit }, params) {
    commit('handleCollapse', params)
  },

  logout: () => api.logout().then(res => res),

  // 获取多级审批数目配置
  getMultistageExamineCountConfigs: async({ rootState, state, commit }) => {
    try {
      const { data } = await api.getMultistageExamineCountConfigs()

      commit('setMultistageExamineCountConfigs', data)

      if (rootState.global.isRefreshMultistageExamineMessageBell) commit('setIsRefreshMultistageExamineMessageBell', false)

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}
