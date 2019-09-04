<template>
  <el-button class="m-excel-download" type="primary" @click="onDownloadExcel">
    导出 Excel
  </el-button>
</template>

<script>
import qs from 'qs';
import urls from '@/service/urls';

export default {
  props: {
    path: String,
    params: Object
  },
  methods: {
    async onDownloadExcel() {
      const query = qs.stringify(this.params)
      const { apiHost, apiPath } = urls
      location.href = apiHost + apiPath + this.path + (query && '?' + query)
    }
  }
}
</script>