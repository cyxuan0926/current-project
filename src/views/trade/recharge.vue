<template>
  <el-table
    :data="contents"
    border
    style="width: 100%">
    <el-table-column
      prop="phone"
      label="手机号码" />
    <el-table-column
      prop="tradeNo"
      label="订单编号" />
    <el-table-column
      label="支付方式">
      <template slot-scope="scope">
        {{ scope.row.paymentType | payType }}
      </template>
    </el-table-column>
    <el-table-column
      prop="gmtPayment"
      label="支付成功时间">
    </el-table-column>
    <el-table-column
      prop="amount"
      label="订单总金额(元)">
    </el-table-column>
    <el-table-column
      prop="callbackResults"
      label="备注" />
  </el-table>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      contents: state => state.trade.recharge.contents
    })
  }
}
</script>