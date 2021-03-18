<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch" />
    <el-col :span="24">
      <el-table
        class="border"
        :data="tabledata.list"
        style="width: 100%">
            <el-table-column
            prop="monthName"
            label="月"
            width="150" />
            <el-table-column
            prop="name"
            label="姓名"
            width="150" />
            <el-table-column
            prop="prisonerNumber"
            label="编号"/>
            <el-table-column
            label="行政奖励">
                  <el-table-column
                    prop="praiseTimes"
                    label="表扬数">
                  </el-table-column>
                  <el-table-column
                    prop="materialAwardTimes"
                    label="物质奖励数">
                  </el-table-column>
                  <el-table-column
                    prop="meritTimes"
                    label="立功个数">
                  </el-table-column>
                  <el-table-column
                    prop="greatMeritTimes"
                    label="重大立功数">
                  </el-table-column>
            </el-table-column>
            <el-table-column
            label="行政处罚">
                  <el-table-column
                    prop="warnTimes"
                    label="警告个数"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="mistakeTimes"
                    label="记过个数"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="confinementTimes"
                    label="禁闭个数"
                    width="100">
                  </el-table-column>
            </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="tabledata.totalCount"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import http from '@/service'
import Moment from 'moment'
export default {
  data() {
    const MonthDate = Moment().format('YYYY-MM')
    return {
      tabledata:{},
      MonthDate,
      filterInit:{},
      searchItems: {
         date: {
          type: 'month',
          label: '时间',
          value: ''
        },
      }
    }
  },
  created() {
      this.filterInit = Object.assign({}, this.filterInit, { date: this.MonthDate })
    },
  async mounted() {
    this.$set(this.searchItems['date'], 'value', this.MonthDate)
    this.getDatas()
  },
  methods: {
    async getDatas() {
      let res = await http.getPrisonerBonusPenaltylist({ ...this.filter, ...this.pagination })
      this.tabledata= res.data
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(0)
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" >

#body .el-table.border th, #body .el-table td{
 border-bottom: 1px solid #e6e6e6
}
</style>
