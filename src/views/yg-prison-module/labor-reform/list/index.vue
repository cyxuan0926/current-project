<template>
  <el-row class="el-row__prison-adminstration-list" :gutter="0">
    <m-yg-prison-content
      ref="$ygPrisonAdminstrationParent"
      :tabItems="$tabItems"
      :ygSearchItems.sync="searchItems"
      :tabs.sync="$tabs"
      :httpRequests="$httpRequests"
      :tableCols="$tableCols"
      v-bind="routeProps"
    />
  </el-row>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  toRefs,
  watch,
  toRef
} from '@vue/composition-api'

import {
  tabItems,
  _searchItems,
  httpRequests,
  _tableCols
} from '../constants'


import useRouteProps from '@/common/composables/useRouteProps'
export default {
  name: 'PrisonAdminstrationList',

  setup() {
    const $ygPrisonAdminstrationParent = ref(null)

    const searchItems = ref(_.cloneDeep(_searchItems))

    const $tabs = ref('0')

    const $tabItems = reactive(tabItems)

    const $httpRequests = computed(() => {
      return Object.entries(httpRequests).reduce((accumulator, [key, value]) => {
        let temp = value
        // if (['excelExportRequest', ].includes(key)) {
        //   temp['params'] = {
        //     ...value['params'],
        //     tab: $tabs.value
        //   }
        // }
        if (['pagedRequest','excelExportRequest','excelUploadRequest','excelDownloadRequest'].includes(key)) temp = value[$tabs.value]
        accumulator[key] = {
          ...accumulator[key],
          ...temp
        }
        return accumulator
      }, {})
    })

    const $tableCols = computed(() => _tableCols[$tabs['value']])

    const { routeProps } = useRouteProps()

    watch($tabs, val => {
      $ygPrisonAdminstrationParent.value && $ygPrisonAdminstrationParent.value.initData()
    })

    return {
      $ygPrisonAdminstrationParent,
      searchItems,
      $tabs,
      $tabItems,
      $httpRequests,
      $tableCols,
      routeProps
    }
  }
}
</script>
