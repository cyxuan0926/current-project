<template>
  <el-table
    :data="contents"
    border
    style="width: 100%">
    <el-table-column
      prop="phone"
      label="手机号码" />
    <el-table-column
      prop="trade_no"
      label="订单编号" />
    <el-table-column
      prop="refund_no"
      label="退款编号" />
    <el-table-column
      label="退款方式">
      <template slot-scope="scope">
        {{ scope.row.refund_type | payType }}
      </template>
    </el-table-column>
    <el-table-column
      label="退款时间">
      <template slot-scope="scope">
        {{ scope.row.refund_date | Date }}
      </template>
    </el-table-column>
    <el-table-column
      prop="amount"
      label="订单总金额(元)" />
    <el-table-column
      prop="refund_money"
      label="退款申请金额(元)" />
    <el-table-column
      prop="remark"
      label="退款状态" />
    <el-table-column
      label="备注">
      <template slot-scope="scope">
        <span
          class="red" v-if="scope.row.is_apply === 2">{{ scope.row.callback_results }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      contents: state => state.trade.refund.contents
    })
  }
}
</script>
