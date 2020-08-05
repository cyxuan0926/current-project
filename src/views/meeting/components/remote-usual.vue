<template>
  <div class="m-container">
    <div
      v-for="(config, index) in configsBefore"
      :key="index"
      class="config-box">
      <div class="day-box">
        <label class="c-label">选择工作日</label>
        <!-- 当前工作日有配置时间段或者不是国科服务管理员的时候disabled状态 -->
        <el-checkbox-group
          v-model="config.days"
          :disabled="!!config.timeperiodQueue.length || disabled || (!config.timeperiodQueue.length && !!config.queue.length)">
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
          v-if="!config.timeperiodQueue.length && config.days.length && !disabled"
          @click="handleConfig(index)">配置时间段参数</el-button>
        <el-button
          plain
          type="danger"
          size="mini"
          v-if="config.timeperiodQueue.length && !disabled"
          @click="handleDeleteConfig(index)">删除当前配置</el-button>
      </div>
      <template v-if="config.timeperiodQueue.length">
        <!-- 通话时长/时间间隔 -->
        <m-form
          class="duration-interval-form"
          :items="durationIntervalItems[index]"
          :values="{ index: index, duration: config.duration, interval: config.interval }"
          @response="onResponse"
          :ref="`form${index}`"
        />

        <div
          class="timeperiod"
          v-for="(queue, o) in config.timeperiodQueue"
          :key="o"
        >
          <label class="c-label">{{ '时间段' + convertToChinaNum(o + 1) }}</label>

          <div class="range-selecor__container">
            <m-time-range-selector
            :val="queue"
            :configs="{
              prev: {
                attrs: {
                  prefixIcon: 'ower-cssName'
                } 
              }
            }"
            :disabled="disabled || !!config.queue.length"
            :prev="config.timeperiodQueue[o - 1]"
            :next="config.timeperiodQueue[o + 1]"
            type="queue"
            @handleBlur="handleBlur($event, config.timeperiodQueue, index)"
            />
            <!-- <div v-if="compareTimes(queue, config.duration, index)" class="error__tip">时间段区间小于通话时长</div> -->
          </div>
          
          <template v-if="o === config.timeperiodQueue.length -1 && !disabled && !config.queue.length">
            <el-button
              v-if="config.timeperiodQueue[config.timeperiodQueue.length - 1][1] !== '23:59'"
              type="primary"
              size="mini"
              style="margin-right: 10px;"
              @click="onNewTimePeriod(config.timeperiodQueue[config.timeperiodQueue.length - 1], index)">新增时间段</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="onFigureOut(config)">生成通话时间段</el-button>
              <el-button
                v-if="config.timeperiodQueue.length > 1"
                size="mini"
                type="danger"
                @click="onDelTimePriod(config)">删除时间段</el-button>
          </template>
        </div>

        <!-- 当有配置时间队列并且flag -->
        <div
          v-if="config.queue.length && flag"
          style="overflow: hidden; margin-bottom: 10px;"
        >
          <label class="c-label">时间段分配</label>
          <div
            style="float: left; width: calc(100% - 80px); overflow: hidden;">
            <!-- 时间范围选择器 -->
            <m-time-range-selector
              v-for="(queue, o) in config.queue"
              :key="o"
              :val="queue"
              :disabled="true"
              :prev="config.queue[o - 1]"
              :next="config.queue[o + 1]"
              type="queue"
            />
            <!--配置的时间段的最后一个时间段的结束时间是不是23:59并且是国科服务管理员角色-->
            <!-- <el-button
              v-if="config.queue[config.queue.length - 1][1] !== '23:59' && !disabled"
              type="primary"
              size="mini"
              class="button-float"
              style="margin-right: 10px;"
              @click="onAddRange(config.queue)">新增会见时间段</el-button> -->
            <!-- 国科服务管理员角色 -->
            <el-button
              v-if="!disabled"
              size="mini"
              class="button-float"
              :style="index === configsBefore.length - 1 ? 'margin-right: 10px;' : ''"
              @click="onRestQueue(config)">重置时间段</el-button>
            <!-- 国科服务管理角色并且有新增的日子选项并且常规配置的长度和当前的索引一致 -->
            <el-button
              v-if="index === configsBefore.length - 1 && canAddDay && !disabled"
              size="mini"
              type="success"
              class="button-float"
              @click="onAddDay(config)">新增工作日</el-button>
          </div>
        </div>
      </template>
    </div>
    <div class="button-box">
      <el-button
        v-if="superAdmin"
        size="small"
        @click="onGoBack">返回</el-button>
      <!-- 权限是编辑并且是国科服务管理人员并且至少有一个通话时间配置 -->
      <el-button
        v-if="configsBefore[0].queue.length && !disabled && permission === 'edit'"
        size="small"
        type="primary"
        @click="onUpdate">更新</el-button>
    </div>
    <el-dialog
      class="authorize-dialog"
      :visible.sync="visible"
      width="45%">
      <span
        slot="title"
        style="display: block; text-align: center; font-weight: bold;font-size: 14px">提示</span>
      <div>修改常规配置后，如有家属已预约，将重新分配相关可视亲情电话时间段，调整后会以短信形式通知相关家属。若预约日期无法在当日分配时间段，系统将自动取消该家属申请，并以短信形式通知相关家属！请确认是否继续操作！</div>
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
// 把得到的参数给变化下 config -> queue timeperiod -> timeperiodQueue
// 实际操作的是变化后的参数 最后更新完成提交前 再把参数还原化
import { mapActions, mapState } from 'vuex'
import Moment from 'moment'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import roles from '@/common/constants/roles'
import {
  countTimes,
  getNextQueue,
  convertToChinaNum
} from '@/utils/helper'
export default {
  data() {
    return {
      // 监狱id: 信息管理员角色 是从用户里面取监狱id 其余是从路由里面取
      jailId: this.$route.meta.role === '3' ? JSON.parse(localStorage.getItem('user')).jailId : this.$route.params.id,
      // '周'的选项
      week: [
        { label: '星期一', value: 1 },
        { label: '星期二', value: 2 },
        { label: '星期三', value: 3 },
        { label: '星期四', value: 4 },
        { label: '星期五', value: 5 },
        { label: '星期六', value: 6 },
        { label: '星期日', value: 0 }
      ],
      // 配置参数
      // configs: [
      //   {
      //     // 工作日
      //     days: [],
      //     // 配置时间段
      //     config: [],
      //     // 时间段队列
      //     queue: []
      //   }
      // ],
      // 默认初始的时间队列
      queue: ['09:00', '10:00'],
      flag: true,
      // 确定更新按钮加载
      loading: false,
      disabled: true,
      permission: 'add',
      // 提示对话框显示属性
      visible: false,
      // 原始的配置信息
      orignConfigs: [],
      configsBefore: [
        {
          // 工作日
          days: [],
          // 配置时间段
          config: [],
          // 时间段队列
          queue: [],
          timeperiod: [],
          timeperiodQueue: [],
          interval: 5,
          duration: 25
        }
      ],
      filterDuration: 25
    }
  },
  computed: {
    // 常规配置
    ...mapState(['normalConfig', 'normalCongigs']),
    // 能否新增工作日
    canAddDay() {
      let days = []
      this.configsBefore.forEach(config => {
        days = days.concat(config.days)
      })
      return days.length < 7
    },
    // 国科服务管理员
    superAdmin() {
      return this.$store.getters.role === roles.SUPER_ADMIN
    },

    // 通话时长和间隔时间
    durationIntervalItems() {
      const item = {
        formConfigs: {
          labelWidth: '81px',
          hideRequiredAsterisk: true,
        },
        duration: {
          label: '通话时长',
          type: 'input',
          append: '分钟',
          rules: ['required', 'isPositiveIntegers']
        },
        interval: {
          label: '间隔时间',
          type: 'input',
          append: '分钟',
          rules: ['required', 'isNumber']
        }
      }

      return this.configsBefore.map((config, index, target) => {
        const cloneItem = cloneDeep(item)

        this.$set(cloneItem['duration'], 'disabled', !(!config.queue.length && target.length === 1))

        this.$set(cloneItem['interval'], 'disabled', !!config.queue.length)

        return cloneItem
      })
    }
  },
  // 激活状态
  async activated() {
    // 国科服务管理员
    if (this.$route.meta.role === '0') this.disabled = false
    // 国科服务管理员权限/信息管理人员权限
    if (this.$route.meta.permission === 'visit.prison.visit-config.search' || this.$route.meta.permission === 'visit.remote-visit-configure.search') this.permission = 'edit'
    if (this.permission === 'edit') {
      // 获取远程通话常规配置
      await this.getRemoteNormalConfigs({ jailId: this.jailId })

      const { configBefore } = this.normalCongigs

      this.configsBefore = cloneDeep(configBefore)
    }
  },
  methods: {
    ...mapActions([
      // 获取通话常规配置
      'getRemoteNormalConfigs',
      // 更新通话常规配置
      'updateRemoteNormalConfig'
    ]),

    // 数字转汉字
    convertToChinaNum(o) {
      return convertToChinaNum(o)
    },

    // 新增时间段
    onNewTimePeriod(timeperiodQueue, index) {
      this.configsBefore[index].timeperiodQueue.push(this.getNextRange(timeperiodQueue, 180))
    },

    // form组件数据
    onResponse(params) {
      const { index, duration, interval } = params

      this.filterDuration = duration

      this.$set(this.configsBefore[index], 'duration', duration)

      this.$set(this.configsBefore[index], 'interval', interval)
    },

    // 生成通话时间段
    onFigureOut(config) {
      let result = []
      const { interval, duration, timeperiodQueue } = config
      timeperiodQueue.forEach((item, index) => {
        const totalTime = Moment(item[1], 'HH:mm').diff(Moment(item[0], 'HH:mm'), 'minutes')
        const times = countTimes(totalTime, duration, interval)
        result = [...result, ...getNextQueue(item, duration, interval, times)]
      })
      this.$set(config, 'queue', result)
    },

    // 计算时长是否大于时间段
    compareTimes(time, duration, index) {
      return Moment(time[1], 'HH:mm').diff(Moment(time[0], 'HH:mm'), 'minutes') - duration < 0
    },

    // 删除时间段
    onDelTimePriod(config) {
      config.timeperiodQueue.splice(-1, 1)
    },

    // 参数化(需要修改)
    filterParams(params) {
      let result = []
      params.forEach(config => {
        if (!config.days.length || !config.queue.length) return
        let c = []
        config.queue.forEach(q => c.push(q.join('-')))
        result.push({ days: config.days, config: c })
      })
      return result
    },

    // 更新按钮的方法
    onUpdate() {
      // 最新的通话配置
      // const configs = this.filterParams(this.configs)
      // // 初始的通话配置
      // const orignConfigs = this.filterParams(this.orignConfigs)
      // // 是否发生变化
      // const hasNoChanged = isEqual(configs, orignConfigs)
      // if (hasNoChanged) {
      //   this.$message({
      //     showClose: true,
      //     message: '配置没有变化，无需编辑！',
      //     duration: 3000,
      //     type: 'error'
      //   })
      // }
      // // 展示提示对话框
      // else this.visible = true
    },

    // 更新常规配置
    onSubmit(e) {
      const params = this.filterParams(this.configs)
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
      // 触发父组件的submit事件
      else this.$emit('submit', params)
    },

    // 新增一个时间段 配置默认的会见时间段
    handleConfig(index) {
      this.$set(this.configsBefore[index], 'duration', this.filterDuration)
      this.$set(this.configsBefore[index], 'interval', 5)
      this.$set(this.configsBefore[index], 'timeperiodQueue', [this.queue])
    },

    // 时间范围选择器组件 自定义的handleblur事件实际触发方法
    handleBlur(e, queue) {
      this.flag = false
      queue[queue.length - 1] = e
      this.flag = true
    },

    // 删除当前常规配置
    handleDeleteConfig(e) {
      if (this.configsBefore.length > 1) this.configsBefore.splice(e, 1)
      else this.configsBefore = [{ days: [], interval: 5, duration: 25, timeperiod: [], config: [], queue: [], timeperiodQueue: [] }]
    },

    // 新增通话时间段
    // onAddRange(e) {
    //   // e: 当前日子的时间队列
    //   e.push(this.getNextRange(e[e.length - 1]))
    // },

    // 新增工作日
    onAddDay(config) {
      // 在常规配置里面新增一个初始化的配置
      this.configsBefore.push({ days: [], interval: 5, duration: this.filterDuration, timeperiod: [], config: [], queue: [], timeperiodQueue: [] })
    },

    // 重置时间段
    onRestQueue(e) {
      // e: 是当前配置信息
      e.queue = []
    },

    // 计算下一个配置时间段
    getNextRange(e, timeDuration) {
      // e：是当前日子配置时间段的最后一个时间段
      let sh = parseInt(e[0]),  // 开始时间
        eh = parseInt(e[1]),  // 结束时间
        sm = parseInt(e[0].split(':')[1]), // 开始的时
        em = parseInt(e[1].split(':')[1]), // 结束的时
        dur = (eh - sh) * 60 + em - sm, // 时间间隔(秒)
        time = Moment(new Date(2000, 0, 1, eh, em)).add(timeDuration || dur, 'minutes') // 下一个的时间段的结束时间
      if (time.date() !== 1) {
        // 如果新增时间段的结束时间跨天的话 就是当天最后的时间
        return [e[1], '23:59']
      }
      // 否则 上一个的结束时间是新的时间段的开始时间 计算后的时间就是新的时间段的结束时间
      return [e[1], time.format('HH:mm')]
    },

    // 显示的日 w: 日子对象 config：当前配置信息 index： 当前索引
    showWeek(w, config, index) {
      // 配置信息的时间段队列存在的话
      if (config.timeperiodQueue.length) {
        // 存在就显示
        return config.days.some(v => v === w.value)
      }
      // 没有配置时间(新增工作日)
      else {
        let days = []
        // 新增后的常规配置信息
        this.configsBefore.forEach((config, i) => {
          // 已经配置了的日期
          if (i !== index) days = days.concat(config.days)
        })
        // 过滤已经配置了的日子
        return !days.some(v => v === w.value)
      }
    },

    // 返回操作
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
  .authorize-dialog {
    /deep/ .button-box {
      button {
        width: 14% !important;
      }
    }
  }

  .duration-interval-form {
    padding-top: 5px;
    /deep/ .el-form-item {
      margin-bottom: 13px;

      .el-form-item__content {
        width: 30%;
      }

      label {
        line-height: 36px;
      }

      .el-form-item__error {
        padding-top: 0px;
        top: 95%
      }
    }
  }

  .timeperiod {
    display: flex;

    /deep/ label {
      line-height: 36px;
    }

    /deep/ .range-selecor__container {
      display: flex;
      flex-direction: column;
      width: 30%;
      margin-right: 10px;

      .m-range-selector {
        float: none;
        width: 100%;
        height: 36px;
        margin-bottom: 13px;
      }
    }

    /deep/ button {
      margin-bottom: 28px;
    }
  }
}
.error__tip {
  color: #F56C6C;
  font-size: 12px;
  line-height: 1;
}
</style>
