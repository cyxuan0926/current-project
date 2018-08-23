<template>
    <el-row class="top-content" @keyup.native.enter="submitForm('loginForm')">
        <el-col class="inner-bg">
            <el-col class="container">
                <el-col class="row">
                    <el-col :span="12" :offset="6" class="form-box">
                        <el-col class="form-top">
                            <el-col class="form-top-left">
                                <h2>狱务公开管理平台</h2>
                                <p>请输入监狱编号, 您的用户名和密码:</p>
                            </el-col>
                        </el-col>
                        <el-col class="form-bottom">
                            <el-form :model="loginForm" label-position="left" :rules="rules" ref="loginForm" role="form">
                                <el-form-item prop="prison">
                                    <el-input v-model="loginForm.prison" type="text" placeholder="请输入监狱编号"></el-input>
                                </el-form-item>
                                <el-form-item prop="username">
                                    <el-input v-model="loginForm.username" type="text" placeholder="请输入用户名"></el-input>
                                </el-form-item>
                                <el-form-item prop="password">
                                    <el-input v-model="loginForm.password" type="password" placeholder="请输入用户密码"></el-input>
                                </el-form-item>
                                <el-form-item style="margin: -10px 0 0">
                                  <el-checkbox class="rememberPSW" v-model="rememberPSW">记住密码</el-checkbox>
                                </el-form-item>
                                <el-form-item>
                                    <el-button
                                      type="primary"
                                      :loading="logining"
                                      @click="submitForm('loginForm')">登录</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-col>
                </el-col>
            </el-col>
        </el-col>
    </el-row>
</template>

<script>
import { Base64 } from 'js-base64'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      loginForm: {
        password: '',
        username: '',
        prison: ''
      },
      rememberPSW: false,
      logining: false,
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
        this.loginForm = Object.assign({}, res, { password: Base64.decode(res.password) })
        this.rememberPSW = true
      }
    })
  },
  methods: {
    ...mapActions(['login', 'setCookie', 'getCookie', 'removeCookie']),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.logining = true
          this.login(this.loginForm).then(res => {
            this.logining = false
            if (!res) return
            let params = {
              password: Base64.encode(this.loginForm.password),
              username: this.loginForm.username,
              prison: this.loginForm.prison
            }
            if (this.rememberPSW) this.setCookie(params)
            else this.removeCookie(params)
            this.$router.replace('/dashboard')
          })
        }
      })
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
@import "../../assets/css/style.css"
</style>
