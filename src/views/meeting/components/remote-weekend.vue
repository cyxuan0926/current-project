<template>
  <div class="yt-form">
    <el-form
      ref="form"
      label-width="140px"
      :model="remoteWeekendConfig"
      inline>
      <div style="clear: both;">
        <div
          class="el-form-item"
          style="float: left;">
          <label
            class="el-form-item__label"
            style="width: 140px;padding-right: 2px;">周末配置</label>
        </div>
        <div style="float: left; width: calc(100% - 150px);">
          <template v-for="(item, index) in remoteWeekendConfig.queue">
            <el-form-item
              :key="index"
              :prop="'queue.' + index"
              style="width: calc(25% - 10px); min-width: 140px; max-width: 350px;">
              <m-time-range-picker
                :val="remoteWeekendConfig.queue[index]"
                :prev="remoteWeekendConfig.queue[index - 1]"
                :next="remoteWeekendConfig.queue[index + 1]"
                type="queue"
                @handleBlur="handleBlur" />
            </el-form-item>
          </template>
          <el-button
            :disabled="!flag.canAddQueue"
            type="primary"
            style="margin-right: 10px; margin-bottom: 22px;"
            @click="onAddRange">新增会见时间段</el-button>
          <el-button
            v-if="remoteWeekendConfig.queue[0]"
            style="margin-left: 0; margin-bottom: 22px;"
            @click="onRestRange">重置</el-button>
        </div>
      </div>
    </el-form>
    <div class="button-box">
      <el-button
        size="small"
        type="primary"
        :loading="loading"
        @click="onSubmit">更新</el-button>
    </div>
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
      jailId: this.$route.meta.role === '3' ? JSON.parse(localStorage.getItem('user')).jailId : this.$route.params.id,
      loading: false
    }
  },
  computed: {
    ...mapState(['remoteWeekendConfig'])
  },
  activated() {
    this.getRemoteWeekendConfig({ jailId: this.jailId }).then(res => {
      if (!res) return
      this.getNextTime(this.remoteWeekendConfig.queue[this.remoteWeekendConfig.queue.length - 1])
    })
  },
  mounted() {
  },
  methods: {
    ...mapActions(['getRemoteWeekendConfig', 'updateRemoteWeekendConfig']),
    onSubmit(e) {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.remoteWeekendConfig, { jailId: this.jailId })
          this.handleQueue(params)
          if ((!params.settings && !this.remoteWeekendConfig.settings) || (params.settings && this.remoteWeekendConfig.settings && params.settings.toString() === this.remoteWeekendConfig.settings.toString())) {
            return
          }
          else {
            this.loading = true
            this.updateRemoteWeekendConfig(params).then(res => {
              this.loading = false
              if (!res) return
              if (this.$route.meta.role !== '3') this.$router.push('/prison/list')
            })
          }
        }
      })
    },
    handleBlur(e) {
      this.remoteWeekendConfig.queue[this.remoteWeekendConfig.queue.length - 1] = e
      this.$refs.form.validateField('queue.0')
      this.getNextTime(e)
    },
    handleQueue(params) {
      params.settings = null
      if (params.queue[0] !== null) {
        params.settings = []
        params.queue.forEach(queue => {
          params.settings.push(`${ queue[0] }-${ queue[1] }`)
        })
      }
      delete params.queue
    },
    onAddRange() {
      this.remoteWeekendConfig.queue.push(this.queueToAdd)
      this.getNextTime(this.remoteWeekendConfig.queue[this.remoteWeekendConfig.queue.length - 1])
    },
    onRestRange() {
      this.remoteWeekendConfig.queue = [null]
      this.flag.canAddQueue = false
    },
    getNextTime(last = null) {
      if (!this.handleCanAdd(last) || !last) return
      let start = Moment(new Date(2000, 0, 1, last[0].split(':')[0], last[0].split(':')[1])),
        end = Moment(new Date(2000, 0, 1, last[1].split(':')[0], last[1].split(':')[1])),
        duration = end.diff(start, 'minutes'),
        toEnd = end.add(duration, 'minutes')
      if (toEnd.date() !== 1) {
        this.queueToAdd = [last[1], '23:59']
      }
      else {
        this.queueToAdd = [last[1], `${ toEnd.format('HH:mm') }`]
      }
    },
    handleCanAdd(last) {
      let flag = true
      if (last === null) {
        flag = false
      }
      else if (last[1] === '23:59') {
        flag = false
      }
      this.flag.canAddQueue = flag
      return flag
    }
  }
}
</script>

<style lang="css">
</style>
