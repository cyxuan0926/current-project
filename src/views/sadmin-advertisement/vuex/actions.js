import http from '@/service'

export default {
  getAdvertisements: ({ commit }, params) => {
    http.getAdvertisements(params).then(res => res && commit('getAdvertisements', res))
  },
  getAdvertisementTypes: ({ commit }) => {
    return http.getAdvertisementTypes().then(res => res && commit('getAdvertisementTypes', res))
  },
  addAdvertisement: ({ commit, dispatch }, params) => {
    return http.addAdvertisement(params).then(res => {
      dispatch('deleteUrls', { urls: [params.imageUrl] })
      return res
    })
  },
  updateAdvertisementStatus: ({ commit }, params) => {
    return http.updateAdvertisementStatus(params).then(res => res)
  },
  deleteAdvertisement: ({ commit }, params) => {
    return http.deleteAdvertisement(params).then(res => res)
  },
  getAdvertisementDetail: ({ commit }, params) => {
    return http.getAdvertisementDetail(params).then(res => {
      if (!res) return
      commit('getAdvertisementDetail', res)
      return true
    })
  },
  updateAdvertisement: ({ commit, dispatch }, params) => {
    return http.updateAdvertisement(params).then(res => {
      dispatch('deleteUrls', { urls: [params.imageUrl] })
      return res
    })
  }
}
