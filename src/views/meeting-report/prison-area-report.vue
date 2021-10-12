<template>
  <el-row class="row-container" :gutter="0">
    <m-excel-download
      v-if="hasAllPrisonQueryAuth"
      path="/download/newExportPrisonStatical"
      :params="filter"
    />
    <m-excel-download
      v-if="!hasAllPrisonQueryAuth"
      path="/download/exportPrisonAreaReport"
      :params="filter"
    />

    <m-search
      ref="search"
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    />

    <el-col :span="24">
      <!--  show-summary :summary-method="summaryMethod" --> 
      <m-table-new
        stripe
        :data="prisonAreaReportList.contents"
        :cols="tableCols"
      >
        <template #num="{ row }">{{ row.num || 0 }} 次</template>

        <template #pending="{ row }">{{ row.pending || 0 }} 次</template>

        <template #passed="{ row }"> {{ row.passed || 0 }} 次</template>

        <template #finished="{ row }">{{ row.finished || 0 }} 次</template>

        <template #canceled="{ row }">{{ row.canceled || 0 }} 次</template>

        <template #expired="{ row }">{{ row.expired || 0 }} 次</template>
        <template #authToExpired="{ row }">{{ row.authToExpired || 0 }} 次</template>

        <template #denied="{ row }">{{ row.denied || 0 }} 次</template>

        <template #meetingOn="{ row }"> {{ row.meetingOn || 0 }} 次</template>

        <template #ended="{ row }"> {{ row.ended || 0 }} 次</template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="prisonAreaReportList.total"
      @onPageChange="getDatas"
    />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Moment from 'moment'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import { Message } from 'element-ui'


const startDate = Moment().subtract(1, 'months').format('YYYY-MM-DD')
const endDate = Moment().format('YYYY-MM-DD')

import { $likeName, $likePrisonerNumber } from '@/common/constants/const'
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
          getting: true,
          belong: {
            value: 'id',
            label: 'name'
          },
          filterable: true,
          options: []
        },

        reportRange: {
          type: 'dateRange',
          unlinkPanels: true,
          start: 'startDate',
          end: 'endDate',
          startPlaceholder: '通话开始时间',
          endPlaceholder: '通话结束时间',
          value: [startDate, endDate]
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
          label: '省份',
          prop: 'provinceName'
        },

        {
          label: '监狱名称',
          prop: 'jailName',
          showOverflowTooltip: true
        },

        {
          label: '罪犯姓名',
          prop: 'prisonerName',
          ...$likeName
        },

        {
          label: '罪犯编号',
          prop: 'prisonerNumber',
          ...$likePrisonerNumber
        },

        {
          label: '监区',
          prop: 'prisonArea',
          showOverflowTooltip: true
        },

        {
          label: '申请次数（次）',
          prop: 'num',
          slotName: 'num'
        },

        {
          label: '未授权次数（次）',
          prop: 'pending',
          slotName: 'pending'
        },

        {
          label: '待通话次数（次）',
          prop: 'passed',
          slotName: 'passed'
        },
        {
          label: '已拒绝/撤回次数（次）',
          prop: 'denied',
          slotName: 'denied'
        },
        {
          label: '未审核过期次数（次）',
          prop: 'expired',
          slotName: 'expired'
        },
        {
          label: '审核通过未通话过期次数(次)',
          prop: 'authToExpired',
          slotName: 'authToExpired'
        },
        {
          label: '已完成次数（次）',
          prop: 'finished',
          slotName: 'finished'
        },
        {
          label: '通话结束次数（次）',
          prop: 'meetingOn',
          slotName: 'meetingOn'
        },
         {
          label: '取消次数（次）',
          prop: 'canceled',
          slotName: 'canceled'
        }

      ]

      if (!this.hasAllPrisonQueryAuth) {
        allCols.splice(0, 2)

        const index = allCols.findIndex(col => col.label === '监区')

        this.$set(allCols[index], 'prop', 'prisonArea')
      }
      return allCols
    }
  },

  async mounted() {
    this.$refs.search.onGetFilter()

    if (this.hasAllPrisonQueryAuth) {
      this.searchItems.prisonAreaId.getting = false

      await this.getDatas()
    } else {
      await this.getJailPrisonAreas({ url: '/prison_config/getPrisonConfigs', params: { jailId: JSON.parse(localStorage['user']).jailId } })

      this.searchItems.prisonAreaId.options = this.jailPrisonAreas

      this.searchItems.prisonAreaId.options.push({ id: '无监区', name: '无监区' })

      this.searchItems.prisonAreaId.value = this.searchItems.prisonAreaId.options[0].id

      this.filter.prisonAreaId = this.searchItems.prisonAreaId.options[0].id

      this.searchItems.prisonAreaId.getting = false

      await this.getDatas()
    }
  },

  methods: {
    ...mapActions([
      'getPrisonAreaReportList',
      'getPrisonAreaReportListAll',
      'getJailPrisonAreas'
    ]),

    async getDatas() {
      let res

      const { startDate, endDate } = this.filter

      if (startDate) this.filter['startDate'] = `${ startDate } 00:00:00`

      if (endDate) this.filter['endDate'] = `${ endDate } 23:59:59`

      this.prisonArea = this.searchItems.prisonAreaId.options.find(o => o.id === this.filter.prisonAreaId)

      if (this.filter.prisonAreaId === '无监区' && this.searchItems.prisonAreaId.options.length === 1) delete this.filter.prisonAreaId

      else if (this.filter.prisonAreaId === '无监区' && this.searchItems.prisonAreaId.options.length > 1) this.filter.prisonAreaId = ''

      if (this.hasAllPrisonQueryAuth) res = await this.getPrisonAreaReportListAll({ ...this.filter, ...this.pagination })

      else res = await this.getPrisonAreaReportList({ ...this.filter, ...this.pagination })

      if (!res) return

      this.show = true
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
      if (selectKey === 'provincesId') {
        if (value) {
          this.$set(this.searchItems['jailId'], 'value', '')
          if (this.searchItems['prisonAreaId']) {
            this.$set(this.searchItems['prisonAreaId'], 'value', '')

            this.$set(this.searchItems['prisonAreaId'], 'options', [])
          }
        }

        this.$set(this.searchItems['jailId'], 'getting', true)

        await this.$store.dispatch('getPrisonAll', { provincesId: value })

        Message.closeAll()

        this.$set(this.searchItems['jailId'], 'options', this.$store.state.prisonAll || [])

        this.$set(this.searchItems['jailId'], 'getting', false)
      }

      if (selectKey === 'jailId') {
        if (value) {
          await this.$store.dispatch('getJailPrisonAreas', { url: '/prison_config/getPrisonConfigs', params: { jailId: value } })
          this.$set(this.searchItems['prisonAreaId'], 'options', this.$store.state.jailPrisonAreas)
        }
        else {
          this.$set(this.searchItems['prisonAreaId'], 'options', [])
        }
        this.$set(this.searchItems['prisonAreaId'], 'value', '')
      }
    }
  }
}
</script>
