<template>
  <div class="w80">
    <div class="el-form-item is-required">
      <label class="el-form-item__label">实地探监窗口个数</label>
      <div style="float: left; width: calc(100% - 150px); position: relative;">
        <el-input
          v-model="prisonVisitConfigDetail.windowSize"
          :disabled="!canEdit"
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
          v-if="queue"
          :key="o"
          :val="queue"
          :disabled="!canEdit"
          :prev="prisonVisitConfigDetail.queue[o - 1]"
          :next="prisonVisitConfigDetail.queue[o + 1]"
          type="queue"
          @handleBlur="handleBlur($event, prisonVisitConfigDetail.queue)" />
        <el-button
          v-if="canEdit && Boolean(prisonVisitConfigDetail.queue && prisonVisitConfigDetail.queue.length && hasLocalTimeConfig && prisonVisitConfigDetail.queue[prisonVisitConfigDetail.queue.length - 1][1] !== '23:59')"
          type="primary"
          size="mini"
          class="button-float"
          @click="onAddRange(prisonVisitConfigDetail.queue)">新增实地会见批次</el-button>
        <el-button
          v-if="canEdit && hasLocalTimeConfig"
          size="mini"
          class="button-float"
          @click="onRestQueue(prisonVisitConfigDetail)">重置实地会见时间段</el-button>
      </div>
    </div>
    <div class="button-box">
      <el-button
        v-if="canEdit"
        :disabled="!(prisonVisitConfigDetail.windowSize && !errorMsg && hasLocalTimeConfig)"
        size="small"
        type="primary"
        @click="onSubmit">{{ submitBtnText }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import Moment from 'moment'
import validator from '@/utils'

export default {
  props: {
    role: {
      type: Number,
      default: -1
    }
  },
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
    },
    hasConfig() {
      const batchQueue = this.prisonVisitConfigDetail.batchQueue
      return batchQueue && batchQueue.length > 0
    },
    hasLocalTimeConfig() {
      const queue = this.prisonVisitConfigDetail.queue
      return queue[0] && queue[0][0]
    },
    // 是否可以编辑配置
    canEdit() {
      // 超级管理员始终可编辑
      return this.role === 0 ? true : !this.hasConfig
    },
    submitBtnText() {
      return this.hasConfig ? '更新' : '保存'
    }
  },
  mounted() {
    this.getPrisonVisitConfigDetail({ jailId: this.jailId })
  },
  beforeDestroy() {
    this.resetPrisonVisitConfigDetail()
  },
  methods: {
    ...mapMutations(['resetPrisonVisitConfigDetail']),
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
        // this.prisonVisitConfigDetail.canNotChange = true
        this.$forceUpdate()
      })
    },
    handleBlur(e, queue) {
      // queue[queue.length - 1] = e
      queue.splice(queue.length - 1, 1, e)
      this.$forceUpdate()
    },
    onAddRange(queue) {
      queue.push(this.getNextRange(queue[queue.length - 1]))
    },
    onRestQueue() {
      this.prisonVisitConfigDetail.queue = [[]]
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
