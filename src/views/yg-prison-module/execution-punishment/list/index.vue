<template>
  <el-row class="el-row__execution-punishment-list" :gutter="0">
    <m-yg-prison-content
      ref="$ygExecutionPunishmentParent"
      :tabItems="$tabItems"
      :searchItems="searchItems"
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
  name: 'ExecutionPunishmentList',

  setup(props) {
    const $ygExecutionPunishmentParent = ref(null)

    const searchItems = reactive(cloneDeep(_searchItems))

    const $tabs = ref('0')

    const $tabItems = reactive(tabItems)

    const $httpRequests = computed(() => {
      return Object.entries(httpRequests).reduce((accumulator, [key, value]) => {
        let temp = value

        if (['excelDownloadRequest'].includes(key)) temp = value[$tabs.value]

        accumulator[key] = {
          ...accumulator[key],
          ...temp
        }

        return accumulator
      }, {})
    })

    const $tableCols = computed(() => _tableCols[$tabs['value']])

    watch($tabs, val => {
      $ygExecutionPunishmentParent.value.initData()
    })

    return {
      $ygExecutionPunishmentParent,
      searchItems,
      $tabs,
      $tabItems,
      $httpRequests,
      $tableCols
    }
  }
}
</script>
