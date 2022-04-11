<template>
  <el-row class="row-container" :gutter="0">

    <m-excel-download :path="excelDownloadPath" :params="filter" />

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

import profile from './prison-report-profile'

import detail from './prison-report-detail'

import prisonFilterCreator from '@/mixins/prison-filter-creator'
export default {
  mixins: [prisonFilterCreator],

  components: { profile, detail },

  data() {
    return {
      activeComponentName: 'profile',

      searchItems: {
        reportRange: {
          type: 'dateRange',
          unlinkPanels: true,
          start: 'startDate',
          end: 'endDate',
          canNotClear: true,
          startPlaceholder: '通话开始时间',
          endPlaceholder: '通话结束时间',
          value: [this.$_oneMonthAgo, this.$_dateNow]
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
      }
    }
  },

  computed: {
    ...mapGetters(['isSuperAdmin']),

    ...mapState(['prisonReportList', 'prisonReportDetail']),

    totalPage() {
      if (this.activeComponentName === 'profile') return this.prisonReportList.total

      else return this.prisonReportDetail.total
    },

    excelDownloadPath() {
      const activeTab = this.tabOptions.find(tab => tab.name === this.activeComponentName)

      return activeTab && activeTab.excelDownloadPath
    },

    tabOptions() {
      return (
        [
          {
            label: '监狱可视电话统计',
            name: 'profile',
            excelDownloadPath: this.isSuperAdmin ? '/download/exportJailStatical' : '/download/exportJailVideoPhone'
          },

          {
            label: '可视电话统计详情',
            name: 'detail',
            excelDownloadPath: '/download/exportDetailsStatical'
          }
        ]
      )
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

  methods: {
    ...mapActions([
      'getNewPrisonReportList',
      'getPrisonReportListAll',
      'getPrisonReportDetail',
      'getPrisonReportDetailAll'
    ]),

    async getDatas() {
      // 后端说这里jailid 为 -1 也传入 后端自行做了处理
      this.filter = Object.assign({}, { jailId: JSON.parse(localStorage.getItem('user')).jailId }, this.filter)

      const params = Object.assign({}, { ...this.filter, ...this.pagination })

      if (this.activeComponentName === 'profile') {
        if (this.isSuperAdmin) await this.getPrisonReportListAll(params)

        else await this.getNewPrisonReportList(params)
      } else {
        if (this.isSuperAdmin) await this.getPrisonReportDetailAll(params)

        else await this.getPrisonReportDetail(params)
      }
    },

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    }
  }
}
</script>
