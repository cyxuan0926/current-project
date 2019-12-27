<template>
  <div class="m-container">
    <div
      v-for="(config, index) in configs"
      :key="index"
      class="config-box">
      <div class="day-box">
        <label class="c-label">选择工作日</label>
        <el-checkbox-group
          v-model="config.days"
          :disabled="config.queue.length > 0 || disabled">
          <template v-for="(w, i) in week">
            <el-checkbox
              :key="i"
              v-if="showWeek(w, config, index)"
              :label="w.value">{{ w.label }}</el-checkbox>
            </template>
        </el-checkbox-group>
        <el-button
          type="primary"
          size="mini"
          v-if="!config.queue.length && config.days.length && !disabled"
          @click="handleConfig(index)">配置会见时间</el-button>
        <el-button
          plain
          type="danger"
          size="mini"
          v-if="config.queue.length && !disabled"
          @click="handleDeleteConfig(index)">删除当前日期配置</el-button>
      </div>
      <div
        v-if="config.queue.length && flag"
        style="overflow: hidden; margin-bottom: 10px;">
        <label class="c-label">常规配置</label>
        <div
          style="float: left; width: calc(100% - 80px); overflow: hidden;">
          <m-time-range-selector
            v-for="(queue, o) in config.queue"
            :key="o"
            :val="queue"
            :disabled="disabled"
            :prev="config.queue[o - 1]"
            :next="config.queue[o + 1]"
            type="queue"
            @handleBlur="handleBlur($event, config.queue, index)" />
          <el-button
            v-if="config.queue[config.queue.length - 1][1] !== '23:59' && !disabled"
            type="primary"
            size="mini"
            class="button-float"
            style="margin-right: 10px;"
            @click="onAddRange(config.queue)">新增会见时间段</el-button>
          <el-button
            v-if="!disabled"
            size="mini"
            class="button-float"
            :style="index === configs.length - 1 ? 'margin-right: 10px;' : ''"
            @click="onRestQueue(config)">重置会见时间段</el-button>
          <el-button
            v-if="index === configs.length - 1 && canAddDay && !disabled"
            size="mini"
            type="success"
            class="button-float"
            @click="onAddDay">新增工作日</el-button>
        </div>
      </div>
    </div>
    <div class="button-box">
      <el-button
        v-if="configs[0].queue.length && !disabled && permission === 'edit'"
        size="small"
        type="primary"
        @click="visible = true">更新</el-button>
    </div>
    <el-dialog
      :visible.sync="visible"
      width="400px">
      <span
        slot="title"
        style="display: block; text-align: center; font-weight: bold;">提示</span>
      <div style="text-align: center;">修改常规配置后，将重新分配相关待会见时间段，调整后会以短信形式通知相关家属。</div>
      <div style="text-align: center;">注意：若预约日期无法在当日分配时间段，系统将自动取消该条待会见申请，并以短信形式通知相关家属，请确认是否继续操作！</div>
      <div
        slot="footer"
        class="button-box"
        style="padding-bottom: 0;">
        <el-button
          type="default"
          size="mini"
          @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="loading"
          @click="onSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import Moment from 'moment'
export default {
  data() {
    return {
      jailId: this.$route.meta.role === '3' ? JSON.parse(localStorage.getItem('user')).jailId : this.$route.params.id,
      week: [
        { label: '星期一', value: 1 },
        { label: '星期二', value: 2 },
        { label: '星期三', value: 3 },
        { label: '星期四', value: 4 },
        { label: '星期五', value: 5 },
        { label: '星期六', value: 6 },
        { label: '星期日', value: 0 }
      ],
      configs: [
        {
          days: [],
          config: [],
          queue: []
        }
      ],
      queue: ['09:00', '09:30'],
      flag: true,
      loading: false,
      disabled: true,
      permission: 'add',
      visible: false
    }
  },
  computed: {
    ...mapState(['normalConfig']),
    canAddDay() {
      let days = []
      this.configs.forEach(config => {
        days = days.concat(config.days)
      })
      return days.length < 7
    }
  },
  watch: {
    'configs.0': {
      handler: function(val) {
        this.$emit('canAdd', val.queue.length > 0)
      },
      deep: true
    }
  },
  activated() {
    if (this.$route.meta.role === '0') this.disabled = false
    if (this.$route.meta.permission === 'visit.prison.visit-config.search' || this.$route.meta.permission === 'visit.remote-visit-configure.search') this.permission = 'edit'
    if (this.permission === 'edit') {
      this.getRemoteNormalConfig({ jailId: this.jailId }).then(res => {
        if (!res) return
        this.configs = this.normalConfig.normalConfig
      })
    }
  },
  methods: {
    ...mapActions([
      'getRemoteNormalConfig',
      'updateRemoteNormalConfig'
    ]),
    onSubmit(e) {
      let params = []
      this.configs.forEach(config => {
        if (!config.days.length || !config.queue.length) return
        let c = []
        config.queue.forEach(q => c.push(q.join('-')))
        params.push({ days: config.days, config: c })
      })
      if (e) {
        this.loading = true
        this.updateRemoteNormalConfig({
          id: this.normalConfig.id,
          jailId: this.normalConfig.jailId,
          normalConfig: params
        }).then(res => {
          this.loading = false
          if (!res) return
          this.visible = false
        })
      }
      else this.$emit('submit', params)
    },
    handleConfig(e) {
      this.configs[e].queue = [this.queue]
    },
    handleBlur(e, queue) {
      this.flag = false
      queue[queue.length - 1] = e
      this.flag = true
    },
    handleDeleteConfig(e) {
      if (this.configs.length > 1) this.configs.splice(e, 1)
      else this.configs = [{ days: [], config: [], queue: [] }]
    },
    onAddRange(e) {
      e.push(this.getNextRange(e[e.length - 1]))
    },
    onAddDay() {
      this.configs.push({ days: [], config: [], queue: [] })
    },
    onRestQueue(e) {
      e.queue = [this.queue]
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
    },
    showWeek(w, config, index) {
      if (config.queue.length) {
        return config.days.some(v => v === w.value)
      }
      else {
        let days = []
        this.configs.forEach((config, i) => {
          if (i !== index) days = days.concat(config.days)
        })
        return !days.some(v => v === w.value)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.m-container{
  .config-box{
    overflow: hidden;
  }
  .config-box+.config-box{
    border-top: 1px solid #dcdfe6;
    padding-top: 10px;
  }
  label.c-label{
    width: 70px;
    text-align: right;
    font-weight: normal;
    float: left;
    color: #606266;
    line-height: 28px;
    margin-right: 10px;
  }
  .button-float{
    float: left;
    margin-bottom: 10px;
    margin-left: 0;
  }
  .button-box{
    padding-bottom: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    clear: both;
  }
}
</style>
