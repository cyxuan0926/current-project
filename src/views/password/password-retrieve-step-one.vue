<template>
  <div>
    <div class="passwore-retrieve__icon">
      <i class="el-icon-info">&nbsp;&nbsp;请输入你需要找回登陆密码的账户名</i>
    </div>
    <el-form
      :label-width="'30%'"
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
          @click="handleNextStep">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

import { mapActions, mapState } from 'vuex'
import { getUserSecurityQuestions } from '@/service-public/api/account'
export default {
  data () {
    let checkUsernanme = async (rule, value, callback) => {
      console.log(rule, value)
      let res
      if (this.$route.params.username) res = await getUserSecurityQuestions({ username: this.$route.params.username })
      if (!value) callback(new Error('请输入用户名'))
    }
    return {
      user: {
        username: ''
      },
      userRules: {
        username: [ { validator: checkUsernanme, trigger: 'blur' } ]
      }
    }
  },
  mounted() {
    this.user.username = this.$route.params.username
  },
  methods: {
    ...mapActions('account', ['estimateUsername']),
    handleNextStep() {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
