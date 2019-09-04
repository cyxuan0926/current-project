<template>
  <el-table
    :data="contents"
    border
    style="width: 100%">
    <el-table-column
      prop="phone"
      label="手机号码" />
    <el-table-column
      label="交易金额(元)">
      <template slot-scope="scope">
        {{ scope.row.money > 0 ? '+' + scope.row.money : scope.row.money }}
      </template>
    </el-table-column>
    <el-table-column
      prop="createdAt"
      label="交易场景时间">
      <template slot-scope="scope">
        {{ scope.row.createdAt | Date }}
      </template>
    </el-table-column>
    <el-table-column
      prop="reason"
      show-overflow-tooltip
      label="交易场景" />
    <el-table-column
      prop="meetingId"
      label="会见ID" />
  </el-table>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      contents: state => state.trade.consumption.contents
    })
  }
}
</script>