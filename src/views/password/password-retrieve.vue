<template>
  <el-card
    class="password-retrieve__card"
    shadow="hover">
    <div slot="header">
      <el-button
        type="text"
        @click="handleSetStepAndRouter({ path: '/login' })">狱务通</el-button>
      <span>{{ $route.meta.step === 3 ? '设置新密码' : '找回密码' }}</span>
    </div>
    <router-view />
  </el-card>
</template>
<script>
import passwordMixins from './mixins/password-mixins'
export default {
  mixins: [passwordMixins]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.password-retrieve__card {
  width: 60%;
  margin: 4% auto;
  .el-card__header {
    padding: 6px 18px;
    background-color: #f2f2f2;
  & .el-button--text {
      font-size: 18px;
      color: black; 
    }
    span {
      margin-left: 12px;
    } 
  }
  & .el-card__body {
    & .el-form {
        padding: 20px 0px;
        .el-input {
          width: 60%;
        }
      .el-button--primary {
          padding: 11px 6%;
          &:nth-last-child(1):first-child{
            margin-left: 43%;
          }
          &:first-child {
            margin-left: 23%;
          }
          & + .el-button {
            margin-left: 2%;
          }
        }
      }
      .button-box {
        width: 73%;
        .el-button--primary {
          padding: 11px 6%;
          &:first-child {
            margin-left: 23%;
          }
          & + .el-button {
            margin-left: 2%;
          }
        }
      }
  }
  & .passwore-retrieve__icon{
    padding: 22px 23% 0px;
    .el-icon-info:before {
      font-size: 16px;
      color: #409EFF;
    }
  }
}
</style>
