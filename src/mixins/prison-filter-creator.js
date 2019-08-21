
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
    }
  },
  methods: {
    async createPrisonFilter() {
      const prisonSearchItem = {
        type: 'select',
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
    }
  }
}
