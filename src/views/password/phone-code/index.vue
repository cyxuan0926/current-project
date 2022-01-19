<template>
  <div class="password-retrieve">
    <template v-if="isModifyingPassword">
      <el-card class="password-retrieve__card" shadow="hover">
        <div slot="header">
          <el-button type="text" @click="onRouterToLogin">国科服务</el-button>

          <span>找回密码</span>
        </div>

        <div class="el-row_step-one">
          <div class="passwore-retrieve__icon">
            <i class="el-icon-info">&nbsp;&nbsp;请输入你需要找回登录密码的账户名</i>
          </div>

          <el-form
            ref="passwordRetrieveForm"
            @submit.native.prevent
            :model="formData"
            label-width="70px"
            :rules="rules"
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model.trim="formData.username"
                placeholder="请输入你的用户名"
                clearable
              />
            </el-form-item>

            <el-form-item label="验证码" prop="verificationCode">
              <div class="verification-code_block">
                <el-input
                  v-model.trim="formData.verificationCode"
                  placeholder="请输入你的验证码"
                  clearable
                />

                <el-button
                  size="small"
                  type="info"
                  class="verification-code_block__send"
                  :loading="processing"
                  :disabled="isDisabledVerificationCodeBtn"
                  @click="onSendVerificationCode"
                >
                  <span v-if="countDown">发送验证码</span>

                  <span v-else>重发{{ countDownNumber }}s</span>
                </el-button>
              </div> 
            </el-form-item>

            <!-- <template v-if="showPhoneNumber">
              <el-form-item class="el-form-item__tips" prop="tips">
                <span>验证码已发送到{{ phoneNumber }}</span>
              </el-form-item>
            </template> -->

            <el-form-item label="新密码" prop="newPassword">
              <el-input
                placeholder="请输入新密码"
                type="password"
                show-password
                clearable
                v-model.trim="formData.newPassword"
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="checkPassword">
              <el-input
                placeholder="请输入确认密码"
                type="password"
                show-password
                clearable
                v-model.trim="formData.checkPassword"
              />
            </el-form-item>

            <el-form-item size="large">
              <el-button type="primary" @click="onSubmitModifyPassowrd">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </template>

    <template v-else>
      <el-row class="password-retrieve__login">
        <h2>恭喜您！密码重置成功</h2>

        <h4>{{ loginNumber }} 秒后进入登陆</h4>

        <el-button type="primary" @click="onRouterToLogin">立即登陆</el-button>
      </el-row>
    </template>
  </div>
</template>
<script>

import { mapState, mapActions } from 'vuex'

import validate from '@/utils/validate'
export default {
  data() {
    let validateNewPassword = (rule, value, callback) => {
      if (!value) callback(new Error('请输入新密码'))

      else {
        if (this.formData.checkPassword) this.$refs.passwordRetrieveForm.validateField('checkPassword')
        callback()
      }
    }, validateCheckPassword = (rule, value, callback) => {
        if (!value) callback(new Error('请输入确认密码'))

        else if (value !== this.formData.newPassword) callback(new Error('两次输入密码不一致'))

        else callback()
      }, validateCheckUsername = (rule, value, callback) => {
        if (!value) callback(new Error('请输入用户名'))

        else if (this.codeResult && (this.codeResult.code === 'SMS_SEND_ERR' || this.codeResult.code === 'SMS_NO_BIND')) callback(new Error(this.codeResult.msg))

        else callback()
      }
    return {
      formData: {
        username: '',
        newPassword: '',
        checkPassword: '',
        verificationCode: ''
      },

      rules: {
        username: [{ validator: validateCheckUsername, trigger: 'blur', required: true }],

        verificationCode: [{ message: '请输入验证码', trigger: 'blur', required: true }],

        newPassword: [
          { validator: validateNewPassword, trigger: 'blur', required: true },
          { validator: validate.password }
        ],

        checkPassword: [
          { validator: validateCheckPassword, trigger: 'blur', required: true },
          { validator: validate.password }
        ]
      },

      processing: false,

      countDown: true,

      countDownNumber: 60,

      isDisabledVerificationCodeBtn: true,

      // showPhoneNumber: false,

      // phoneNumber: '',

      isModifyingPassword: true,

      loginNumber: 5,

      codeResult: {}
    }
  },

  computed: {
    ...mapState('account', {
      findPasswordUsername: state => state.findPasswordUsername
    })
  },

  watch: {
    'formData.username': {
      handler: function(username) {
        if (username) this.isDisabledVerificationCodeBtn = false

        else this.isDisabledVerificationCodeBtn = true
      },

      deep: true
    }
  },

  methods: {
    ...mapActions('account', ['sendSmsVerificationCodes', 'modifyMyPasswordByCode']),

    onRouterToLogin() {
      this.$router.replace({ path: '/login' })

      this.onReset()
    },

    async onSendVerificationCode() {
      this.$refs['passwordRetrieveForm'].validateField("username")

      this.processing = true

      const { username } = this.formData

      if (username) {
        const isUsefully = await this.sendSmsVerificationCodes(username)

        this.codeResult = isUsefully

        this.$refs['passwordRetrieveForm'].validateField("username")

        if (isUsefully === 'SMS_SEND_OK') {
          this.isDisabledVerificationCodeBtn = true

          this.countDown = false

          let timer = null

          if (this.countDownNumber > 0) {
            timer = setInterval(() => {
              this.countDownNumber --
            }, 1000)
          }

          setTimeout(() => {
            this.countDown = true

            clearInterval(timer)

            this.countDownNumber = 60

            this.isDisabledVerificationCodeBtn = false
          }, 1000 * 60)
        }
      }

      this.processing = false
    },

    onReset() {
      this.processing = false,

      this.countDown = true,

      this.countDownNumber = 60,

      this.isDisabledVerificationCodeBtn = true,

      // this.showPhoneNumber = false,

      // this.phoneNumber = '',

      this.isModifyingPassword = true,

      this.loginNumber = 5

      this.codeResult = {}
    },

    onSubmitModifyPassowrd() {
      this.$refs['passwordRetrieveForm'].validate(async valid => {
        if (valid) {
          const {
            newPassword,
            verificationCode,
            username
          } = this.formData

          const params = {
            newPassword,
            verificationCode,
            username
          }

          const isSucess = await this.modifyMyPasswordByCode(params)

          this.isModifyingPassword = !isSucess

          if (!this.isModifyingPassword) {
            let timer = null

            if (this.loginNumber > 0) {
              setInterval(() => {
                this.loginNumber --
              }, 1000)
            }

            setTimeout(() => {
              clearInterval(timer)

              this.onRouterToLogin()
            }, 1000 * 5)
          }
        }
      })
    }
  },

  created() {
    this.formData.username = this.findPasswordUsername
  }
}
</script>

<style lang="scss" scoped>
.password-retrieve__card {
  width: 70%;
  margin: 4% auto;
  /deep/ .el-card__header {
    padding: 6px 18px;
    background-color: #f2f2f2;
    .el-button--text {
      font-size: 18px;
      color: black; 
    }

    span {
      margin-left: 12px;
    } 
  }

  /deep/ .el-card__body {
    display: flex;
    flex-direction: column;
    .el-form {
      padding: 20px 0px;
      width: 46%;
      text-align: right;
      margin: 0px auto;

      .el-button--primary {
        padding: 11px 15%;
        text-align: center;
      }

      .el-form-item {
        margin-bottom: 20px;
        .el-form-item__content {
          .verification-code_block {
            display: flex;
            align-items: baseline;

            .el-button {
              margin-left: 10px;
              padding: 10px 15px !important;
            }
          }
        }

        &__tips {
          text-align: left;
          margin-bottom: 5px;
          .el-form-item__content {
            line-height: normal;
          }
        }
      }
    }

    .passwore-retrieve__icon {
      padding: 22px 0px 0px;
      text-align: center;
      .el-icon-info:before {
        font-size: 16px;
        color: #409EFF;
      }
    }
  }
}

.password-retrieve__login {
  width: 30%;
  margin: 10% auto;
  padding: 30px;
  border: 1px solid #EBEEF5;
  background-color: $white;
  color: #303133;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 3px;

  h4 {
    font-weight: normal;
  }

  .el-button {
    width: 42%;
  }
}
</style>
