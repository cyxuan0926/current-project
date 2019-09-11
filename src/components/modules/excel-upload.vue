<template>
  <el-upload
    :headers="headers"
    class="el-upload__excel"
    :multiple="false"
    accept=".xls,.xlsx"
    :on-success="handleSuccess"
    :on-error="handleError"
    :action="actionsUrl">
  <el-button
    type="primary">
    {{ text }}
  </el-button>
</el-upload>
</template>
<script>
import { Message } from 'element-ui'
export default {
  props: {
    text: {
      type: String,
      default: '导入'
    },
    url: {
      type: String,
      default: ''
    },
    headers: {
      type: Object,
      default: function() {
        const { access_token, token_type } = this.$store.state.account.accountInfo
        return {
          Authorization: `${ token_type } ${ access_token }`
        }
      }
    }
  },
  computed: {
    actionsUrl() {
      return `${this.$urls.apiHost}${this.$urls.apiPath}${this.url}`
    }
  },
  methods: {
    tips(msg = '操作失败！', type = 'error') {
      Message({
        showClose: true,
        message: msg,
        duration: 3000,
        type: type
      })
    },
    handleSuccess(response) {
      const type = response.code === 200 ? 'success' : 'error'
      this.tips(response.msg, type)
      if (response.code === 200) this.$emit('onGetUploadResults', response.data)
    },
    handleError(error) {
      this.tips(error.message)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-upload__excel {
  margin-bottom: 0px !important;
  margin-left: 10px !important;
  /deep/ .el-upload-list {
    display: none !important;
  }
}
</style>