import http from '@/service'

export default {
  getPrisonUsers: ({ commit }, params) => {
    return http.getPrisonUsers(params).then(res => {
      if (!res) return
      res.users.forEach(user => {
        let configList = [], roles = []
        if (user.prisonConfigList) {
          user.prisonConfigList.forEach(c => { configList.push(c.fullname) })
          user.prisonAreas = configList.join('、')
        }
        if (user.userRoles) {
          user.userRoles.forEach(val => roles.push(val.roleName))
          user.roles = roles.join('、')
        }
      })
      commit('getPrisonUsers', res)
      return true
    })
  },
  deletePrisonUser: ({ commit }, params) => {
    return http.deletePrisonUser(params).then(res => res)
  },
  // 新增用户需要判读(租户管理员才有这个权限)
  addPrisonUser: ({ commit }, params) => {
    return http.addPrisonUser(params).then(res => res)
  },
  getPrisonUserDetail: ({ commit }, params) => {
    return http.getPrisonUserDetail(params).then(res => {
      if (!res) return
      // level: 最大层级
      // areaId: 监区id
      // branchId: 分监区id
      // buildingId: 楼栋id
      // layerId: 楼层id
      const multipHierarchicalRelationshipParams = ['areaId', 'branchId', 'buildingId', 'layerId']

      const role = res.userRoles.map(val => val.roleId)

      const prisonConfigIds = res.prisonConfigIds.map(prisonConfig => {
        const { level } = prisonConfig

        const temp = multipHierarchicalRelationshipParams.slice(0, level)

        return temp.map(key => prisonConfig[key])
      })

      res.prisonConfigIds = prisonConfigIds

      res.roleIds = role[0]

      commit('getPrisonUserDetail', res)

      return true
    })
  },
  updatePrisonUser: ({ commit }, params) => {
    return http.updatePrisonUser(params).then(res => res)
  },
  enableOrDisablePrisonUser: ({ commit }, params) => {
    return http.enableOrDisablePrisonUser(params).then(res => res)
  },

  // 监区管理 - 级联层级选择
  getChildPrisonConfigs: async({ commit }, parmas) => {
    try {
      const { prisonConfigs = [] } = await http.getJailPrisonSubs(parmas)

      commit('setMultiPrisonConfigs', prisonConfigs)

      return prisonConfigs
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}
