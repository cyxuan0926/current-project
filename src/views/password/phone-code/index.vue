<template>
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

        <el-form-item label="验证码" prop="username">
          <div class="verification-code_block">
            <el-input
              v-model.trim="formData.code"
              placeholder="请输入你的验证码"
              clearable
            />

            <el-button
              size="small"
              type="info"
              class="verification-code_block__send"
            >
              <span>发送验证码</span>
              <!-- <span v-else>{{ countDownNumber }}s后可重新发送</span> -->
            </el-button>
          </div>
          
        </el-form-item>

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
          <el-button type="primary">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>
<script>

import { mapState, mapActions } from 'vuex'

import validate from '@/utils/validate'

import { JSEncryptEncrypt } from '@/common/constants/rsa'
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
      }
    return {
      formData: {
        username: '',
        newPassword: '',
        checkPassword: '',
        code: ''
      },

      rules: {
        username: [{ trigger: 'blur', required: true }],
        code: [{ trigger: 'blur', required: true }],
        newPassword: [
          { validator: validateNewPassword, trigger: 'blur', required: true },
          { validator: validate.password }
        ],
        checkPassword: [
          { validator: validateCheckPassword, trigger: 'blur', required: true },
          { validator: validate.password }
        ]
      }
    }
  },

  computed: {
    ...mapState('account', {
      findPasswordUsername: state => state.findPasswordUsername
    })
  },

  methods: {
    ...mapActions('account', ['sendSmsVerificationCodes']),

    onRouterToLogin() {
      this.$router.replace({ path: '/login' })
    }
  },

  created() {
    this.formData.username = this.findPasswordUsername
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
</style>
