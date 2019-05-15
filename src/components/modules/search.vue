<template>
  <div class="filter-container">
    <div class="filter-left">
      <el-select
        v-model="pageSize"
        placeholder="请选择"
        @change="sizeChange">
        <el-option
          v-for="item in selectItem"
          :key="item"
          :label="item"
          :value="item"/>
      </el-select>
      条记录
    </div>
    <div class="filter-right">
      <template v-for="(item, index) in items">
        <el-input
          :key="index"
          clearable
          :disabled="item.disabled"
          v-if="item.type === 'input' && !item.miss"
          v-model="item.value"
          :placeholder="'请输入' + item.label" />
        <el-select
          :key="index"
          v-if="item.type === 'select' && !item.miss"
          v-model="item.value"
          :placeholder="item.noPlaceholder ? item.label : '请选择' + item.label"
          :loading="item.getting || false"
          :clearable="!item.canNotClear"
          :filterable="item.filterable">
          <template v-for="option in item.options">
            <el-option
              v-if="item.no ? (item.no.indexOf(item.belong ? option[item.belong.value] : option.value) == -1) : true"
              :key="item.belong ? option[item.belong.value] : option.value"
              :label="item.belong ? option[item.belong.label] : option.label"
              :value="item.belong ? option[item.belong.value] : option.value" />
          </template>
        </el-select>
        <el-date-picker
          :key="index"
          v-if="item.type === 'datetime' && !item.miss"
          v-model="item.value"
          type="datetime"
          :placeholder="item.label"
          align="right"
          :picker-options="pickerOptions"/>
        <el-date-picker
          :key="index"
          v-if="item.type === 'date' && !item.miss"
          v-model="item.value"
          type="date"
          value-format="yyyy-MM-dd"
          :placeholder="item.label"/>
        <el-date-picker
          :key="index"
          v-if="item.type === 'month' && !item.miss"
          v-model="item.value"
          type="month"
          :clearable="!item.canNotClear"
          :editable="!item.canNotClear"
          :picker-options="item.pickerOptions"
          value-format="yyyy-MM"
          :placeholder="item.label"/>
        <el-date-picker
          :key="index"
          v-if="item.type === 'datetimerange' && !item.miss"
          v-model="item.value"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="yyyy-MM-dd HH:mm:ss"
          :value-format=" item.valueFormat ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss' "
          :default-time="['00:00:00', '23:59:59']"/>
        <el-date-picker
          :key="index"
          v-if="item.type === 'daterange' && !item.miss"
          v-model="item.value"
          unlink-panels
          type="daterange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="yyyy-MM"
          value-format="yyyy-MM"/>
        <el-date-picker
          :key="index"
          v-if="item.type === 'dateRange' && !item.miss"
          v-model="item.value"
          type="daterange"
          :unlink-panels="item.unlinkPanels"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"/>
        <m-month-range-picker
          :key="index"
          v-if="item.type=== 'monthrange' && !item.miss"
          class="monthrange"
          :start-date-value.sync="startValue"
          :end-date-value.sync="endValue" />
        <m-month-range-selector
          :key="index"
          v-if="item.type=== 'monthRangeSelector' && !item.miss"
          class="monthRangeSelector"
          :prop="index"
          :clear="!item.canNotClear"
          :range="item.range"
          :start-key="item.startKey"
          :end-key="item.endKey"
          :start-value="item.startValue"
          :end-value="item.endValue"
          @onEnsure="onEnsure" />
      </template>
      <template v-if="items">
        <el-button
          v-if="buttonText"
          @click="onSearch">{{ buttonText }}</el-button>
        <el-button
          v-else
          icon="el-icon-search"
          @click="onSearch" />
        <slot name="append" />
      </template>
    </div>
  </div>
</template>

<script>
import { helper } from '@/utils'
export default {
  props: {
    items: {
      type: Object,
      default: () => {
        return {}
      } },
    buttonText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
<<<<<<< HEAD
      selectItem: [ 1, 10, 20, 30, 40, 50 ], // 每页可以提供的显示页数的数组
=======
      selectItem: [10, 20, 30, 40, 50], // 每页可以提供的显示页数的数组
>>>>>>> 90589b2e27bed2036e8ae3e940b6680e033bf2af
      pageSize: 10,
      startValue: null,
      endValue: null,
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  mounted() {
    this.$parent.$parent.filter = Object.assign({}, this.$parent.$parent.filterInit)
  },
  methods: {
    sizeChange(e) {
      this.$emit('sizeChange', this.pageSize)
    },
    onSearch(e) {
      if (this.items) {
        let params = {}
        Object.keys(this.items).forEach(key => {
          if (this.items[key].miss) return
          if (this.items[key].type === 'monthRangeSelector') {
            params[this.items[key].startKey] = this.items[key][this.items[key].startKey] || this.items[key].startValue
            params[this.items[key].endKey] = this.items[key][this.items[key].endKey] || this.items[key].endValue
          }
          if (this.items[key].type === 'monthrange') {
            params[this.items[key].start] = this.startValue
            params[this.items[key].end] = this.endValue
          }
          if (!this.items[key].value && parseInt(this.items[key].value) !== 0) return
          if (['datetimerange', 'daterange', 'dateRange'].indexOf(this.items[key].type) > -1) {
            params[this.items[key].start] = this.items[key].value[0]
            params[this.items[key].end] = this.items[key].value[1]
          }
          else {
            params[key] = this.items[key].value
          }
        })
        this.$parent.$parent.filter = helper.trimObject(params) || params
      }
      if (e !== 'tabs') this.$emit('search')
    },
    onEnsure(e) {
      let prop = e.prop
      Object.keys(e).forEach(key => {
        if (key === 'prop') return
        this.items[prop][key] = e[key]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-container{
  line-height: 40px;
  width: 100%;
  overflow: hidden;
  .filter-left{
    width: 170px;
    float: left;
    z-index: 10;
    margin-bottom: 10px;
    div:first-child{
      float: left;
      width: 120px;
      margin-right: 5px;
    }
  }
  .filter-right{
    width: calc(100% - 170px);
    min-width: 128px;
    float: right;
    z-index: 10;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    &>*:not(button){
      // float: left;
      width: 20%;
      max-width: 200px;
      min-width: 100px;
      margin-left: 10px;
      margin-bottom: 10px;
    }
    button{
      height: 40px;
      margin-left: 10px;
    }
  }
}
</style>
<style type="text/stylus" lang="stylus">
.filter-container .filter-right
  .monthRangeSelector
    min-width: 170px;
    .el-date-editor--daterange.el-popover__reference
      width: 100%;
      padding-left: 9px;
      padding-right: 9px;
  .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner
    width: 320px;
    max-width: 320px;
  .monthrange
    width: 230px;
    max-width: 230px;
  &>.el-date-editor.el-input, &>.el-date-editor.el-input__inner
      max-width: 230px;
      min-width: 230px;
</style>
