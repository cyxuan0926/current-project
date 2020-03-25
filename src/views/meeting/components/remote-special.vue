<template>
  <div
    v-if="show"
    class="m-container">
    <div
      v-for="(config, index) in configs"
      :key="index"
      class="config-box">
      <div class="day-box">
        <label class="c-label">选择日期</label>
        <el-date-picker
          v-model="config.day"
          size="mini"
          type="date"
          :disabled="disabled"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          @change="handleDate(config)" />
        <el-radio-group
          v-model="config.enabledMeeting"
          :disabled="disabled"
          @change="handleDate(config)">
          <el-radio :label="1">支持会见申请</el-radio>
          <el-radio :label="0">不支持会见</el-radio>
        </el-radio-group>
        <!-- 有问题 -->
        <el-button
          plain
          type="danger"
          size="mini"
          v-if="(config.enabledMeeting === 0 || config.queue.length) && !disabled"
          @click="handleDeleteConfig(config, index)">删除当前日期配置</el-button>
        <el-button
          v-if="canSave(config) && !disabled && permission === 'edit'"
          type="primary"
          size="mini"
          @click="onSubmit(config, index)">保存</el-button>
        <el-button
          v-if="(permission === 'edit' || (permission === 'add' && configs.length < 10)) && (index === configs.length - 1 && config.enabledMeeting === 0 && config.day && !disabled)"
          size="mini"
          type="success"
          class="button-float"
          @click="onAddDay">新增特殊日期</el-button>
      </div>
      <div
        v-if="config.enabledMeeting && config.queue.length && flag"
        style="overflow: hidden; margin-bottom: 10px;">
        <label class="c-label">配置</label>
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
            v-if="(permission === 'edit' || (permission === 'add' && configs.length < 10)) && (index === configs.length - 1 && config.queue.length > 0 && !disabled)"
            size="mini"
            type="success"
            class="button-float"
            @click="onAddDay">新增特殊日期</el-button>
        </div>
      </div>
    </div>
    <div
      class="button-box"
      v-if="superAdmin" >
      <el-button
        size="small"
        @click="onGoBack">返回</el-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import Moment from 'moment'
import roles from '@/common/constants/roles'
export default {
  data() {
    return {
      jailId: this.$route.meta.role === '3' ? JSON.parse(localStorage.getItem('user')).jailId : this.$route.params.id,
      configs: [
        // { day: '', config: [], queue: [], enabledMeeting: 1 }
      ],
      queue: ['09:00', '09:30'],
      show: true,
      flag: true,
      loading: false,
      pickerOptions: {
        disabledDate: (time) => {
          let t = Moment(new Date(time)).format('YYYY-MM-DD')
          return (time.getTime() < Date.now()) || (this.configs.find(item => item.day === t))
        }
      },
      disabled: true,
      permission: 'add'
    }
  },
  computed: {
    ...mapState(['specialConfig']),
    superAdmin() {
      return this.$store.getters.role === roles.SUPER_ADMIN
    }
  },
  activated() {
    if (this.$route.meta.role === '0') this.disabled = false
    if (this.$route.meta.permission === 'visit.prison.visit-config.search' || this.$route.meta.permission === 'visit.remote-visit-configure.search') this.permission = 'edit'
    if (this.permission === 'edit') {
      this.getRemoteSpecialConfig({ jailId: this.jailId }).then(res => {
        if (!res) return
        this.configs = [...this.specialConfig]
      })
    }
  },
  methods: {
    ...mapActions([
      'getRemoteSpecialConfig',
      'addSpecialConfig',
      'updateSpecialConfig',
      'deleteSpecialConfig'
    ]),
    onSubmit(config, index, e) {
      let params = {
        day: config.day,
        enabledMeeting: config.enabledMeeting,
        jailId: Number(this.jailId),
        // config: null
        config: []
      }
      if (config.enabledMeeting) {
        params.config = []
        config.queue.forEach(q => params.config.push(q.join('-')))
      }
      if (e) return params
      if (config.id) {
        params.id = config.id
        this.updateSpecialConfig(params).then(res => {
          if (!res) return
          config.oldDay = params.day
          // config.config = params.config
          config.config = params.config ? params.config : []
        })
      }
      else {
        this.addSpecialConfig(params).then(res => {
          if (!res) return
          config.oldDay = params.day
          config.jailId = params.jailId
          config.config = params.config ? params.config : []
          config.id = res.id
          // this.$forceUpdate()
          this.show = false
          this.show = true
        })
      }
    },
    handleEmit() {
      let params = []
      this.configs.forEach((config, index) => {
        if (this.canSave(config)) params.push(this.onSubmit(config, index, true))
      })
      this.$emit('submit', params)
    },
    handleDate(config) {
      if (config.day && config.enabledMeeting && config.queue.length < 1) {
        config.queue.push(this.queue)
      }
    },
    handleBlur(e, queue) {
      this.flag = false
      queue[queue.length - 1] = e
      this.flag = true
    },
    handleDeleteConfig(config, index) {
      if (config.id) {
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteSpecialConfig({ jailId: config.jailId, day: config.oldDay }).then(res => {
            if (!res) return
            this.splice(index)
          })
        }).catch(() => {})
      }
      else {
        this.splice(index)
      }
    },
    splice(index) {
      if (this.configs.length > 1) {
        this.configs.splice(index, 1)
      }
      else {
        this.configs = [{ enabledMeeting: 1, day: '', config: [], queue: [] }]
      }
    },
    canSave(config) {
      if (!config.day) {
        return false
      }
      else if (config.enabledMeeting === 0) {
        if (config.oldEnabled === 0 && config.day === config.oldDay) return false
        return true
      }
      else if (config.queue.length === 0) {
        return false
      }
      else if (!config.id || config.config.length !== config.queue.length || config.day !== config.oldDay) {
        return true
      }
      else {
        for (let i = 0; i < config.queue.length; i++) {
          if (config.queue[i].join('-') !== config.config[i]) return true
        }
      }
    },
    onAddRange(e) {
      e.push(this.getNextRange(e[e.length - 1]))
    },
    onAddDay() {
      this.configs.push({ day: '', config: [], queue: [], enabledMeeting: 1 })
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
    onGoBack() {
      this.$router.back()
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
