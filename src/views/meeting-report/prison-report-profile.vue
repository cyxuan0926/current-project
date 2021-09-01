<template>
  <el-row :gutter="0">
    <el-col :span="24">
      <!--         show-summary
        :summary-method="summaryMethod" -->
      <m-table-new
        stripe
        :data="prisonReportList.contents"
        :cols="tableCols">
        <template #total="{ row }">{{ row.total }} 次</template>
        <template #finishedTotal="{ row }">{{ row.finishedTotal }} 次</template>
        <template #canceledTotal="{ row }">{{ row.canceledTotal }} 次</template>
        <template #expiredTotal="{ row }">{{ row.expiredTotal }} 次</template>
        <template #deniedTotal="{ row }"> {{ row.deniedTotal }} 次</template>
      </m-table-new>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    hasAllPrisonQueryAuth: Boolean
  },
  computed: {
    ...mapState({
      prisonReportList: state => state.prisonReportList,
      user: state => state.global.user
    }),
    summaryMethod() {
      return this.hasAllPrisonQueryAuth
        ? this.getSummariesAll
        : this.getSummaries
    },
    tableCols() {
      let cols = [
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
          label: '监区',
          prop: 'fullname',
          showOverflowTooltip: true
        },

        {
          label: '申请次数',
          prop: 'total',
          slotName: 'total'
        },

        {
          label: '未授权次数',
          prop: ''
        },

        {
          label: '待通话次数',
          prop: ''
        },

        {
          label: '已完成次数',
          prop: 'finishedTotal',
          slotName: 'finishedTotal'
        },

        {
          label: '已过期次数',
          prop: 'expiredTotal',
          slotName: 'expiredTotal'
        },

        {
          label: '已拒绝/撤回次数',
          prop: 'deniedTotal',
          slotName: 'deniedTotal'
        },

        {
          label: '已取消次数',
          prop: 'canceledTotal',
          slotName: 'canceledTotal'
        },

        {
          label: '已结束次数',
          prop: ''
        },

        {
          label: '通话中次数'
        }
      ]

      if (!this.hasAllPrisonQueryAuth) {
        cols.splice(0, 2)

        const index = cols.findIndex(col => col.label === '监区')

        this.$set(cols[index], 'prop', 'prisonArea')
      }
      return cols
    }
  },
  methods: {
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
    },
    getSummariesAll(params) {
      const { columns, data } = params
      const sums = []
      columns.forEach((column, index) => {
        if (index <= 1) {
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
