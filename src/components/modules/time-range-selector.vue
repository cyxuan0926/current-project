<template>
  <!--最后一个时间段之前的或者是传过的为disabled的是禁用状态-->
  <div
    class="m-range-selector"
    :class="[{ 'm-disabled-range': next.length > 0 || disabled }]"
    @click="onClick"
  >
    <el-time-picker
      v-model.trim="startTime"
      ref="start"
      class="startClass"
      :clearable="false"
      :format="format"
      :value-format="format"
      v-bind="configs['prev'] && configs['prev']['attrs']"
      size="mini"
      :disabled="next.length > 0 || disabled"
      :picker-options="startPickerOptions"
      placeholder="开始时间"
      @blur="onStartBlur"
      @change="onStartChange"
    />

    <span>至</span>

    <el-time-picker
      v-model.trim="endTime"
      ref="end"
      v-bind="configs['next'] && configs['next']['attrs']"
      class="endClass"
      :disabled="!startTime || next.length > 0 || disabled"
      :clearable="false"
      :format="format"
      :value-format="format"
      size="mini"
      :picker-options="endPickerOptions"
      placeholder="结束时间"
      @blur="onEndBlur"
    />
  </div>
</template>

<script>
import Moment from 'moment'
// import Clickoutside from '@/utils/clickoutside'
export default {
  inheritAttrs: false,

  props: {
    configs: {
      type: Object,
      default: () => (
        {
          prev: {
            attrs: {},
            events: {}
          },
          next: {
            attrs: {},
            events: {}
          }
        }
      )
    },

    // 前一个时间段
    prev: {
      type: Array,
      default: function() { return [] }
    },

    // 当前的时间段
    val: {
      type: Array,
      default: function() { return [] }
    },

    // 下一个时间段
    next: {
      type: Array,
      default: function() { return [] }
    },

    // 类型
    type: {
      type: String,
      default: 'usu'
    },

    // 是否可修改
    disabled: {
      type: Boolean,
      default: false
    },

    // 当前常规配置时间段的索引
    index: {
      type: Number,
      default: 0
    }
  },

  // directives: { Clickoutside },
  data() {
    return {
      format: 'HH:mm',
      // 开始时间
      startTime: '',
      // 结束时间
      endTime: '',
      // 开始时间的选项
      startPickerOptions: {
        // 要保证结束时间至少为 23:59:59
        selectableRange: '00:00:00 - 23:58:59'
      },
      // 结束时间的选项
      endPickerOptions: {},
      // errorMessage: '',
      value: ''
    }
  },

  watch: {
    endTime(val) {
      if (!val) {
        this.startTime = null
      }
    },

    // 当前的时间段
    val(value) {
      if (!value) {
        this.startTime = null
        this.endTime = null
      } else {
        this.startTime = this.val[0]
        this.endTime = this.val[1]
        // 结束时间的可选时间是在开始时间 + 1分钟 到 23：59：59
        let start = Moment(new Date(2000, 0, 1, this.val[0].split(':')[0], this.val[0].split(':')[1])).add(1, 'm').format('HH:mm')
        this.endPickerOptions = { selectableRange: `${ start }:00 - 23:59:59` }
        if (this.prev.length) {
          // 如果存在前一个时间 当前时间的开始时间的可选时间时间为结束时间
          this.startPickerOptions = { selectableRange: `${ this.prev[1] }:00 - 23:58:59` }
        }
      }
    }
  },

  mounted() {
    // 初始化 开始时间/结束时间 开始时间的可选时间范围 结束时间的可选时间范围
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
    // 开始时间变化后
    onStartChange(e) {
      if (!e) {
        this.endPickerOptions = {}
      } else {
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

    // '开始时间'失去焦点之后
    onStartBlur(e) {
      // 结束时间 获得焦点
      this.$refs.end.focus()
    },

    // '结尾时间'失去焦点操作
    onEndBlur(e) {
      // if (this.startTime === this.endTime) {
      //   this.errorMessage = '间隔时间太短'
      //   return false
      // }
      // 调用父组件的handleBur事件
      this.$emit('handleBlur', [this.startTime, this.endTime], this.type, this.index)
    }
  }
}
</script>

<style lang="scss" scoped>
.m-range-selector {
  width: 180px;
  height: 28px;
  margin-bottom: 10px;
  float: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  margin-right: 10px;
  &.m-disabled-range {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
  }
}
</style>
