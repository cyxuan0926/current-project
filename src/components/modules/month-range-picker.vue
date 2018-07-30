<template>
  <div class="m-range-picker"
       @mouseenter="showClose"
       @mouseleave="hideClose">
    <el-date-picker
      v-model="startDate"
      ref="start"
      type="month"
      class="startMonthClass"
      placeholder="开始日期"
      format="yyyy-MM"
      value-format="yyyy-MM"
      @change="onChange"
      :picker-options="startObj"
    />
    <span>~</span>
    <el-date-picker
      v-model="endDate"
      ref="end"
      type="month"
      format="yyyy-MM"
      value-format="yyyy-MM"
      class="endMonthClass"
      placeholder="结束日期"
      @change="onChangeEnd"
      :picker-options="endObj"
    />
    <span class="el-input__suffix">
      <span class="el-input__suffix-inner">
        <i class="el-input__icon el-icon-circle-close close-icon" @click="close" v-if="closeShow"></i>
      </span>
    </span>
  </div>
</template>

<script>
import Moment from 'moment'
export default {
  data() {
    return {
      startDate: null,
      endDate: null,
      closeShow: false,
      startObj: {
        disabledDate: (time) => {
          if (this.endDate) return Moment(this.endDate).valueOf() < time.getTime()
        }
      },
      endObj: {
        disabledDate: (time) => {
          if (this.startDate) return Moment(this.startDate).valueOf() > time.getTime()
        }
      }
    }
  },
  props: ['startDateValue', 'endDateValue'],
  methods: {
    onChange(e) {
      this.startDate = e
      this.$emit('update:startDateValue', this.startDate)
    },
    close() {
      this.startDate = null
      this.endDate = null
      this.$emit('update:startDateValue', this.startDate)
      this.$emit('update:endDateValue', this.endDate)
    },
    onChangeEnd(e) {
      this.endDate = e
      this.$emit('update:endDateValue', this.endDate)
    },
    showClose() {
      this.closeShow = this.isClose
    },
    hideClose() {
      this.closeShow = false
    }
  },
  computed: {
    isClose() {
      if (this.startDate && this.endDate) return true
      else return false
    },
    endClear() {
      if (this.startDate && this.endDate) return false
      else return true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.m-range-picker
  display flex
  justify-content space-between
  align-items center
  position relative
  border 1px solid #dcdfe6
  box-sizing border-box
  /*& > div:nth-child(2)*/
    /*width 48%*/
  & > span:first-child
    width 10px
    text-align center
.close-icon
  width 15px !important
  cursor pointer
</style>
