<template>
  <el-row
    class="row-container"
    :gutter="0">
     <m-excel-download
      path="/download/exportJailStatical"
      :params="filter"
    />
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
    >
      <!-- <el-button 
        class="m-excel-download"
        type="primary"
        slot="append"
        :loading="downloading"
        @click="onDownloadExcel">
        导出execl
      </el-button> -->
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
          prop: 'num',
          minWidth: '8.2%'
        },
        {
          label: '未授权次数(次)',
          prop: 'pending',
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
          prop: 'deniedScale',
          minWidth: '8.2%'
        },
        {
          label: '未审核过期次数(次)',
          prop: 'noAuthToExpired',
          minWidth: '8.2%'
        },
        {
          label: '未审核过期比例',
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
          prop: 'canceled',
          minWidth: '8.8%'
        },
        {
          label: '取消次数比例',
          prop: 'canceledScale',
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
    async onSearch() {
      const { rows } = this.pagination
      this.loading = true
      this.$refs.pagination.currentPage = 1
      this.pagination = Object.assign({}, { page: 1, rows })
      await this.getDatas()
    },

    async getDatas() {
      const { page, rows } = this.pagination

      const { total, report} = await this.getMeetingStatics({
        ...this.filter,
        ...this.pagination
      })
      this.total = total ? total + 1 : 0

      this.tableDatas = report
      if (total && Math.ceil(this.total / rows) === page) this.tableDatas.push(this.meetingStatisticTotalItem)
    }
  },

 mounted() {
    this.$set(this.searchItems['time'], 'value', [this.$_timeOneWeekAgo, this.$_timeNow])

    this.$refs.search.onGetFilter()

    this.getDatas()

  },

  computed: {
    ...mapState([
      'meetingStatistics',
      'meetingStatisticTotalItem'
    ]),
  }
}
</script>
