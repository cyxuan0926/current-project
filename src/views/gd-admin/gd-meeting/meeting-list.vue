<template>
  <el-row
    class="row-container"
    :gutter="0">
     <m-excel-download
      path="/download/newExportFindPage"
      :params="filter"
    />
    <m-search
      ref="search"
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch" />
      
    <el-col :span="24">
      <m-table-new
        stripe
        :data="tabledata.report"
        :cols="tableCols">
        <template #imageUrl="{ row }">
          <img :src="row.imageUrl + '?token=' + $urls.token">
        </template>
        <template #isDate="{ row }">{{ row.startDate | Date }} - {{ row.endDate | Date }}</template>
       
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="tabledata.total"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import http from '@/service'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
export default {
  mixins: [prisonFilterCreator],
  data() {
   return {
      searchItems: {
       time: {
          type: 'dateRange',
          start: 'startDate',
          end: 'endDate',
          canNotClear: true,
          value: [this.$_oneMonthAgo, this.$_dateNow],
          unlinkPanels: true
        }
      },
      // 注释的是接口以前返回的字段名
      // 修改后的接口没有按照需求文档给出所有字段名（审核通过未通话过期次数/家属取消次数）
      tableCols: [
        {
          label: '监区',
          prop: 'prisonArea',
          minWidth: '11%',
          showOverflowTooltip: true
        },
        {
          label: '申请次数(次)',
          // prop: 'total',
          prop: 'num',
          minWidth: '8.2%'
        },
        {
          label: '未授权次数(次)',
          // prop: 'unPendTotal',
          prop: 'pending',
          minWidth: '8.2%'
        },
        {
          label: '待通话次数(次)',
          // prop: 'passedTotal',
          prop: 'passed',
          minWidth: '8.2%'
        },
        {
          label: '审核被拒绝次数(次)',
          // prop: 'deniedTotal',
          prop: 'denied',
          minWidth: '8.2%'
        },
        {
          label: '审核被拒绝比例',
          prop: 'deniedScale',
          minWidth: '8.2%'
        },
        {
          label: '未审核过期次数(次)',
          // prop: 'pendingExpiredTotal',
          prop: 'noAuthToExpired',
          minWidth: '8.2%'
        },
        {
          label: '未审核过期比例',
          // prop: 'pendingExpiredScale',
          prop: 'noAuthToExpiredScale',
          minWidth: '8.2%'
        },
        {
          label: '审核通过未通话过期次数(次)',
          prop: 'authToExpired',
          minWidth: '9%'
        },
        {
          label: '审核通过未通话过期比例',
          prop: 'authToExpiredScale',
          minWidth: '8.8%'
        },
        {
          label: '通话完成次数(次)',
          // prop: 'finishedTotal',
          prop: 'finished',
          minWidth: '8.2%'
        },
        {
          label: '通话完成比例',
          prop: 'finishedScale',
          minWidth: '8.2%'
        },
        {
          label: '通话结束次数(次)',
          // prop: 'endedTotal',
          prop: 'ended',
          minWidth: '8.2%'
        },
        {
          label: '通话结束比例',
          prop: 'endedScale',
          minWidth: '8.2%'
        },
        {
          label: '取消次数(次)',
          // prop: 'canceledTotal',
          prop: 'canceled',
          minWidth: '8.2%'
        }
      ],
      tabledata:{}
    }
  },

  methods: {
     async getDatas() {
      let res = await http.getPrisonReportListJails({ ...this.filter, ...this.pagination,jailId:JSON.parse(localStorage.getItem('user')).jailId})
      this.tabledata=res
    },

    onSearch() {
      this.filter.jailId=JSON.parse(localStorage.getItem('user')).jailId
      this.$refs.pagination.handleCurrentChange(1)
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>
