<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-tabs
        value="first"
        type="card">
        <el-tab-pane
          label="监狱会见统计"
          name="first" />
      </el-tabs>
      <el-table
        :data="prisonReportList.contents"
        border
        show-summary
        :summary-method="getSummaries"
        style="width: 100%">
        <el-table-column
          prop="prisonArea"
          label="监区" />
        <el-table-column
          prop="total"
          label="会见申请次数">
          <template slot-scope="scope">
            {{ scope.row.total }} 次
          </template>
        </el-table-column>
        <el-table-column
          prop="finishedTotal"
          label="会见成功次数">
          <template slot-scope="scope">
            {{ scope.row.finishedTotal }} 次
          </template>
        </el-table-column>
        <el-table-column
          prop="canceledTotal"
          label="会见取消次数">
          <template slot-scope="scope">
            {{ scope.row.canceledTotal }} 次
          </template>
        </el-table-column>
        <el-table-column
          prop="expiredTotal"
          label="会见过期次数">
          <template slot-scope="scope">
            {{ scope.row.expiredTotal }} 次
          </template>
        </el-table-column>
        <el-table-column
          prop="deniedTotal"
          label="会见拒绝/撤回次数">
          <template slot-scope="scope">
            {{ scope.row.deniedTotal }} 次
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="prisonReportList.total"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Moment from 'moment'
const startDate = Moment().subtract(1, 'months').format('YYYY-MM')
const endDate = Moment().subtract(1, 'months').format('YYYY-MM')
export default {
  data() {
    return {
      tabNum: 'first',
      filterInit: { // 默认查询上一个月的，筛选框初始化
        startDate: startDate,
        endDate: endDate
      },
      searchItems: {
        reportRange: {
          type: 'monthRangeSelector',
          canNotClear: true,
          startValue: startDate,
          endValue: endDate,
          startKey: 'startDate',
          endKey: 'endDate',
          range: {
            min: Moment().subtract(24, 'months').format('YYYY-MM'),
            max: Moment().subtract(1, 'months').format('YYYY-MM')
          }
        }
      }
    }
  },
  computed: {
    ...mapState(['prisonReportList', 'user'])
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions(['getPrisonReportList']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.getPrisonReportList({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    getSummaries(params) {
      const { columns, data } = params
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.user.jailName
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            }
            else {
              return prev
            }
          }, 0)
          sums[index] += ' 次'
        }
        else {
          sums[index] = 'N/A'
        }
      })
      return sums
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>
