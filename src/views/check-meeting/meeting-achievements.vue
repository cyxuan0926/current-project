<template>
  <el-row class="row-container">
    <m-filter :filterItems="filterItems" :on-filter="onFilter" />
    <el-select v-model="chartTypeSelected">
      <el-option label="柱形图" :value="chartTypes.COLUMN" />
      <el-option label="折线图" :value="chartTypes.LINE" />
    </el-select>

    <div id="container"></div>
  </el-row>
</template>

<script>
import roles from '@/common/constants/roles'
import { Column } from '@antv/g2plot';

console.log('g2plot', Column)

const chartTypes = {
  LINE: 'line',
  COLUMN: 'column'
}

export default {
  data() {
    return {
      chartTypes,
      chartTypeSelected: chartTypes.COLUMN
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

    tableCols() {
      const result = []

      const baseCols = [{

      }]

      return result
    }
  },

  watch: {
    chartTypeSelected(val) {
      console.log('chartTypeSelected', val)
    }
  },

  mounted() {
    const data = [
  {
    type: '家具家电',
    sales: 38,
  },
  {
    type: '粮油副食',
    sales: 52,
  },
  {
    type: '生鲜水果',
    sales: 61,
  },
  {
    type: '美容洗护',
    sales: 145,
  },
  {
    type: '母婴用品',
    sales: 48,
  },
  {
    type: '进口食品',
    sales: 38,
  },
  {
    type: '食品饮料',
    sales: 38,
  },
  {
    type: '家庭清洁',
    sales: 38,
  },
];

const columnPlot = new Column(document.getElementById('container'), {
  title: {
    visible: true,
    text: '基础柱状图',
  },
  forceFit: true,
  data,
  padding: 'auto',
  data,
  xField: 'type',
  yField: 'sales',
  meta: {
    type: {
      alias: '类别',
    },
    sales: {
      alias: '销售额(万)',
    },
  },
});

columnPlot.render();
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
