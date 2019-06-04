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
          label="罪犯奖惩详情表"
          name="first"/>
      </el-tabs>
      <el-table
        border
        :data="prisonerRewardPunishments.contents"
        style="width: 100%"
        stripe>
        <el-table-column
          label="罪犯姓名"
          prop="name"/>
        <el-table-column
          label="罪犯编号"
          prop="prisonerNumber"/>
        <el-table-column
          label="监区"
          prop="prisonArea"/> 
        <el-table-column
          label="年份"
          prop="datayear"/>
        <el-table-column
          label="奖惩内容"
          prop="ndry"/> 
        <el-table-column
          label="数据导入人员"
          prop="realName"/>
        <el-table-column label="数据导入时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | Date }}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      :total="prisonerRewardPunishments.total"
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
        operateName: { type: 'input', label: '数据导入人员姓名' },
        time: { type: 'dateRange', start: 'start', end: 'end', unlinkPanels: true }
      }
    }
  },
  computed: {
    ...mapState(['prisonerRewardPunishments'])
  },
  methods: {
    ...mapActions(['getPrisonerRewardPunishments']),
    getDatas() {
      this.getPrisonerRewardPunishments({ ...this.filter, ...this.pagination })
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
