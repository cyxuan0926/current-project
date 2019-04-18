import api from './service'

export default {
  // 获取监狱基本信息
  getJailInformation: ({ commit }) => {
    return api.getJailInformation().then(res => res && commit('getJailInformation', res))
  }
}
