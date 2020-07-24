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
      <m-excel-download
        slot="append"
        path="/download/province/export"
        :params="filter" />
    </m-search>
    <m-charts
      :visible="!!totalCount"
      :options="chartOptions"
      :loading="loading">
    </m-charts>
    <div style="position:absolute;color: red">asdasd</div>
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
      :total="totalCount"
      @onPageChange="getDatas"/>
  </el-row>
</template>
<script>

import { mapActions, mapState } from 'vuex'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import http from '@/service'

const chartTypes = {
  PIE: 'pie',
  BAR: 'bar',
}

export default {
  mixins: [prisonFilterCreator],
  data () {
    return {
      totalCount: 0,
      chartTypes,
      chartType: chartTypes.BAR,
      loading: true,
      meetingStatistics:[],
      meetingStatisticTotalItem:{},
      filter: {},
      searchItems: {
        time: {
          type: 'dateRange',
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
        // {
        //   label: '审核通过后取消次数(次)',
        //   prop: 'canceled',
        //   minWidth: '8.8%'
        // },
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
      barData: [],
      barXAxisData: [],
      tableDatas: []
    }
  },
  methods: {
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
      this.filter.provincesId=`20`
      const { data}  = await http.getFamilyStatistics({
        ...this.filter,
        ...this.pagination
      })
      const { item, list, totalCount }= data
      this.totalCount = totalCount ? totalCount + 1 : 0
      this.meetingStatistics=list
      this.tableDatas = this.meetingStatistics.slice(0)
      this.meetingStatisticTotalItem=item
      if (totalCount && Math.ceil(this.totalCount / rows) === page) this.tableDatas.push(this.meetingStatisticTotalItem)
    }
  },
  async mounted() {
    await this.getDatas()
    this.filterBarData()
  },
  computed: {
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
            tooltip: {
              formatter: (name)=> {
                return `${ name.name}`
              },
            },
            legend: {
              padding: [0, 50, 0,0],
              orient: 'vertical',
              selectedMode:true,
              align:'left',
              left: 'right',
              top: '16%',
              formatter: (name)=> {
                console.log(name)
                let val=""
                console.log(this.meetingStatisticTotalItem)
                if(name==`未授权次数(未审核数)`){
                  val=`          `+this.meetingStatisticTotalItem.pend
                }
                if(name==`已通过审核待见通话次数`){
                  val=`      `+this.meetingStatisticTotalItem.passed
                }
                if(name==`审核被拒绝次数`){
                  val=`                   `+this.meetingStatisticTotalItem.denied
                }
                if(name==`狱警未审核过期次数`){
                  val=`             `+this.meetingStatisticTotalItem.noAuthToExpired
                }
                if(name==`审核通过未通话过期次数`){
                  val=`      `+this.meetingStatisticTotalItem.authedToExpired
                }
                if(name==`通话完成次数`){
                  val=`                       `+this.meetingStatisticTotalItem.finished
                }
                if(name==`审核通过后取消次数`){
                  val=`             `+this.meetingStatisticTotalItem.canceled
                }
                return `${name}  ${val}(次)`
              },
              data:this.pieData
              //  [
              //   '未授权次数(未审核数)',
              //   '已通过审核待见通话次数',
              //   '审核被拒绝次数',
              //   '狱警未审核过期次数',
              //   '审核通过未通话过期次数',
              //   '通话完成次数',
              //   '审核通过后取消次数'
              // ]
            },
            series : [{
              type: 'pie',
              radius :  ['30%', '80%'],
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show:  true,
                  fontSize: '20',
                  formatter: function (name) {
                     return `${name.percent}%`
                    },
                }
              },
              center: [
                '30%',
                '50%'
              ],
              data: this.pieData,
              data:[
                {
                  name: '未授权次数(未审核数)',
                  value: this.meetingStatisticTotalItem['pend']
                },
                {
                  name: '已通过审核待见通话次数',
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
                normal: {
                  borderWidth: 1,
                  borderColor: '#fff',
                  //定义一个list，通过list获取颜色，
                  color: function (params) {
                    var colorList = [
                      '#e8a29b', '#cccccc', '#fbc8d9', '#c7d890', '#b2a4c1', '#9dbfe2', '#fbe1a1'
                    ];
                    return colorList[params.dataIndex]
                  }
                },
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
