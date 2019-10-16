<template>
  <div>
    <el-form :label-width="'30%'"
      ref="passwordByTokenForm"
      :model="passwords"
      :rules="passwordsRules">
      <el-form-item
        label="新密码"
        prop="newPassword">
        <el-input
          placeholder="请输入新密码"
          type="password"
          clearable
          v-model.trim="passwords.newPassword" />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="checkPassword">
        <el-input
          placeholder="请输入确认密码"
          type="password"
          show-password
          clearable
          v-model.trim="passwords.checkPassword" />
      </el-form-item>
      <el-form-item size="large">
        <el-button
          type="primary"
          @click="handleSubmit">确定</el-button>
        <el-button
          type="primary"
          @click="handleGoBack">上一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import passwordMixins from './mixins/password-mixins'
export default {
  mixins: [passwordMixins],
  data () {
    let validateNewPassword = (rule, value, callback) => {
        if (!value) callback(new Error('请输入新密码'))
        else {
          if (this.passwords.checkPassword) this.$refs.passwordByTokenForm.validateField('checkPassword')
          callback()
        }
      }, validateCheckPassword = (rule, value, callback) => {
        if (!value) callback(new Error('请输入确认密码'))
        else if (value !== this.passwords.newPassword) callback(new Error('两次输入密码不一致'))
        else callback()
      }
    return {
      passwords: {
        newPassword: '',
        checkPassword: ''
      },
      passwordsRules: {
        newPassword: [{ validator: validateNewPassword, trigger: 'blur', required: true }],
        checkPassword: [{ validator: validateCheckPassword, trigger: 'blur', required: true }]
      }
    }
  },
  mounted() {
    if (this.isStep !== 2) {
      this.setIsStep(1)
      localStorage.setItem('isStep', JSON.stringify(1))
      this.$router.push('/password_retrieve/step_one')
    }
  },
  methods: {
    ...mapActions('account', ['modifyMyPasswordByToken']),
    handleGoBack() {
      this.$router.back()
    },
    handleSubmit() {
      this.$refs.passwordByTokenForm.validate( async valid => {
        if (valid) {
          const { newPassword } = this.passwords
          const res = await this.modifyMyPasswordByToken({ token: this.passwordToken, newPassword })
          if (res) {
            this.setIsStep(0)
            localStorage.clear('isStep')
            localStorage.clear('findPasswordUsername')
            localStorage.clear('passwordToken')
            this.$router.push({ path: '/login' })
          }
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >

</style>
