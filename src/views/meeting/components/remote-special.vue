<template>
  <div class="yt-form">
    <el-form
      v-for="(special, index) in remoteSpecialConfig"
      :key="index"
      :ref="'form' + index"
      label-width="140px"
      :model="special"
      style="overflow: hidden;"
      inline>
      <div style="overflow: hidden;">
        <div
          class="el-form-item"
          style="float: left; margin-bottom: 10px;">
          <label
            class="el-form-item__label"
            style="width: 140px; padding-right: 0;">请选择日期</label>
        </div>
        <div style="float: left; width: calc(100% - 150px);">
          <el-form-item
            class="m-date-form">
            <el-date-picker
              v-model="special.effectDate"
              :clearable="false"
              :editable="false"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              class="m-date-picker"
              :picker-options="pickerOptions" />
          </el-form-item>
          <el-button
            v-if="special.id && special.queue[0] !== null && ((special.effectDate !== special.originDate) || special.update)"
            type="text"
            :loading="special.loading"
            @click="onUpdate(special, index)">保存修改</el-button>
          <el-button
            v-if="special.id"
            :loading="special.deleting"
            type="text"
            style="color: #F56C6C;"
            @click="onDelete(special, index)">删除</el-button>
          <el-button
            v-if="!special.id && special.queue[0] !== null"
            type="text"
            :loading="special.loading"
            style="color: #F56C6C;"
            @click="onAdd(special, index)">保存</el-button>
          <el-button
            v-if="index === (remoteSpecialConfig.length - 1)"
            type="text"
            @click="onAddDate">新增特殊日期</el-button>
        </div>
      </div>
      <div
        v-if="special.effectDate"
        style="float: left; width: calc(100% - 150px); margin-left: 150px;">
        <template v-for="(item, idx) in special.queue">
          <el-form-item
            :key="idx"
            :prop="'queue.' + idx"
            class="m-picker">
            <m-time-range-picker
              :val="special.queue[idx]"
              :prev="special.queue[idx - 1]"
              :next="special.queue[idx + 1]"
              type="queue"
              @handleBlur="handleBlur($event, special)" />
          </el-form-item>
        </template>
        <el-button
          :disabled="!special.canAddQueue"
          type="primary"
          style="margin-right: 10px; margin-bottom: 22px; float: left;"
          @click="onAddRange(special)">新增会见时间段</el-button>
        <el-button
          v-if="special.queue[0]"
          style="margin-left: 0; margin-bottom: 22px;; float: left;"
          @click="onRestRange(special)">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Moment from 'moment'

export default {
  data() {
    return {
      flag: {
        canAddQueue: true
      },
      visible2: false,
      jailId: this.$route.meta.role === '3' ? JSON.parse(localStorage.getItem('user')).jailId : this.$route.params.id,
      loading: false,
      pickerOptions: {
        disabledDate: (time) => {
          let t = Moment(new Date(time)).format('YYYY-MM-DD')
          return (time.getTime() < Date.now()) || (this.remoteSpecialConfig.find(item => item.effectDate === t))
        }
      }
    }
  },
  computed: {
    ...mapState(['remoteSpecialConfig'])
  },
  activated() {
    this.getRemoteSpecialConfig({ jailId: this.jailId }).then(res => {
      if (!res) return
      this.remoteSpecialConfig.forEach(config => {
        this.getNextTime(config.queue[config.queue.length - 1], config)
      })
    })
  },
  mounted() {
  },
  methods: {
    ...mapActions(['getRemoteSpecialConfig', 'addRemoteSpecialConfig', 'updateRemoteSpecialConfig', 'deleteRemoteSpecialConfig']),
    onAdd(config, index) {
      let params = this.handleQueue(config)
      config.loading = true
      this.addRemoteSpecialConfig(params).then(res => {
        config.loading = false
        if (!res) return
        this.remoteSpecialConfig[index].originDate = config.effectDate
        this.remoteSpecialConfig[index].originQueue = config.queue.toString()
        this.remoteSpecialConfig[index].id = res.id
      })
    },
    onUpdate(config, index) {
      let params = this.handleQueue(config)
      config.loading = true
      this.updateRemoteSpecialConfig(params).then(res => {
        config.loading = false
        if (!res) return
        this.remoteSpecialConfig[index].originDate = config.effectDate
        this.remoteSpecialConfig[index].originQueue = config.queue.toString()
        this.remoteSpecialConfig[index].update = false
      })
    },
    onDelete(config, index) {
      this.$confirm(`是否确认删除？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        config.deleting = true
        this.deleteRemoteSpecialConfig({ id: config.id }).then(res => {
          config.deleting = false
          if (!res) return
          this.remoteSpecialConfig.splice(index, 1)
          if (!this.remoteSpecialConfig.length) {
            this.onAddDate()
          }
        })
      }).catch(() => {})
    },
    handleBlur(e, config) {
      config.queue[config.queue.length - 1] = e
      this.getNextTime(e, config)
      if (!config.id) {
        config.update = false
      }
      else if (config.queue.toString() !== config.originQueue) {
        config.update = true
      }
      else {
        config.update = false
      }
    },
    handleQueue(config) {
      let params = {
        effectDate: config.effectDate,
        settings: null,
        jailId: this.jailId
      }
      config.id && (params.id = config.id)
      if (config.queue[0] !== null) {
        params.settings = []
        config.queue.forEach(queue => {
          params.settings.push(`${ queue[0] }-${ queue[1] }`)
        })
      }
      return params
    },
    onAddDate() {
      this.remoteSpecialConfig.push({ id: '', effectDate: '', queue: [null], originQueue: '', originDate: '', canAddQueue: false, loading: false })
    },
    onAddRange(config) {
      config.queue.push(config.queueToAdd)
      this.getNextTime(config.queueToAdd, config)
      if (!config.id) {
        config.update = false
      }
      else if (config.queue.toString() !== config.originQueue) {
        config.update = true
      }
      else {
        config.update = false
      }
    },
    onRestRange(config) {
      config.queue = [null]
      config.canAddQueue = false
      config.update = false
    },
    getNextTime(last, config) {
      if (!last || !this.handleCanAdd(last, config)) return
      let start = Moment(new Date(2000, 0, 1, last[0].split(':')[0], last[0].split(':')[1])),
        end = Moment(new Date(2000, 0, 1, last[1].split(':')[0], last[1].split(':')[1])),
        duration = end.diff(start, 'minutes'),
        toEnd = end.add(duration, 'minutes')
      if (toEnd.date() !== 1) {
        config.queueToAdd = [last[1], '23:59']
      }
      else {
        config.queueToAdd = [last[1], `${ toEnd.format('HH:mm') }`]
      }
    },
    handleCanAdd(last, config) {
      let flag = true
      if (last[1] === '23:59') {
        flag = false
      }
      config.canAddQueue = flag
      return flag
    }
  }
}
</script>

<style lang="css">
</style>
