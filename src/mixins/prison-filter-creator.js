import { Message } from 'element-ui'
import http from '@/service'

const baseItem = {
  type: 'select',
  options: [],
  belong: { value: 'id', label: 'name' },
  value: ''
}

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
      await this.$store.dispatch('getPrisonAll', this.provincesId ? { provincesId: this.provincesId } : {})
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
      let { prisonArea, ...ret } = this.searchItems
      this.searchItems = Object.assign({}, ret, {
        prisonArea,
        prisonSubArea: prisonSubAreaItem
      })
    },

    createPrisonHouseItem() {
      const prisonHouseItem = Object.assign({}, baseItem, {
        selectKey: 'prisonHouseId',
        label: '楼栋'
      })
      let { prisonArea, prisonSubArea, ...ret } = this.searchItems
      this.searchItems = Object.assign({}, ret, {
        prisonArea,
        prisonSubArea,
        prisonHouse: prisonHouseItem
      })
    },

    createPrisonFloorItem() {
      const prisonFloorItem = Object.assign({}, baseItem, {
        selectKey: 'prisonFloorId',
        label: '楼层'
      })
      let { prisonArea, prisonSubArea, prisonHouse, ...ret } = this.searchItems
      this.searchItems = Object.assign({}, ret, {
        prisonArea,
        prisonSubArea,
        prisonHouse,
        prisonFloor: prisonFloorItem
      })
    },

    createPrisonAreaFilter() {
      const prisonAreaItem = Object.assign({}, baseItem, {
        selectKey: 'prisonAreaId',
        label: '监区'
      })

      this.searchItems = Object.assign({}, this.searchItems, {
        prisonArea: prisonAreaItem
      })

      const _jailId = this.$store.state.global.user.jailId
      if (_jailId && _jailId !== -1) {
        this.searchSelectChange('jailId', _jailId)
      }
    },

    clearSubPrisonArea(target) {
      let _list = ['prisonArea', 'prisonSubArea', 'prisonHouse', 'prisonFloor']
      _list = _list.slice(_list.findIndex(l => l === target))
      _list.forEach(t => {
        this.$delete(this.searchItems, t)
      })
    },

    async searchSelectChange(selectKey, value) {
      if (selectKey === 'prisonAreaId') {
        this.clearSubPrisonArea('prisonSubArea')
        if (value) {
          let { prisonConfigs } = await http.getJailPrisonSubsAuth({ parentId: value })
          Message.closeAll()
          if (prisonConfigs && prisonConfigs.length) {
            this.createPrisonSubArea()
            this.$set(this.searchItems['prisonSubArea'], 'options', prisonConfigs)
          }
        }
      }

      if (selectKey === 'prisonSubAreaId') {
        this.clearSubPrisonArea('prisonHouse')
        if (value) {
          let { prisonConfigs } = await http.getJailPrisonSubsAuth({ parentId: value })
          Message.closeAll()
          if (prisonConfigs && prisonConfigs.length) {
            this.createPrisonHouseItem()
            this.$set(this.searchItems['prisonHouse'], 'options', prisonConfigs)
          }
        }
      }

      if (selectKey === 'prisonHouseId') {
        this.clearSubPrisonArea('prisonFloor')
        if (value) {
          let { prisonConfigs } = await http.getJailPrisonSubsAuth({ parentId: value })
          Message.closeAll()
          if (prisonConfigs && prisonConfigs.length) {
            this.createPrisonFloorItem()
            this.$set(this.searchItems['prisonFloor'], 'options', prisonConfigs)
          }
        }
      }

      if (selectKey === 'jailId') {
        if (value) {
          this.clearSubPrisonArea('prisonSubArea')
          await this.$store.dispatch('getJailPrisonAreas', { jailId: value })
          Message.closeAll()
          this.$set(this.searchItems['prisonArea'], 'options', this.$store.state.jailPrisonAreas)
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
        if (value === 'CANCELED') {
          if (this.toShow.changerType === true) {
            this.searchItems.changerType.miss = true
          }
          else {
            this.searchItems.changerType.miss = false
            delete this.filter.changerType
            this.searchItems.changerType.value = ''
          }
        }
        else {
          this.searchItems.changerType.miss = true
        }
        }
    }
  }
}
