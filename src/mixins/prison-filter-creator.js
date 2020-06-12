import { Message } from 'element-ui'

export default {
  props: {
    // 是否有权限查看所有监狱的数据（在路由的 props 中定义）
    hasAllPrisonQueryAuth: Boolean,
    hasOnlyAllPrisonQueryAuth: Boolean,
    hasProvinceQueryAuth: Boolean
  },
  data() {
    return {
      filter: {}
    }
  },
  created() {
    if (this.hasOnlyAllPrisonQueryAuth) this.createPrisonFilter()

    if (this.hasAllPrisonQueryAuth) {
      this.createPrisonAreaFilter()
      this.createPrisonFilter()
    }

    if (this.hasProvinceQueryAuth) this.createProvinceFilter()
  },

  methods: {
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

      await this.$store.dispatch('getPrisonAll')

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

    createPrisonAreaFilter() {
      const prisonAreaItem = {
        type: 'select',
        label: '监区',
        options: [],
        belong: { value: 'name', label: 'name' },
        value: ''
      }

      this.searchItems = Object.assign({}, { prisonArea: prisonAreaItem }, this.searchItems)
    },

    async searchSelectChange(selectKey, value) {
      if (selectKey === 'jailId') {
        if (this.searchItems.prisonArea) {
          if (value) {
            await this.$store.dispatch('getJailPrisonAreas', { jailId: value })

            Message.closeAll()

            this.$set(this.searchItems['prisonArea'], 'options', this.$store.state.jailPrisonAreas)
          }
          else {
            this.searchItems.prisonArea.options = []
          }

          this.searchItems.prisonArea.value = ''
        }
      }

      if (selectKey === 'provincesId') {
        if (value) {
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
    }
  }
}
