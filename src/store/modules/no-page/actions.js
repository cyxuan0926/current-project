import http from '@/service'

export default {
  getPrisonAll: ({ commit }, params) => {
    return http.getPrisonAll(params).then(res => {
      if (!res) return
      commit('getPrisonAll', res)
      return true
    })
  },
  getPrisonAllWithBranchPrison: ({ commit }, params) => {
    return http.getPrisonAllWithBranchPrison(params).then(res => res && commit('getPrisonAllWithBranchPrison', res))
  },
  getProvincesAll: ({ commit }) => {
    return http.getProvincesAll().then(res => {
      if (!res) return
      commit('getProvincesAll', res)
      return { options: res.provinces, label: 'name', value: 'id' }
    })
  },
  getCities: ({ commit }, params) => {
    return http.getCities(params).then(res => {
      if (!res) return
      commit('getCities', res)
      return { options: res.citys, label: 'name', value: 'id' }
    })
  },
  getJailPrisonAreas: ({ commit }, params) => {
    return http.getJailPrisonAreas(params).then(res => {
      if (!res) return
      commit('getJailPrisonAreas', res)
      return true
    })
  },

  async getOrgName({ commit }, params) {
    try {
      const { data } = await http.getOrgName(params)

      let organization = []

      if (data && Array.isArray(data)) {
        organization = data.map(orgName => (
          {
            label: orgName,
            value: orgName
          }
        ))
      }

      commit('getOrgName', organization)

      return data
    }
    catch (err) {
      throw err
    }
  }
}
