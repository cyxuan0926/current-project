<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col
      v-show="show"
      :span="24">
      <el-tabs
        value="first"
        type="card">
        <el-tab-pane
          label="监区会见统计"
          name="first" />
      </el-tabs>
      <el-table
        :data="prisonAreaReportList.contents"
        border
        show-summary
        :summary-method="getSummaries"
        style="width: 100%">
        <el-table-column
          prop="prisonerName"
          label="姓名" />
        <el-table-column
          prop="prisonerNumber"
          label="囚号" />
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
      v-show="show"
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
        // reportDate: Moment().subtract(1, 'months').format('YYYY-MM')
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
        // reportDate: {
        //   value: Moment().subtract(1, 'months').format('YYYY-MM'),
        //   type: 'month',
        //   label: '统计月份',
        //   canNotClear: true,
        //   pickerOptions: {
        //     disabledDate(time) {
        //       return Moment(time).format('YYYY-MM') > Moment().subtract(1, 'months').format('YYYY-MM')
        //     }
        //   }
        // },
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
        },
        prisonerName: {
          type: 'input',
          label: '服刑人员姓名'
        },
        prisonerNumber: {
          type: 'input',
          label: '服刑人员囚号'
        }
      }
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
      this.show = true
      if (this.filter.prisonAreaId === '无监区' && this.searchItems.prisonAreaId.options.length === 1) delete this.filter.prisonAreaId
      else if (this.filter.prisonAreaId === '无监区' && this.searchItems.prisonAreaId.options.length > 1) this.filter.prisonAreaId = ''
      this.getPrisonAreaReportList({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    getSummaries(params) {
      const { columns, data } = params
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.searchItems.prisonAreaId.options.find(o => o.id === this.searchItems.prisonAreaId.value).name || this.user.jailName
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

<style type="text/stylus" lang="stylus" scoped>
</style>
