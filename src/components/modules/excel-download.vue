<template>
  <el-button class="m-excel-download" type="primary" @click="onDownloadExcel">
    导出 Excel
  </el-button>
</template>

<script>
// import globalApi from '@/service/modules/global'
import qs from 'qs';
import urls from '@/service/urls';

export default {
  props: {
    path: String,
    params: Object
  },
  methods: {
    async onDownloadExcel() {
      // await globalApi.downloadExcel(this.path, this.params)
      const query = qs.stringify(this.params)
      console.log(urls.apiHost + this.path + (query && '?' + query))
      location.href = urls.apiHost + this.path + (query && '?' + query)
      // window.open(urls.apiHost + this.path + (query && '?' + query))
    }
  }
}
</script>