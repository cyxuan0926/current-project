<template>
  <div>
    <div class="passwore-retrieve__icon">
      <i class="el-icon-info">&nbsp;&nbsp;请输入你需要找回登录密码的账户名</i>
    </div>
    <!-- https://element.eleme.cn/#/zh-CN/component/form -->
    <el-form
      ref="user"
      @submit.native.prevent
      label-width="30%"
      :model="user"
      :rules="userRules">
      <el-form-item
        label="用户名"
        prop="username">
        <el-input
          placeholder="请输入你的用户名"
          clearable
          v-model.trim="user.username" />
      </el-form-item>
      <el-form-item size="large">
        <el-button
          type="primary"
          @click="handleNextStep">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { getUserSecurityQuestions } from '@/service-public/api/account'
import passwordMixins from './mixins/password-mixins'
export default {
  mixins: [passwordMixins],
  data () {
    let checkUsernanme = async (rule, value, callback) => {
      let res
      if (value) res = await getUserSecurityQuestions({ username: value })
      if (!value) callback(new Error('请输入用户名'))
      else if (res === 'user.CanNotRecoverDisabledUserPassword') callback(new Error('该账户已被禁用，请联系厂家维护人员处理'))
      else if (!res) callback(new Error('该账户不存在，请重新输入'))
      else if (res && !res.length) callback(new Error('该账户未设置安全问题，无法自行找回密码，请联系租户管理员或厂家维护人员处理'))
      else callback()
    }
    return {
      user: {
        username: ''
      },
      userRules: {
        username: [ { validator: checkUsernanme, trigger: 'blur', required: true } ]
      }
    }
  },
  mounted() {
    this.user.username = this.findPasswordUsername
  },
  methods: {
    handleNextStep() {
      const { username } = this.user
      this.$refs['user'].validate(valid => {
        if(valid) {
          this.setFindPasswordUsername(username)
          localStorage.setItem('findPasswordUsername', JSON.stringify(username))
          this.handleSetStepAndRouter({ step: 1, path: '/password_retrieve/step_two', type: 'push' })
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
