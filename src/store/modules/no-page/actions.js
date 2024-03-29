import http from '@/service'

export default {
  getPrisonAll: ({ commit }, params) => {
    return http.getPrisonAll(params).then(res => {
      if (!res) {
        return
      }

      commit('getPrisonAll', res)
      return true
    })
  },

  getPrisonAllWithBranchPrison: ({ commit }, params) => {
    return http.getPrisonAllWithBranchPrison(params).then(res => res && commit('getPrisonAllWithBranchPrison', res))
  },

  getProvincesAll: ({ commit }) => {
    return http.getProvincesAll().then(res => {
      if (!res) {
        return
      }

      commit('getProvincesAll', res)
      return {
        options: res.provinces,
        label: 'name',
        value: 'id'
      }
    })
  },

  getCities: ({ commit }, params) => {
    return http.getCities(params).then(res => {
      if (!res) {
        return
      }

      commit('getCities', res)
      return {
        options: res.citys,
        label: 'name',
        value: 'id'
      }
    })
  },

  getJailPrisonAreas: ({ commit }, args) => {
    return http.getJailPrisonAreas(args).then(res => {
      if (!res) {
        return
      }

      commit('getJailPrisonAreas', res)
      return true
    })
  },

  async getOrgName({ commit }, params) {
    try {
      let organization = []
      const { data } = await http.getOrgName(params)

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
    } catch (err) {
      Promise.reject(err)
    }
  },

  async exportMeetingStatistics({ commit }, params) {
    try {
      const data = await http.exportMeetingStatistics(params)

      return data
    } catch (err) {
      Promise.reject(err)
    }
  },

  async getPrisonAreaMaxLevel({ commit }) {
    try {
      const { data } = await http.getPrisonAreaMaxLevel()
      const { maxLevel } = data
      commit('setPrisonConfigsMaxLevel', maxLevel)

      return true
    } catch (err) {
      Promise.reject(err)
    }
  },

  async getAllChildPrisonConfigs({ commit }) {
    try {
      const { data } = await http.getAllChildPrisonConfigs()
      const filterData = inputs => {
        return inputs.map(item => {
          if (item.children && item.children.length) {
            filterData(item.children)
          } else {
            delete item.children
          }

          return item
        })
      }

      const { prisonConfigs } = data
      const temp = filterData(prisonConfigs)
      commit('setAllChildPrisonConfigs', temp)

      return temp
    } catch (err) {
      Promise.reject(err)
    }
  },

  async getDetailMany({ commit }, params) {
    try {
      const { data } = await http.getDetailMany(params)
      const { prisonConfigs = {} } = data
      commit('setDetailManyConfigs', prisonConfigs)

      return true
    } catch (err) {
      Promise.reject(err)
    }
  },

  async changePrisonJailOrBatch(_, params) {
    try {
      const response = await http.changePrisonJailOrBatch(params)
      const isSucess = response ? response['code'] === 200 : response

      return isSucess
    } catch (err) {
      Promise.reject(err)
    }
  },

  async getMeetingFloorTerminals({ commit }, jailId) {
    try {
      const { data } = await http.getMeetingFloorTerminals(jailId)
      const haveMeetingFloorTerminals = data && Array.isArray(data) && data.length
      commit('setIsHaveMeetingFloorTerminals', haveMeetingFloorTerminals)

      return haveMeetingFloorTerminals
    } catch (err) {
      Promise.reject(err)
    }
  },

  async getJailByProvincesNoAuth({ commit }, params) {
    try {
      const { data } = await http.getJailByProvincesNoAuth(params)
      commit('getPrisonAll', data)

      return true
    } catch (err) {
      Promise.reject(err)
    }
  },

  async exportVisitExcel(_, inputs) {
    try {
      const response = await http.exportVisitExcel(inputs)

      if (!response) {
        return
      }

      return response
    } catch (err) {
      Promise.reject(err)
    }
  }
}
