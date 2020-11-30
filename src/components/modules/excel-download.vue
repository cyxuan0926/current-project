<template>
  <el-button
    class="m-excel-download"
    type="primary"
    @click="onDownloadExcel"
  >
    {{ text }}
  </el-button>
</template>

<script>
import qs from 'qs';
import urls from '@/service/urls';

export default {
  props: {
    path: String,
    params: Object,
    text: {
      type: String,
      default: '导出 Excel'
    }
  },

  methods: {
    onDownloadExcel() {
      const { apiHost, apiPath } = urls

      const params = this.params

      const query = qs.stringify(params)

      location.href = apiHost + apiPath + this.path + (query && '?' + query)
    }
  }
}
</script>
