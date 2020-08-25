<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @search="onSearch">
      <el-select
        v-model="chartType"
        slot="pre">
          <el-option
            label="申请次数柱状图"
            :value="chartTypes.BAR" />
          <el-option
            label="通话总量分析饼图"
            :value="chartTypes.PIE" />
      </el-select>
      <el-button 
        class="m-excel-download"
        type="primary"
        slot="append"
        :loading="downloading"
        @click="onDownloadExcel">
        导出execl
      </el-button>
    </m-search>
    <m-charts
      :visible="!!total"
      :options="chartOptions"
      :loading="loading"/>
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

// import Moment from 'moment'

const chartTypes = {
  PIE: 'pie',
  BAR: 'bar',
}

export default {
  mixins: [prisonFilterCreator],
  data () {
    // const endDate = Moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')

    // const startDate = Moment().subtract(1, 'months').startOf('day').format('YYYY-MM-DD HH:mm:ss')
    return {
      total: 0,
      chartTypes,
      chartType: chartTypes.BAR,
      loading: true,
      filter: {},
      // filterInit: {
      //   startDate,
      //   endDate
      // },
      searchItems: {
        time: {
          type: 'datetimerange',
          start: 'startDate',
          end: 'endDate'
          // value: [startDate, endDate]
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
          label: '审核通过后取消次数(次)',
          prop: 'canceled',
          minWidth: '8.8%'
        }
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

      // const { startDate, endDate } = this.filter

      const formater = menuName => {
        return `${menuName + times}`
        // return `${menuName + startDate + '-' + endDate}`
      }

      await tokenExcel({
        params: this.filter,
        actionName: 'exportMeetingStatistics',
        menuName: '可视亲情电话数据统计表',
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
    await this.getDatas()
    this.filterBarData()
  },
  computed: {
    ...mapState([
      'meetingStatistics',
      'meetingStatisticTotalItem'
    ]),
    chartOptions() {
      let options
      switch(this.chartType) {
        case 'bar':
          options = Object.assign({}, {
            title: {
              text: '通话申请次数'
            },
            tooltip: {},
            xAxis: {
              data: this.barXAxisData,
              axisLine: {
                // symbol: ['none', 'arrow'],
                // symbolSize: [8, 10]
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0,
                fontStyle: 'italic',
                margin: 32,
                rotate: 20,
                align: 'center'
              },
            },
            yAxis: {
              type: 'value',
              axisLine: {
                // symbol: ['none', 'arrow'],
                // symbolSize: [8, 10],
                // symbolOffset: 5
              },
              axisTick: {
                show: false
              }
            },
            series: [{
              type: 'bar',
              barMaxWidth: 58.8,
              itemStyle: {
                color: '#3398DB'
              },
            data: this.barData
            }]
          })
        break
      case 'pie':
        options = Object.assign({}, {
            title : {
              text: '通话总量分析'
            },
            tooltip: {},
            legend: {
              padding: 0,
              orient: 'vertical',
              left: 'right',
              top: '16%',
              data: [
                '未授权次数(未审核数)',
                '已通过审核待通话次数',
                '审核被拒绝次数',
                '狱警未审核过期次数',
                '审核通过未通话过期次数',
                '通话完成次数',
                '审核通过后取消次数'
              ]
            },
            series : [{
              type: 'pie',
              radius : '65%',
              center: [
                '40%',
                '55%'
              ],
              data: this.pieData,
              data:[
                {
                  name: '未授权次数(未审核数)',
                  value: this.meetingStatisticTotalItem['pend']
                },
                {
                  name: '已通过审核待通话次数',
                  value: this.meetingStatisticTotalItem['passed']
                },
                {
                  name: '审核被拒绝次数',
                  value: this.meetingStatisticTotalItem['denied']
                },
                {
                  name: '狱警未审核过期次数',
                  value: this.meetingStatisticTotalItem['noAuthToExpired']
                },
                {
                  name: '审核通过未通话过期次数',
                  value: this.meetingStatisticTotalItem['authedToExpired']
                },
                {
                  name: '通话完成次数',
                  value: this.meetingStatisticTotalItem['finished']
                },
                {
                  name: '审核通过后取消次数',
                  value: this.meetingStatisticTotalItem['canceled']
                }
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }]
          })
          break
        default:
          options = null
          break
        }
      return options
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
