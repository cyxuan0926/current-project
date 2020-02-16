<template>
  <el-row>
    <m-table-new
      border
      stripe
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
      @cell-click="onGetTime"
      :cols="tableCols"
      :data="meetingConfigs.testData">
    </m-table-new>
  </el-row>
</template>
<script>

import cloneDeep from 'lodash/cloneDeep'
// 凡是需要交互回去的数据 通过v-model传递过来
export default {
  data () {
    return {
      meetingConfigs: {},
      // 最原始的值 用prop传递过来
      originTableData: [
        {
          number: '44352',
          nameOne: '汪姐1',
          nameTwo: '汪姐2',
          indexNumber: 0
        },
        {
          number: '44353',
          nameOne: '汪姐3',
          nameTwo: '汪姐4',
          indexNumber: 1
        }
      ]
    }
  },
  props: {
    test: {
      type: Array,
      default: () => [
      { duration: '09:00 - 09:30', slotName: 'nameOne'},
      { duration: '09:30 - 10:00', slotName: 'nameTwo' },
      { duration: '10:30 - 11:00', slotName: 'nameThree' },
      { duration: '11:30 - 12:00', slotName: 'nameFour' }]
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    tableCols() {
      const basicCols = [
        {
          label: '终端号',
          prop: 'number',
          align: 'center'
        }
      ]
      const durationCols = this.test.map((item, index) => {
        return {
          label: item.duration,
          prop: item.slotName,
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
      const haveNoCellStyleProp = ['number']
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
      const haveNoCellStyleProp = ['number']
      const cloneDate = cloneDeep(this.originTableData)
      if (haveNoCellStyleProp.includes(column.property) || (!haveNoCellStyleProp.includes(column.property) && row[column.property])) return
      this.$set(this.meetingConfigs, 'testData', cloneDate)
      this.$set(this.meetingConfigs.testData[row.indexNumber], column.property, this.meetingConfigs.familyName)
      this.$set(this.meetingConfigs, 'isSelected', false)
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
