<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-excel-download
      v-if="hasAllPrisonQueryAuth"
      :path="excelDownloadPath"
      :params="filter"
    />
    <m-search
      ref="search"
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    />
    <el-col :span="24">
      <el-tabs
        v-model="activeComponentName"
        type="card">
        <template v-for="item in tabOptions">
          <el-tab-pane
            :label="item.label"
            :name="item.name"
            :key="item.name">
            <keep-alive>
              <component
                :is="activeComponentName"
                :hasAllPrisonQueryAuth="hasAllPrisonQueryAuth" />
            </keep-alive>
          </el-tab-pane>
        </template>
      </el-tabs>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="tatalPage"
      @onPageChange="getDatas"
    />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Moment from 'moment'
import profile from './prison-report-profile'
import detail from './prison-report-detail'
import prisonFilterCreator from '@/mixins/prison-filter-creator'

const startDate = Moment().format('YYYY-MM')
const endDate = Moment().format('YYYY-MM')

export default {
  mixins: [prisonFilterCreator],
  components: { profile, detail },
  data() {
    return {
      activeComponentName: 'profile',
      searchItems: {
        reportRange: {
          type: 'monthRangeSelector',
          canNotClear: true,
          startValue: startDate,
          endValue: endDate,
          startKey: 'startDate',
          endKey: 'endDate',
          range: {
            max: Moment().format('YYYY-MM'),
            maxMonthRange: 24
          }
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
        startDate: startDate,
        endDate: endDate
      }
    }
  },
  computed: {
    ...mapState(['prisonReportList', 'prisonReportDetail']),
    tatalPage() {
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
    }
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
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions([
      'getPrisonReportList',
      'getPrisonReportListAll',
      'getPrisonReportDetail',
      'getPrisonReportDetailAll'
    ]),

    getDatas() {
      const params = { ...this.filter, ...this.pagination }

      if (this.activeComponentName === 'profile') {
        if (this.hasAllPrisonQueryAuth) {
          this.getPrisonReportListAll(params)
        } else {
          this.getPrisonReportList(params)
        }
      } else {
        if (this.hasAllPrisonQueryAuth) {
          this.getPrisonReportDetailAll(params)
        } else {
          this.getPrisonReportDetail(params)
        }
      }
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    }
  }
}
</script>
