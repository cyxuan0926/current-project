<template>
<el-container :class="['height100', { 'no-login': $route.meta.notLogin }]">
    <el-header height="46px">
      <the-header />
    </el-header>
    <el-container class="main-container">
        <el-main>
          <div id="login">
            <el-row
              :gutter="0"
              class="loginBackground">
              <el-col
                :span="7"
                :offset="8">
                <el-col :span="24">
                  <p class="projectName">修改密码</p>
                </el-col>
                <el-form
                  :model="ruleForm2"
                  status-icon
                  :rules="rules2"
                  ref="ruleForm2"
                  label-width="100px"
                  class="demo-ruleForm">
                  <el-form-item
                    label-width="0"
                    prop="password">
                    <el-input
                      show-password
                      type="password"
                      v-model="ruleForm2.password"
                      auto-complete="off"
                      placeholder="原密码"/>
                  </el-form-item>
                  <el-form-item
                    label-width="0"
                    prop="new_password">
                    <el-input
                      show-password
                      type="password"
                      v-model="ruleForm2.new_password"
                      auto-complete="off"
                      placeholder="新密码"/>
                  </el-form-item>
                  <el-form-item
                    label-width="0"
                    prop="passwordReview">
                    <el-input
                      show-password
                      type="password"
                      v-model="ruleForm2.passwordReview"
                      auto-complete="off"
                      placeholder="重新输入密码"/>
                  </el-form-item>
                  <el-form-item
                    label-width="0"
                    class="btn-box">
                    <!-- `checked` 为 true 或 false -->
                    <el-button
                      type=""
                      @click="submitForm('ruleForm2')">提交</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
        </el-main>
        <el-footer
          height="36px" style="text-align: center">
          <the-footer />
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
  
</template>

<script>
import { mapActions, mapState } from 'vuex'
import logout from '@/utils/logout'
import validators from '@/utils/validate'
import TheHeader from '@/views/layout/the-header'
import TheFooter from '@/views/layout/the-footer'

export default {
  components: { TheHeader, TheFooter },
  data() {
    // 验证密码和确认密码是否一致
    var validatePasswordReview = (rule, value, callback) => {
      if (value === '') callback(new Error('请输入确认密码'))
      else if (value !== this.ruleForm2.new_password) callback(new Error('两次输入密码不一致'))
      else callback()
    }
    return {
      ruleForm2: {
        password: '',
        new_password: '',
        passwordReview: ''
      },
      rules2: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          // { validator: validators.password }
        ],
        new_password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validators.password }
        ],
        passwordReview: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validators.password },
          { validator: validatePasswordReview, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    // 修改用户密码成功以后重新登录
    modifyPasswordResult() {
      setTimeout(() => {
          logout()
          this.$router.replace('/login')
      }, 1000)
    }
  },
  computed: {
    ...mapState({
      modifyPasswordResult: state => state.account.modifyMyPasswordResult // 修改用户名密码的结果
    })
  },
  methods: {
    ...mapActions('account', ['modifyMyPassword']),
    // 点击提交按钮执行的方法
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.modifyMyPassword({ oldPassword:this.ruleForm2.password, newPassword: this.ruleForm2.new_password })
        }
        else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
  white = #fff
  .main-container
    background: url('../../assets/images/bg-login.jpg') 0 60% no-repeat;
    background-size: cover;
    min-height: calc(100vh - 36px);
  #login
    .loginBackground
      background: rgba(0, 0, 0, 0.3)
      width: 60%
      margin: 6% auto 0
    .projectName
      font-size: 35px
      color: white
      margin: 20px 0 20px 24%;
    .btn-box
      & /deep/ .el-button
        background: #186C9C
        color: white
        float: right
        border: 0
        border-radius: 0
        width: 86px
        height: 34px
        vertical-align: middle
      & /deep/ .el-checkbox
        float: left
      & /deep/ .el-checkbox__label
        color: white
</style>
