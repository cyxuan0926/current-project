<template>
  <el-row :gutter="0">
    <el-col :span="24">
      <!-- show-summary :summary-method="summaryMethod" -->
      <m-table-new
        stripe
        :data="prisonReportList.contents"
        :cols="tableCols"
      >
        <template #num="{ row }">{{ row.num || 0 }} 次</template>

        <template #pending="{ row }">{{ row.pending || 0 }} 次</template>

        <template #finished="{ row }">{{ row.finished || 0 }} 次</template>

        <template #canceled="{ row }">{{ row.canceled || 0 }} 次</template>

        <template #expired="{ row }">{{ row.expired || 0 }} 次</template>
        <template #authToExpired="{ row }">{{ row.authToExpired || 0 }} 次</template>

        <template #denied="{ row }"> {{ row.denied || 0 }} 次</template>

        <template #passed="{ row }"> {{ row.passed || 0 }} 次</template>

        <template #meetingOn="{ row }"> {{ row.meetingOn || 0 }} 次</template>

        <template #ended="{ row }"> {{ row.ended || 0 }} 次</template>
      </m-table-new>
    </el-col>
  </el-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState({
      prisonReportList: state => state.prisonReportList,
      user: state => state.global.user
    }),

    summaryMethod() {
      return this.isSuperAdmin
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
          label: '审核通过未通话过期次数（次）',
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

      if (!this.isSuperAdmin) {
        cols.splice(0, 2)

        const index = cols.findIndex(col => col.label === '监区')

        this.$set(cols[index], 'prop', 'prisonArea')
      }
      return cols
    },

    ...mapGetters(['isSuperAdmin'])
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
