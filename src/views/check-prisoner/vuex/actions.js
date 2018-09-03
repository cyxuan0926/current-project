import http from '@/service'

export default {
  getPrisoners({ commit }, params) {
    http.getPrisoners(params).then(res => res && commit('getPrisoners', res))
  },
  updateAccessTime({ commit }, params) {
    return http.updateAccessTime(params).then(res => res)
  },
  addPrisonerBlacklist({ commit }, params) {
    return http.addPrisonerBlacklist(params).then(res => res)
  }
}
