<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
    />

    <el-col class="el-col__no-tabs__margin" :span="24">
      <m-table-new
        stripe
        :data="prisonTerms.contents"
        :cols="tableCols"
      >
        <template #changeyear="{ row }">
          {{ row.changeyear | termChangeYearMonthDay(row.changemonth, row.changeday) }}
        </template>

        <template #createdAt="{ row }">
          {{ row.createdAt | Date }}
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="prisonTerms.total"
      @onPageChange="getDatas"
    />
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
          label: '数据导入人员姓名',
          type: 'input',
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
