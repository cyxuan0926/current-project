<template>
  <div
    id="login"
    @keyup.enter="submitForm('ruleForm2')">
    <el-row
      :gutter="0"
      class="loginBackground">
      <el-col
        :span="6"
        :offset="9">
        <el-col :span="24">
          <p class="projectName">狱务公开管理平台</p>
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
            prop="prison">
            <el-input
              type="text"
              v-model="ruleForm2.prison"
              auto-complete="off"
              placeholder="监狱代码"/>
          </el-form-item>
          <el-form-item
            label-width="0"
            prop="username">
            <el-input
              type="text"
              v-model="ruleForm2.username"
              auto-complete="off"
              placeholder="用户名"/>
          </el-form-item>
          <el-form-item
            label-width="0"
            prop="password">
            <el-input
              type="password"
              v-model="ruleForm2.password"
              auto-complete="off"
              placeholder="密码"/>
          </el-form-item>
          <el-form-item
            label-width="0"
            class="btn-box">
            <!-- `checked` 为 true 或 false -->
            <!--<el-checkbox v-model="ruleForm2.checked">记住密码</el-checkbox>-->
            <el-button
              type=""
              @click="submitForm('ruleForm2')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      ruleForm2: {
        password: '',
        username: '',
        prison: ''
      },
      // ruleForm2: {
      //   password: '3m4c3n9J',
      //   username: 'admin',
      //   prison: '9999'
      // },
      // ruleForm2: {
      //   password: '3m4c3n9J',
      //   username: '4501_xx',
      //   prison: '4501'
      // },
      rules2: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        prison: [{ required: true, message: '请输入监狱代码', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    if (localStorage.getItem('user')) {
      this.$router.replace('/dashboard')
    }
  },
  methods: {
    ...mapActions(['login']),
    // 点击提交按钮执行的方法
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login(this.ruleForm2).then(res => {
            if (!res) return
            this.$router.replace('/dashboard')
          })
        }
      })
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
  white = #fff
  #login
    .loginBackground
      background: #4F98C2
      margin-top: 10%
    .projectName
      font-size: 35px
      color: white
      margin-top: 20px
      margin-bottom: 20px
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
