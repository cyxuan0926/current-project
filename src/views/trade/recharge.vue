<template>
  <m-table-new
    stripe
    :data="contents"
    style="width: 100%"
    :cols="tableCols">
    <template #paymentType="{ row }">{{ row.paymentType | payType }}</template>
  </m-table-new>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      contents: state => state.trade.recharge.contents
    })
  },
  data() {
    return {
      tableCols: [
        {
          label: '手机号码',
          prop: 'phone'
        },
        {
          label: '订单编号',
          prop: 'tradeNo'
        },
        {
          label: '支付方式',
          slotName: 'paymentType'
        },
        {
          label: '支付成功时间',
          prop: 'gmtPayment'
        },
        {
          label: '订单总金额(元)',
          prop: 'amount'
        },
        {
          label: '备注',
          prop: 'callbackResults',
          showOverflowTooltip: true
        }
      ]
    }
  }
}
</script>