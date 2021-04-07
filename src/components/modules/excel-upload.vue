<template>
  <el-upload
    ref="upload"
    :headers="headers"
    class="el-upload__excel"
    :multiple="false"
    accept=".xls,.xlsx"
    :on-success="getResults"
    :on-error="handleError"
    :action="actionsUrl"
    v-bind="configs['attrs']"
  >
    <el-button slot="trigger" type="primary">{{ text }}</el-button>
</el-upload>
</template>
<script>
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
    'get-results': {
      type: Function,
      default: () => () => {}
    },
    'handle-error': {
      type: Function,
      default: () => () => {}
    },
    headers: {
      type: Object,
      default: function() {
        const { access_token, token_type } = this.$store.state.account.accountInfo
        return {
          Authorization: `${ token_type } ${ access_token }`
        }
      }
    },

    configs: {
      type: Object,
      default: () => ({
        attrs: {}
      })
    },

    apiConfigs: {
      type: Object,
      default: () => ({
        apiHostKey: 'apiHost',
        apiPathKey: 'apiPath'
      })
    }
  },

  computed: {
    actionsUrl() {
      const { apiHostKey, apiPathKey } = this.apiConfigs

      const apiHost = this.$urls[apiHostKey]

      const apiPath = this.$urls[apiPathKey] || ''

      return `${apiHost}${apiPath}${this.url}`
    }
  },

  methods: {
    onManualUpload() {
      this.$refs.upload.submit()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-upload__excel {
  margin-bottom: 0px !important;
  // margin-left: 10px !important;
  /deep/ .el-upload-list {
    display: none !important;
  }
}
</style>