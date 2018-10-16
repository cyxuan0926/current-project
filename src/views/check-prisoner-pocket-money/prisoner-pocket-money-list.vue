<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search :items="searchItems" @sizeChange="sizeChange" @search="onSearch">
    </m-search>
    <el-col :span="24">
      <el-tabs type="card" value="first">
        <el-tab-pane label="服刑人员零花钱" name="first"></el-tab-pane>
      </el-tabs>
      <el-table border
        :data="prisonersPocketMoney.contents" style="width: 100%" stripe>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="囚号" prop="prisonerNumber"></el-table-column>
        <el-table-column label="监区" prop="prisonArea"></el-table-column>
        <el-table-column label="当前余额" prop="balance"></el-table-column>
        <el-table-column label="收入总额" prop="income"></el-table-column>
        <el-table-column label="支出总额" prop="expenditure"></el-table-column>
        <el-table-column label="日期" prop="accountDate"></el-table-column>
        <el-table-column label="创建时间" prop="createdAt">
          <template slot-scope="scope">
            {{scope.row.createdAt | Date}}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination :total="prisonersPocketMoney.total" ref="pagination" @onPageChange="getDatas"></m-pagination>
  </el-row>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  export default {
    data() {
      return {
        searchItems: {
          name: { type: 'input', label: '姓名' },
          prisonerNumber: { type: 'input', label: '囚号' },
          time: { type: 'monthrange', start: 'start', end: 'end' },
          prisonArea: JSON.parse(localStorage.getItem('user')).prisonConfigList.length === 1 ? { label: '监区', type: 'input', value: `${ JSON.parse(localStorage.getItem('user')).prisonConfigList[0].prisonConfigName }`, disabled: true } : { label: '监区', type: 'select', options: JSON.parse(localStorage.getItem('user')).prisonConfigList, belong: { value: 'prisonConfigName', label: 'prisonConfigName' } }
        }
      }
    },
    computed: {
      ...mapState(['prisonersPocketMoney'])
    },
    methods: {
      ...mapActions(['getPrisonersPocketMoney']),
      getDatas() {
        this.getPrisonersPocketMoney({ ...this.filter, ...this.pagination })
      },
      sizeChange(rows) {
        this.$refs.pagination.handleSizeChange(rows)
        this.getDatas()
      },
      onSearch() {
        this.$refs.pagination.handleCurrentChange(1)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
