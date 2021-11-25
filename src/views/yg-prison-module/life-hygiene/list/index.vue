<template>
  <el-row class="el-row__prison-adminstration-list" :gutter="0">
    <m-yg-prison-content
      ref="$ygPrisonAdminstrationParent"
      :tabItems="$tabItems"
      :searchItems="searchItems"
      :tabs.sync="$tabs"
      :httpRequests="$httpRequests"
      :tableCols="$tableCols"
      :elTableConfigs="elTableConfigs"
    >
      <template #infoRecipeYearNum="{ row }">{{ row.yearNum }}</template>
    </m-yg-prison-content>
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

    const $tabs = ref('1')

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

    watch($tabs, val => {
       if(val==0){
        searchItems.prisonArea.miss= true
        searchItems.prisonerNumber.miss = true
        searchItems.prisonerName.miss = true
        searchItems.dateMonth.miss = false
      }else if(val==1){
        searchItems.prisonArea.miss= false
        searchItems.prisonerNumber.miss = false
        searchItems.prisonerName.miss = false
        searchItems.dateMonth.miss = false
      }else if(val==2){
          searchItems.prisonArea.miss= false
            searchItems.prisonerNumber.miss = false
            searchItems.prisonerName.miss = false
            searchItems.dateMonth.miss = false
      }else if(val == 3){
          searchItems.prisonArea.miss= false
            searchItems.prisonerNumber.miss = false
            searchItems.prisonerName.miss = false
            searchItems.dateMonth.miss = true
      }else if(val == 4){
          searchItems.prisonArea.miss= false
            searchItems.prisonerNumber.miss = false
            searchItems.prisonerName.miss = false
            searchItems.dateMonth.miss = false
      }
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
      elTableConfigs
    }
  }
}
</script>
