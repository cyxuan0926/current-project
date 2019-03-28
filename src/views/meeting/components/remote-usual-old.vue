<template>
  <div class="yt-form">
    <el-form
      ref="form"
      label-width="140px"
      :model="remoteUsualConfig"
      inline>
      <div style="clear: both;">
        <div
          class="el-form-item is-required"
          style="float: left;">
          <label
            class="el-form-item__label"
            style="width: 140px;padding-right: 2px;">常规配置</label>
        </div>
        <div style="float: left; width: calc(100% - 150px);">
          <template v-for="(item, index) in remoteUsualConfig.queue">
            <el-form-item
              :key="index"
              :prop="'queue.' + index"
              :rules="[{ required: true, message: '请选择会见时间段' }]"
              style="width: calc(25% - 10px); min-width: 140px; max-width: 350px;">
              <m-time-range-picker
                :val="remoteUsualConfig.queue[index]"
                :prev="remoteUsualConfig.queue[index - 1]"
                :next="remoteUsualConfig.queue[index + 1]"
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
            v-if="remoteUsualConfig.queue[0]"
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
    ...mapState(['remoteUsualConfig'])
  },
  activated() {
    this.getRemoteUsualConfig({ jailId: this.jailId }).then(res => {
      if (!res) return
      this.getNextTime(this.remoteUsualConfig.queue[this.remoteUsualConfig.queue.length - 1])
    })
  },
  mounted() {
  },
  methods: {
    ...mapActions(['getRemoteUsualConfig', 'updateRemoteUsualConfig']),
    onSubmit(e) {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.remoteUsualConfig, { jailId: this.jailId })
          this.handleQueue(params)
          if (params.settings.toString() !== this.remoteUsualConfig.settings.toString()) {
            this.loading = true
            this.updateRemoteUsualConfig(params).then(res => {
              this.loading = false
              if (!res) return
              if (this.$route.meta.role !== '3') this.$router.push('/prison/list')
            })
          }
        }
      })
    },
    handleBlur(e) {
      this.remoteUsualConfig.queue[this.remoteUsualConfig.queue.length - 1] = e
      this.$refs.form.validateField('queue.0')
      this.getNextTime(e)
    },
    handleQueue(params) {
      params.settings = []
      params.queue.forEach(queue => {
        params.settings.push(`${ queue[0] }-${ queue[1] }`)
      })
      delete params.queue
    },
    onAddRange() {
      this.remoteUsualConfig.queue.push(this.queueToAdd)
      this.getNextTime(this.remoteUsualConfig.queue[this.remoteUsualConfig.queue.length - 1])
    },
    onRestRange() {
      this.remoteUsualConfig.queue = [null]
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
