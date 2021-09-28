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
          <el-form-item prop="username" ref="usernameItem">
            <el-input
              clearable
              v-model.trim="formData.username"
              placeholder="用户名"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              clearable
              type="password"
              show-password
              v-model.trim="formData.password"
              placeholder="密码"
            />
          </el-form-item>

          <el-form-item prop="code">
            <el-input
                clearable
                v-model.trim="formData.code"
                :maxlength="4"
                placeholder="请输入验证码">
                <el-button slot="append" @click="handleSmscode" :disabled="isGetSmscode">{{ smsCodeText }}</el-button>
            </el-input>
        </el-form-item>

          <!-- <el-form-item class="el-form__code" prop="code">
            <el-input
              clearable
              v-model.trim="formData.code"
              placeholder="请输入验证码">
            </el-input>

            <img :src="captchaConfigs.imageCode" @click.self.prevent="getCaptcha" />
          </el-form-item> -->

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
      {{ 'Copyright © 2006-' + year }}
      <a href="http://www.sinog2c.com">国科政信科技(北京)股份有限公司</a>
      <a href="http://www.beian.miit.gov.cn">湘ICP备18008171号-2</a>
    </div>
    <bind-phone-modal v-model="showBindModal" :username="formData.username"/>
  </div>
</template>

<script>
import { _thisYear } from '@/common/constants/const'
import bindPhoneModal from './components/bind-phone-modal.vue'
import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import { helper } from '@/utils'
import { sendSmsByAccount } from '@/service-public/api/account'
import { JSEncryptEncrypt } from '@/common/constants/rsa'

export default {
  components: {
    bindPhoneModal
  },
  data() {
    return {
      showBindModal: false,
      loading: false,
      isRememberAccount: false,
      isGetSmscode: false,
      smsCountdown: 60,
      smsInterval: null,
      hasGetedSmscode: false,

      formData: {
        username: '',
        password: '',
        code: ''
      },

      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          // {
          //   validator: async (rule, value, callback) => {
          //     let res = await this.sendSmsVerificationCodes(value)
          //     if (res) {
          //       callback()
          //       if (!res.data) {
          //         callback(new Error(''))
          //         this.showBindModal = true
          //       }
          //     }
          //     else {
          //       callback(new Error('用户名不存在'))
          //     }
          //   },
          //   trigger: 'send'
          // }
        ],

        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],

        code: [
          {
            required: true,
            validator(rule, value, callback) {
              if ( /^\d{4}$/.test(value) ) {
                callback()
              }
              else {
                callback(new Error('请输入正确验证码'))
              }
            },
            trigger: 'blur'
          }
        ]
      },

      year: _thisYear
    }
  },

  computed: {
    ...mapState('account', {
      accountInfo: state => state.accountInfo,
      menus: state => state. menus,
      publicUserInfo: state => state.publicUserInfo,
      authorities: state => state.authorities
      // captchaConfigs: state => state.captchaConfigs
    }),
    ...mapState({
      user: state => state.global.user
    }),

    ...mapGetters(['isAdvancedAuditor', 'isTenantAdmin', 'isAuditor']),

    // 倒计时文本
    smsCodeText() {
        return `${ !this.smsInterval ? '获取验证码' : `重发(${ this.smsCountdown }s)` }`
    }
  },

  async created() {
    // await this.getCaptcha()
    if (localStorage.getItem('accountInfo')) {
      if (this.$route.query.redirect) this.$router.replace(this.$route.query.redirect)

      else this.$router.replace('/login')

      return
    }

    this.resolveAccount()
  },

  destroyed() {
    if (this.smsInterval) {
      clearInterval(this.smsInterval)
      this.smsInterval = null
    }
  },

  methods: {
    ...mapMutations(['setUser', 'setLoginHavePrisonerIn']),
    ...mapMutations('account', ['setFindPasswordUsername', 'setIsStep']),
    ...mapActions(['getWebsocketResult']),
    ...mapActions('account', ['login']), // 'getCaptcha'

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

    // 获取验证码倒计时
    setSmsCountdown() {
        if (!this.smsInterval) {
            this.smsInterval = setInterval(() => {
                this.smsCountdown--
                if (!this.smsCountdown) {
                    this.smsCountdown = 60
                    this.isGetSmscode = false
                    clearInterval(this.smsInterval)
                    this.smsInterval = null
                }
            }, 1000)
        }
    },

    // 获取验证码
    handleSmscode() {
      if (this.isGetSmscode) {
        return
      }
      this.$message.closeAll();
      let valid = true
      let count = 0
      this.$refs.form.validateField(['username', 'password'], async err => {
        if (err) {
          valid = false
        }
        if (++count == 2 && valid) {
          this.isGetSmscode = true
          let res = await sendSmsByAccount(this.formData.username, this.formData.password)
          if (res) {
            let { code } = res
            // 发送短信验证码失败 用户名不存在 ｜ 密码不正确 | 操作频繁 ｜ 短信次数达上限
            if (code == 'SMS_SEND_ERR') {
              this.isGetSmscode = false
            }
            // 用户名是否绑定手机号
            else if (code == 'SMS_NO_BIND') {
              this.showBindModal = true
              this.isGetSmscode = false
            }
            // 提示
            else if (code == 'SMS_SEND_OK') {
              this.setSmsCountdown()
              this.hasGetedSmscode = true
            }
          }
          else {
            this.isGetSmscode = false
          }
        }
      })
    },

    handleLogin() {
      if (this.loading) return
      this.$message.closeAll();
      this.$refs.form.validate(async valid => {
        if (!valid) return

        if (!this.hasGetedSmscode) {
          this.$message.error('还未获取验证码，请点击获取验证码')
          return
        }

        try {
          // const { key } = this.captchaConfigs
          const {
            username,
            password,
            code
          } = this.formData
          this.loading = true
          const res = await this.login({
            username,
            password,
            code,
            codeKey: username
          })

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
            localStorage.setItem('menus', JSON.stringify(this.menus || []))
            this.setUser(Object.assign({}, this.user, {...helper.transitionRoleId(this.publicUserInfo.userRoles)}))
            localStorage.setItem('user', JSON.stringify(this.user || {}))

            const { role, jailId } = this.user
            if ([1, -1].includes(parseInt(role))) {
              this.getWebsocketResult(jailId)
            }

            if ( this.isRememberAccount ) {
              this.storeAccount(username, password)
            } else {
              this.removeAccount()
            }

            if (this.publicUserInfo && this.publicUserInfo.firstLogin) {
              this.loading = false
              this.$router.replace('/password/edit?isNoback=1')
              return
            }

            const passWordStatus = this.publicUserInfo && this.publicUserInfo.passWordStatus

            const passWordDays = this.publicUserInfo && this.publicUserInfo.days

            if (passWordStatus === 'UP') {
              const { hasPrisonerIn } = this.user

              const isPrisonerIn = hasPrisonerIn && (this.isAuditor || this.isTenantAdmin || this.isAdvancedAuditor)

              const redirectPath = this.$route.query.redirect

              redirectPath && !redirectPath.includes('login') && !isPrisonerIn ?
                this.$router.replace(redirectPath) :
                this.$router.replace('/dashboard')

              hasPrisonerIn && setTimeout(() => {
                this.$confirm('有新的转监记录，请及时处理！', {
                  confirmButtonText: '处理',
                  closeOnClickModal: false
                }).then(() => {
                  this.setLoginHavePrisonerIn(true)

                  this.$router.replace('/prisoner/list')
                })
              }, 100)
            } else {
              this.$router.replace(`/password/edit${ passWordStatus === 'DOWN' ? '?isNoback=1' : '' }`)
              const title = passWordStatus === 'DOWN' ?
                '密码已过期，请修改密码！' :
                `密码将在${ passWordDays < 90 ? 90 - passWordDays : 1}天后过期，为了不影响系统正常使用，请及时修改密码！`
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

      this.$router.push({ path: '/password_retrieve/byPhone' })
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

  .el-form__code {
    /deep/ .el-form-item__content {
      .el-input {
        width: 64% !important;
      }

      img {
        width: 30%;
        margin-left: 5%;
        cursor: pointer;
      }
    }
  }
}
</style>
