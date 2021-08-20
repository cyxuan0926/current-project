<template>
  <div>
    <m-table-new
      stripe
      :data="contents"
      @cell-click="handleClick"
      :cell-style="cellStyle"
      :cols="tableCols">
      <template #balance="{ row }">{{ row.balance | fixedNumber }}</template>
      <template #recharge="{ row }">{{ row.recharge | fixedNumber }}</template>
      <template #consume="{ row }">{{ row.consume | fixedNumber }}</template>
      <template #preConsume="{ row }">{{ row.preConsume | fixedNumber }}</template>
      <template #refund="{ row }">{{ row.refund | fixedNumber }}</template>
      <template #refundable="{ row }">{{ row.refundable | fixedNumber }}</template>
      <template #transferMoney="{ row }">{{ row.transferMoney | fixedNumber }}</template>
      <template #contents="{ row }">{{(row.remark ? (row.remark > 0 ? '+' + row.remark : row.remark) : '' )}}</template>
    </m-table-new>
    <el-dialog
      title="账户余额"
      :visible.sync="dialogTableVisible"
      v-if="dialogTableVisible">
      <!-- <div>
        手机号码：{{ accountDetail[0].phone }}
      </div> -->
      <m-table-new
        stripe
        :data="accountDetail"
        max-height="400"
        :cols="dialogTableCols">
        <template #balance="{ row }">{{ row.balance | fixedNumber }}</template>
      </m-table-new>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'

import { $likePhone } from '@/common/constants/const'

export default {
  computed: {
    ...mapState({
      contents: state => state.trade.account.contents
    })
  },
  data() {
    return {
      dialogTableVisible: false,
      cellStyle: ({ row }) => {
        if (row.remark > 0) {
          return {
            background: '#81cdf1'
          }
        }
        else if (row.remark < 0) {
          return {
            background: '#ffbdbf'
          }
        }
      },
      accountDetail: [],
      tableCols: [
        {
          label: '手机号码',
          prop: 'phone',
          ...$likePhone
        },
        {
          label: '账户余额(元)',
          prop: 'balance',
          slotName: 'balance'
        },
        {
          label: '充值金额(元)',
          prop: 'recharge',
          slotName: 'recharge'
        },
        {
          label: '消费金额(元)',
          prop: 'consume',
          slotName: 'consume'
        },
        {
          label: '预消费金额(元)',
          prop: 'preConsume',
          slotName: 'preConsume'
        },
        {
          label: '已退款金额(元)',
          prop: 'refund',
          slotName: 'refund'
        },
        {
          label: '可退款金额(元)',
          prop: 'refundable',
          slotName: 'refundable'
        },
        {
          label: '需转账金额(元)',
          prop: 'transferMoney',
          slotName: 'transferMoney'
        },
        {
          label: '备注',
          prop: 'contents',
          slotName: 'contents'
        }
      ],
      dialogTableCols: [
        {
          label: '手机号码',
          prop: 'phone'
        },
        {
          label: '监狱名称',
          prop: 'jailName'
        },
        {
          label: '账户余额(元)',
          prop: 'balance',
          slotName: 'balance'
        }
      ]
    }
  },
  methods: {
    ...mapActions(['getAccountDetail']),
    handleClick(row, column) {
      if (column.property !== 'balance') return
      this.getAccountDetail({ phone: row.phone }).then(res => {
        if (!res) return
        this.accountDetail = res
        this.dialogTableVisible = true
      })
    }
  }
}
</script>