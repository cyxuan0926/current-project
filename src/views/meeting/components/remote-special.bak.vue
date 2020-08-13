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
        <!--（不支持通话申请或者支持通话申请并且通话时间段已经初始化）并且是国科服务管理员-->
        <el-button
          plain
          type="danger"
          size="mini"
          v-if="(config.enabledMeeting === 0 || config.queue.length) && !disabled"
          @click="handleDeleteConfig(config, index)">删除当前日期配置</el-button>
        <!--可保存状态并且是国科服务管理员并且是编辑状态-->
        <el-button
          v-if="canSave(config) && !disabled && permission === 'edit'"
          type="primary"
          size="mini"
          @click="onSubmit(config, index)">保存</el-button>
        <!--编辑状态并且不支持通话并且选择了日期并且国科服务管理员角色并且是最新一个配置的-->
        <el-button
          v-if="(permission === 'edit' || (permission === 'add' && configs.length < 10)) && (index === configs.length - 1 && config.enabledMeeting === 0 && config.day && !disabled)"
          size="mini"
          type="success"
          class="button-float"
          @click="onAddDay">新增特殊日期</el-button>
      </div>
      <!-- 可配置/时间段存在 -->
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
          <!-- 通常规时间配置 -->
          <el-button
            v-if="config.queue[config.queue.length - 1][1] !== '23:59' && !disabled"
            type="primary"
            size="mini"
            class="button-float"
            style="margin-right: 10px;"
            @click="onAddRange(config.queue)">新增会见时间段</el-button>
          <!-- 通常规时间配置 -->
          <el-button
            v-if="!disabled"
            size="mini"
            class="button-float"
            :style="index === configs.length - 1 ? 'margin-right: 10px;' : ''"
            @click="onRestQueue(config)">重置会见时间段</el-button>
          <!--编辑状态并且支持通话并且选择了日期并且国科服务管理员角色并且是最新配置并且初始化了通话时间段-->
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
      // 监狱id: 信息管理员角色 是从用户里面取监狱id 其余是从路由里面取
      jailId: this.$route.meta.role === '3' ? JSON.parse(localStorage.getItem('user')).jailId : this.$route.params.id,
      // data里面的特殊日期配置
      configs: [
        // { day: '', config: [], queue: [], enabledMeeting: 1 }
      ],
      queue: ['09:00', '09:30'],
      show: true,
      flag: true,
      loading: false,
      // 选择日期的选择选项配置
      pickerOptions: {
        // 不可选的时间: 今天之前的 或者是已经选择了的日期
        disabledDate: (time) => {
          let t = Moment(new Date(time)).format('YYYY-MM-DD')
          return (time.getTime() < Date.now()) || (this.configs.find(item => item.day === t))
        }
      },
      disabled: true,
      // 页面权限
      permission: 'add'
    }
  },
  computed: {
    // vuex里面的特殊日期配置
    ...mapState(['specialConfig']),
    // 国科服务管理员
    superAdmin() {
      return this.$store.getters.role === roles.SUPER_ADMIN
    }
  },
  activated() {
    // 国科服务管理员
    if (this.$route.meta.role === '0') this.disabled = false
    // 国科服务管理员权限/信息管理人员权限
    if (this.$route.meta.permission === 'visit.prison.visit-config.search' || this.$route.meta.permission === 'visit.remote-visit-configure.search') this.permission = 'edit'
    if (this.permission === 'edit') {
      // 获取特殊日期配置
      this.getRemoteSpecialConfig({ jailId: this.jailId }).then(res => {
        if (!res) return
        this.configs = [...this.specialConfig]
      })
    }
  },
  methods: {
    ...mapActions([
      // 获取特殊日期配置
      'getRemoteSpecialConfig',
      // 新增特殊日期配置(保存操作)
      'addSpecialConfig',
      // 更新特殊日期配置
      'updateSpecialConfig',
      // 删除特殊日期配置
      'deleteSpecialConfig'
    ]),
    // 单独保存某一个特殊日期配置
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
    // 选择日期后 初始化时间段
    handleDate(config) {
      // 选择了日子 并且 是支持通话申请 并且 没有通话配置通话时间段的
      if (config.day && config.enabledMeeting && config.queue.length < 1) {
        config.queue.push(this.queue)
      }
    },
    // 时间范围选择器组件 自定义的handleblur事件实际触发方法
    handleBlur(e, queue) {
      this.flag = false
      queue[queue.length - 1] = e
      this.flag = true
    },
    // 删除特殊日期配置
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
    // 删除配置
    splice(index) {
      if (this.configs.length > 1) {
        this.configs.splice(index, 1)
      }
      else {
        this.configs = [{ enabledMeeting: 1, day: '', config: [], queue: [] }]
      }
    },
    // 可保存状态 本质是一个特殊日期的实际变化
    canSave(config) {
      // config：当前特殊配置信息
      if (!config.day) {
        // 未选择配置日期
        return false
      }
      // 不支持通话申请
      else if (config.enabledMeeting === 0) {
        // 这个日期是初始化时候不支持通话的并且本质上没有改变其状态 则是不可保存的
        if (config.oldEnabled === 0 && config.day === config.oldDay) return false
        return true
      }
      else if (config.queue.length === 0) {
        // 没有配置通话时间段
        return false
      }
      // 新增的特殊日期配置 或者 是新增了通话时间段 或者是更换了新的配置日期
      else if (!config.id || config.config.length !== config.queue.length || config.day !== config.oldDay) {
        return true
      }
      // 修改了某个通话时间段
      else {
        console.log(4)
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
