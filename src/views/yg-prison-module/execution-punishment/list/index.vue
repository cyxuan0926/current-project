<template>
  <el-row class="el-row__execution-punishment-list" :gutter="0">
    <m-yg-prison-content
      ref="$ygExecutionPunishmentParent"
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
  watch
} from '@vue/composition-api'

import {
  tabItems,
  _searchItems,
  httpRequests,
  _tableCols
} from '../constants'

import useRouteProps from '@/common/composables/useRouteProps'
export default {
  name: 'ExecutionPunishmentList',

  setup() {
    const $ygExecutionPunishmentParent = ref(null)

    const searchItems = reactive(_.cloneDeep(_searchItems))

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

    const { routeProps } = useRouteProps()

    watch($tabs, val => {
      $ygExecutionPunishmentParent.value.initData()
    })

    return {
      $ygExecutionPunishmentParent,
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
