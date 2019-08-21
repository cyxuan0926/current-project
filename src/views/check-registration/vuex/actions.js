import http from '@/service'

export default {
  getRegistrations: ({ commit }, params) => {
    http.getRegistrations(params).then(res => res && commit('getRegistrations', res))
  },
  getRegistrationsAll: ({ commit }, params) => {
    http.getRegistrationsAll(params).then(res => res && commit('getRegistrations', res))
  },
  authorizeRegistrations: ({ commit }, params) => {
    return http.authorizeRegistrations(params).then(res => res)
  }
}
