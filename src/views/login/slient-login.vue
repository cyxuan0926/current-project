<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { helper } from '@/utils'
import logout from '@/utils/logout'

export default {
    computed: {
        ...mapState('account', {
            accountInfo: state => state.accountInfo,
            menus: state => state. menus,
            publicUserInfo: state => state.publicUserInfo,
            authorities: state => state.authorities
        }),
        ...mapState({
            user: state => state.global.user
        })
    },

    async created() {
        if(localStorage.getItem('accountInfo')) {
            this.$router.replace('/dashboard')
            return
        }
        try {
            const _query = this.$route.query
            if( _query ) {
                localStorage.clear()
                this.closeWebsocket()
                this.resetState('logout')
                const res = await this.slientLogin(_query)
                if(res) {
                    localStorage.setItem('accountInfo', JSON.stringify(this.accountInfo))
                    localStorage.setItem('authorities', JSON.stringify(this.authorities || []))
                    localStorage.setItem('publicUserInfo', JSON.stringify(this.publicUserInfo))
                    localStorage.setItem('menus', JSON.stringify(this.menus))
                    this.setUser(Object.assign({}, this.user, {...helper.transitionRoleId(this.publicUserInfo.userRoles)}))
                    localStorage.setItem('user', JSON.stringify(this.user))

                    const { role, jailId } = this.user
                    if ([1, -1].includes(parseInt(role))) {
                        this.getWebsocketResult(jailId)
                    }
                    this.$router.replace('/dashboard')
                }
            }else {
                this.$router.replace('/login')
            }

        } catch (err) {
            throw err
        }
    },

    methods: {
        ...mapMutations(['setUser']),
        ...mapActions(['resetState','getWebsocketResult','closeWebsocket']),
        ...mapActions('account', ['slientLogin']),
    }
}
</script>
