
import { mapGetters } from 'vuex'

export default {

  computed: {
    ...mapGetters(['isTenantAdmin'])
  },

  methods: {
    // 租户管理员 监区数据和别的角色的监区数据不同
    async handleRolePrisonArea(element, prop, type = 'props', operation = 'search', role = this.user.role) {
      if (this.isTenantAdmin) {
        const options = operation === 'search' ? { value: 'name', label: 'name' } : { value: 'id', label: 'name' }

        await this.$store.dispatch('getPrisonConfigs', { jailId: JSON.parse(localStorage.getItem('user')).jailId })

        this.$set(element[prop], 'options', this.$store.state.prisonConfigs)
        this.$set(element[prop], type, options)
      } else {
        const options = { value: 'id', label: 'name' }

        await this.$store.dispatch('getJailPrisonAreas', { url: '/prison_config/getAuthChildPrisonConfigs' })

        this.$set(element[prop], 'options', (this.$store.state.jailPrisonAreas || []))
        this.$set(element[prop], type, options)
      }
    }
  }

}
