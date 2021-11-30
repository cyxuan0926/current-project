// 监狱是最基本的机构
import { Message } from 'element-ui'

import http from '@/service'

const baseItem = {
  type: 'select',
  options: [],
  filterable: true,
  belong: { value: 'id', label: 'name' },
  value: '',
  miss: false
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
    isChartQuery: Boolean,
    provincesId: String,
    jailId: Number,
    hasDiplomatQueryAuth: Boolean,
    hasPrisonAreaAuth: Boolean
  },

  data() {
    // this.filter 有值 说明是vue3的写法 在setup中返回了 在生命周期initData()之前
    return this.filter || {
      filter: {},
      $_prisonFilterCreatorMounting: false
    }
  },

  computed: {
    $_provincesId() {
      return this.provincesId || (this.$store.state.provincesAll && this.$store.state.provincesAll.length && this.$store.state.provincesAll[0]['id'])
    }
  },

  async mounted() {
    this.$_prisonFilterCreatorMounting = true

    let _promise = []

    if (this.hasDiplomatQueryAuth) {
      _promise = [
        ..._promise,
        this.createDiplomatFilter()
      ]
    }

    if (this.hasOnlyAllPrisonQueryAuth) {
      _promise = [
        ..._promise,
        this.createPrisonFilter()
      ]
    }

    if (this.hasAllPrisonQueryAuth) {
      _promise = [
        ..._promise,
        this.createPrisonAreaFilter(),
        this.createPrisonFilter()
      ]
    }

    if (this.hasPrisonAreaAuth) {
      _promise = [
        ..._promise,
        this.createPrisonAreaFilter()
      ]
    }

    if (this.hasProvinceQueryAuth) {
      _promise = [
        ..._promise,
        this.createProvinceFilter()
      ]
    }

    await Promise.all(_promise)

    const $search = this.$refs.search || this.$refs.$search || this.$refs.$ygSearch

    $search && $search.onGetFilter()

    await this._initData()

    this.$_prisonFilterCreatorMounting = false
  },

  async activated() {
    if (this.$_prisonFilterCreatorMounting) return

    await this._activedMethods()
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
        value: this.jailId,
        options: []
      }

      this.searchItems = Object.assign({}, { jailId: prisonSearchItem }, this.searchItems)

      if (!this.hasProvinceQueryAuth) {
        const provincesId = this.isChartQuery ? this.chartRole.provincesId : this.$_provincesId

        await this.$store.dispatch('getPrisonAll', provincesId ? { provincesId } : {})

        Message.closeAll()

        this.$set(this.searchItems['jailId'], 'options', this.$store.state.prisonAll)

        if (this.jailId) {
          const _jailId = this.jailId || (this.this.$store.state.prisonAll && this.$store.state.prisonAll.length && this.$store.state.prisonAll[0]['id'])
          this.$set(this.searchItems['jailId'], 'value', this.jailId)
        }

        this.searchItems.jailId.getting = false
      }
    },

    async createProvinceFilter() {
      const provinceItem = {
        type: 'select',
        label: '省份',
        selectKey: 'provincesId',
        options: [],
        belong: { label: 'name', value: 'id' },
        filterable: true,
        value: '',
        getting: true
      }

      this.searchItems = Object.assign({}, { provincesId: provinceItem }, this.searchItems)

      await this.$store.dispatch('getProvincesAll')

      Message.closeAll()

      this.$set(this.searchItems['provincesId'], 'options', this.$store.state.provincesAll)

      this.$set(this.searchItems['provincesId'], 'value', this.$_provincesId)

      this.$set(this.searchItems['provincesId'], 'getting', false)

      if (this.hasAllPrisonQueryAuth || this.hasOnlyAllPrisonQueryAuth) await this.searchSelectChange('provincesId', this.$_provincesId)
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

    async createPrisonAreaFilter() {
      const prisonAreaItem = Object.assign({}, baseItem, {
        selectKey: 'prisonAreaId',
        label: '监区'
      })

      this.searchItems = Object.assign({}, {
        prisonArea: prisonAreaItem
      }, this.searchItems)

      const _jailId = this.jailId || this.$store.state.global.user.jailId

      if (_jailId && _jailId !== -1) {
        await this.searchSelectChange('jailId', _jailId)

        // if (!this.$store.getters.isSuperAdmin && this.hasPrisonAreaAuth && this.$store.state.jailPrisonAreas && this.$store.state.jailPrisonAreas.length) {
        //   const _prisonArea = this.$store.state.jailPrisonAreas[0]['id']

        //   this.$set(this.searchItems['prisonArea'], 'value', _prisonArea)

        //   const { selectKey } = this.searchItems['prisonArea']

        //   if (selectKey === 'prisonAreaId') await this.searchSelectChange('prisonAreaId', _prisonArea)
        // }
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

          if (this.searchItems['prisonArea'] && !this.searchItems['prisonArea'].miss) {
            // 柏鑫说 ywt_admin和租户管理员都是查当前监狱所有的监区 其余监狱角色都是查当前用户管理的监区
            if (this.$store.getters.isSuperAdmin || this.$store.getters.isTenantAdmin) await this.$store.dispatch('getJailPrisonAreas', { url: '/prison_config/getPrisonConfigs', params: { jailId: value } })

            else await this.$store.dispatch('getJailPrisonAreas', { url: '/prison_config/getAuthChildPrisonConfigs' })

            Message.closeAll()

            this.$set(this.searchItems['prisonArea'], 'value', '')

            this.$set(this.searchItems['prisonArea'], 'options', this.$store.state.jailPrisonAreas)
          }
        }
      }

      if (selectKey === 'provincesId') {
        if (value) {
          this.clearSubPrisonArea('prisonSubArea')

          if (this.searchItems['prisonArea'] && !this.searchItems['prisonArea'].miss) this.$set(this.searchItems['jailId'], 'value', '')

          if (this.searchItems['prisonArea'] && !this.searchItems['prisonArea'].miss) {
            this.$set(this.searchItems['prisonArea'], 'value', '')

            this.$set(this.searchItems['prisonArea'], 'options', [])
          }
        }

        if (this.searchItems['jailId'] && !this.searchItems['jailId'].miss) {
          this.$set(this.searchItems['jailId'], 'getting', true)

          await this.$store.dispatch('getPrisonAll', { provincesId: value })

          Message.closeAll()

          this.$set(this.searchItems['jailId'], 'options', this.$store.state.prisonAll || [])

          this.$set(this.searchItems['jailId'], 'getting', false)
        }
      }

      if (selectKey === 'status') {
        if (this.searchItems.changerType) {
          if (value === 'CANCELED') {
            if (this.toShow && this.toShow.changerType === true) this.searchItems.changerType.miss = true

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
    prisonFilterCreatorSelfSearchSelectChange(selectKey, value) {},

    // 初始化数据
    async _initData() {
      // 优先自定义的方法
      const _promise = this._mixinsInitMethods || this.getDatas || this.getData || async function() {
        return true
      }

      await _promise()
    },

    // actived
    async _activedMethods() {
      const _promise = this._mixinsActivedMethods || this.getDatas || this.getData || async function() {
        return true
      }

      await _promise()
    }
  }
}
