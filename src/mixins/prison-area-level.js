import { prisonAreaLevelObject, terminalUsersBasicAuths } from '@/common/constants/const'

import cloneDeep from 'lodash/cloneDeep'

import { Message } from 'element-ui'

import { mapState } from 'vuex'

export default {
  data() {
    return {
      localPrisonAreaLevelObject: cloneDeep(prisonAreaLevelObject),
      prisonConfigIdKey: ''
    }
  },

  computed: {
    ...mapState(['terminalUserListsByPrisonConfigId'])
  },

  methods: {
    clearSubPrisonArea(target, budingObject) {
      let _list = ['prisonArea', 'prisonBranch', 'prisonBuilding', 'prisonLayer']

      _list = _list.slice(_list.findIndex(l => l === target))

      _list.forEach(t => {
        this.$set(this.localPrisonAreaLevelObject[t], 'options', [])
        this.$set(budingObject, this.localPrisonAreaLevelObject[t]['prop'], '')
      })
    },

    async onInitPrisonAreaLevelData({ parentId, childNode }) {
      await this.$store.dispatch('getChildPrisonConfigs', { parentId })

      Message.closeAll()

      this.$set(this.localPrisonAreaLevelObject[childNode], 'options', this.$store.state.multiPrisonConfigs)
    },

    async onPrisonAreaLevelDataChange(params = {}) {
      const { key, parentId = '', budingObject = {} } = params

      this.prisonConfigIdKey = key

      const childNode = this.localPrisonAreaLevelObject[key]['childNode']

      const { level } = this.localPrisonAreaLevelObject[key]

      const isLast = level === Object.keys(this.localPrisonAreaLevelObject).length

      if (childNode) this.clearSubPrisonArea(childNode, budingObject)

      // 监区-用户权限（最底层用户权限）
      // if (['prisonArea'].includes(key)) {
      const {
        jailId,
        areaId,
        layerId,
        buildingId,
        branchId
      } = budingObject

      const prisonConfigId = layerId || buildingId || branchId || areaId || ''

      await this.onGetPrisonAreaUsersData({ jailId, prisonConfigId }, budingObject)
      // }

      if (isLast) return

      if (!(parentId < 0 || !parentId)) await this.onInitPrisonAreaLevelData({ parentId, childNode })
    },

    // 监区-用户数据
    // 分监区-正常监区： 监区权限下的用户
    // 其他监狱层级的用户
    async onGetPrisonAreaUsersData(params = {}, modelValue = this.terminal, inputPermission = []) {
      const permission = ([...inputPermission, ...terminalUsersBasicAuths]).join(',')

      if (!params['prisonConfigId'] || params['prisonConfigId'] < 0) delete params['prisonConfigId']

      if (this.$store.state.terminalUserListsByPrisonConfigId.length) this.$store.commit('setTerminalUsersByPrisonConfigId', [])

      if (modelValue['username']) this.$set(modelValue, 'username', '')

      await this.$store.dispatch('getTerminalUsersByPrisonConfigId', { permission, ...params })
    }
  }
}
