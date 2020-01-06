<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-excel-download
      v-if="hasAllPrisonQueryAuth"
      path="/download/exportPrisonStatical"
      :params="filter" />
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @searchSelectChange="searchSelectChange"
      @search="onSearch" />
    <el-col :span="24">
      <m-table-new
        stripe
        show-summary
        :summary-method="summaryMethod"
        :data="prisonAreaReportList.contents"
        :cols="tableCols">
        <template
          slot="total"
          slot-scope="scope">{{ scope.row.total }} 次</template>
        <template
          slot="finishedTotal"
          slot-scope="scope">{{ scope.row.finishedTotal }} 次</template>
        <template
          slot="canceledTotal"
          slot-scope="scope">{{ scope.row.canceledTotal }} 次</template>
        <template
          slot="expiredTotal"
          slot-scope="scope">{{ scope.row.expiredTotal }} 次</template>
        <template
          slot="deniedTotal"
          slot-scope="scope">{{ scope.row.deniedTotal }} 次</template>
      </m-table-new>
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
import prisonFilterCreator from '@/mixins/prison-filter-creator'

const startDate = Moment().subtract(1, 'months').format('YYYY-MM')
const endDate = Moment().subtract(1, 'months').format('YYYY-MM')
export default {
  mixins: [prisonFilterCreator],
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
          belong: {
            value: 'id',
            label: 'name'
          },
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
    ...mapState([
      'prisonAreaReportList',
      'jailPrisonAreas',
      'user'
    ]),
    summaryMethod() {
      return this.hasAllPrisonQueryAuth
        ? this.getSummariesAll
        : this.getSummaries
    },
    tableCols() {
      let allCols = [
        {
          label: '监狱名称',
          prop: 'jailName'
        },
        {
          label: '罪犯姓名',
          prop: 'prisonerName'
        },
        {
          label: '罪犯编号',
          prop: 'prisonerNumber'
        },
        {
          label: '监区',
          prop: 'prisonArea'
        },
        {
          label: '会见申请次数',
          prop: 'total',
          slotName: 'total'
        },
        {
          label: '会见完成次数',
          prop: 'finishedTotal',
          slotName: 'finishedTotal'
        },
        {
          label: '会见取消次数',
          prop: 'canceledTotal',
          slotName: 'canceledTotal'
        },
        {
          label: '会见过期次数',
          prop: 'expiredTotal',
          slotName: 'expiredTotal'
        },
        {
          label: '会见拒绝/撤回次数',
          prop: 'deniedTotal',
          slotName: 'deniedTotal'
        }
      ]
      if (!this.hasAllPrisonQueryAuth) allCols.splice(0, 1)
      return allCols
    }
  },
  mounted() {
    if (this.hasAllPrisonQueryAuth) {
      this.searchItems.prisonAreaId.getting = false
      this.getDatas()
    } else {
      this.getJailPrisonAreas({ jailId: JSON.parse(localStorage['user']).jailId }).then(res => {
        this.searchItems.prisonAreaId.options = this.jailPrisonAreas
        this.searchItems.prisonAreaId.options.push({ id: '无监区', name: '无监区' })
        this.searchItems.prisonAreaId.value = this.searchItems.prisonAreaId.options[0].id
        this.filter.prisonAreaId = this.searchItems.prisonAreaId.options[0].id
        this.searchItems.prisonAreaId.getting = false
        this.getDatas()
      })
    }
  },
  methods: {
    ...mapActions([
      'getPrisonAreaReportList',
      'getPrisonAreaReportListAll',
      'getJailPrisonAreas'
    ]),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.prisonArea = this.searchItems.prisonAreaId.options.find(o => o.id === this.filter.prisonAreaId)
      if (this.filter.prisonAreaId === '无监区' && this.searchItems.prisonAreaId.options.length === 1) delete this.filter.prisonAreaId
      else if (this.filter.prisonAreaId === '无监区' && this.searchItems.prisonAreaId.options.length > 1) this.filter.prisonAreaId = ''
      if (this.hasAllPrisonQueryAuth) {
        this.getPrisonAreaReportListAll({ ...this.filter, ...this.pagination }).then(res => {
          if (!res) return
          this.show = true
        })
      } else {
        this.getPrisonAreaReportList({ ...this.filter, ...this.pagination }).then(res => {
          if (!res) return
          this.show = true
        })
      }
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
    },
    getSummariesAll(params) {
      if (!this.show) return ''
      const { columns, data } = params
      if (!columns || !data.length) return ''
      const sums = []
      columns.forEach((column, index) => {
        if (index <= 3) {
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
    },
    // 覆盖 prison-filter-creator mixin
    createPrisonAreaFilter() {},
    // 覆盖 prison-filter-creator mixin
    async searchSelectChange(selectKey, value) {
      if (selectKey === 'jailId') {
        if (value) {
          await this.$store.dispatch('getJailPrisonAreas', { jailId: value })
          this.searchItems.prisonAreaId.options = this.$store.state.jailPrisonAreas
        }
        else {
          this.searchItems.prisonAreaId.options = []
        }

        this.searchItems.prisonAreaId.value = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
