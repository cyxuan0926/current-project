<template>
  <fullscreen class="fullscreen-layout" ref="fullscreen" @change="handleFullscreenChange">
    <el-container class="gd-home">
      <el-header class="gd-home-title" v-show="isFullscreen"><h3>广东省可视亲情电话数据分析</h3></el-header>
      <el-container>
        <section class="gd-home__left">
          <section class="gd-home-map">
            <div class="gd-home-map-container" id="gd-home-map-container"></div>
            <transition name="modal">
              <div v-show="isShowDevice" class="gd-home-map-tooltip" :style="deviceStyle" @click.stop>
                <div class="gd-home-map-tooltip-title">
                  <i class="iconfont icon-jianyuguanli"></i>
                  <span>{{mapTooltips.name}}</span>
                </div>
                <el-table
                  class="gd-home-map-tooltip-table"
                  max-height="217"
                  :data="mapTooltips.data"
                  :cell-style="setCellStyle">
                  <el-table-column
                    prop="name"
                    label="监区名称">
                  </el-table-column>
                  <el-table-column
                    prop="terminalNumber"
                    label="设备终端号">
                  </el-table-column>
                  <el-table-column
                    prop="status"
                    label="设备状态">
                    <template slot-scope="scope">
                      <span>{{ jailStatusEm[scope.row.status] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </transition>
            <el-button class="btn-fullscreen" type="primary" icon="el-icon-full-screen" @click="handleToggle" v-if="$fullscreen.support && !isFullscreen">全屏展示</el-button>
            <div class="gd-home-map-loading" v-loading="isDrawMap"></div>
          </section>
          <section class="gd-home-statistics">
            <m-chart-block>
              <template v-slot:content>
                <h3 class="gd-home-block-title"><span>广东省亲情电话统计曲线</span></h3>
                <div class="gd-home-statistics-linechart" id="gd-home-statistics-charts"></div>
              </template>
            </m-chart-block>
          </section>  
        </section>
        <section class="gd-home__right">
          <section>
            <m-chart-block :style="{left: '30px', right: '30px', top: '16px', bottom: '16px'}">
              <template v-slot:content>
                <div class="gd-home-top8">
                  <el-date-picker
                    class="gd-home-top8-datepicker"
                    v-model="datePickerVal"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :clearable="false"
                    :picker-options="pickerOptions"
                    @change="drawTop8"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                  <h3 class="gd-home-block-title"><span>申请通话次数TOP8</span></h3>
                  <div class="gd-home-top8-block" id="top8-apply"></div>
                  <h3 class="gd-home-block-title"><span>完成通话次数TOP8</span></h3>
                  <div class="gd-home-top8-block" id="top8-complete"></div>
                </div>
              </template>
            </m-chart-block>
          </section>
        </section>
      </el-container>
    </el-container>
  </fullscreen>
</template>
<script>
  import guangdongJson from '@/assets/map/guangdong.json'
  import { getRankBarChart, getSolidCircleLineChart } from '@/utils/chartOptions'
  import http from '@/service'
  import debounce from 'lodash/debounce'
  export default {
    data() {
      return {
        isFullscreen: false,
        winHandleResize: function() {},
        datePickerVal: [],
        deviceStyle: {},
        mapChart: null,
        mapChartOptions: {},
        mapTooltips: {},
        isShowDevice: false,
        barChartApply: null,
        barChartApplyOptions: {},
        barChartComplete: null,
        barChartCompleteOptions: {},
        lineChart: null,
        lineChartOptions: {},
        lineChartStatus: [
          {
            name: '申请次数',
            color: '#5CA9E8'
          },
          {
            name: '审核通过次数',
            color: '#D2767A'
          },
          {
            name: '审核拒绝次数',
            color: '#EFB579'
          },
          {
            name: '通话成功次数',
            color: '#A692DA'
          }
        ],
        jailStatusEm: {
          online: '开机',
          offline: '关机',
          meeting_on: '会见中'
        },
        drawMapInterval: null,
        drawMapTimeout: null,
        isDrawMap: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
          }
        }
      }
    },
    methods: {
      add_0_prefix(n) {
        return `${ n < 10 ? '0' : '' }${ n }`
      },

      setCellStyle({row}) {
        return {
          'background-color': row.status == 'offline' ? '#eb6100' : (row.status == 'online' ? '#6CDFF5' : '#4BF26F')
        }
      },

      formateDate(date) {
        return `${ date.getFullYear() }-${ this.add_0_prefix(date.getMonth() + 1) }-${ date.getDate
        () }`
      },

      setDefaultPickerDate() {
        const eDate = new Date()
        eDate.setDate( eDate.getDate() - 1 )
        const sDate = new Date()
        sDate.setDate( sDate.getDate() - 31 )
        this.datePickerVal = [this.formateDate(sDate), this.formateDate(eDate)]
      },

      setFitview(x, y) {
        const h = document.querySelector('#gd-home-map-container').offsetHeight
        const toolTip_h = 242
        let top
        if(h >= toolTip_h) {
          top = y - toolTip_h / 2
          if(top < 0) {
            top = 0
          }
          if( h - y < toolTip_h / 2 ) {
            top = h - toolTip_h
          }
        }
        this.deviceStyle = {
          left: (x + 5) + 'px',
          top: top + 'px'
        }
      },

      getMonthAxis(i) {
        const date = new Date()
        let y = date.getFullYear()
        let m = date.getMonth() + 1
        let res = []
        for( ; i > 0; i-- ) {
          if( --m < 0 ) {
            m = 12
            y--
          }
          res.unshift(`${ y }-${ this.add_0_prefix(m) }`)
        }
        return res
      },

      async drawTop8() {
        let { totalTop = [], finishedTotalTop = [] } = await http.getHometop({
          startDate: this.datePickerVal[0],
          endDate: this.datePickerVal[1],
          topN: 8
        })
        totalTop.reverse()
        finishedTotalTop.reverse()

        // 申请通话次数
        this.barChartApplyOptions.yAxis.data = totalTop.map(t => t.jailName)
        this.barChartApplyOptions.series[0].data = totalTop.map( t => t.total )
        this.barChartApply.setOption(this.barChartApplyOptions)
        // 完成通话次数
        this.barChartCompleteOptions.yAxis.data = finishedTotalTop.map(t => t.jailName)
        this.barChartCompleteOptions.series[0].data = finishedTotalTop.map( t => t.total )
        this.barChartComplete.setOption(this.barChartCompleteOptions)
      },

      initTop8() {
        this.barChartApply = echarts.init(document.getElementById('top8-apply'))
        this.barChartApplyOptions = getRankBarChart({
          itemColor: new echarts.graphic.LinearGradient(
            0, 0, 1, 1,
            [
              {offset: 0, color: '#0043F4'},
              {offset: 1, color: '#48AEF8'}
            ]
          ),
          labelColor: '#4FA5E4',
          formatter: '{c}次'
        })

        this.barChartComplete = echarts.init(document.getElementById('top8-complete'))
        this.barChartCompleteOptions = getRankBarChart({
          itemColor: new echarts.graphic.LinearGradient(
            0, 0, 1, 1,
            [
              {offset: 0, color: '#80C654'},
              {offset: 1, color: '#B8E2C0'}
            ]
          ),
          labelColor: '#B7E1BF',
          formatter: '{c}次'
        })

        this.drawTop8()
      },

      async drawLineChart() {
        const { monthList } = await http.getTotalMonthReport({
          nums: document.documentElement.clientWidth > 1440 ? 12 : 6
        }) || []
        const xaxis = []
        const total = []
        const passedTotal = []
        const deniedTotal = []
        const finishedTotal = []
        monthList.forEach(d => {
          xaxis.push( d.reportDate )
          total.push( d.total )
          passedTotal.push( d.passedTotal )
          deniedTotal.push( d.deniedTotal )
          finishedTotal.push( d.finishedTotal )
        })

        this.lineChartOptions.xAxis.data = xaxis
        this.lineChartOptions.series.push(
          Object.assign({ data: total }, getSolidCircleLineChart({
            name: '申请次数',
            color: '#5CA9E8'
          })),
          Object.assign({ data: passedTotal }, getSolidCircleLineChart({
            name: '审核通过次数',
            color: '#D2767A'
          })),
          Object.assign({ data: deniedTotal }, getSolidCircleLineChart({
            name: '审核拒绝次数',
            color: '#EFB579'
          })),
          Object.assign({ data: finishedTotal }, getSolidCircleLineChart({
            name: '通话成功次数',
            color: '#A692DA'
          }))
        )
        this.lineChart.setOption(this.lineChartOptions)
      },

      initLineChart() {
        this.lineChart = echarts.init(document.getElementById('gd-home-statistics-charts'));
        this.lineChartOptions = {
          grid: {
            top: 30,
            left: 0,
            right: 0,
            bottom: 0,
            containLabel: true
          },
          legend: {
            top: 5,
            data: this.lineChartStatus.map(d => ({
              name: d.name,
              textStyle: {
                color: d.color
              }
            }))
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              color: '#6EA8C3'
            },
            axisTick: {
              inside: true,
              alignWithLabel: true,
              lineStyle: {
                color: '#6EA8C3'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#6EA8C3'
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: '#6EA8C3'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          series: []
        }

        this.drawLineChart()
      },

      async drawMap() {
        if( this.isDrawMap ) {
          return
        }
        this.isDrawMap = true
        const { jailList = [] } = await http.getJailstatus()
        const onlineArr = []
        const offlineArr = []
        jailList.forEach((d) => {
          let opt = {
            name: d.name,
            value: [d.longitude, d.latitude, d.jailId]
          }
          if( d.status == 'offline' ) {
            offlineArr.push(Object.assign(opt, {
              itemStyle: {
                borderColor: '#eb6100'
              }
            }))
          }else {
            onlineArr.push(Object.assign(opt, {
              itemStyle: {
                borderColor: '#6CDFF5'
              }
            }))
          }
        })
        this.mapChartOptions.series[0].data = onlineArr
        this.mapChartOptions.series[1].data = offlineArr
        this.mapChart.setOption(this.mapChartOptions)
        if( this.drawMapTimeout ) {
          clearTimeout( this.drawMapTimeout )
        }
        this.drawMapTimeout = setTimeout(() => {
          this.isDrawMap = false
        }, 2000)
      },

      initMap() {
        echarts.registerMap('guangdong', guangdongJson)
        this.mapChart = echarts.init(document.getElementById('gd-home-map-container'))
        this.mapChartOptions = {
          tooltip: {
            show: false
          },
          geo: {
            map: 'guangdong',
            emphasis: {
              label: {
                show: false
              },
              itemStyle: {
                areaColor: '#286DBA'
              }
            },
            itemStyle: {
              areaColor: '#286DBA',
              borderColor: '#fff'
            },
            layoutCenter: ['50%', '50%'],
            layoutSize: '100%'
          },
          series: [
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              symbolSize: 20,
              label: {
                show: true,
                color: '#fff',
                position: 'top',
                backgroundColor: '#70186C',
                borderRadius: 7,
                padding: [4, 7],
                formatter: '{b}'
              },
              data: [],
              itemStyle: {
                color: '#fff',
                shadowBlur: 16,
                shadowColor: '#2158DD',
                borderWidth: 5
              },
              showEffectOn: 'render',
              zlevel: 1
            },
            {
              type: 'scatter',
              coordinateSystem: 'geo',
              symbolSize: 12,
              label: {
                show: true,
                color: '#fff',
                position: 'top',
                backgroundColor: '#eb6100',
                borderRadius: 7,
                padding: [4, 7],
                formatter: '{b}'
              },
              data: [],
              itemStyle: {
                color: '#fff',
                borderWidth: 4
              },
              zlevel: 1
            }
          ]
        }

        this.mapChart.on('click', 'series', async ({ data, event }) => {
          if( !this.isShowDevice ) {
            const { terminalList = [] } = await http.getTerminalList({
              name: data.name,
              jailId: data.value[2]
            })
            this.mapTooltips = {
              name: data.name,
              data: terminalList
              //data: this.deviceData
            }
            this.setFitview(event.offsetX, event.offsetY)
            this.isShowDevice = true
          }
        })

        document.body.onclick = () => {
          this.isShowDevice = false
        }

        this.drawMap()
      },

      handleFullscreenChange(val) {
        this.isFullscreen = val
      },

      handleToggle() {
        this.$refs['fullscreen'].toggle()
      },

      handleResize() {
        this.mapChart.resize()
        this.lineChart.resize()
        this.barChartApply.resize()
        this.barChartComplete.resize()
      }
    },
    mounted() {
      if( this.drawMapInterval ) {
        clearInterval(this.drawMapInterval)
      }
      this.setDefaultPickerDate()
      this.initMap()
      this.initLineChart()
      this.initTop8()
      this.drawMapInterval = setInterval(this.drawMap, 5 * 60 * 1000)
      this.winHandleResize = debounce(this.handleResize, 400)
      window.addEventListener('resize', this.winHandleResize)
    },
    destroyed() {
      this.mapChart = null
      this.lineChart = null
      this.barChartApply = null
      this.barChartComplete = null
      clearInterval(this.drawMapInterval)
      clearTimeout( this.drawMapTimeout )
      window.removeEventListener('resize', this.winHandleResize)
    }
  }
</script>
<style lang="scss" scoped>
  .fullscreen-layout {
    height: 100%;
    display: flex;
    flex: 1;
  }

  .gd-home {
    height: 100%;
    background-color: #000A26;

    &-title {
      background: url('../../assets/images/gd-admin-title-bg.png') repeat-x left top;

      h3 {
        width: 960px;
        margin: 0 auto;
        font-size: 0;
        text-indent: -99px;
        overflow: hidden;
        height: 47px;
        background: #000A26 url('../../assets/images/gd-admin-title.png') no-repeat center top;
      }
      
    }

    &__left, &__right {
      padding: 16px 30px;
    }

    &__left {
      width: 55%;
      display: flex;
      flex-direction: column;

      .gd-home-map {
        flex: 3;
        position: relative;

        &-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        &-tooltip {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 3;
          width: 240px;
          color: #fff;
          border: 1px solid #fff;
          opacity: .9;
          
          &-title {
            text-align: center;
            height: 24px;
            line-height: 24px;
            background-color: #2F7DDF;
            border-bottom: 1px solid #fff;
          }
        }

        &-loading {
          position: absolute;
          width: 56px;
          height: 56px;
          left: 0;
          top: 0;
          z-index: 4;
        }

        .btn-fullscreen {
          position: absolute;
          right: 0;
          top: 10px;
          z-index: 4;
          background-color: transparent;
          border-color: transparent;
          color: #6CDFF5;
        }
      }

      .gd-home-statistics {
        flex: 2;
        position: relative;

        &-linechart {
          position: absolute;
          left: 16px;
          right: 16px;
          top: 30px;
          bottom: 5px;
        }
      }

    }

    &__right {
      width: 45%;
      margin-left: -30px;
      position: relative;
    }

    &-block-title {
      height: 27px;
      text-align: center;
      overflow: hidden;
      margin: 0;

      span {
        display: inline-block;
        height: 26px;
        line-height: 26px;
        vertical-align: top;
        position: relative;
        color: #6CDFF5;
        font-size: 14px;
        font-weight: 500;

        &:after {
          display: block;
          content: '';
          width: 100%;
          height: 1px;
          bottom: 0;
          left: 0;
          background-image: linear-gradient(to right, #3F7FE2, #6CDFF5);
        }
      }
    }

    &-top8 {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;

      &-datepicker {
        margin: 16px 0;
      }

      &-block {
        flex: 1;
        width: 100%;
        margin: 8px 0 16px;
      }
    }

    /deep/ .el-date-editor {
      color: #6CDFF5;
      border-color: #6CDFF5;
      background-color: transparent;

      .el-range-input {
        color: #6CDFF5;
        background: none;

        &::-webkit-input-placeholder {
          color: #467684;
        }
      }

      .el-input__icon,
      .el-range-separator {
        color: #6CDFF5;
      }
    }

    /deep/ .gd-home-map-tooltip-table {
      border: none !important;
      margin-bottom: -1px;

      thead th,
      tbody td {
        padding: 0 !important;
        height: 22px;
        line-height: 22px;
        color: #fff;
        border-bottom: 1px solid #fff !important;
      }

      thead th {
        background-color: #FB721F;
      }
    }

    /deep/ .gd-home-map-loading {
      .el-loading-mask {
        background-color: transparent !important;
        
        .el-loading-spinner {
          margin-top: -11px;

          .circular {
            width: 22px;
            height: 22px;

            .path {
              stroke: #6CDFF5;
            }
          }
        }
      }
    }

  }
</style>
