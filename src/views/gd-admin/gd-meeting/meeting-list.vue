<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
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
import Moment from 'moment'
export default {
  mixins: [prisonFilterCreator],
  data() {
     const endDate = Moment().format('YYYY-MM-DD')
    const startDate = Moment().subtract(1, 'months').subtract(1, 'days').format('YYYY-MM-DD')
    return {
      initFilter: { // 默认查询上一个月的，筛选框初始化
        startDate,
        endDate
      },
      searchItems: {
       time: {
          type: 'dateRange',
          start: 'startDate',
          end: 'endDate',
          value: [startDate, endDate],
          unlinkPanels: true
        }
      },
     tableCols: [
        {
          label: '监区',
          prop: 'prisonArea',
          minWidth: '11%',
          showOverflowTooltip: true
        },
        {
          label: '申请次数(次)',
          prop: 'total',
          minWidth: '8.2%'
        },
        {
          label: '未授权次数(次)',
          prop: 'unPendTotal',
          minWidth: '8.2%'
        },
        {
          label: '待通话次数(次)',
          prop: 'passedTotal',
          minWidth: '8.2%'
        },
        {
          label: '审核被拒绝次数(次)',
          prop: 'deniedTotal',
          minWidth: '8.2%'
        },
        {
          label: '审核被拒绝比例',
          prop: 'deniedScale',
          minWidth: '8.2%'
        },
        {
          label: '未审核过期次数(次)',
          prop: 'pendingExpiredTotal',
          minWidth: '8.2%'
        },
        {
          label: '未审核过期比例',
          prop: 'pendingExpiredScale',
          minWidth: '8.2%'
        },
        {
          label: '审核通过未通话过期次数(次)',
          prop: 'expiredTotal',
          minWidth: '9%'
        },
        {
          label: '审核通过未通话过期比例',
          prop: 'expiredScale',
          minWidth: '8.8%'
        },
        {
          label: '通话完成次数(次)',
          prop: 'finishedTotal',
          minWidth: '8.2%'
        },
        {
          label: '通话完成比例',
          prop: 'finishedScale',
          minWidth: '8.2%'
        },
        {
          label: '通话结束次数(次)',
          prop: 'endedTotal',
          minWidth: '8.2%'
        },
        {
          label: '通话结束比例',
          prop: 'endedScale',
          minWidth: '8.2%'
        },
        {
          label: '警官取消次数(次)',
          prop: 'canceledTotal',
          minWidth: '8.2%'
        },{
          label: '家属取消次数(次)',
          prop: 'familyCanceledTotal',
          minWidth: '8.2%'
        }
      ],
      tabledata:{}
    }
  },
  mounted() {
    this.filter = Object.assign({}, this.filter, this.initFilter)
    this.getDatas()
  },
  methods: {
     async getDatas() {
      let res = await http.getPrisonReportListJails({ ...this.filter, ...this.pagination })
      this.tabledata=res
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>
