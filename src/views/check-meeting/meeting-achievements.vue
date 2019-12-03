<template>
  <el-row class="row-container">
    <m-filter :filterItems="filterItems" :on-filter="onFilter" />
    <el-select v-model="chartType">
      <el-option label="折线图" :value="chartTypes.LINE" />
      <el-option label="柱形图" :value="chartTypes.BAR" />
      <el-option label="隐藏图形" :value="chartTypes.NONE" />
    </el-select>

    <m-charts v-show="chartOptions" :loading="loading" :options="chartOptions"/>
  </el-row>
</template>

<script>
import roles from '@/common/constants/roles'

const chartTypes = {
  LINE: 'line',
  BAR: 'bar',
  NONE: 'none'
}

export default {
  data() {
    return {
      loading: true,
      chartTypes,
      chartType: chartTypes.LINE,
      chartData: []
    }
  },

  computed: {
    filterItems() {
      const result = [
        {
          type: 'select',
          name: 'status',
          options: [{ value: 1, label: '个人维度' }],
          defaultValue: 1
        },
        {
          type: 'daterange',
          name: 'daterange',
          valueFormat: 'yyyyMM',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间'
        }
      ]

      if (this.$store.getters.hasPrisonArea) {
        result[0].options.push({ value: 2, label: '监区维度' })
      }

      if (this.$store.getters.role === roles.SUPER_ADMIN) {
        result[0].options.push({ value: 2, label: '监区维度' })
        result[0].options.push({ value: 3, label: '监狱维度' })
      }

      return result
    },

    chartOptions() {
      if (this.chartType === chartTypes.NONE) {
        return null
      }

      return {
        // title: {
        //     text: 'ECharts 入门示例'
        // },
        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: this.chartType,
            data: this.chartData
        }]
      }
    },

    // chartData() {
    //   return [5, 20, 36, 10, 10, 20]
    // },

    tableCols() {
      const result = []

      const baseCols = [{

      }]

      return result
    }
  },

  watch: {
    chartType(val) {
      console.log('chartType', val)
      // this.chartOptions.series
    }
  },

  created() {
    setTimeout(() => {
      this.chartData = [5, 20, 36, 10, 10, 20]
      this.loading = false
    }, 2000)
  },

  methods: {
    onFilter(filterParams) {
      console.log("onFilter", filterParams)
      this.filterParams = filterParams
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  display: inline-block;
  margin-right: 61.8px;
  vertical-align: top;
}

/deep/ .el-input {
  width: 13em;
}
</style>
