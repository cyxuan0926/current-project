<template>
  <div>
    <el-form :label-width="'30%'">
      <el-form-item label="新密码">
        <el-input
          placeholder="请输入新密码"
          show-password
          clearable
          v-model="newPassword" />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input
          placeholder="请输入确认密码"
          show-password
          clearable
          v-model="checkPassword" />
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary">确定</el-button>
        <el-button type="primary">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      newPassword: '',
      checkPassword: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >

</style>
