<template>
  <el-row class="el-row__time">
    <m-table-new
      border
      stripe
      :height="tableHeight"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
      @cell-click="onGetTime"
      :cols="tableCols"
      :data="meetingConfigs.tableData"
    />
  </el-row>
</template>
<script>

import cloneDeep from 'lodash/cloneDeep'
// 凡是需要交互回去的数据 通过v-model传递过来
export default {
  data () {
    return {
      meetingConfigs: {}
    }
  },
  props: {
    tableProps: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    tableHeight() {
      const height = this.tableProps.length > 12 ? 50 : 41
      return this.meetingConfigs.tableData.length > 10 ? 10 * height : (this.meetingConfigs.tableData.length + 1) * height
    },
    tableCols() {
      const basicCols = [
        {
          label: '终端号',
          prop: 'terminalNumber',
          align: 'center'
        }
      ]
      const durationCols = this.tableProps.map(item => {
        return {
          label: item.label,
          prop: item.prop,
          align: 'center'
        }
      })
      return [
        ...basicCols,
        ...durationCols
      ]
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
       handler(val) {
        this.meetingConfigs = Object.assign({}, this.meetingConfigs, val)
      }
    }
  },
  methods: {
    cellStyle({row, column, rowIndex, columnIndex}) {
      const haveNoCellStyleProp = ['terminalNumber']
      const occupiedCellStyle = {
        background: '#A8ACB1',
        transition: 'background 0.3s ease-in-out',
        cursor: 'not-allowed',
        color: '#fff'
      }
      const selectedCellStyle = {
        background: '#3c8dbc',
        transition: 'background 0.3s ease-in-out',
        cursor: 'not-allowed',
        color: '#fff'
      }
      const border_rigth__none = {
          borderRight: 'none'
      }
      const cursorShow = {
        cursor: 'pointer'
      }
      const notAllowedShow = {
        cursor: 'not-allowed'
      }
      if (haveNoCellStyleProp.includes(column.property)) return notAllowedShow
      else {
        if (row[column.property]) {
          if (row[column.property] !== this.meetingConfigs.familyName)
            if (columnIndex === this.tableCols.length - 1) return {...occupiedCellStyle, ...border_rigth__none}
            else return occupiedCellStyle
          else
            if (columnIndex === this.tableCols.length - 1) return {...selectedCellStyle, ...border_rigth__none}
            else return selectedCellStyle
        }
        else
          if (columnIndex === this.tableCols.length - 1) return {...cursorShow, ...border_rigth__none}
          else return cursorShow
      }
    },
    headerCellStyle({row, column, rowIndex, columnIndex}) {
      if (columnIndex === this.tableCols.length - 1)
        return {
          borderRight: 'none'
        }
    },
    onGetTime(row, column, cell, event) {
      const haveNoCellStyleProp = ['terminalNumber']
      const cloneDate = cloneDeep(this.meetingConfigs.originTableData)
      if (haveNoCellStyleProp.includes(column.property) || (!haveNoCellStyleProp.includes(column.property) && row[column.property])) return
      this.$set(this.meetingConfigs, 'tableData', cloneDate)
      this.$set(this.meetingConfigs.tableData[row.indexNumber], column.property, this.meetingConfigs.familyName)
      this.$set(this.meetingConfigs, 'isSelected', false)
      this.$set(this.meetingConfigs, 'terminalId', row.terminalId)
      this.$set(this.meetingConfigs, 'meetingTime', column.property)
      this.$emit('input', this.meetingConfigs)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-table {
  /deep/ td {
    border-bottom: 1px solid #e6e6e6 !important;
  }
  /deep/ th {
    border-bottom: 1px solid #e6e6e6 !important;
  }
}
</style>
