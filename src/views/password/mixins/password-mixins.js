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
    ...mapMutations('account', ['setFindPasswordUsername', 'setIsStep'])
  }
}
