<template>
  <div class="center">
    <div class="login-container">
      <h1>狱务公开管理平台</h1>
      <div class="login-form">
        <el-form
          ref="form"
          :model="formData"
          :rules="rules"
          @keyup.enter.native="onSubmit">
          <el-form-item prop="prison">
            <el-input
              v-model="formData.prison"
              placeholder="监狱编号">
              <span
                class="prepend"
                slot="prepend">监狱编号</span>
            </el-input>
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              placeholder="用户名">
              <span
                class="prepend"
                slot="prepend">用户名</span>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="formData.password"
              placeholder="密码">
              <span
                class="prepend"
                slot="prepend">密码</span>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="isRember"><span class="white">记住密码</span></el-checkbox>
          </el-form-item>
        </el-form>
        <el-button
          class="width100"
          type="primary"
          :loading="loading"
          @click="onSubmit">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      formData: {
        password: '',
        username: '',
        prison: ''
      },
      isRember: false,
      loading: false,
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        prison: [{ required: true, message: '请输入监狱编号', trigger: 'blur' }]
      },
      loged: false
    }
  },
  mounted() {
    if (localStorage.getItem('user')) {
      this.$router.replace('/dashboard')
    }
    this.getCookie().then(res => {
      if (res && res.password) {
        this.formData = Object.assign({}, res, { password: Base64.decode(res.password) })
        this.isRember = true
      }
    })
  },
  methods: {
    ...mapActions(['login', 'setCookie', 'getCookie', 'removeCookie']),
    onSubmit() {
      if (this.loged || this.loading) return false
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.login(this.formData).then(res => {
            this.loading = false
            if (!res) return
            this.loged = true
            let params = {
              password: Base64.encode(this.formData.password),
              username: this.formData.username,
              prison: this.formData.prison
            }
            if (this.isRember) this.setCookie(params)
            else this.removeCookie(params)
            this.$router.replace('/dashboard')
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
