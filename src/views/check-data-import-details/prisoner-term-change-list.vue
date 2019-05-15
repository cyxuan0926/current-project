<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch"/>
    <el-col :span="24">
      <el-tabs
        type="card"
        value="first">
        <el-tab-pane
          label="刑期变动详情表"
          name="first"/>
      </el-tabs>
      <el-table
        border
        :data="prisonTerms.contents"
        style="width: 100%"
        stripe>
        <el-table-column
          label="罪犯姓名"
          min-width="65"
          prop="name" />
        <el-table-column
          label="罪犯编号"
          min-width="70"
          prop="prisonerNumber" />
        <el-table-column
          label="监区"
          min-width="65"
          prop="prisonArea"/> 
        <el-table-column
          label="减刑时间"
          min-width="110"
          prop="term_start" />
        <el-table-column
          label="变动类型"
          prop="changetype" />
        <el-table-column label="减刑变动年/月/日" min-width="110">
          <template slot-scope="scope">
            {{ scope.row.changeyear | termChangeYearMonthDay(scope.row.changemonth, scope.row.changeday) }}
          </template>
        </el-table-column>
        <el-table-column
          label="变动后刑期止日"
          min-width="110"
          prop="term_finish" />  
        <el-table-column
          label="数据导入人员"
          min-width="95"
          prop="real_name"/>
        <el-table-column label="数据导入时间" min-width="110">
          <template slot-scope="scope">
            {{ scope.row.createdAt | Date }}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      :total="prisonTerms.total"
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
        name: { type: 'input', label: '姓名' },
        prisonerNumber: { type: 'input', label: '罪犯编号' },
        operateName: { type: 'input', label: '数据导入人员姓名' },
        time: { type: 'dateRange', start: 'start', end: 'end', unlinkPanels: true }
      }
    }
  },
  computed: {
    ...mapState(['prisonTerms'])
  },
  methods: {
    ...mapActions(['getPrisonTerms']),
    getDatas() {
      this.getPrisonTerms({ ...this.filter, ...this.pagination })
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
<style scoped >

</style>
