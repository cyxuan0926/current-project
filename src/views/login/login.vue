<template>
  <div class="center">
    <div class="login-container">
      <h1>狱务通管理平台</h1>
      <div class="login-form">
        <p class="white">请输入监狱编号, 您的用户名和密码:</p>
        <el-form
          ref="form"
          :model="formData"
          :rules="rules"
          @keyup.enter.native="onSubmit">
          <el-form-item prop="prison">
            <el-input
              v-model="formData.prison"
              placeholder="监狱编号">
            </el-input>
          </el-form-item>
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
            <el-checkbox v-model="isRember"><span class="white">记住密码</span></el-checkbox>
          </el-form-item>
        </el-form>
        <el-button
          class="width100"
          type="primary"
          :loading="loginState.loading"
          @click="onSubmit">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      formData: {
        password: '',
        username: '',
        prison: ''
      },
      isRember: false,
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        prison: [{ required: true, message: '请输入监狱编号', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      loginState: state => state.global.loginState
    })
  },
  mounted() {
    if (localStorage.getItem('user')) {
      if (this.$route.query.redirect) {
        this.$router.replace(this.$route.query.redirect)
      }
      else {
        this.$router.replace('/dashboard')
      }
      return
    }
    this.getCookie().then(res => {
      if (res && res.password) {
        this.formData = Object.assign({}, res, { password: Base64.decode(res.password) })
        this.isRember = true
      }
    })
  },
  methods: {
    ...mapMutations(['setLoginState']),
    ...mapActions(['login', 'setCookie', 'getCookie', 'removeCookie']),
    onSubmit() {
      if (this.loginState.loged || this.loginState.loading) return false
      this.$refs.form.validate(valid => {
        if (valid) {
          this.setLoginState({ loading: true })
          this.login(this.formData).then(res => {
            this.setLoginState()
            if (!res) return
            this.setLoginState({ loged: true })
            let params = {
              password: Base64.encode(this.formData.password),
              username: this.formData.username,
              prison: this.formData.prison
            }
            if (this.isRember) this.setCookie(params)
            else this.removeCookie(params)
            if (this.$route.query.redirect) this.$router.replace(this.$route.query.redirect)
            else this.$router.replace('/dashboard')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/login";
</style>
