<template>
  <div class="height100 center">
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
              <!-- <template slot="prepend">监狱编号</template> -->
            </el-input>
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              placeholder="用户名">
              <!-- <template slot="prepend">用户名</template> -->
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="formData.password"
              placeholder="密码">
              <!-- <template slot="prepend">密码</template> -->
            </el-input>
          </el-form-item>
          <el-form-item class="white-login">
            <el-checkbox v-model="isRember">记住密码</el-checkbox>
          </el-form-item>
        </el-form>
        <el-button
          class="button-login"
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
        prison: [{ required: true, message: '请输入监狱代码', trigger: 'blur' }]
      }
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
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.login(this.formData).then(res => {
            this.loading = false
            if (!res) return
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

