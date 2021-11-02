<template>
  <el-row class="main">
    <m-yg-prison-content :tabItems="tabsItems" :tabs.sync="$tabs" />
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

export default {
  setup(props) {
    const $tabs = ref('first')
    const tabsItems = reactive([
      {
        label: '亲情电话',
        name: 'first'
      },
      {
        label: '已通过',
        name: '1'
      },
      {
        label: '未通过',
        name: '-1'
      },
      {
        label: '待审核',
        name: '0'
      }
    ])
    watch($tabs, val => {
      console.log(1, val)
    })
    return {
      $tabs,
      tabsItems
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
