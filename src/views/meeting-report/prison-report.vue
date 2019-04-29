<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch"
    />
    <el-col :span="24">
      <el-tabs v-model="activeComponentName" type="card">
        <template v-for="item in tabOptions">
          <el-tab-pane :label="item.label" :name="item.name" :key="item.name">
            <keep-alive>
              <component :is="activeComponentName" />
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

const startDate = Moment().subtract(1, 'months').format('YYYY-MM')
const endDate = Moment().subtract(1, 'months').format('YYYY-MM')

export default {
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
            max: Moment().subtract(1, 'months').format('YYYY-MM'),
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
          label: '囚号',
          miss: true
        }
      },
      tabOptions: [
        { label: '监狱会见统计', name: 'profile' },
        { label: '会见统计详情', name: 'detail' }
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
    ...mapActions(['getPrisonReportList', 'getPrisonReportDetail']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      const params = { ...this.filter, ...this.pagination }

      if (this.activeComponentName === 'profile') {
        this.getPrisonReportList(params)
      } else {
        this.getPrisonReportDetail(params)
      }
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    }
  }
}
</script>
