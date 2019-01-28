<template>
  <div class="w80">
    <div class="el-form-item is-required">
      <label class="el-form-item__label">实地探监窗口个数</label>
      <div style="float: left; width: calc(100% - 150px); position: relative;">
        <el-input
          v-model="prisonVisitConfigDetail.windowSize"
          :disabled="prisonVisitConfigDetail.canNotChange"
          class="part-right"
          size="small"
          placeholder="请填写实地探监窗口个数">
          <template slot="append">/个</template>
        </el-input>
        <span
          v-if="Boolean(errorMsg)"
          class="tips">{{ errorMsg }}</span>
      </div>
    </div>
    <div class="el-form-item is-required">
      <label class="el-form-item__label">配置</label>
      <div style="float: left; width: calc(100% - 150px); overflow: hidden;">
        <m-time-range-selector
          v-for="(queue, o) in prisonVisitConfigDetail.queue"
          :key="o"
          :val="queue"
          :disabled="prisonVisitConfigDetail.canNotChange"
          :prev="prisonVisitConfigDetail.queue[o - 1]"
          :next="prisonVisitConfigDetail.queue[o + 1]"
          type="queue"
          @handleBlur="handleBlur($event, prisonVisitConfigDetail.queue)" />
        <el-button
          v-if="!prisonVisitConfigDetail.canNotChange && Boolean(prisonVisitConfigDetail.queue && prisonVisitConfigDetail.queue.length && prisonVisitConfigDetail.queue[0] && prisonVisitConfigDetail.queue[prisonVisitConfigDetail.queue.length - 1][1] !== '23:59')"
          type="primary"
          size="mini"
          class="button-float"
          @click="onAddRange(prisonVisitConfigDetail.queue)">新增实地会见批次</el-button>
        <el-button
          v-if="!prisonVisitConfigDetail.canNotChange && prisonVisitConfigDetail.queue[0]"
          size="mini"
          class="button-float"
          @click="onRestQueue(prisonVisitConfigDetail)">重置实地会见时间段</el-button>
      </div>
    </div>
    <div class="button-box">
      <el-button
        v-if="!prisonVisitConfigDetail.canNotChange"
        :disabled="!(prisonVisitConfigDetail.windowSize && !errorMsg && prisonVisitConfigDetail.queue[0] !== null)"
        size="small"
        type="primary"
        @click="onSubmit">确定</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Moment from 'moment'
import validator from '@/utils'

export default {
  data() {
    let jailId = ''
    if (this.$route.meta.role === '0') jailId = this.$route.params.id
    else if (this.$route.meta.role === '3') jailId = JSON.parse(localStorage.getItem('user')).jailId
    return {
      jailId
    }
  },
  computed: {
    ...mapState(['prisonVisitConfigDetail']),
    errorMsg() {
      if (this.prisonVisitConfigDetail.windowSize === null || this.prisonVisitConfigDetail.windowSize === undefined) {
        return ''
      }
      let msg = '', handleValid = (v) => {
        if (typeof v === 'object') {
          if (!msg) msg = v.message
        }
      }
      validator.required({ message: '请填写实地探监窗口个数' }, this.prisonVisitConfigDetail.windowSize, handleValid)
      validator.isNumber({}, this.prisonVisitConfigDetail.windowSize, handleValid)
      validator.numberRange({ min: 1, max: 20 }, this.prisonVisitConfigDetail.windowSize, handleValid)
      return msg
    }
  },
  mounted() {
    this.getPrisonVisitConfigDetail({ jailId: this.jailId })
  },
  methods: {
    ...mapActions(['getPrisonVisitConfigDetail', 'updatePrisonVisitConfig']),
    onSubmit(e) {
      if (!this.prisonVisitConfigDetail.queue[0]) return
      let params = {
        windowSize: parseInt(this.prisonVisitConfigDetail.windowSize),
        jailId: this.jailId,
        batchQueue: []
      }
      this.prisonVisitConfigDetail.queue.forEach(queue => {
        params.batchQueue.push(queue.join('-'))
      })
      this.updatePrisonVisitConfig(params).then(res => {
        if (!res) return
        this.prisonVisitConfigDetail.canNotChange = true
        this.$forceUpdate()
      })
    },
    handleBlur(e, queue) {
      queue[queue.length - 1] = e
      this.$forceUpdate()
    },
    onAddRange(queue) {
      queue.push(this.getNextRange(queue[queue.length - 1]))
    },
    onRestQueue() {
      this.prisonVisitConfigDetail.queue = [null]
    },
    getNextRange(e) {
      let sh = parseInt(e[0]),
        eh = parseInt(e[1]),
        sm = parseInt(e[0].split(':')[1]),
        em = parseInt(e[1].split(':')[1]),
        dur = (eh - sh) * 60 + em - sm,
        time = Moment(new Date(2000, 0, 1, eh, em)).add(dur, 'minutes')
      if (time.date() !== 1) {
        return [e[1], '23:59']
      }
      return [e[1], time.format('HH:mm')]
    }
  }
}
</script>

<style lang="scss" scoped>
.w80{
  padding: 20px 10%;
  .el-form-item__label{
    width: 140px;
    line-height: 30px;
    float: left;
    color: #606266;
  }
  .button-float{
    float: left;
    margin-bottom: 10px;
    margin-right: 10px;
    margin-left: 0;
    &+.button-float{
      margin-right: 0;
    }
  }
  .button-box{
    padding-bottom: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    clear: both;
  }
  .tips{
    color: #F56C6C;
    position: absolute;
    left: 0;
    top: 32px;
    font-size: 12px;
  }
}
.part-right{
  width: 500px;
}
</style>
