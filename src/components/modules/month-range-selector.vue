<template>
  <el-popover
    placement="bottom"
    width="400"
    trigger="manual"
    v-model="visible"
    popper-class="el-picker-panel month-panel-popover">
    <div
      :class="[
        'el-date-editor',
        'el-range-editor',
        'el-input__inner',
        'el-date-editor--daterange',
        {'can-clear' : clear}]"
      @click="handleClick"
      slot="reference">
      <i class="el-input__icon el-range__icon el-icon-date" />
      <input
        v-model="start"
        readonly
        autocomplete="off"
        placeholder="开始月份"
        class="el-range-input">
      <span class="el-range-separator">-</span>
      <input
        v-model="end"
        readonly
        autocomplete="off"
        placeholder="结束月份"
        class="el-range-input">
      <i
        v-if="clear"
        :class="[
          'el-input__icon',
          'el-range__close-icon',
          {'el-icon-circle-close' : clear && start && end}]"
        @click="handleClear"/>
    </div>
    <div
      v-clickoutside="{ func: 'handleBlur', ignoreEle: '.el-date-editor--daterange' }"
      class="picker-panel">
      <div class="show-picked">
        <div>
          <span>开始月份</span>
          <span class="pre-content">{{ pickedPreYear }}-{{ fillPre(pickedPreMonth) }}</span>
        </div>
        <div>
          <span>结束月份</span>
          <span class="next-content">{{ pickedNextYear }}-{{ fillPre(pickedNextMonth) }}</span>
        </div>
      </div>
      <div class="el-picker-panel__content el-date-range-picker__content is-left">
        <div
          class="el-date-range-picker__header">
          <i
            class="el-picker-panel__icon-btn el-icon-d-arrow-left"
            :class="{'is-disabled' : (minYear && preYear <= minYear) || (minRangeYear && preYear <= minRangeYear)}"
            @click="handlePreYear('pre', (minYear && preYear <= minYear) || (minRangeYear && preYear <= minRangeYear))" />
          <!-- <i
            class="el-picker-panel__icon-btn el-icon-d-arrow-right"
            :class="{'is-disabled' : preYear >= nextYear - 1}"
            @click="handleNextYear('pre', preYear >= nextYear - 1)" /> -->
          <div>{{ preYear }}年</div>
        </div>
        <table
          class="el-month-table table-month">
          <tr
            v-for="row in 3"
            :key="row">
            <td
              v-for="col in 4"
              :key="col">
              <span
                class="cell"
                :class="[
                  {'picked' : (pickedPreMonth === (row - 1) * 4 + col && pickedPreYear === preYear) || (pickedNextMonth == (row - 1) * 4 + col && pickedNextYear === preYear)},
                  {'in-range' : inRange(preYear, (row - 1) * 4 + col)},
                  {'is-disabled' : isDisabled(preYear, (row - 1) * 4 + col)}]"
                @click="handlePick(preYear, (row - 1) * 4 + col, isDisabled(preYear, (row - 1) * 4 + col))">{{ (row - 1) * 4 + col }}月</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="el-picker-panel__content el-date-range-picker__content is-right">
        <div
          class="el-date-range-picker__header">
          <!-- <i
            class="el-picker-panel__icon-btn el-icon-d-arrow-left"
            :class="{'is-disabled' : nextYear <= preYear + 1}"
            @click="handlePreYear('next', nextYear <= preYear + 1)" /> -->
          <i
            class="el-picker-panel__icon-btn el-icon-d-arrow-right"
            :class="{'is-disabled' : (maxYear && nextYear >= maxYear) || (maxRangeYear && nextYear >= maxRangeYear)}"
            @click="handleNextYear('next', (maxYear && nextYear >= maxYear) || (maxRangeYear && nextYear >= maxRangeYear))"/>
          <div>{{ nextYear }}年</div>
        </div>
        <table
          class="el-month-table table-month">
          <tr
            v-for="row in 3"
            :key="row">
            <td
              v-for="col in 4"
              :key="col">
              <span
                class="cell"
                :class="[
                  {'picked' : (pickedPreMonth === (row - 1) * 4 + col && pickedPreYear === nextYear) || (pickedNextMonth == (row - 1) * 4 + col && pickedNextYear === nextYear)},
                  {'in-range' : inRange(nextYear, (row - 1) * 4 + col)},
                  {'is-disabled' : isDisabled(nextYear, (row - 1) * 4 + col)}]"
                @click="handlePick(nextYear, (row - 1) * 4 + col, isDisabled(nextYear, (row - 1) * 4 + col))">{{ (row - 1) * 4 + col }}月</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="el-picker-panel__footer">
        <el-button
          size="mini"
          type="text"
          class="el-picker-panel__link-btn"
          @click="handleClearPicked(0)">
          清空
        </el-button>
        <!-- <el-button
          size="mini"
          type="primary"
          class="el-picker-panel__link-btn"
          :disabled="(!pickedPreMonth && !pickedNextMonth) || (pickedPreMonth && pickedNextMonth && (pickedPreYear !== pickedNextYear || (pickedPreYear === pickedNextYear && pickedPreMonth !== pickedNextMonth)))"
          @click="handleEnsure('single')">
          查询当月
        </el-button> -->
        <el-button
          plain
          size="mini"
          class="el-picker-panel__link-btn"
          :disabled="!pickedPreMonth || !pickedNextMonth"
          @click="handleEnsure('picked')">
          确定
        </el-button>
      </div>
    </div>
  </el-popover>
</template>
<script>
import Clickoutside from '@/utils/clickoutside'
import Moment from 'moment'
export default {
  props: {
    startValue: {
      type: String,
      default: '',
      validator: function(value) {
        if (!value) {
          return true
        }
        else if (!(/^[0-9]{4}-[0-9]{2}$/).test(value)) {
          return false
        }
        return true
      }
    },
    endValue: {
      type: String,
      default: '',
      validator: function(value) {
        if (!value) {
          return true
        }
        else if (!(/^[0-9]{4}-[0-9]{2}$/).test(value)) {
          return false
        }
        return true
      }
    },
    startKey: {
      type: String,
      default: 'startDate'
    },
    endKey: {
      type: String,
      default: 'endDate'
    },
    prop: {
      type: String,
      default: 'range'
    },
    range: {
      type: Object,
      default: function() {
        return {
          min: null,
          max: null,
          maxMonthRange: null
        }
      }
    },
    clear: {
      type: Boolean,
      default: true
    }
  },
  directives: { Clickoutside },
  data() {
    return {
      start: '',
      end: '',
      visible: false,
      preYear: 0,
      nextYear: 0,
      pickedPreYear: 0,
      pickedNextYear: 0,
      pickedPreMonth: 0,
      pickedNextMonth: 0,
      minYear: null,
      minRangeYear: null,
      minRangeMonth: null,
      maxYear: null,
      maxRangeYear: null,
      maxRangeMonth: null,
      count: 0
    }
  },
  mounted() {
    this.start = this.startValue
    this.end = this.endValue
    this.render('startValue', 'endValue')
    if (this.range.min) {
      this.minYear = parseInt(this.range.min.split('-')[0])
    }
    if (this.range.max) {
      this.maxYear = parseInt(this.range.max.split('-')[0])
    }
  },
  methods: {
    render(start, end) {
      if (this[start]) {
        this.preYear = parseInt(this[start].split('-')[0])
        this.pickedPreYear = this.preYear
        this.pickedPreMonth = parseInt(this[start].split('-')[1])
      }
      if (this[end]) {
        this.nextYear = parseInt(this[end].split('-')[0])
        this.pickedNextYear = this.nextYear
        this.pickedNextMonth = parseInt(this[end].split('-')[1])
      }
      if (this.preYear === this.nextYear) this.preYear = this.preYear - 1
    },
    handleClick(e) {
      if (e.target.className.indexOf('el-icon-circle-close') > -1 || this.visible) {
        return false
      }
      this.render('start', 'end')
      this.visible = true
    },
    inRange(year, month) {
      if (!this.pickedPreMonth || !this.pickedNextMonth) return false
      let pickedPre = `${ this.pickedPreYear }-${ this.fillPre(this.pickedPreMonth) }`,
        pickedNext = `${ this.pickedNextYear }-${ this.fillPre(this.pickedNextMonth) }`,
        now = `${ year }-${ this.fillPre(month) }`
      return now > pickedPre && now < pickedNext
    },
    isDisabled(year, month) {
      let now = `${ year }-${ this.fillPre(month) }`
      if ((this.range.min && now < this.range.min) || (this.range.max && now > this.range.max) || (this.range.maxMonthRange && this.minRangeYear && this.minRangeMonth && now < `${ this.minRangeYear }-${ this.minRangeMonth }`) || (this.range.maxMonthRange && this.maxRangeYear && this.maxRangeMonth && now > `${ this.maxRangeYear }-${ this.maxRangeMonth }`)) {
        return true
      }
      return false
    },
    fillPre(num) {
      if (!num) return ''
      return `00${ num }`.slice(-2)
    },
    handlePick(year, month, disabled) {
      if (disabled) return
      if (this.count >= 2) this.count = 0
      this.count++
      if (this.count === 1) {
        this.handleClearPicked(this.count)
        this.pickedPreYear = year
        this.pickedPreMonth = month
        if (this.range.maxMonthRange) this.handleRange(year, month, this.range.maxMonthRange - 1)
      }
      else if (this.count === 2) {
        let pickedPre = `${ this.pickedPreYear }-${ this.fillPre(this.pickedPreMonth) }`,
          pickedNext = `${ year }-${ this.fillPre(month) }`
        if (pickedNext < pickedPre) {
          this.pickedNextYear = this.pickedPreYear
          this.pickedNextMonth = this.pickedPreMonth
          this.pickedPreYear = year
          this.pickedPreMonth = month
        }
        else {
          this.pickedNextYear = year
          this.pickedNextMonth = month
        }
        if (this.range.maxMonthRange) this.clearRange()
      }
    },
    handleRange(year, month, dur) {
      let minRangeMonth = Moment(`${ year }-${ month }-01 01:01:01`).subtract(dur, 'months').format('YYYY-MM').split('-'), maxRangeMonth = Moment(`${ year }-${ month }-01 01:01:01`).add(dur, 'months').format('YYYY-MM').split('-')
      this.minRangeYear = minRangeMonth[0]
      this.minRangeMonth = minRangeMonth[1]
      this.maxRangeYear = maxRangeMonth[0]
      this.maxRangeMonth = maxRangeMonth[1]
    },
    handleBlur(e) {
      if (!this.visible) return
      this.visible = false
    },
    handlePreYear(e, disabled) {
      if (disabled) return
      if (e === 'pre') {
        this.nextYear = this.preYear
        this.preYear = parseInt(this.preYear) - 1
      }
      else if (e === 'next') {
        this.preYear = this.nextYear
        this.nextYear = parseInt(this.nextYear) - 1
      }
    },
    handleNextYear(e, disabled) {
      if (disabled) return
      if (e === 'pre') {
        this.nextYear = this.preYear
        this.preYear = parseInt(this.preYear) + 1
      }
      else if (e === 'next') {
        this.preYear = this.nextYear
        this.nextYear = parseInt(this.nextYear) + 1
      }
    },
    handleClearPicked(e) {
      this.count = e
      this.pickedPreYear = null
      this.pickedNextYear = null
      this.pickedPreMonth = null
      this.pickedNextMonth = null
      if (this.range.maxMonthRange) this.clearRange()
    },
    clearRange() {
      this.minRangeYear = null
      this.minRangeMonth = null
      this.maxRangeYear = null
      this.maxRangeMonth = null
    },
    handleEnsure(e) {
      this.start = `${ this.pickedPreYear }-${ this.fillPre(this.pickedPreMonth) }`
      if (e === 'single') {
        this.end = `${ this.pickedPreYear }-${ this.fillPre(this.pickedPreMonth) }`
        this.count = 0
      }
      else {
        this.end = `${ this.pickedNextYear }-${ this.fillPre(this.pickedNextMonth) }`
      }
      this.$emit('onEnsure', { [this.startKey]: this.start, [this.endKey]: this.end, prop: this.prop })
      this.visible = false
    },
    handleClear(e) {
      this.start = ''
      this.end = ''
    }
  }
}
</script>
<style scoped>
.el-date-editor .el-range-separator{
  padding: 0;
  width: 20px;
}
.el-date-editor--daterange .el-icon-circle-close{
  color: transparent;
}
.el-date-editor--daterange:hover .el-icon-circle-close{
  color: #c0c4cc;
}
.is-left{
  margin: 0;
  padding: 0 15px 0 0;
}
.is-right{
  margin: 0;
  padding: 0 0 0 15px;
}
.el-date-range-picker__header{
  border-bottom: 1px solid #ebeef5;
}
.show-picked{
  border-bottom: 1px solid #ebeef5;
  display: table;
  width: 100%;
  padding-bottom: 4px;
}
.show-picked>div{
  display: table-cell;
  line-height: 30px;
  text-align: center;
}
.show-picked .pre-content, .show-picked .next-content{
  border: 1px solid #ebeef5;
  text-align: center;
  border-radius: 4px;
  margin-left: 10px;
  width: 90px;
  display: inline-block;
  padding: 0 20px;
}
.el-date-range-picker__header div{
  margin-right: 0;
  line-height: 28px;
}
.table-month td{
  padding: 10px 3px;
  cursor: default;
}
.table-month td .cell{
  width: 37px;
  cursor: pointer;
}
.table-month .cell.in-range{
  background: #f2f6fc;
}
.table-month .cell.picked{
  background: #409EFF;
  color: #fff;
}
.table-month .cell.is-disabled{
  background-color: #f5f7fa;
  opacity: 1;
  cursor: not-allowed;
  color: #c0c4cc;
}
.picker-panel{
  padding: 12px;
  overflow: hidden;
}
.el-picker-panel__footer{
  clear: both;
}
</style>

