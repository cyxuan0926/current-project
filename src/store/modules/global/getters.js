import roles from '@/common/constants/roles'

export default {
  role(state) {
    const rolesMap = {
      [-1]: roles.TENANT_ADMIN,
      0: roles.SUPER_ADMIN,
      1: roles.AUDITOR,
      3: roles.INFORMATION_ADMIN,
      5: roles.POLICE_LITERATURE_AUDITOR,
      6: roles.FAMILY_LITERATURE_AUDITOR,
      7: roles.ADVANCED_AUDITOR
    }

    return rolesMap[parseInt(state.user.role)]
  },

  chartRole(state) {
    return roles.CHART_ROLES[ state.user.username ]
  },

  hasPrisonArea(state) {
    return state.user.branch_prison === 1
  },

  prisonAreaOptions(state) {
    return {
      options: state.user.prisonConfigList || []
    }
  },

  isInWhitelist(state) {
    return roles.JAIL_WHITELIST.includes(state.user.jailCode)
  },

  isShowPrisonerName(state) {
    return state.user.showPrisonerName === 1
  },

  // 高级审核人员
  isAdvancedAuditor(state, getters) {
    return getters.role === roles.ADVANCED_AUDITOR
  },

  // 狱务通管理员
  isSuperAdmin(state, getters) {
    return getters.role === roles.SUPER_ADMIN
  },

  // 租户管理员
  isTenantAdmin(state, getters) {
    return getters.role === roles.TENANT_ADMIN
  },

  // 初级审核人员
  isAuditor(state, getters) {
    return getters.role === roles.AUDITOR
  },

  // 是否开启多级审批
  haveMultistageExamine(state) {
    return !!state.user.multistageExamine
  },

  // 是否显示家属电话
  isShowPhone(state) {
    return !!state.user.familyPhone
  },

  // 查询监区层级结构的actions 监区-分监区-楼栋-楼层
  // 除了ywt_admin/xx_sadmin其余都是需要权限的
  prisonChildApi(_, getters) {
    return (getters.isSuperAdmin || getters.isTenantAdmin) ? 'getJailPrisonSubs' : 'getJailPrisonSubsAuth'
  },

  isPrisonInternetGetUrlWay(_, getters) {
    return !getters.isSuperAdmin && 'getHyUrl'
  }
}
