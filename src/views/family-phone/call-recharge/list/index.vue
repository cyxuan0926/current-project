<template>
  <el-row class="el-row__call-recharge-list" :gutter="0">
    <m-yg-prison-content
      ref="$callRechargeParent"
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
  name: 'CallRechargeList',

  setup() {
    const $callRechargeParent = ref(null)

    const searchItems = ref(_.cloneDeep(_searchItems))

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
      if (val === '0') searchItems.value.types.miss = false

      else if (val === '1') searchItems.value.types.miss = true

      $callRechargeParent.value && $callRechargeParent.value.initData()
    })

    return {
      $callRechargeParent,
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
