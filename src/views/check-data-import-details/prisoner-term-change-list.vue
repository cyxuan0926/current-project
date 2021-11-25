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
        <template #changeyear="{ row }">
          {{ row.changeyear | termChangeYearMonthDay(row.changemonth, row.changeday) }}
        </template>
        <template #createdAt="{ row }">
          {{ row.createdAt | Date }}
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
    }
  }
}
</script>
