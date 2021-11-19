<template>
  <el-row class="el-row__prison-adminstration-list" :gutter="0">
    <m-yg-prison-content
      ref="$ygPrisonAdminstrationParent"
      :tabItems="$tabItems"
      :parentSearchItems="searchItems"
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
  onMounted,
  computed,
  toRefs,
  watch,
  toRef
} from '@vue/composition-api'

import prisonFilterCreator from '@/mixins/prison-filter-creator'

import {
  tabItems,
  _searchItems,
  httpRequests,
  _tableCols
} from '../constants'
export default {
  name: 'PrisonAdminstrationList',

  mixins: [prisonFilterCreator],

  setup() {
    const $ygPrisonAdminstrationParent = ref(null)

    const searchItems = reactive(_searchItems)

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

<style lang="scss" scoped>
</style>
