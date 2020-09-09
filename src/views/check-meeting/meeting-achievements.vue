<template>
  <el-row class="row-container">
    <m-filter
      v-model="filterParams"
      :filterItems="filterItems"
      :on-filter="onFilter"
    >
      <el-select v-if="chartSelectionVisible" v-model="chartType">
        <el-option label="折线图" :value="chartTypes.LINE" />
        <el-option label="柱形图" :value="chartTypes.BAR" />
        <el-option label="隐藏图形" :value="chartTypes.NONE" />
      </el-select>
    </m-filter>

    <!-- <transition name="fade"> -->
    <m-charts :visible="chartVisible" :options="chartOptions" />
    <!-- </transition> -->

    <m-table-new
      stripe 
      :data="meetingCostSaving.meetingDistances"
      :cols="tableCols"
    />

    <m-pagination-new
      v-model="pagination"
      :total="meetingCostSaving.total"
      :on-change="onFilter"
    />
  </el-row>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { toCurrencyString } from '@/utils/helper'
import roles from '@/common/constants/roles'

const chartTypes = {
  // 折线图
  LINE: 'line',

  // 柱状图
  BAR: 'bar',

  // 隐藏图形
  NONE: 'none'
}

const dimensions = {
  // 个人维度
  INDIVIDUAL: 'INDIVIDUAL',

  // 监区维度
  PRISON_AREA: 'PRISON_AREA',

  // 监狱维度
  PRISON: 'PRISON'
}

export default {
  data() {
    return {
      loading: false,
      chartTypes,
      chartType: chartTypes.LINE,
      filterParams: {},
      pagination: { page: 1, rows: 10 },
      rankData: []
    }
  },

  computed: {
    ...mapState([
      'meetingCostSaving',
      'provincesAll']),

    ...mapGetters(['isSuperAdmin']),

    hasPrisonArea() {
      return this.$store.getters.hasPrisonArea
    },

    filterItems() {
      return [
        ...this.filterItemDimension,
        {
          type: 'daterange',
          name: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间'
        }
      ]
    },

    filterItemDimension() {
      const result = [{
        type: 'select',
        name: 'dimension',
        options: [{ value: dimensions.INDIVIDUAL, label: '个人维度' }],
        defaultValue: dimensions.INDIVIDUAL
      }]
      let provinceItem = {
        type: 'select',
        name: 'provincesId',
        placeholder: '请选择省份',
        options: [],
        filterable: true,
        loading: true,
        value: null,
        clearable: true,
        labelKey: 'name',
        valueKey: 'id'
      }
      if (this.hasPrisonArea || this.isSuperAdmin) {
        result[result.length - 1].options.push({
          value: dimensions.PRISON_AREA,
          label: '监区维度'
        })
      }

      if (this.isSuperAdmin) {
        if (this.provincesAll.length === 0) (async () => await this.getProvincesAll() )()
        provinceItem.loading = false
        provinceItem.options = this.provincesAll
        result.unshift(provinceItem)
        result[result.length - 1].options.push({ value: dimensions.PRISON, label: '监狱维度' })
      }

      return result
    },

    requetParams() {
      const result = {}
      const { daterange, provincesId } = this.filterParams

      if (provincesId) result.provincesId = provincesId

      if (daterange) {
        result.meetingStartDate = daterange[0]
        result.meetingEndDate = daterange[1]
      }

      if (!this.isSuperAdmin) {
        result.jailId = this.$store.state.global.user.jailId
      }

      return Object.assign({}, result, this.pagination)
    },

    chartSelectionVisible() {
      // 个人维度无图表选择
      if (this.filterParams.dimension === dimensions.INDIVIDUAL) {
        return false
      }

      // 监区维度统计表中，狱务通管理员不展示图形
      if (
        this.filterParams.dimension === dimensions.PRISON_AREA && this.isSuperAdmin
      ) {
        return false
      }

      return this.rankData.length > 0
    },

    chartVisible() {
      return this.chartSelectionVisible && this.chartType !== chartTypes.NONE
    },

    chartOptions() {
      if (!this.chartVisible) {
        return {}
      }

      return {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data:['距离(km)', '节约开支(元)']
        },
        xAxis: {
          data: this.xAxisData,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            rotate: 20,
            margin: 32,
            align: 'center'
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false,
          }
        },
        series: [
          {
            name: '距离(km)',
            color: '#3398db',
            barGap: 0,
            barMaxWidth: 38.2,
            type: this.chartType,
            data: this.distanceData
          },
          {
            name: '节约开支(元)',
            color: '#d48265',
            barMaxWidth: 38.2,
            type: this.chartType,
            data: this.costData
          }
        ]
      }
    },

    prisonData() {
      return this.rankData.map(item => item.jailName)
    },

    prisonAreaData() {
      return this.rankData.map(item => item.prisonArea || item.jailName)
    },

    distanceData() {
      return this.rankData.map(item => item.distance)
    },

    costData() {
      return this.rankData.map(item => item.saveMoney)
    },

    xAxisData() {
      switch (this.filterParams.dimension) {
        case dimensions.PRISON_AREA:
          return this.prisonAreaData

        case dimensions.PRISON:
          return this.prisonData
      }
    },

    tableCols() {
      const cols = {
        [dimensions.INDIVIDUAL]: [
          {
            prop: 'familyName',
            label: '家属姓名',
            minWidth: '70px',
            showOverflowTooltip: true
          },
          {
            prop: 'prisonerName',
            label: '服刑人员姓名',
            minWidth: '86px',
            showOverflowTooltip: true
          },
          {
            prop: 'prisonerNumber',
            label: '服刑人员编号',
            minWidth: '100px',
            showOverflowTooltip: true
          },
          { prop: 'meetingTime', label: '通话日期', minWidth: '110px' },
          { prop: 'duration', label: '通话时长', minWidth: '70px' },
          { prop: 'province', label: '家属通话所在省', minWidth: '100px' },
          { prop: 'city', label: '家属通话所在市', minWidth: '100px' },
          {
            prop: 'distance',
            label: '与监狱距离(km)',
            minWidth: '100px',
            formatter: this.distanceFormatter
          },
          {
            prop: 'saveMoney',
            label: '节约开支(元)',
            minWidth: '80px',
            formatter: this.currencyFormatter
          }
        ],
        [dimensions.PRISON_AREA]: [
          { prop: 'jailName', label: '监狱名称' },
          { prop: 'prisonArea', label: '监区' },
          {
            prop: 'distance',
            label: '与监狱距离(km)',
            formatter: this.distanceFormatter
          },
          {
            prop: 'saveMoney',
            label: '节约开支(元)',
            formatter: this.currencyFormatter
          }
        ],
        [dimensions.PRISON]: [
          { type: 'index', label: '排名', index: this.rank, width: '150px' },
          { prop: 'jailName', label: '监狱名称' },
          {
            prop: 'distance',
            label: '与监狱距离(km)',
            formatter: this.distanceFormatter
          },
          {
            prop: 'saveMoney',
            label: '节约开支(元)',
            formatter: this.currencyFormatter
          }
        ]
      }

      if (this.isSuperAdmin) {
        const provinceCol = {
          label: '省份',
          prop: 'provinceName'
        }
        cols[dimensions.INDIVIDUAL].unshift({
          prop: 'jailName',
          label: '监狱名称',
          minWidth: '90px',
          showOverflowTooltip: true
        })
        for (let [type, col] of Object.entries(cols)) {
          if (type === 'PRISON') col.splice(1, 0, provinceCol)
          else col.unshift(provinceCol)
        }
      }

      return cols[this.filterParams.dimension]
    }
  },

  watch: {
    filterParams: {
      deep: true,
      async handler(val) {
        this.pagination.page = 1
        await this.onFilter()
        this.rankData = this.meetingCostSaving.meetingDistances.slice(0, 10)
      }
    }
  },

  methods: {
    ...mapActions([
      'getMeetingCostSavingIndividual',
      'getMeetingCostSavingPrisonArea',
      'getMeetingCostSavingPrison',
      'getProvincesAll'
    ]),

    async onFilter() {
      try {
        switch (this.filterParams.dimension) {
          case dimensions.INDIVIDUAL:
            await this.getMeetingCostSavingIndividual(this.requetParams)
            break

          case dimensions.PRISON_AREA:
            await this.getMeetingCostSavingPrisonArea(this.requetParams)
            break

          case dimensions.PRISON:
            await this.getMeetingCostSavingPrison(this.requetParams)
            break
        }
      } catch (err) {
        console.log(err)
      }
    },

    rank(index) {
      return index + 1 + (this.pagination.page - 1) * this.pagination.rows
    },

    currencyFormatter(row, col, cellValue) {
      return toCurrencyString(cellValue || 0)
    },

    distanceFormatter(row, col, cellValue, index) {
      return toCurrencyString(cellValue || 0, 1)
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

.el-select {
  width: 13em;
}

.el-table {
  /deep/ .cell {
    padding: 0 5px;
  }
}

.m-charts {
  margin-bottom: 20px;
}
</style>
