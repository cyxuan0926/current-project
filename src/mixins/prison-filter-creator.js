
export default {
  props: {
    // 是否有权限查看所有监狱的数据（在路由的 props 中定义）
    hasAllPrisonQueryAuth: Boolean
  },
  data() {
    return {
      filter: {}
    }
  },
  created() {
    if (this.hasAllPrisonQueryAuth) {
      this.createPrisonFilter()
      this.createPrisonAreaFilter()
    }
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

      if (this.$store.state.prisonAll.length === 0) {
        await this.$store.dispatch('getPrisonAll')
      }
      this.$set(this.searchItems, 'jailId', prisonSearchItem)
      this.searchItems.jailId.options = this.$store.state.prisonAll
      this.searchItems.jailId.getting = false
    },
    createPrisonAreaFilter() {
      const prisonAreaItem = {
        type: 'select',
        label: '监区',
        options: [],
        belong: { value: 'name', label: 'name' },
        value: ''
      }

      this.$set(this.searchItems, 'prisonArea', prisonAreaItem)
    },
    async searchSelectChange(selectKey, value) {
      if (selectKey === 'jailId') {
        if (value) {
          await this.$store.dispatch('getJailPrisonAreas', { jailId: value })
          this.searchItems.prisonArea.options = this.$store.state.jailPrisonAreas
        }
        else {
          this.searchItems.prisonArea.options = []
        }

        this.searchItems.prisonArea.value = ''
      }
    }
  }
}
