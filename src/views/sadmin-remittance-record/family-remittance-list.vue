<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-tabs
        value="first"
        type="card">
        <el-tab-pane
          label="家属汇款记录"
          name="first" />
      </el-tabs>
      <el-table
        :data="[]"
        border
        stripe
        style="width: 100%">
        <el-table-column
          label="汇款单号" />
        <el-table-column
          label="服刑人员姓名" />
        <el-table-column
          label="囚号" />
        <el-table-column
          label="汇款家属" />
        <el-table-column
          label="汇款金额" />
        <el-table-column
          label="汇款时间" />
        <el-table-column
          label="汇款状态" />
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="10"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      searchItems: {
        prisoner: { type: 'select', label: '所属监狱' },
        prisonerName: { type: 'input', label: '服刑人员姓名' },
        prisonerNumber: { type: 'input', label: '囚号' },
        payFamily: { type: 'input', label: '汇款家属' },
        payAt: { type: 'date', label: '汇款时间' }
      }
    }
  },
  methods: {
    sizeChange() {
      console.log(1111)
    },
    onSearch() {
      console.log(22222)
    },
    getDatas() {
      console.log(33333)
    }
  }
}
</script>

<style scoped>

</style>

