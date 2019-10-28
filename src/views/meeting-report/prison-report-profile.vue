<template>
  <el-row :gutter="0">
    <el-col :span="24">
      <el-table
        :data="prisonReportList.contents"
        stripe
        show-summary
        :summary-method="summaryMethod"
        style="width: 100%">
        <el-table-column
          v-if="hasAllPrisonQueryAuth"
          prop="jailName" 
          label="监狱名称"
        />
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
