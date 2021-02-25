<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
    />
    <el-col
      :span="24"
      class="el-col__no-tabs__margin">
      <m-table-new
        stripe
        :data="prisonTerms.contents"
        :cols="tableCols" >
        <template slot-scope="scope" slot="changeyear">
          {{ scope.row.changeyear | termChangeYearMonthDay(scope.row.changemonth, scope.row.changeday) }}
        </template>
        <template slot="createdAt" slot-scope="scope">
          {{ scope.row.createdAt | Date }}
        </template>
      </m-table-new>
    </el-col>
    <m-pagination
      :total="prisonTerms.total"
      ref="pagination"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import commonTableColsMixins from './mixins/common-table-cols'
export default {
  mixins: [commonTableColsMixins],
  data() {
    return {
      selfOwnSearchItems: {
        operateName: {
          type: 'input',
          label: '数据导入人员姓名',
          noPlaceholder: true
        }
      }
    }
  },
  methods: {
    getDatas() {
      this.getPrisonTerms({
        ...this.filter,
        ...this.pagination
      })
    },

    onLocalGetFilter() {
      this.$refs.search.onGetFilter()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >

</style>
