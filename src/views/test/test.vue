<template>
  <div class="m-range-picker">
    <el-time-picker
      v-model="value2"
      format="HH:mm"
      :picker-options="{
        selectableRange: '18:30:00 - 20:30:00'
      }"
      placeholder="开始时间">
    </el-time-picker>
    <el-time-picker
      v-model="value3"
      :picker-options="{
        selectableRange: '18:30:00 - 20:30:00'
      }"
      placeholder="结束时间">
    </el-time-picker>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  // import helper from '@/utils'
  export default {
    data() {
      return {
        value2: new Date(2016, 9, 10, 18, 40),
        value3: new Date(2016, 9, 10, 18, 40),
        value4: null,
        value5: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]
      }
    },
    methods: {
      ...mapActions(['addPrison', 'getProvincesAll', 'getCities']),
      onChange(e) {
        console.log('change', e)
      },
      onBlur(e) {
        console.log('blur', e)
      },
      onFocus(e) {
        console.log('focus', e, this.value4)
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus">
</style>
