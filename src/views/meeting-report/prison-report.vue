<template>
  <el-row class="row-container" :gutter="0">
    <m-excel-download
      v-if="isSuperAdmin"
      :path="excelDownloadPath"
      :params="filter"
    />
      <m-excel-download
      v-if="!isSuperAdmin"
      path="/download/exportJailVideoPhone"
      :params="filter"
    />

    <m-search
      ref="search"
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    />

    <el-col :span="24">
      <el-tabs v-model="activeComponentName" type="card">
        <template v-for="item in tabOptions">
          <el-tab-pane
            :label="item.label"
            :name="item.name"
            :key="item.name"
          >
            <keep-alive>
              <component :is="activeComponentName" />
            </keep-alive>
          </el-tab-pane>
        </template>
      </el-tabs>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="totalPage"
      @onPageChange="getDatas"
    />
  </el-row>
</template>

<script>
import {
  mapActions,
  mapState,
  mapGetters
} from 'vuex'
import Moment from 'moment'
import profile from './prison-report-profile'
import detail from './prison-report-detail'
import prisonFilterCreator from '@/mixins/prison-filter-creator'

const endDate = Moment().format('YYYY-MM-DD')

const startDate = Moment().subtract(1, 'months').format('YYYY-MM-DD')

export default {
  mixins: [prisonFilterCreator],

  components: { profile, detail },

  data() {
    return {
      activeComponentName: 'profile',
      searchItems: {
        // reportRange: {
        //   type: 'monthRangeSelector',
        //   canNotClear: true,
        //   startValue: startDate,
        //   endValue: endDate,
        //   startKey: 'startDate',
        //   endKey: 'endDate',
        //   range: {
        //     max: Moment().format('YYYY-MM'),
        //     maxMonthRange: 24
        //   }
        // },

        reportRange: {
          type: 'dateRange',
          unlinkPanels: true,
          start: 'startDate',
          end: 'endDate',
          startPlaceholder: '通话开始时间',
          endPlaceholder: '通话结束时间',
          value: [startDate, endDate]
        },

        name: {
          type: 'input',
          label: '家属姓名',
          miss: true
        },

        prisonerNumber: {
          type: 'input',
          label: '罪犯编号',
          miss: true
        }
      },

      tabOptions: [
        {
          label: '监狱可视电话统计',
          name: 'profile',
          excelDownloadPath: '/download/exportJailStatical'
        },
        {
          label: '可视电话统计详情',
          name: 'detail',
          excelDownloadPath: '/download/exportDetailsStatical'
        }
      ],

      filterInit: { // 默认查询上一个月的，筛选框初始化
        startDate,
        endDate
      }
    }
  },

  computed: {
    ...mapState(['prisonReportList', 'prisonReportDetail']),

    totalPage() {
      if (this.activeComponentName === 'profile') {
        return this.prisonReportList.total
      } else {
        return this.prisonReportDetail.total
      }
    },

    excelDownloadPath() {
      const activeTab = this.tabOptions.find(tab => {
        return tab.name === this.activeComponentName
      })

      return activeTab && activeTab.excelDownloadPath
    },

    ...mapGetters(['isSuperAdmin'])
  },

  watch: {
    activeComponentName(val) {
      if (this.activeComponentName === 'profile') {
        this.searchItems.name.miss = true

        this.searchItems.prisonerNumber.miss = true

        delete this.filter.name

        delete this.filter.prisonerNumber
      } else {
        this.searchItems.name.miss = false

        this.searchItems.prisonerNumber.miss = false
      }

      this.$refs.search.onSearch('tabs')

      this.onSearch()
    }
  },

  async mounted() {
    this.$refs.search.onGetFilter()
    this.filter.jailId=JSON.parse(localStorage.getItem('user')).jailId

    await this.getDatas()
  },

  methods: {
    ...mapActions([
      'getNewPrisonReportList',
      'getPrisonReportListAll',
      'getPrisonReportDetail',
      'getPrisonReportDetailAll'
    ]),

    getDatas() {
      const params = { ...this.filter, ...this.pagination }

      if (this.activeComponentName === 'profile') {
        const { startDate, endDate } = this.filter

        if (startDate) params['startDate'] = `${ startDate } 00:00:00`

        if (endDate) params['endDate'] = `${ endDate } 23:59:59`

        if (this.isSuperAdmin) this.getPrisonReportListAll(params)

        else this.getNewPrisonReportList(params)
      } else {
        if (this.isSuperAdmin) this.getPrisonReportDetailAll(params)

        else this.getPrisonReportDetail(params)
      }
    },

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    }
  }
}
</script>
