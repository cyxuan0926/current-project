<template>
  <div>
    <div class="passwore-retrieve__icon">
      <i class="el-icon-info">&nbsp;&nbsp;请输入你需要找回登陆密码的账户名</i>
    </div>
    <el-form :label-width="'30%'">
      <el-form-item label="用户名">
        <el-input
          placeholder="请输入你的用户名"
          clearable
          v-model="username" />
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      username: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
