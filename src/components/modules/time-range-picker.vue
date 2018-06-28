<template>
  <div
    class="m-range-picker"
    :class="[
      { 'error-tip': errorMessage },
      { 'm-disabled-range': next.length }]"
    @click="onClick">
    <el-time-picker
      v-model="startTime"
      ref="start"
      class="startClass"
      :clearable="false"
      :format="format"
      :value-format="format"
      :picker-options="startPickerOptions"
      placeholder="开始时间"
      @blur="onStartBlur"
      @change="onStartChange" />
    <span>至</span>
    <el-time-picker
      v-model="endTime"
      ref="end"
      class="endClass"
      :disabled="!startTime"
      :clearable="false"
      :format="format"
      :value-format="format"
      :picker-options="endPickerOptions"
      placeholder="结束时间"
      @blur="onEndBlur" />
  </div>
</template>

<script>
import Moment from 'moment'
export default {
  props: {
    prev: {
      type: Array,
      default: function() { return [] }
    },
    val: {
      type: Array,
      default: function() { return [] }
    },
    next: {
      type: Array,
      default: function() { return [] }
    },
    type: {
      type: String,
      default: 'usu'
    }
  },
  data() {
    return {
      format: 'HH:mm',
      startTime: '',
      endTime: '',
      startPickerOptions: {
        selectableRange: '00:00:00 - 23:58:59'
      },
      endPickerOptions: {},
      errorMessage: '',
      value: ''
    }
  },
  watch: {
    endTime(val) {
      if (!val) this.startTime = null
    }
  },
  mounted() {
    if (this.val && this.val.length) {
      this.startTime = this.val[0]
      this.endTime = this.val[1]
    }
    console.log(this.prev, this.type, this.val, this.next)
  },
  methods: {
    onStartChange(e) {
      if (!e) {
        this.endPickerOptions = {}
      }
      else {
        let start = Moment(`1990-01-01 ${ e }`).add(1, 'm').format('HH:mm')
        this.endPickerOptions = { selectableRange: `${ start }:00 - 23:59:59` }
        if (start > this.endTime) {
          this.endTime = start
        }
      }
    },
    onClick() {
      if (!this.endTime) {
        this.$refs.start.focus()
      }
    },
    onStartBlur(e) {
      this.$refs.end.focus()
    },
    onEndBlur(e) {
      if (this.startTime === this.endTime) {
        this.errorMessage = '间隔时间太短'
        return false
      }
      this.$emit('handleBlur', [this.startTime, this.endTime], this.type)
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
.m-range-picker
  width: 100%;
  min-width: 140px;
  max-width: 350px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  & > div
    width: 45%;
  & > span
    width: 16px;
    text-align: center;
  &.m-disabled-range
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
</style>
