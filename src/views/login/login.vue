<template>
  <div class="center">
    <div class="login-container">
      <h1>狱务通管理平台</h1>
      <div class="login-form">
        <p class="white">请输入您的用户名和密码</p>
        <el-form       
          ref="form"
          :model="formData"
          :rules="rules"
          @keyup.enter.native="handleLogin">
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              placeholder="用户名">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="formData.password"
              placeholder="密码">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="isRememberAccount">
              <span class="white">记住密码</span>
            </el-checkbox>
          </el-form-item>
        </el-form>
        <el-button
          class="width100"
          type="primary"
          :loading="loading"
          @click="handleLogin">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'
import { mapActions, mapState, mapMutations } from 'vuex'
// import jwtDecode from 'jwt-decode'
import { helper } from '@/utils'
import information from '@/router/modules/information'
import admin from '@/router/modules/admin'
import check from '@/router/modules/check'

export default {
  data() {
    return {
      loading: false,
      isRememberAccount: false,
      formData: {
        username: '',
        password: ''
      },
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      }
    }
  },
  computed: {
    // ...mapState({
    //   loginState: state => state.global.loginState
    // }),
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
  created() {
    if (localStorage.getItem('accountInfo')) {
      if (this.$route.query.redirect) {
        this.$router.replace(this.$route.query.redirect)
      }
      else {
        this.$router.replace('/login')
        // this.$router.replace('/dashboard')
      }
      return
    }
    this.resolveAccount()
  },
  methods: {
    // ...mapMutations(['setLoginState']),
    ...mapMutations(['setUser']),
    ...mapActions(['login', 'setCookie', 'getCookie', 'removeCookie']),
    ...mapActions('account', ['login']),
    handleLogin() {
      if (this.loading) return

      this.$refs.form.validate(async valid => {
        if (!valid) return

        try {
          const { username, password } = this.formData

          this.loading = true
          const res = await this.login({ username, password })
          if(res) {
            localStorage.setItem('accountInfo', JSON.stringify(this.accountInfo))
            localStorage.setItem('authorities', JSON.stringify(this.authorities))
            localStorage.setItem('publicUserInfo', JSON.stringify(this.publicUserInfo))
            localStorage.setItem('menus', JSON.stringify(this.menus))
            this.setUser(Object.assign({}, this.user, {...helper.transitionRoleId(this.publicUserInfo.userRoles)}))
            localStorage.setItem('user', JSON.stringify(this.user))
            this.isRememberAccount
            ? this.storeAccount(username, password)
            : this.removeAccount()

          const redirectPath = this.$route.query.redirect
          redirectPath && !redirectPath.includes('login')
            ? this.$router.replace(redirectPath)
            : this.$router.replace('/dashboard')
          }
        } catch (err) {
          throw err
        }
        this.loading = false
      })
    },
    storeAccount(username, password) {
      Cookies.set('username', username, { expires: 7 })
      Cookies.set('password', Base64.encode(password), { expires: 7 })
    },
    removeAccount() {
      Cookies.remove('username')
      Cookies.remove('password')
    },
    resolveAccount() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')

      if (!username || !password) return

      this.formData = { username, password: Base64.decode(password) }
      this.isRememberAccount = true
    },
    // handleLogin() {
    //   if (this.loginState.loged || this.loginState.loading) return false
    //   this.$refs.form.validate(valid => {
    //     if (valid) {
    //       this.setLoginState({ loading: true })
    //       this.login(this.formData).then(res => {
    //         this.setLoginState()
    //         if (!res) return
    //         this.setLoginState({ loged: true })
    //         let params = {
    //           password: Base64.encode(this.formData.password),
    //           username: this.formData.username,
    //           prison: this.formData.prison
    //         }
    //         if (this.isRememberAccount) this.setCookie(params)
    //         else this.removeCookie(params)
    //         if (this.$route.query.redirect) this.$router.replace(this.$route.query.redirect)
    //         else this.$router.replace('/dashboard')
    //       })
    //     }
    //   })
    // }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/login";
</style>
