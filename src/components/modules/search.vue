<template>
  <div class="filter-container">
    <div class="filter-right">
      <template v-for="(item, index) in items">
        <template v-if="$_elInputTypes.includes(item.type) && !item.miss">
          <el-input
            v-model.trim="item.value"
            :class="{'inputHeight': item.type === 'number'}"
            :key="index"
            :type="item.type"
            clearable
            :disabled="item.disabled"
            :placeholder="item.noPlaceholder ? item.label : '请输入' + item.label"
            v-bind="item.attrs || item.type === 'number' ?  {
              min: 0,
              onKeypress: $_limitInputPositiveInteger
            } : {}"
          />
        </template>

        <template v-if="item.type === 'select' && !item.miss">
          <el-select
            v-model="item.value"
            :key="index"          
            v-autowidth:10="item.value"
            :placeholder="item.noPlaceholder ? item.label : '请选择' + item.label"
            :loading="item.getting || false"
            :clearable="!item.canNotClear"
            :filterable="item.filterable"
            @change="onSelectChange(item.selectKey ? item.selectKey : item.correlation, item.value)"
          >
            <template v-for="(option, i) in item.options">
              <el-option
                v-if="item.no ? (item.no.indexOf(item.belong ? option[item.belong.value] : option.value) == -1) : true"
                :key="i"
                :label="item.belong ? option[item.belong.label] : option.label"
                :value="item.belong ? option[item.belong.value] : option.value"
              />
            </template>
          </el-select>
        </template>

        <template v-if="item.type === 'datetime' && !item.miss">
          <el-date-picker
            v-model="item.value"
            :key="index"
            type="datetime"
            :placeholder="item.label"
            align="right"
            :picker-options="pickerOptions"
            :clearable="false"
          />
        </template>

        <template v-if="item.type === 'date' && !item.miss">
          <el-date-picker
            v-model="item.value"
            :key="index"
            type="date"
            value-format="yyyy-MM-dd"
            :placeholder="item.label"
            clearable
          />
        </template>

        <template v-if="item.type === 'month' && !item.miss">
          <el-date-picker
            v-model="item.value"
            :key="index"
            type="month"
            :size="item.size"
            :clearable="false"
            :editable="!item.canNotClear"
            :picker-options="item.pickerOptions"
            value-format="yyyy-MM"
            :placeholder="item.label"
          />
        </template>

        <template v-if="item.type === 'year' && !item.miss">
          <el-date-picker
            v-model="item.value"
            :key="index"
            type="year"
            :size="item.size"
            :clearable="false"
            :editable="!item.canNotClear"
            :picker-options="item.pickerOptions"
            value-format="yyyy"
            :placeholder="item.label"
          />
        </template>

        <template v-if="item.type === 'datetimerange' && !item.miss">
          <el-date-picker
            v-model="item.value"
            :key="index"
            type="datetimerange"
            unlink-panels
            :start-placeholder=" item.startPlaceholder || '开始时间' "
            :end-placeholder=" item.endPlaceholder || '结束时间'"
            format="yyyy-MM-dd HH:mm:ss"
            :value-format=" item.valueFormat ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss' "
            :default-time="['00:00:00', '23:59:59']"
            :clearable="false"
          />
        </template>

        <template v-if="item.type === 'daterange' && !item.miss">
          <el-date-picker
            v-model="item.value"
            :key="index"
            :clearable="false"
            unlink-panels
            type="daterange"
            :start-placeholder="item.startPlaceholder || '开始时间'"
            :end-placeholder="item.endPlaceholder || '结束时间'"
            format="yyyy-MM"
            value-format="yyyy-MM"
            :picker-options="item.pickerOptions"
            
          />
        </template>

        <template v-if="item.type === 'dateRange' && !item.miss">
          <el-date-picker
            v-model="item.value"
            :key="index"
            :clearable="typeof item.canNotClear === 'undefined' ? false : !item.canNotClear"
            type="daterange"
            :disabled="item.disabled || false"
            :unlink-panels="item.unlinkPanels"
            :start-placeholder="item.startPlaceholder || '开始时间'"
            :end-placeholder="item.endPlaceholder || '结束时间'"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="item.pickerOptions"
          />
        </template>

        <template v-if="item.type=== 'monthrange' && !item.miss">
          <m-month-range-picker
            :key="index"
            class="monthrange"
            :start-date-value.sync="startValue"
            :end-date-value.sync="endValue"
          />
        </template>

        <template v-if="item.type=== 'monthRangeSelector' && !item.miss">
          <m-month-range-selector
            :key="index"
            v-model="item.value"
            class="monthRangeSelector"
            :prop="index"
            :clear="false"
            :range="item.range"
            :start-key="item.startKey"
            :end-key="item.endKey" 
          />
        </template>

        <template v-if="item.slotName">
          <slot :name="item.slotName" />
        </template>
      </template>

      <template v-if="showSearchIcon">
        <slot name="pre" />

        <el-button v-if="buttonText" @click="onSearch">{{ buttonText }}</el-button> 

        <el-button
          v-else
          icon="el-icon-search"
          @click="onSearch"
        />

        <el-button
          v-if="clearable"
          type="warning"
          @click="onClear"
        >清空</el-button>

        <slot name="append" />
      </template>
    </div>
  </div>
</template>

<script>
import autowidth from '@/common/directives/autowidth'
import { helper } from '@/utils'
import moment from 'moment'

export default {
  props: {
    items: {
      type: Object,
      default: () => {}
    },

    buttonText: {
      type: String,
      default: ''
    },

    clearable: Boolean
  },

  data() {
    return {
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
      },

      showSearchIcon: true
    }
  },

  watch: {
    items: {
      handler(val) {
        // 是否显示查询的按钮
        this.showSearchIcon = val && !Object.values(val).every(item => item && item.miss)
      },
      deep: true,
      immediate: true
    }
  },

  directives: { autowidth },

  mounted() {
    this.$parent.$parent.filter = Object.assign({}, this.$parent.$parent.filterInit)
  },

  methods: {
    onSearch(e) {
      this.onGetFilter()
      // search组件 添加判断逻辑 家属姓名、罪犯姓名、罪犯编号和日期选择 不可同时为空  日期选择范围不可大于1年
      // 父组件如果定义了是否添加此限制 isSearchLimit true
      let { isSearchLimit, filter: { name, prisonerName, prisonerNumber, familyName, criminalNumber, criminalName} } = this.$parent.$parent
      if (isSearchLimit) {
        let _dateKey = Object.values(this.items).find(v => !v.miss && v.type == 'dateRange')
        if (_dateKey && !this.$parent.$parent.filter[_dateKey.start] && !name && !familyName&& !criminalNumber && !prisonerName && !criminalName && !prisonerNumber) {
          // tab切换时候不提示
          e !== 'tabs' && this.$message.warning('请输入家属姓名、罪犯姓名、罪犯编号或申请时间')
          return false
        }
        if (_dateKey ) {
          let _start = this.$parent.$parent.filter[_dateKey.start]
          
          console.log(_start)
          _start = _start && moment(_start, 'YYYY-MM-DD')
          let _end = this.$parent.$parent.filter[_dateKey.end]
          _end = _end && moment(_end, 'YYYY-MM-DD')
          if (_start && _end && _end.diff(_start, 'years', true) * 100 > 100 ) {
            e !== 'tabs' && this.$message.warning('开始时间-结束时间的选择范围不可大于1年')
            return false
          }
        }
      }

      if (e !== 'tabs') {
        this.$emit('search')
      }

      return true
    },

    // onEnsure(e) {
    //   let prop = e.prop

    //   Object.keys(e).forEach(key => {
    //     if (key === 'prop') return
    //     this.items[prop][key] = e[key]
    //   })
    // },

    onSelectChange(selectKey, value) {
      this.$emit('searchSelectChange', selectKey, value)
    },

    onClear() {
      Object.keys(this.items).forEach(key => {
        if (this.items[key].miss) {
          return
        }
        // if (this.items[key].type === 'monthRangeSelector') {
        //   this.items[key][this.items[key].startKey] = this.items[key].startValue || ''
        //   // params[this.items[key].startKey] = this.items[key][this.items[key].startKey] || this.items[key].startValue
        //   this.items[key][this.items[key].endKey] = this.items[key].endValue || ''
        //   // params[this.items[key].endKey] = this.items[key][this.items[key].endKey] || this.items[key].endValue
        // }
        // if (this.items[key].type === 'monthrange') {
        //   this.startValue = this.endValue = ''
        //   // params[this.items[key].start] = this.startValue
        //   // params[this.items[key].end] = this.endValue
        // }
        // // if (!this.items[key].value && parseInt(this.items[key].value) !== 0) return
        // if (['datetimerange', 'daterange', 'dateRange'].indexOf(this.items[key].type) > -1) {
        //   this.items[key].value = null
        //   // params[this.items[key].start] = this.items[key].value[0]
        //   // params[this.items[key].end] = this.items[key].value[1]
        // }
        // else {
        //   this.items[key].value = ''
        //   // params[key] = this.items[key].value
        // }
        this.$set(this.items[key], 'value', '')
      })

      this.$parent.$parent.filter = {}
    },

    onGetFilter() {
      if (this.items) {
        let params = {}

        Object.keys(this.items).forEach(key => {
          if (this.items[key].miss || this.items[key].slotName) {
            return
          }

          if (this.items[key].type === 'monthRangeSelector') {
            params[this.items[key].startKey] = this.items[key].value[0]
            params[this.items[key].endKey] = this.items[key].value[1]

            return
          }

          if (this.items[key].type === 'monthrange') {
            params[this.items[key].start] = this.startValue
            params[this.items[key].end] = this.endValue

            return
          }

          if (!this.items[key].value && parseInt(this.items[key].value) !== 0) {
            return
          }

          if (['datetimerange', 'daterange', 'dateRange'].indexOf(this.items[key].type) > -1) {
            params[this.items[key].start] = this.items[key].value[0]
            params[this.items[key].end] = this.items[key].value[1]
          } else {
            params[key] = this.items[key].value
          }
        })

        const _prisonConfigId = params.prisonFloor || params.prisonHouse || params.prisonSubArea || params.prisonArea || ''

        if (_prisonConfigId) {
          params.prisonConfigId = _prisonConfigId

          if (params.prisonArea) {
            delete params.prisonArea
          }

          if (params.prisonSubArea) {
            delete params.prisonSubArea
          }

          if (params.prisonHouse) {
            delete params.prisonHouse
          }

          if (params.prisonFloor) {
            delete params.prisonFloor
          }
        }
        // 如果当前实例没有父实例，此实例将会是其自己
        this.$parent.$parent.filter = helper.trimObject(params) || params
      }
    }
  }
  //  destroyed() {
  //   const keys = Object.keys(this.items)

  //   keys.forEach(key => {
  //     if (this.items[key].type === 'monthRangeSelector') {
  //       this.items[key][this.items[key].startKey] = ''

  //       this.items[key][this.items[key].endKey] = ''
  //     }
  //   })
  // }
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/custom-element.scss";
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input[type="number"]{
  -moz-appearance: textfield;
}

.filter-container{
  // line-height: 40px;
  // width: 100%;
  overflow: hidden;
  // padding-bottom: 10px;
  
  // .filter-left{
  //   width: 170px;
  //   float: left;
  //   z-index: 10;
  //   margin-bottom: 10px;
  //   div:first-child{
  //     float: left;
  //     width: 120px;
  //     margin-right: 5px;
  //   }
  // }
  .filter-right /deep/ {
    // width: calc(100% - 170px);
    // min-width: 128px;
    // float: right;
    z-index: 10;
    display: flex;
    // justify-content: flex-end;
    flex-wrap: wrap;
    & > *:not(button){
      // float: left;
      // width: 20%;
      // width: $--input-width;
      // max-width: 200px;
      // min-width: 100px;
      // margin-left: 10px;
      margin-bottom: 10px;
      margin-right: 10px;
    }
    button{
      min-width: 50px;
      margin-bottom: 10px;
      margin-right: 10px;
      // height: 40px;
      // margin-left: 10px;
      + button {
        margin-left: 0;
      }
    }

    .el-input {
      width: 14em;
      // width: $--input-width;
    }

    .el-date-editor--datetimerange {
      width: 380px;
    }

    .m-range-picker,
    .el-date-editor--month,
    .el-date-editor--daterange,
    .el-date-editor--monthrange {
      width: 280px !important;
    }

    .el-range-separator {
      padding: 0 5px 0 3px;
    }
  }

  .el-upload__excel {
    margin-right: 0px !important;
  }
}
</style>
<style type="text/stylus" lang="stylus">
.inputHeight .el-input__inner {
    height: 34px;
    line-height: inherit;
}
.inputHeight .input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input[type="number"]{
  -moz-appearance: textfield;
}

.filter-container .filter-right
  .monthRangeSelector
    // min-width: 170px;
    .el-date-editor--daterange.el-popover__reference
      width: 100%;
      padding-left: 9px;
      padding-right: 9px;
  // .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner
  //   width: 320px;
  //   max-width: 320px;
  // .monthrange
  //   width: 230px;
  //   max-width: 230px;
  // &>.el-date-editor.el-input, &>.el-date-editor.el-input__inner
  //     max-width: 230px;
  //     min-width: 230px;
</style>
