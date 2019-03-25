<template>
  <div>
    <el-table
      :data="contents"
      border
      @cell-click="handleClick"
      :row-class-name="rowClass">
      <el-table-column
        prop="phone"
        label="手机号码" />
      <el-table-column
        prop="balance"
        label="账户余额(元)" />
      <el-table-column
        prop="recharge"
        label="充值金额(元)" />
      <el-table-column
        prop="consume"
        label="消费金额(元)" />
      <el-table-column
        prop="preConsume"
        label="预消费金额(元)" />
      <el-table-column
        prop="refund"
        label="已退款金额(元)" />
      <el-table-column
        prop="refundable"
        label="可退款金额(元)" />
      <el-table-column
        prop="transferMoney"
        label="需转账金额(元)" />
      <el-table-column
        prop="contents"
        label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark ? (scope.row.remark > 0 ? '+' + scope.row.remark : scope.row.remark) : '' }}
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="账户余额"
      :visible.sync="dialogTableVisible"
      v-if="dialogTableVisible">
      <!-- <div>
        手机号码：{{ accountDetail[0].phone }}
      </div> -->
      <el-table
        :data="accountDetail"
        max-height="400"
        border>
        <el-table-column
          property="phone"
          label="手机号码" />
        <el-table-column
          property="jailName"
          label="监狱名称" />
        <el-table-column
          property="balance"
          label="账户余额(元)" />
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      contents: state => state.trade.account.contents
    })
  },
  data() {
    return {
      dialogTableVisible: false,
      rowClass: ({ row, rowIndex }) => {
        if (row.remark > 0) {
          return 'table-row-blue'
        }
        else if (row.remark < 0) {
          return 'table-row-red'
        }
      },
      accountDetail: []
    }
  },
  methods: {
    ...mapActions(['getAccountDetail']),
    handleClick(row, column) {
      console.log(row, column)
      if (column.property !== 'balance') return
      console.log()
      this.getAccountDetail({ phone: row.phone }).then(res => {
        if (!res) return
        this.accountDetail = res
        console.log(res)
        this.dialogTableVisible = true
      })
    }
  }
}
</script>