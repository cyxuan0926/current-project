import api from './service'

export default {
  handleCollapse({ commit }, params) {
    commit('handleCollapse', params)
  },
  logout: ({ commit }) => {
    return api.logout().then(res => {
      return res
    })
  },

  // 获取多级审批数目配置
  getMultistageExamineCountConfigs: async({ commit }) => {
    try {
      const { data } = await api.getMultistageExamineCountConfigs()

      commit('setMultistageExamineCountConfigs', data)

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}
