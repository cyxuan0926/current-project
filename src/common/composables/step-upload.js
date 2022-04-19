import { ref, toRefs, computed } from '@vue/composition-api'

export default function(props) {
  const { httpRequests, excelExportButtonProps, dialogExcelDownloadRequest } = toRefs(props)

  const status = ref(0)
  const spendTime = ref(0)
  const percent = ref(0)

  const objectReduce = (objectValue, defaultValue) => {
    return Object.entries(objectValue).reduce((accumulator, [key, value]) => {
      let temp = value || {}

      if (defaultValue[key]) {
        temp = Object.assign({}, defaultValue[key], value)
      }

      accumulator = {
        ...accumulator,
        [key]: temp
      }
    }, {})
  }

  // computed
  const $httpRequests = computed(() => {
    const defaultValue = {
      excelDownloadRequest: {
        path: '/download/common/download',

        params: {
          fileName: ''
        },

        text: '模版',

        apiConfigs: {
          apiHostKey: 'ygApiHost',
          apiPathKey: 'temp'
        }
      }
    }

    return objectReduce(httpRequests.value, defaultValue)
  })

  const $dialogExcelDownloadRequest = computed(() => {
    return Object.assign({}, {
      path: '/download/common/download',

      apiConfigs: {
        apiHostKey: 'ygApiHost',
        apiPathKey: 'temp'
      },

      text: '导入失败的数据.xls'
    }, dialogExcelDownloadRequest.value)
  })

  // 失败数据excel导出按钮属性
  const $excelExportButtonProps = computed(() => {
    const defaultValue = {
      attrs: {
        type: "text",
      }
    }
  
    return objectReduce(excelExportButtonProps.value, defaultValue)
  })

  return {
    status,
    spendTime,
    percent,
    $httpRequests,
    $excelExportButtonProps,
    $dialogExcelDownloadRequest
  }
}