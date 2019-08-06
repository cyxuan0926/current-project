import http from '@/service'

export default {
  getPrisonUsers: ({ commit }, params) => {
    return http.getPrisonUsers(params).then(res => {
      if (!res) return
      res.users.forEach(user => {
        let configList = [], roles = []
        if (user.prisonConfigList) {
          user.prisonConfigList.forEach(c => { configList.push(c.prisonConfigName) })
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
      const role = res.userRoles.map(val => val.roleId)
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
  }
}
