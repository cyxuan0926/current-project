import http from './service'

export default {
  getOperations({ commit }, params) {
    http.getPagedOperation(params).then(res => res && commit('getOperations', res))
  }
}
