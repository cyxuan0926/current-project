<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch"/>
    <el-col :span="24">
      <el-table
        stripe
        :data="prisonersPocketMoney.contents"
        style="width: 100%"
      >
        <el-table-column
          label="罪犯姓名"
          prop="name" />
        <el-table-column
          label="罪犯编号"
          prop="prisonerNumber" />
        <el-table-column
          label="监区"
          prop="prisonArea" />
        <el-table-column
          label="当前余额"
          prop="balance">
          <template slot-scope="scope">
            {{ scope.row.balance | fixedNumber }}
          </template>
        </el-table-column>  
        <el-table-column
          label="收入总额"
          prop="income">
          <template slot-scope="scope">
            {{ scope.row.income | fixedNumber }}
          </template>
        </el-table-column>  
        <el-table-column
          label="支出总额"
          prop="expenditure">
          <template slot-scope="scope">
            {{ scope.row.expenditure | fixedNumber }}
          </template>
        </el-table-column>  
        <el-table-column
          label="日期"
          prop="accountDate" />
        <el-table-column
          label="数据导入人员"
          prop="realName"/>  
        <el-table-column
          label="数据导入时间"
          width="140"
          prop="createdAt">
          <template slot-scope="scope">
            {{ scope.row.createdAt | Date }}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      :total="prisonersPocketMoney.total"
      ref="pagination"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      searchItems: {
        name: { type: 'input', label: '罪犯姓名' },
        prisonerNumber: { type: 'input', label: '罪犯编号' },
        time: { type: 'monthrange', start: 'start', end: 'end' },
        prisonArea: JSON.parse(localStorage.getItem('user')).prisonConfigList && JSON.parse(localStorage.getItem('user')).prisonConfigList.length === 1 ? { label: '监区', type: 'input', value: `${ JSON.parse(localStorage.getItem('user')).prisonConfigList[0].prisonConfigName }`, disabled: true } : { label: '监区', type: 'select', options: JSON.parse(localStorage.getItem('user')).prisonConfigList, belong: { value: 'prisonConfigName', label: 'prisonConfigName' } }
      }
    }
  },
  computed: {
    ...mapState(['prisonersPocketMoney'])
  },
  methods: {
    ...mapActions(['getPrisonersPocketMoney']),
    getDatas() {
      if (JSON.parse(localStorage.getItem('user')).prisonConfigList && JSON.parse(localStorage.getItem('user')).prisonConfigList.length === 1) this.filter = { prisonArea : `${ JSON.parse(localStorage.getItem('user')).prisonConfigList[0].prisonConfigName }` }
      this.getPrisonersPocketMoney({ ...this.filter, ...this.pagination })
    },
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    }
  },
  mounted () {
    this.getDatas()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
