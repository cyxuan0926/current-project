<template>
  <div class="center">
    <div class="login-container">
      <h1>国科服务</h1>
      <div class="login-form">
        <p class="white">请输入您的用户名和密码</p>
        <el-form       
          ref="form"
          :model="formData"
          :rules="rules"
          @keyup.enter.native="handleLogin">
          <el-form-item prop="username">
            <el-input
              clearable
              v-model.trim="formData.username"
              placeholder="用户名">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              clearable
              type="password"
              v-model.trim="formData.password"
              placeholder="密码">
            </el-input>
          </el-form-item>
          <el-form-item class="keep-password">
            <el-checkbox v-model="isRememberAccount">
              <span class="white">记住密码</span>
            </el-checkbox>
            <el-button
              type="text"
              class="white forget-password"
              @click="handleGoPasswordRetrieve">忘记密码</el-button>  
          </el-form-item>
        </el-form>
        <el-button
          class="width100"
          type="primary"
          :loading="loading"
          @click="handleLogin">登录</el-button>
      </div>
    </div>
    <div class="copyright">
      Copyright © 2006-2019
      <a href="http://www.sinog2c.com">国科政信科技(北京)股份有限公司</a>
      <a href="http://www.beian.miit.gov.cn">湘ICP备18008171号-2</a>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'
import { mapActions, mapState, mapMutations } from 'vuex'
import { helper } from '@/utils'

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
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }]
      }
    }
  },
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
  created() {
    if (localStorage.getItem('accountInfo')) {
      if (this.$route.query.redirect) {
        this.$router.replace(this.$route.query.redirect)
      }
      else {
        this.$router.replace('/login')
      }
      return
    }
    this.resolveAccount()
  },
  methods: {
    ...mapMutations(['setUser']),
    ...mapMutations('account', ['setFindPasswordUsername', 'setIsStep']),
    ...mapActions(['getWebsocketResult']),
    ...mapActions('account', ['login']),

    handlePasswordTips(title) {
      return this.$confirm(
        title,
        '提示',
        {
          type: 'warning',
          showClose: false,
          closeOnClickModal: false,
          showCancelButton: false
        }
      )
    },
    handleLogin() {
      if (this.loading) return

      this.$refs.form.validate(async valid => {
        if (!valid) return

        try {
          const { username, password } = this.formData
          this.loading = true
          const res = await this.login({ username, password })
          if( res.code === 'user.PasswordNotMatched' ) {
            this.loading = false
            if( parseInt(res.passWordErrorCount) >= 3 ) {
              this.handlePasswordTips(`很抱歉，连续多次密码输入错误，账户已被锁定，请${res.lockTime}分钟后再登录`)
            }
            return
          }
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

            if ( this.isRememberAccount ) {
              this.storeAccount(username, password)
            } else {
              this.removeAccount()
            }

            if ( this.publicUserInfo && this.publicUserInfo.firstLogin ) {
              this.loading = false
              this.$router.replace('/password/edit?isFirst=1')
              return
            }

            const passWordStatus = this.publicUserInfo && this.publicUserInfo.passWordStatus
            if (passWordStatus === 'UP') {
              const redirectPath = this.$route.query.redirect
              redirectPath && !redirectPath.includes('login') ?
                this.$router.replace(redirectPath) :
                this.$router.replace('/dashboard')
            } else {
              this.$router.replace('/password/edit')
              const title = passWordStatus === 'DOWN' ?
                '密码已过期，请修改密码！' :
                `密码将在${passWordStatus === 'WARN' ? '7' : '1'}天后过期，为了不影响系统正常使用，请及时修改密码！`
              this.handlePasswordTips(title)
            }
          }
        } catch (err) {
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
    handleGoPasswordRetrieve() {
      const { username } = this.formData
      this.setFindPasswordUsername(username)
      localStorage.setItem('findPasswordUsername', JSON.stringify(username))
      this.$router.push({ path: `/password_retrieve/step_one` })
    }
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

.center {
  position: relative;

  .copyright {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 36px;
    line-height: 36px;
    border-top: 1px solid #d2d6de;
    text-align: center;
    background: #fff;
    color: #444;

    a {
      color: #444;

      &:last-child {
        margin-left: 20px;
      }
    }
  }

  /deep/ .el-input {
    width: 100% !important;
  }
  .forget-password {
    margin-left: 61%;
    font-family: 'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif;
  }
  .el-checkbox {
    margin-left: 1px;
  }
}
</style>
