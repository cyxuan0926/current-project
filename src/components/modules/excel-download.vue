<template>
  <el-button
    class="m-excel-download"
    @click="onDownloadExcel"
    v-bind="buttonsProps['attrs']"
    v-on="buttonsProps['listeners']"
  >
    {{ text }}
  </el-button>
</template>

<script>
import qs from 'qs';
import urls from '@/service/urls';
import { getFile } from '@/service/config/service'
import { saveAs } from 'file-saver'
import { helper } from '@/utils'

export default {
  props: {
    path: String,
    params: Object,
    text: {
      type: String,
      default: '导出 Excel'
    },

    buttonsProps: {
      type: Object,
      default: () => ({
        attrs: {
          type: 'primary'
        },
        listeners: {}
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

  methods: {
    async onDownloadExcel() {
      const { apiHostKey, apiPathKey } = this.apiConfigs

      const apiHost = urls[apiHostKey]

      const apiPath = urls[apiPathKey] || ''

      const params = this.params

      const query = qs.stringify(params)

      let res = await getFile(apiHost + apiPath + this.path + (query && '?' + query))

      const { headers } = res

      const originFileName = headers['content-disposition'] && decodeURIComponent(headers['content-disposition'].replace(/^attachment;filename=/g, ''))

      if (res && res.data) saveAs(res.data, originFileName || `${ this.$route.meta && this.$route.meta.breadcrumbName }-${ helper.DateFormat(Date.now(),'YYYYMMDDHHmmss') }.xls`)
    }
  }
}
</script>
