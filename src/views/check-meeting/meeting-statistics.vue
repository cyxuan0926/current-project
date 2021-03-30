<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
    >
      <el-button 
        class="m-excel-download"
        type="primary"
        slot="append"
        :loading="downloading"
        @click="onDownloadExcel">
        导出execl
      </el-button>
    </m-search>
    <el-col :span="24">
      <m-table-new
        :data="tableDatas"
        :cols="tableCols"
        class="mini-td-padding">
        <template #rank="{ row, $index }">
          <span v-if="row.jailId">{{ $index | handleGetIndex(pagination.rows, pagination.page) }}</span>
        </template>
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="total"
      @onPageChange="getDatas"/>
  </el-row>
</template>
<script>

import { mapActions, mapState } from 'vuex'

import prisonFilterCreator from '@/mixins/prison-filter-creator'

import { tokenExcel } from '@/utils/token-excel'

import { helper } from '@/utils'

export default {
  mixins: [prisonFilterCreator],
  data () {
    return {
      total: 0,
      loading: true,
      filter: {},
      searchItems: {
        time: {
          type: 'datetimerange',
          start: 'startDate',
          end: 'endDate'
        }
      },
      tableCols: [
        {
          slotName: 'rank',
          label: '排名',
          minWidth: '5.5%'
        },
        {
          label: '省份',
          prop: 'provinceName',
          minWidth: '11%',
          showOverflowTooltip: true
        },
        {
          label: '监狱名称',
          prop: 'jailName',
          minWidth: '11%',
          showOverflowTooltip: true
        },
        {
          label: '申请次数(次)',
          prop: 'cnt',
          minWidth: '8.2%'
        },
        {
          label: '未授权次数(次)',
          prop: 'pend',
          minWidth: '8.2%'
        },
        {
          label: '待通话次数(次)',
          prop: 'passed',
          minWidth: '8.2%'
        },
        {
          label: '审核被拒绝次数(次)',
          prop: 'denied',
          minWidth: '8.2%'
        },
        {
          label: '审核被拒绝比例',
          prop: 'deniedPercentShowValue',
          minWidth: '8.2%'
        },
        {
          label: '未审核过期次数(次)',
          prop: 'noAuthToExpired',
          minWidth: '8.2%'
        },
        {
          label: '未审核过期比例',
          prop: 'noAuthToExpiredPercentShowValue',
          minWidth: '8.2%'
        },
        {
          label: '审核通过未通话过期次数(次)',
          prop: 'authedToExpired',
          minWidth: '9%'
        },
        {
          label: '审核通过未通话过期比例',
          prop: 'authedToExpiredPercentShowValue',
          minWidth: '8.8%'
        },
        {
          label: '通话完成次数(次)',
          prop: 'finished',
          minWidth: '8.2%'
        },
        {
          label: '通话完成比例',
          prop: 'finishedPercentShowValue',
          minWidth: '8.2%'
        },
        {
          label: '通话结束次数(次)',
          prop: 'ended',
          minWidth: '8.2%'
        },
        {
          label: '通话结束比例',
          prop: 'endedPercent',
          minWidth: '8.2%'
        },
        {
          label: '警官取消次数(次)',
          prop: 'pollceCanceled',
          minWidth: '8.8%'
        },
        {
          label: '家属取消次数',
          prop: 'famillesCanceled',
          minWidth: '8.2%'
        },
      ],
      barData: [],
      barXAxisData: [],
      tableDatas: [],
      downloading: false
    }
  },
  methods: {
    ...mapActions(['getMeetingStatics']),

    async onDownloadExcel() {
      this.downloading = true

      const times = helper.DateFormat(Date.now(), 'YYYYMMDDHHmmss')

      const formater = menuName => {
        return `${menuName + times}`
      }

      await tokenExcel({
        params: this.filter,
        actionName: 'exportMeetingStatistics',
        menuName: '可视电话数据统计表',
        formater
      })

      setTimeout(() => {
        this.downloading = false
      }, 300)
    },

    filterBarData() {
      const count = this.meetingStatistics.length > 10 ? 10 : this.meetingStatistics.length
      this.barData = this.meetingStatistics.slice(0, count).map(data => [data.jailName, data.cnt])
      this.barXAxisData = this.meetingStatistics.slice(0, count).map(data => data.jailName)
      this.loading = false
    },


    async onSearch() {
      const { rows } = this.pagination
      this.loading = true
      this.$refs.pagination.currentPage = 1
      this.pagination = Object.assign({}, { page: 1, rows })
      await this.getDatas()
      this.filterBarData()
    },

    async getDatas() {
      const { page, rows } = this.pagination

      const total = await this.getMeetingStatics({
        ...this.filter,
        ...this.pagination
      })

      this.total = total ? total + 1 : 0

      this.tableDatas = this.meetingStatistics.slice(0)

      if (total && Math.ceil(this.total / rows) === page) this.tableDatas.push(this.meetingStatisticTotalItem)
    }
  },

  async mounted() {
    this.$set(this.searchItems['time'], 'value', [this.$_timeOneWeekAgo, this.$_timeNow])

    this.$refs.search.onGetFilter()

    await this.getDatas()

    this.filterBarData()
  },

  computed: {
    ...mapState([
      'meetingStatistics',
      'meetingStatisticTotalItem'
    ]),
  }
}
</script>
