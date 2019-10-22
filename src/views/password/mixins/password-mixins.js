import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState('account', {
      passwordToken: state => state.passwordToken,
      isStep: state => state.isStep, // 表示当前步数已经检验通过了
      findPasswordUsername: state => state.findPasswordUsername
    })
  },
  methods: {
    ...mapMutations('account', ['setFindPasswordUsername', 'setIsStep']),
    handleSetStepAndRouter({ step = 0, path = '/password_retrieve/step_one', type = 'replace' } = {}) {
      this.setIsStep(step)
      localStorage.setItem('isStep', JSON.stringify(step))
      if (type === 'push') this.$router.push({ path: `${ path }` })
      if (type === 'replace') this.$router.replace({ path: `${ path }` })
    }
  },
  watch: {
    '$route'(to, from) {
      if (!to.meta.step) {
        this.setIsStep(0)
        localStorage.setItem('isStep', JSON.stringify(0))
      }
      if (from.meta.step > to.meta.step) {
        this.setIsStep(to.meta.step - 1)
        localStorage.setItem('isStep', JSON.stringify(to.meta.step - 1))
      }
    }
  }
}
