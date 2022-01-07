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
          type="dates"
          :disabled="disabled"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          @change="handleDatePicker($event, config, index)" />
        <el-radio-group
          v-model="config.enabledMeeting"
          :disabled="disabled"
          @change="handleDate(config, index)">
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
          @click="handleSubmit(config)">保存</el-button>
        <!--编辑状态并且不支持通话并且选择了日期并且国科服务管理员角色并且是最新一个配置的-->
        <el-button
          v-if="(permission === 'edit' || (permission === 'add' && configs.length < 10)) && (index === configs.length - 1 && config.enabledMeeting === 0 && config.day && !disabled)"
          size="mini"
          type="success"
          class="button-float"
          @click="onAddDay">新增特殊日期</el-button>
      </div>
      <remote-timeprid-config v-if="config.enabledMeeting" :index="index" :disabled="disabled" :config="config" :durationDisabled="true">
        <template v-slot:addButton>
            <el-button
              v-if="(permission === 'edit' || (permission === 'add' && configs.length < 10)) && (index === configs.length - 1 && config.queue.length > 0 && !disabled)"
              size="mini"
              type="success"
              @click="onAddDay">新增特殊日期</el-button>
        </template>
      </remote-timeprid-config>

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
import remoteTimepridConfig from './remote-timeprid-config'
export default {
  components: {
    remoteTimepridConfig
  },

  data() {
    return {
      timequeue: ['09:00','12:00'],
      complexNormalConfig: {},
      configAfter: null,
      configBefore: null,
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
        this.configs = this.specialConfig.complexSpecialConfigs
        this.complexNormalConfig = this.specialConfig.complexNormalConfig
        this.configAfter = this.complexNormalConfig.configAfter
        this.configBefore = this.complexNormalConfig.configBefore
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

    handleSubmit(config) {
      let c = [], t = [],
      params = {
        day: config.day,
        enabledMeeting: config.enabledMeeting,
        jailId: config.jailId,
        duration: config.duration,
        interval: config.interval
      }
      if ( config.enabledMeeting ) {
        config.queue.forEach(q => c.push(q.join('-')))
        config.timequeue.forEach(q => t.push(q.join('-')))
        params.config = c
        params.timeperiod = t
      }
      if ( (params.id = config.id) ) {
        this.updateSpecialConfig(params).then(res => {
          if (!res) return
          config.oldDay = params.day
        })
      }
      else {
        this.addSpecialConfig(params).then(res => {
          if (!res) return
          config.oldDay = params.day
          config.jailId = params.jailId
          config.id = res.id
        })
      }
    },

    getInitParmas() {
      return { enabledMeeting: 1, day: '', interval: '5', duration: '25', config: [], queue: [], timeperiod: [], timequeue: [] }
    },

    // 选择日期后 初始化时间段
    handleDate(current, i) {
      // 选择了日子 并且 是支持通话申请 并且 没有通话配置通话时间段的
      if (current.day && !!current.enabledMeeting) {
        current.timequeue = [this.timequeue]
        if ( !!i ) {
          current.interval = this.configs[0].interval
          current.duration = this.configs[0].duration
        }
      }
    },

    // 选择日期后 初始化时间段
    handleDatePicker(val, config, i) {
      let enat = Moment(this.complexNormalConfig.enabledAt)
      let inEnat = 0
      let outEnat = 0
      let durationList = []
      if (val.length) {
        val.forEach(v => {
          if ( Moment(v).diff(enat) > 0 ) {
            outEnat++
            if ( this.configAfter && this.configAfter.length ) {
              durationList[1] = this.configAfter[0].duration
            }
            durationList[1] = this.configBefore && this.configBefore.length && this.configBefore[0].duration
          }
          else {
            inEnat++
            durationList[0] = this.configBefore && this.configBefore.length && this.configBefore[0].duration
          }
        })

        if ( outEnat && inEnat && durationList[1] != durationList[0] ) {
          this.$message.error('所选日期常规配置中的通话时长不同，请分开配置！')
          return
        }
        else if ( inEnat ) {
          config.duration = durationList[0]
        }
        else if ( outEnat ) {
          config.duration = durationList[1]
        }

        this.handleDate(config, i)
      }
    },

    // 删除特殊日期配置
    handleDeleteConfig(config, i) {
      if (config.id) {
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteSpecialConfig({ jailId: config.jailId, day: config.oldDay }).then(res => {
            if (!res) return
            this.doDeleteConfig(i)
          })
        }).catch(() => {})
      }
      else {
        this.doDeleteConfig(i)
      }
    },
    // 删除配置
    doDeleteConfig(i) {
      this.configs.splice(i, 1)
      if( !this.configs.length ) {
        this.configs.push(this.getInitParmas())
      }
    },

    // 新增特殊日期
    onAddDay() {
      this.configs.push( this.getInitParmas() )
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
      else if (!config.id || config.config.length !== config.queue.length || !_.isEqual(config.day, config.oldDay)) {
        return true
      }
      // 修改了某个通话时间段
      else {
        for (let i = 0; i < config.queue.length; i++) {
          if (config.queue[i].join('-') !== config.config[i]) return true
        }
      }
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
