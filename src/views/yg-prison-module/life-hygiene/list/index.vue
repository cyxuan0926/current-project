<template>
  <el-row class="el-row__prison-adminstration-list" :gutter="0">
    <m-yg-prison-content
      ref="$ygPrisonAdminstrationParent"
      :tabItems="$tabItems"
      :ygSearchItems.sync="searchItems"
      :tabs.sync="$tabs"
      :httpRequests="$httpRequests"
      :tableCols="$tableCols"
      :elTableConfigs="elTableConfigs"
      v-bind="routeProps"
    >
      <template #infoRecipeYearNum="{ row }">{{ row.yearNum }}</template>
    </m-yg-prison-content>
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

    const $tabs = ref('1')

    const $tabItems = reactive(tabItems)

    const $httpRequests = computed(() => {
      return Object.entries(httpRequests).reduce((accumulator, [key, value]) => {
        let temp = value

        if (['pagedRequest','excelExportRequest','excelUploadRequest','excelDownloadRequest'].includes(key)) {
          temp = value[$tabs.value]
        }

        accumulator = {
          ...accumulator,
          [key]: temp
        }

        return accumulator
      }, {})
    })

    const $tableCols = computed(() => _tableCols[$tabs['value']])

    const onTableSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
      if ($tabs.value !== '0') return {
        rowspan: 1,
        colspan: 1
      }

      else {
        if (['monthNum'].includes(column.property)) {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    }

    const elTableConfigs = reactive({
      _$attrs: {
        spanMethod: onTableSpanMethod
      }
    })

    const { routeProps } = useRouteProps()

    watch($tabs, val => {
      searchItems.value.prisonArea.miss= false

      searchItems.value.prisonerNumber.miss = false

      searchItems.value.prisonerName.miss = false

      searchItems.value.dateMonth.miss = false

      if (val === '0') {
        searchItems.value.prisonArea.miss= true

        searchItems.value.prisonerNumber.miss = true

        searchItems.value.prisonerName.miss = true
      } else if (val === '3') searchItems.value.dateMonth.miss = true

      $ygPrisonAdminstrationParent.value && $ygPrisonAdminstrationParent.value.initData()
    }, {
      immediate: true
    })

    return {
      $ygPrisonAdminstrationParent,
      searchItems,
      $tabs,
      $tabItems,
      $httpRequests,
      $tableCols,
      elTableConfigs,
      routeProps
    }
  }
}
</script>
