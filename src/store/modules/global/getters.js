import roles from '@/common/constants/roles'

export default {
  role(state) {
    const rolesMap = {
      [-1]: roles.TENANT_ADMIN,
      0: roles.SUPER_ADMIN,
      1: roles.AUDITOR,
      3: roles.INFORMATION_ADMIN,
      5: roles.POLICE_LITERATURE_AUDITOR,
      6: roles.FAMILY_LITERATURE_AUDITOR
    }

    return rolesMap[parseInt(state.user.role)]
  },

  hasPrisonArea(state) {
    return state.user.branch_prison === 1
  }
}
