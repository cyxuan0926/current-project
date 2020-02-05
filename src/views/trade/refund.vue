<template>
  <m-table-new
    stripe
    :data="contents"
    style="width: 100%"
    :cols="tableCols">
    <template #refund_type="{ row }">{{ row.refund_type | payType }}</template>
    <template #refund_date="{ row }">{{ row.refund_date | Date }}</template>
    <template #contents="{ row }">
      <span
        v-if="row.is_apply === 2"
        class="red" >{{ row.callback_results }}</span>
    </template>
  </m-table-new>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      contents: state => state.trade.refund.contents
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
          prop: 'trade_no',
          width: 166
        },
        {
          label: '退款编号',
          prop: 'refund_no',
          width: 166
        },
        {
          label: '退款方式',
          slotName: 'refund_type',
          width: 70
        },
        {
          label: '退款时间',
          slotName: 'refund_date',
          width: 126
        },
        {
          label: '订单总金额',
          prop: 'amount'
        },
        {
          label: '退款申请金额',
          prop: 'refund_money'
        },
        {
          label: '退款状态',
          prop: 'remark',
          width: 70
        },
        {
          label: '备注',
          slotName: 'contents',
          showOverflowTooltip: true
        }
      ]
    }
  }
}
</script>
