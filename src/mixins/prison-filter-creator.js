// 监狱是最基本的机构
import { Message } from 'element-ui'

import http from '@/service'

const baseItem = {
  type: 'select',
  options: [],
  filterable: true,
  belong: { value: 'id', label: 'name' },
  value: ''
}

const _filterLists = [
  'prisonArea',
  'prisonSubArea',
  'prisonHouse',
  'prisonFloor'
]

export default {
  props: {
    // 是否有权限查看所有监狱的数据（在路由的 props 中定义）
    hasAllPrisonQueryAuth: Boolean,
    hasOnlyAllPrisonQueryAuth: Boolean,
    hasProvinceQueryAuth: Boolean,
    provincesId: String,
    hasDiplomatQueryAuth: Boolean,
    hasPrisonAreaAuth: Boolean
  },

  data() {
    return {
      filter: {}
    }
  },

  created() {
    if (this.hasDiplomatQueryAuth) {
      this.createDiplomatFilter()
    }

    if (this.hasOnlyAllPrisonQueryAuth) {
        this.createPrisonFilter()
    }

    if (this.hasAllPrisonQueryAuth) {
      this.createPrisonAreaFilter()
      this.createPrisonFilter()
    }
    if (this.hasPrisonAreaAuth) {
      this.createPrisonAreaFilter()
    }

    if (this.hasProvinceQueryAuth) this.createProvinceFilter()
  },

  methods: {

    async createDiplomatFilter() {
      const orgSearchItem = {
        type: 'select',
        selectKey: 'orgName',
        label: '所在机构/馆名',
        getting: true,
        filterable: true,
        value: null,
        options: []
      }

      this.searchItems = Object.assign({}, { orgName: orgSearchItem }, this.searchItems)

      let { data } = await http.getDiplomatist()

      data = data.map(d => ({
        label: d,
        value: d
      }))

      this.searchItems.orgName.options = data

      this.searchItems.orgName.getting = false

      Message.closeAll()
    },

    async createPrisonFilter() {
      const prisonSearchItem = {
        type: 'select',
        selectKey: 'jailId',
        label: '监狱',
        getting: true,
        belong: { value: 'id', label: 'title' },
        filterable: true,
        value: null,
        options: []
      }

      this.searchItems = Object.assign({}, { jailId: prisonSearchItem }, this.searchItems)

      const provincesId = this.provincesId

      await this.$store.dispatch('getPrisonAll', provincesId ? { provincesId } : {})

      Message.closeAll()

      this.searchItems.jailId.options = this.$store.state.prisonAll

      this.searchItems.jailId.getting = false
    },

    async createProvinceFilter() {
      const provinceItem = {
        type: 'select',
        label: '省份',
        selectKey: 'provincesId',
        options: [],
        belong: { label: 'name', value: 'id' },
        filterable: true,
        value: null,
        getting: true
      }

      this.searchItems = Object.assign({}, { provincesId: provinceItem }, this.searchItems)

      await this.$store.dispatch('getProvincesAll')

      Message.closeAll()

      this.$set(this.searchItems['provincesId'], 'options', this.$store.state.provincesAll)

      this.$set(this.searchItems['provincesId'], 'getting', false)
    },

    createPrisonSubArea() {
      const prisonSubAreaItem = Object.assign({}, baseItem, {
        selectKey: 'prisonSubAreaId',
        label: '分监区'
      })

      const { provincesId = {}, jailId = {}, prisonArea, ...ret } = this.searchItems

      this.searchItems = Object.assign({}, {
        provincesId,
        jailId,
        prisonArea,
        prisonSubArea: prisonSubAreaItem
      }, ret)
    },

    createPrisonHouseItem() {
      const prisonHouseItem = Object.assign({}, baseItem, {
        selectKey: 'prisonHouseId',
        label: '楼栋'
      })

      const { provincesId = {}, jailId = {}, prisonArea, prisonSubArea, ...ret } = this.searchItems

      this.searchItems = Object.assign({}, {
        provincesId,
        jailId,
        prisonArea,
        prisonSubArea,
        prisonHouse: prisonHouseItem
      }, ret)
    },

    createPrisonFloorItem() {
      const prisonFloorItem = Object.assign({}, baseItem, {
        selectKey: 'prisonFloorId',
        label: '楼层'
      })

      const { provincesId = {}, jailId = {}, prisonArea, prisonSubArea, prisonHouse, ...ret } = this.searchItems

      this.searchItems = Object.assign({}, {
        provincesId,
        jailId,
        prisonArea,
        prisonSubArea,
        prisonHouse,
        prisonFloor: prisonFloorItem
      }, ret)
    },

    createPrisonAreaFilter() {
      const prisonAreaItem = Object.assign({}, baseItem, {
        selectKey: 'prisonAreaId',
        label: '监区'
      })

      this.searchItems = Object.assign({}, {
        prisonArea: prisonAreaItem
      }, this.searchItems)

      const _jailId = this.$store.state.global.user.jailId

      if (_jailId && _jailId !== -1) {
        this.searchSelectChange('jailId', _jailId)
      }
    },

    findFilterLists(_list = _filterLists.slice(0), target, start = _list.findIndex(l => l === target), end = _list.findIndex(l => l === target)) {
      return _list.slice(start, end)
    },

    clearSubPrisonArea(target) {
      const max = _filterLists.length

      let _list = this.findFilterLists(undefined, target, undefined, max)

      _list.forEach(t => {
        this.$delete(this.searchItems, t)
      })
    },

    async searchSelectChange(selectKey, value) {
      if (selectKey === 'prisonAreaId') {
        this.clearSubPrisonArea('prisonSubArea')
        if (value) {
          let { prisonConfigs } = await http[this.$store.getters.prisonChildApi]({ parentId: value })
          Message.closeAll()
          if (prisonConfigs && prisonConfigs.length) {
            this.createPrisonSubArea()
            this.$set(this.searchItems['prisonSubArea'], 'value', '')
            this.$set(this.searchItems['prisonSubArea'], 'options', prisonConfigs)
          }
        }
      }

      if (selectKey === 'prisonSubAreaId') {
        this.clearSubPrisonArea('prisonHouse')
        if (value) {
          let { prisonConfigs } = await http[this.$store.getters.prisonChildApi]({ parentId: value })
          Message.closeAll()
          if (prisonConfigs && prisonConfigs.length) {
            this.createPrisonHouseItem()
            this.$set(this.searchItems['prisonHouse'], 'value', '')
            this.$set(this.searchItems['prisonHouse'], 'options', prisonConfigs)
          }
        }
      }

      if (selectKey === 'prisonHouseId') {
        this.clearSubPrisonArea('prisonFloor')
        if (value) {
          let { prisonConfigs } = await http[this.$store.getters.prisonChildApi]({ parentId: value }) || {}
          Message.closeAll()
          if (prisonConfigs && prisonConfigs.length) {
            this.createPrisonFloorItem()
            this.$set(this.searchItems['prisonFloor'], 'value', '')
            this.$set(this.searchItems['prisonFloor'], 'options', prisonConfigs)
          }
        }
      }

      if (selectKey === 'jailId') {
        if (value) {
          this.clearSubPrisonArea('prisonSubArea')

          if (this.searchItems['prisonArea']) {
            await this.$store.dispatch('getJailPrisonAreas', { url: '/prison_config/getPrisonConfigs', params: { jailId: value } })
            Message.closeAll()
            this.$set(this.searchItems['prisonArea'], 'value', '')
            this.$set(this.searchItems['prisonArea'], 'options', this.$store.state.jailPrisonAreas)
          }
        }
      }

      if (selectKey === 'provincesId') {
        if (value) {
          this.clearSubPrisonArea('prisonSubArea')
          this.$set(this.searchItems['jailId'], 'value', '')
          if (this.searchItems['prisonArea']) {
            this.$set(this.searchItems['prisonArea'], 'value', '')
            this.$set(this.searchItems['prisonArea'], 'options', [])
          }
        }

        this.$set(this.searchItems['jailId'], 'getting', true)

        await this.$store.dispatch('getPrisonAll', { provincesId: value })

        Message.closeAll()

        this.$set(this.searchItems['jailId'], 'options', this.$store.state.prisonAll || [])

        this.$set(this.searchItems['jailId'], 'getting', false)
      }

      if (selectKey === 'status') {
        if (this.searchItems.changerType) {
          if (value === 'CANCELED') {
            if (this.toShow && this.toShow.changerType === true) {
              this.searchItems.changerType.miss = true
            }
            else {
              this.searchItems.changerType.miss = false
              delete this.filter.changerType
              this.searchItems.changerType.value = ''
            }
          }
          else this.searchItems.changerType.miss = true
        }
      }

      this.prisonFilterCreatorSelfSearchSelectChange(selectKey, value)
    },

    // mixins search组件本地 其他 select 的change事件的方法
    prisonFilterCreatorSelfSearchSelectChange(selectKey, value) {}
  }
}
