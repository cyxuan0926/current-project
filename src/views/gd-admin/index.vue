<template>
  <el-container class="gd-home">
    <!-- <el-header class="gd-home-title">广东监狱管理首页</el-header> -->
    <el-container>
      <section class="gd-home__left">
        <section class="gd-home-map">
          <div class="gd-home-map-container" id="gd-home-map-container"></div>
          <div class="gd-home-map-tooltip">
            <div class="gd-home-map-tooltip-title">
              <i class="iconfont icon-jianyuguanli"></i>
              <span>韶关监狱</span>
            </div>
            <el-table
              class="gd-home-map-tooltip-table"
              max-height="217"
              :data="deviceData"
              :cell-style="setCellStyle">
              <el-table-column
                prop="title"
                label="监区名称">
              </el-table-column>
              <el-table-column
                prop="no"
                label="设备终端号">
              </el-table-column>
              <el-table-column
                prop="status"
                label="设备状态">
              </el-table-column>
            </el-table>
          </div>
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
                  v-model="value1"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
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
</template>
<script>
  import guangdongJson from '@/assets/map/guangdong.json'
  import AmapUtil from '@/utils/amapUtil'
  export default {
    data() {
      return {
        deviceData: [
          {
            title: 'aaaa',
            no: '123456',
            status: 0
          },
          {
            title: 'bbbbb',
            no: '123456',
            status: 0
          },
          {
            title: '哈哈哈',
            no: '123456',
            status: 2
          },
          {
            title: 'aaaa',
            no: '123456',
            status: 1
          },
          {
            title: '哈哈哈222',
            no: '123456',
            status: 2
          },
          {
            title: 'aaaa2222',
            no: '123456',
            status: 1
          },
          {
            title: '哈哈哈222',
            no: '123456',
            status: 2
          },
          {
            title: 'aaaa2222',
            no: '123456',
            status: 1
          },
          {
            title: '哈哈哈444',
            no: '123456',
            status: 2
          },
          {
            title: 'aaaa444',
            no: '123456',
            status: 1
          }
        ],
        instance: null,
        value1: ''
      }
    },
    methods: {
      setCellStyle({row}) {
        return {
          'background-color': row.status == 0 ? '#FE3567' : (row.status == 1 ? '#2DD5FF' : '#4BF26F')
        }
      },
      initTop8() {
        const barChartApply = echarts.init(document.getElementById('top8-apply'));
        const barChartComplete = echarts.init(document.getElementById('top8-complete'));
        barChartApply.setOption({
          grid: {
            top: 0,
            left: 30,
            right: 30,
            bottom: 0,
            containLabel: true
          },
          xAxis: {
            type: 'value',
            axisLabel: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'category',
            axisLabel: {
              color: '#E7E7EA',
              margin: 20
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            data: ['从化监狱', '英德监狱', '东莞监狱', '四会监狱', '明康监狱', '高明监狱', '肇庆监狱', '北江监狱']
          },
          series: [
            {
              type: 'bar',
              barWidth: 10,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 1, 1,
                  [
                    {offset: 0, color: '#0043F4'},
                    {offset: 1, color: '#48AEF8'}
                  ]
                )
              },
              label: {
                show: true,
                formatter: '{c}次',
                position: 'right',
                color: '#4FA5E4',
                fontSize: 14,
                fontStyle: 'italic',
                fontWeight: 'bold'
              },
              data: [96, 94, 115, 84, 82, 88, 102, 66]
            }
          ]
        })

        barChartComplete.setOption({
          grid: {
            top: 0,
            left: 30,
            right: 30,
            bottom: 0,
            containLabel: true
          },
          xAxis: {
            type: 'value',
            axisLabel: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'category',
            axisLabel: {
              color: '#E7E7EA',
              margin: 20
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            data: ['从化监狱', '英德监狱', '东莞监狱', '四会监狱', '明康监狱', '高明监狱', '肇庆监狱', '北江监狱']
          },
          series: [
            {
              type: 'bar',
              barWidth: 10,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 1, 1,
                  [
                    {offset: 0, color: '#80C654'},
                    {offset: 1, color: '#B8E2C0'}
                  ]
                )
              },
              label: {
                show: true,
                formatter: '{c}次',
                position: 'right',
                color: '#B7E1BF',
                fontSize: 14,
                fontStyle: 'italic',
                fontWeight: 'bold'
              },
              data: [96, 94, 115, 84, 82, 88, 102, 66]
            }
          ]
        })

      },

      initLineChart() {
        const lineChart = echarts.init(document.getElementById('gd-home-statistics-charts'));
        lineChart.setOption({
          grid: {
            top: 30,
            left: 0,
            right: 0,
            bottom: 0,
            containLabel: true
          },
          legend: {
            top: 5,
            data: [
              {
                name: '申请次数',
                textStyle: {
                  color: '#5CA9E8'
                }
              },
              {
                name: '审核通过次数',
                textStyle: {
                  color: '#D2767A'
                }
              },
              {
                name: '审核拒绝次数',
                textStyle: {
                  color: '#EFB579'
                }
              },
              {
                name: '通话成功次数',
                textStyle: {
                  color: '#A692DA'
                }
              }
            ]
          },
          xAxis: {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月'],
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
          series: [
            {
              name: '申请次数',
              type: 'line',
              symbol: 'circle',
              data: [120, 132, 101, 134, 90, 230, 210],
              lineStyle: {
                color: '#5CA9E8'
              },
              itemStyle: {
                color: '#5CA9E8',
                borderWidth: 3,
                borderColor: '#5CA9E8'
              }
            },
            {
              name: '审核通过次数',
              type: 'line',
              symbol: 'circle',
              data: [220, 182, 191, 234, 290, 330, 310],
              lineStyle: {
                color: '#D2767A'
              },
              itemStyle: {
                color: '#D2767A',
                borderWidth: 3,
                borderColor: '#D2767A'
              }
            },
            {
              name: '审核拒绝次数',
              type: 'line',
              symbol: 'circle',
              data: [150, 232, 201, 154, 190, 330, 410],
              lineStyle: {
                color: '#EFB579'
              },
              itemStyle: {
                color: '#EFB579',
                borderWidth: 3,
                borderColor: '#EFB579'
              }
            },
            {
              name: '通话成功次数',
              type: 'line',
              symbol: 'circle',
              data: [320, 332, 301, 334, 390, 330, 320],
              lineStyle: {
                color: '#A692DA'
              },
              itemStyle: {
                color: '#A692DA',
                borderWidth: 3,
                borderColor: '#A692DA'
              }
            }
          ]
        })
      },
      initMap() {
        echarts.registerMap('guangdong', guangdongJson);
        const myCharts = echarts.init(document.getElementById('gd-home-map-container'));
        myCharts.setOption({
          tooltip: {
            show: false
          },
          geo: {
            map: 'guangdong',
            emphasis: {
              label: {
                show: true,
                triggerOn: 'click'
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
              symbolSize: 14,
              label: {
                show: true,
                color: '#fff',
                position: 'top',
                backgroundColor: '#70186C',
                borderRadius: 7,
                padding: [4, 7],
                formatter: '{b}'
              },
              data: [
                {
                  name: '韶关监狱',
                  value: [113.23,23.16]
                },
                {
                  name: '肇庆监狱',
                  value: [113.38,22.52]
                },
                {
                  name: '东莞监狱',
                  value: [114.07,22.62]
                },
                {
                  name: '从化监狱',
                  value: [113.52,22.3]
                }
              ],
              itemStyle: {
                color: '#fff',
                shadowBlur: 16,
                shadowColor: '#2158DD',
                borderWidth: 4,
                borderColor: '#75F950'
              },
              showEffectOn: 'render',
              zlevel: 1
            }
          ]
        })

        myCharts.on('click', 'series.effectScatter', function(params) {
          console.log(params)
        })
      }
    },
    mounted() {
      this.initMap()
      this.initLineChart()
      this.initTop8()
    }
  }
</script>
<style lang="scss" scoped>
  .gd-home {
    height: 100%;
    background-color: #000A26;

    &-title {
      height: 44px;
      background: gray;
    }

    &__left, &__right {
      padding: 16px 30px;
    }

    &__left {
      width: 50%;
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
          opacity: .8;
          
          &-title {
            text-align: center;
            height: 24px;
            line-height: 24px;
            background-color: #2F7DDF;
            border-bottom: 1px solid #fff;
          }
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
      width: 50%;
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

  }
</style>
