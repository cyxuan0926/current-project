<template>
  <m-table-new
    stripe
    :data="contents"
    style="width: 100%"
    :cols="tableCols">
    <template #money="{ row }">{{ row.money > 0 ? '+' + row.money : row.money }}</template>
    <template #createdAt="{ row }">{{ row.createdAt | Date }}</template>
    <template #chargeType="{ row }">{{ row.chargeType | chargeWays }}</template>
  </m-table-new>
</template>
<script>
import { mapState } from 'vuex'

// import { $likePhone } from '@/common/constants/const'
export default {
  computed: {
    ...mapState({
      contents: state => state.trade.consumption.contents
    })
  },
  data() {
    return {
      tableCols: [
        {
          label: '手机号码',
          prop: 'phone'
          // ...$likePhone
        },
        {
          label: '交易金额(元)',
          slotName: 'money'
        },
        {
          label: '交易场景时间',
          slotName: 'createdAt'
        },
        {
          label: '交易场景',
          prop: 'reason',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          label: '通话ID',
          prop: 'meetingId'
        },
        {
          label: '收费方式',
          slotName: 'chargeType'
        }
      ]
    }
  }
}
</script>