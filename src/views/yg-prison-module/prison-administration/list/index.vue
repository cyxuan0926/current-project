<template>
  <el-row class="el-row__prison-adminstration-list" :gutter="0">
    <m-yg-prison-content
      ref="$ygPrisonAdminstrationParent"
      :tabItems="$tabItems"
      :searchItems.sync="searchItems"
      :tabs.sync="$tabs"
      :httpRequests="$httpRequests"
      :tableCols="$tableCols"
    />
  </el-row>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  watch
} from '@vue/composition-api'

import {
  tabItems,
  _searchItems,
  httpRequests,
  _tableCols
} from '../constants'

import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'PrisonAdminstrationList',

  setup() {
    const $ygPrisonAdminstrationParent = ref(null)

    const searchItems = reactive(cloneDeep(_searchItems))

    const $tabs = ref('0')

    const $tabItems = reactive(tabItems)

    const $httpRequests = computed(() => {
      return Object.entries(httpRequests).reduce((accumulator, [key, value]) => {
        let temp = value

        if (['pagedRequest', 'excelExportRequest', 'excelUploadRequest'].includes(key)) {
          temp['params'] = {
            ...value['params'],
            tab: $tabs.value
          }
        }

        if (['excelDownloadRequest'].includes(key)) temp = value[$tabs.value]

        accumulator[key] = {
          ...accumulator[key],
          ...temp
        }
        return accumulator
      }, {})
    })

    const $tableCols = computed(() => _tableCols[$tabs['value']])

    const $hasProvinceQueryAuth = computed(() => hasProvinceQueryAuth)

    const $hasAllPrisonQueryAuth = computed(() => hasAllPrisonQueryAuth)

    const $hasPrisonAreaAuth = computed(() => hasPrisonAreaAuth)

    watch($tabs, val => {
      $ygPrisonAdminstrationParent.value.initData()
    })

    return {
      $ygPrisonAdminstrationParent,
      searchItems,
      $tabs,
      $tabItems,
      $httpRequests,
      $tableCols
    }
  }
}
</script>
