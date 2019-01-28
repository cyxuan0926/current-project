<template>
  <!-- { 'error-tip': errorMessage }, -->
  <div
    class="m-range-picker"
    :class="[{ 'm-disabled-range': next.length > 0 || disabled }]"
    @click="onClick">
    <el-time-picker
      v-model="startTime"
      ref="start"
      class="startClass"
      :clearable="false"
      :format="format"
      :value-format="format"
      :disabled="next.length > 0 || disabled"
      :picker-options="startPickerOptions"
      placeholder="开始时间"
      @blur="onStartBlur"
      @change="onStartChange" />
    <span>至</span>
    <el-time-picker
      v-model="endTime"
      ref="end"
      class="endClass"
      :disabled="!startTime || next.length > 0 || disabled"
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
    },
    disabled: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
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
      // errorMessage: '',
      value: ''
    }
  },
  watch: {
    endTime(val) {
      if (!val) this.startTime = null
    },
    val(value) {
      if (!value) {
        this.startTime = null
        this.endTime = null
      }
      else {
        this.startTime = this.val[0]
        this.endTime = this.val[1]
      }
    }
  },
  mounted() {
    if (this.val && this.val.length) {
      this.startTime = this.val[0]
      this.endTime = this.val[1]
      let start = Moment(new Date(2000, 0, 1, this.val[0].split(':')[0], this.val[0].split(':')[1])).add(1, 'm').format('HH:mm')
      this.endPickerOptions = { selectableRange: `${ start }:00 - 23:59:59` }
    }
    if (this.prev.length) {
      this.startPickerOptions = { selectableRange: `${ this.prev[1] }:00 - 23:58:59` }
    }
  },
  methods: {
    onStartChange(e) {
      if (!e) {
        this.endPickerOptions = {}
      }
      else {
        let start = Moment(new Date(2000, 0, 1, e.split(':')[0], e.split(':')[1])).add(1, 'm').format('HH:mm')
        this.endPickerOptions = { selectableRange: `${ start }:00 - 23:59:59` }
        if (start > this.endTime || !this.endTime) {
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
      // if (this.startTime === this.endTime) {
      //   this.errorMessage = '间隔时间太短'
      //   return false
      // }
      this.$emit('handleBlur', [this.startTime, this.endTime], this.type, this.index)
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
.m-range-picker
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
