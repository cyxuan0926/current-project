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
      dispatch('handleDeleteImage', [params.imageUrl])
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
      if (res.imageUrl) {
        let images = localStorage.getItem('images') ? JSON.parse(localStorage.getItem('images')) : []
        if (images.indexOf(res.imageUrl) < 0) images.push(res.imageUrl)
        localStorage.setItem('images', JSON.stringify(images))
      }
    })
  },
  updateAdvertisement: ({ commit, dispatch }, params) => {
    return http.updateAdvertisement(params).then(res => {
      return res
    })
  }
}
