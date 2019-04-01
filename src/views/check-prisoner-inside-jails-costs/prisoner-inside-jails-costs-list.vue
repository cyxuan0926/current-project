<template>
<el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @search="onSearch"
      @sizeChange="sizeChange"/>
    <el-col :span="24">
      <el-tabs
        type="card"
        value="first">
        <el-tab-pane
          label="服刑人员狱内消费情况"
          name="first"/>
      </el-tabs>
      <el-table
        border
        :data="prisonersInsideJailsCosts.contents"
        style="width: 100%"
        stripe>
        <el-table-column
          label="姓名"
          prop="prisonerName" />
        <el-table-column
          label="囚号"
          prop="prisonerNumber" />
        <el-table-column
          label="监区"
          prop="prisonArea" />
        <el-table-column
          label="类别"
          prop="consumeType" />
        <el-table-column
          label="场地"
          prop="address" />
        <el-table-column
          label="交易金额"
          prop="consume">
          <template slot-scope="scope">
            {{ scope.row.consume | fixedNumber }}
          </template>
        </el-table-column>  
        <el-table-column
          label="余额"
          prop="balance">
          <template slot-scope="scope">
            {{ scope.row.balance | fixedNumber }}
          </template>
        </el-table-column>  
        <el-table-column
          label="操作时间"
          min-width="100px"
          prop="consumeAt">
          <template slot-scope="scope">
            {{ scope.row.consumeAt | Date }}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      :total="prisonersInsideJailsCosts.total"
      ref="pagination" 
      @onPageChange="getDatas"/>
  </el-row>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      searchItems: {
        name: { type: 'input', label: '姓名' },
        prisonerNumber: { type: 'input', label: '囚号' },
        prisonArea: JSON.parse(localStorage.getItem('user')).prisonConfigList.length === 1 ? { label: '监区', type: 'input', value: `${ JSON.parse(localStorage.getItem('user')).prisonConfigList[0].prisonConfigName }`, disabled: true } : { label: '监区', type: 'select', options: JSON.parse(localStorage.getItem('user')).prisonConfigList, belong: { value: 'prisonConfigName', label: 'prisonConfigName' } },
        time: { type: 'dateRange', start: 'startDate', end: 'endDate', unlinkPanels: true }
      }
    }
  },
  computed: {
    ...mapState(['prisonersInsideJailsCosts'])
  },
  methods: {
    ...mapActions(['getPrisonersInsideJailsCosts']),
    getDatas() {
      this.getPrisonersInsideJailsCosts({ ...this.filter, ...this.pagination })
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
