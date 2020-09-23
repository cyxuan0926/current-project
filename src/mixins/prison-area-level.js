import { prisonAreaLevelObject } from '@/common/constants/const'

import cloneDeep from 'lodash/cloneDeep'

export default {
  data() {
    return {
      localPrisonAreaLevelObject: cloneDeep(prisonAreaLevelObject),
      prisonConfigIdKey: ''
    }
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

      this.$set(this.localPrisonAreaLevelObject[childNode], 'options', this.$store.state.multiPrisonConfigs)
    },

    async onPrisonAreaLevelDataChange(params = {}) {
      const { key, parentId = '', budingObject = {} } = params

      this.prisonConfigIdKey = key

      const childNode = this.localPrisonAreaLevelObject[key]['childNode']

      const { level } = this.localPrisonAreaLevelObject[key]

      const isLast = level === Object.keys(this.localPrisonAreaLevelObject).length

      if (childNode) this.clearSubPrisonArea(childNode, budingObject)

      if (isLast) return

      await this.onInitPrisonAreaLevelData({ parentId, childNode })
    }
  }
}
