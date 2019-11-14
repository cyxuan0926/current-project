<template>
  <el-button
    class="m-excel-export"
    type="primary"
    :loading="loading"
    @click="onDownload"
  >
    导出 Excel
  </el-button>
</template>

<script>
// 参考 https://github.com/PanJiaChen/vue-element-admin
export default {
  props: {
    jsonData: Array,
    header: Array,
    filterFields: Array,
    filename: {
      type: Object,
      default: () => ({ value: '导出 Excel' })
    },
    bookType: {
      type: String,
      default: 'xlsx'
    },
    autoWidth: {
      type: Boolean,
      default: true
    },
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    onDownload() {
      this.loading = true

      import('@/utils/excel-export').then(excel => {
        const {
          jsonData,
          header,
          filterFields,
          formatData,
          filename,
          bookType,
          autoWidth,
        } = this;

        excel.export_json_to_excel({
          header,
          data: formatData(jsonData, filterFields),
          filename: filename.formater ? filename.formater(filename.value) : filename.value ,
          bookType,
          autoWidth
        })
        this.loading = false
      })
    },
    formatData(jsonData, filterFields) {
      return jsonData.map(item => {
        return filterFields.map(field => {
          if (field.formater) {
            if (field.key instanceof Array) {
              return field.formater(this.getValues(item, field.key))
            } else {
              return field.formater(item[field.key])
            }
          } else {
            return item[field.key]
          }
        })
      })
    },
    getValues(obj, keys) {
      const values = []

      keys.forEach(key => values.push(obj[key]))
      return values
    }
  }
}
</script>