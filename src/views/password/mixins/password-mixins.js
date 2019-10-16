import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState('account', {
      passwordToken: state => state.passwordToken,
      isStep: state => state.isStep,
      findPasswordUsername: state => state.findPasswordUsername
    })
  },
  methods: {
    ...mapMutations('account', ['setFindPasswordUsername', 'setIsStep']),
    handleSetStepAndRouter({ step = 0, path = '/password_retrieve/step_one' } = {}) {
      this.setIsStep(step)
      localStorage.setItem('isStep', JSON.stringify(step))
      this.$router.push({ path: `${ path }` })
    }
  }
}
