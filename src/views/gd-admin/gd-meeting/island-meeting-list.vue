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
         <template #familyType="{ row }">
           <span v-if="row.familyType==0">大陆</span>
           <span v-if="row.familyType==1">港澳</span>
           <span v-if="row.familyType==2">台湾</span>
        </template>
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
     const options = [
      {
        label: '非中国籍家属',
        value: '3'
      },
      {
        label: '港澳居民',
        value: '1'
      },
      {
        label: '台湾居民',
        value: '2'
      }
    ]
    return {
       initFilter: { // 默认查询上一个月的，筛选框初始化
        startDate,
        endDate
      },
      searchItems: {
        familyType: {
            type: 'select',
            label: '家属类型',
            options,
            value: ''
        },
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
          label: '家属类型',
          prop: 'familyType',
          minWidth: '8.2%',
          slotName: 'familyType'
        },
        {
          label: '申请次数(次)',
          prop: 'applyTimes',
          minWidth: '8.2%'
        },
        {
          label: '未授权次数(次)',
          prop: 'PENDING',
          minWidth: '8.2%'
        },
        {
          label: '审核被拒绝次数(次)',
          prop: 'DENIED',
          minWidth: '8.2%'
        },
        {
          label: '未审核过期次数(次)',
          prop: 'noAuthToExpired',
          minWidth: '8.2%'
        },
        {
          label: '审核通过未通话过期次数(次)',
          prop: 'authedToExpired',
          minWidth: '9%'
        },
        {
          label: '通话完成次数(次)',
          prop: 'finished',
          minWidth: '8.2%'
        },
        {
          label: '通话结束次数(次)',
          prop: 'ended',
          minWidth: '8.2%'
        },
        {
          label: '警官取消次数(次)',
          prop: 'policeCanceled',
          minWidth: '8.8%'
        },
        {
          label: '家属取消次数(次)',
          prop: 'familiesCanceled',
          minWidth: '8.8%'
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
      let res = await http.getIslandList({ ...this.filter, ...this.pagination })
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
