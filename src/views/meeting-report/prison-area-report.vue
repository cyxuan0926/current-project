<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-table
        :data="prisonAreaReportList.contents"
        border
        show-summary
        :summary-method="getSummaries"
        style="width: 100%">
        <el-table-column
          prop="prisonerName"
          label="罪犯姓名" />
        <el-table-column
          prop="prisonerNumber"
          label="罪犯编号" />
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
          label="会见完成次数">
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
      :total="prisonAreaReportList.total"
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
      show: false,
      filterInit: { // 默认查询上一个月的，筛选框初始化
        startDate: startDate,
        endDate: endDate
      },
      searchItems: {
        prisonAreaId: {
          type: 'select',
          label: '监区',
          value: '',
          canNotClear: true,
          getting: true,
          belong: { value: 'id', label: 'name' },
          filterable: true,
          options: []
        },
        reportRange: {
          type: 'monthRangeSelector',
          canNotClear: true,
          startValue: startDate,
          endValue: endDate,
          startKey: 'startDate',
          endKey: 'endDate',
          range: {
            max: Moment().subtract(1, 'months').format('YYYY-MM'),
            maxMonthRange: 24
          }
        },
        prisonerName: {
          type: 'input',
          label: '罪犯姓名'
        },
        prisonerNumber: {
          type: 'input',
          label: '罪犯编号'
        }
      },
      prisonArea: {}
    }
  },
  computed: {
    ...mapState(['prisonAreaReportList', 'jailPrisonAreas', 'user'])
  },
  mounted() {
    this.getJailPrisonAreas({ jailId: JSON.parse(localStorage['user']).jailId }).then(res => {
      this.searchItems.prisonAreaId.options = this.jailPrisonAreas
      this.searchItems.prisonAreaId.options.push({ id: '无监区', name: '无监区' })
      this.searchItems.prisonAreaId.value = this.searchItems.prisonAreaId.options[0].id
      this.filter.prisonAreaId = this.searchItems.prisonAreaId.options[0].id
      this.searchItems.prisonAreaId.getting = false
      this.getDatas()
    })
  },
  methods: {
    ...mapActions(['getPrisonAreaReportList', 'getJailPrisonAreas']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.prisonArea = this.searchItems.prisonAreaId.options.find(o => o.id === this.filter.prisonAreaId)
      if (this.filter.prisonAreaId === '无监区' && this.searchItems.prisonAreaId.options.length === 1) delete this.filter.prisonAreaId
      else if (this.filter.prisonAreaId === '无监区' && this.searchItems.prisonAreaId.options.length > 1) this.filter.prisonAreaId = ''
      this.getPrisonAreaReportList({ ...this.filter, ...this.pagination }).then(res => {
        if (!res) return
        this.show = true
      })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    getSummaries(params) {
      if (!this.show) return ''
      const { columns, data } = params
      if (!columns || !data.length) return ''
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.prisonArea.name || this.user.jailName
          return
        }
        else if (index <= 2) {
          sums[index] = ''
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

<style lang="scss" scoped>
</style>
