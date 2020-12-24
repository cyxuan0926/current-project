<template>
  <div class="container">
    <template v-for="(configs, type) in allConfigs">
      <div
        v-if="type === 0 || (type === 1 && hasConfigAfter) || hasOriginConfigAfter"
        class="m-container"
        :key="type"
      >
        <div v-if="type === 1 && hasOriginConfigAfter" class="after-tip">
          {{ meetingRoomConfigs['updatedAt'] + ' 调整后的时间段配置，' + meetingRoomConfigs['enabledAt'] + ' 日生效' }}
        </div>

        <template v-for="(config, index) in configs">
          <div :key="index" class="config-box">
            <div class="day-box">
              <label class="c-label">选择工作日</label>
              <el-checkbox-group v-model="config.days">
                <!-- 这里-->
                <template v-for="(w, i) in week">
                  <el-checkbox
                    :key="i"
                    :label="w.value"
                    :disabled="!!config.timeperiodQueue.length || (!config.timeperiodQueue.length && !!config.queue.length)">{{ w.label }}</el-checkbox>
                </template>
              </el-checkbox-group>

              <!-- 整体隐藏的情况是 当有即将生效的配置 那么全部隐藏正在生效的 -->
              <template v-if="!(hasOriginConfigAfter && type === 0)">
                <!-- 如果没有原来没有将要生效的 那么只有在配置了日期监区配置后 才显示 -->
                <!-- 如果有将要生效的 那么肯定生效撒 -->
                <el-button
                  v-if="hasPrisonWeekItemsBefore || !config.days.length"
                  type="primary"
                  size="mini"
                  @click="onChangeConfigDays(index, type, configs)"
                >修改工作日</el-button>

                <el-button
                  type="primary"
                  size="mini"
                  @click="onDeployPrisonArea(index, type, configs, false)"
                >配置监区</el-button>

                <el-button
                  type="primary"
                  size="mini"
                  @click="onSavePrisonArea(index, type, configs)"
                >保存</el-button>
              </template>

              <!-- 要等配置工作日和监区配置完成后 -->
              <!-- 没有配置会见时间 并且 选择了工作日 现在还要加上配置了是否配置了日期周期 如果是有将要生效的 那么正在生效的是绝对没有的 -->
              <el-button
                v-if="!config.timeperiodQueue.length && config.days.length && (!hasOriginConfigAfter || !(hasOriginConfigAfter && type === 0))"
                type="primary"
                size="mini"
                @click="handleConfig(index, type, configs)">配置时间段参数</el-button>

              <!-- <el-button
                v-if="config.timeperiodQueue.length && (!hasOriginConfigAfter || !(hasOriginConfigAfter && type === 0))"
                plain
                type="danger"
                size="mini"
                @click="handleDeleteConfig({ configs, index, type })">删除当前配置</el-button> -->
            </div>

            <!-- 配置监区区域 -->
            <!-- 现在两个部分 星期几 -->
            <!-- 现在 就是这个 动态的列表 是怎么处理 -->
            <!-- :values="{
                type: type,
                index: index,
                Monday: config.Monday,
                Wednesday: config.Wednesday,
                Thursday: config.Thursday,
                Friday: config.Friday,
                Tuesday: config.Tuesday,
                Saturday: config.Saturday,
                Sunday: config.Sunday,
              }" -->
            <m-form
              class="el-form__prison-area"
              :items="testElFormPrisonAreaItems[type][index]"
              :ref="`${type}el-form__prison-area${index}`"
              @response="onPrisonAreaResponse"
            />
            
            <template v-if="config.timeperiodQueue.length">
              <!-- 通话时长/时间间隔 -->
              <!-- <div v-if="!superAdmin" class="none_superAdmin">
                <label >通话时长</label>
                <span>{{ config.duration }} 分钟</span>
              </div> -->
              <m-form
                class="duration-interval-form"
                :items="durationIntervalItems[type][index]"
                :values="{ index: index, duration: config.duration, interval: config.interval, type: type }"
                @response="onResponse"
                :ref="`${type}form${index}`"
              />

              <template v-for="(queue, o) in config.timeperiodQueue">
                <div :key="o" class="timeperiod">
                  <label class="c-label">{{ '时间段' + convertToChinaNum(o + 1) }}</label>

                  <div :class="['range-selecor__container', { 'error-status': config['showError'][o] } ]">
                    <m-time-range-selector
                      :val="queue"
                      :configs="{
                        prev: {
                          attrs: {
                            prefixIcon: 'ower-cssName'
                          }
                        }
                      }"
                      :disabled="!!config.queue.length"
                      :prev="config.timeperiodQueue[o - 1]"
                      :next="config.timeperiodQueue[o + 1]"
                      type="queue"
                      @handleBlur="handleBlur($event, config.timeperiodQueue, index)"
                    />

                    <div v-if="config['showError'][o]" class="error__tip">时间段区间小于通话时长</div>
                  </div>

                  <template v-if="o === config.timeperiodQueue.length -1 && !config.queue.length  && (!hasOriginConfigAfter || !(hasOriginConfigAfter && type === 0))">
                    <el-button
                      v-if="config.timeperiodQueue[config.timeperiodQueue.length - 1][1] !== '23:59'"
                      type="primary"
                      size="mini"
                      style="margin-right: 10px;"
                      @click="onNewTimePeriod(config.timeperiodQueue[config.timeperiodQueue.length - 1], index, type)">新增时间段</el-button>

                    <el-button
                      type="primary"
                      size="mini"
                      @click="onFigureOut(config, index, type)">生成通话时间段</el-button>

                    <el-button
                      v-if="config.timeperiodQueue.length > 1"
                      size="mini"
                      type="danger"
                      @click="onDelTimePriod(config)">删除时间段</el-button>
                  </template>
                </div>
              </template>

              <!-- 当有配置时间队列并且flag -->
              <div v-if="config.queue.length && flag" style="overflow: hidden; margin-bottom: 10px;">
                <label class="c-label">时间段分配</label>

                <div style="float: left; width: calc(100% - 80px); overflow: hidden;">
                  <!-- 时间范围选择器 -->
                  <template v-for="(queue, o) in config.queue">
                    <m-time-range-selector
                      :key="o"
                      :val="queue"
                      :disabled="true"
                      :prev="config.queue[o - 1]"
                      :next="config.queue[o + 1]"
                      type="queue"
                    />
                  </template>

                  <!-- 国科服务管理员角色 -->
                  <el-button
                    v-if="!hasOriginConfigAfter || !(hasOriginConfigAfter && type === 0)"
                    size="mini"
                    class="button-float"
                    :style="index === configs.length - 1 ? 'margin-right: 10px;' : ''"
                    @click="onRestQueue(config)">重置时间段</el-button>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </template>

    <div v-if="hasOriginConfigAfter || hasConfigBeforeChange" class="effective__date">
      <label class="c-label" style="line-height: 35px">生效日期</label>

      <el-date-picker
        v-model="computedEffectiveDate"
        :picker-options="pickerOptions"
        type="date"
        :clearable="false"
        :value-format="'yyyy-MM-dd'"
        placeholder="选择日期">
      </el-date-picker>
    </div>

    <div class="button-box">
      <el-button
        v-if="superAdmin"
        size="small"
        @click="onGoBack">返回</el-button>

      <el-button
        v-if="!updateShow && permission === 'edit'"
        size="small"
        type="primary"
        @click="onUpdate">更新</el-button>
    </div>

    <el-dialog
      class="authorize-dialog"
      :visible.sync="visible"
      width="45%"
      @close="onClose"
    >
      <span slot="title" style="display: block; text-align: center; font-weight: bold;font-size: 14px">提示</span>

      <div>
        修改常规配置后，如有家属已预约，将重新分配相关可视电话时间段，调整后会以短信形式通知相关家属。
        若预约日期无法在当日分配时间段，系统将自动取消该家属申请，并以短信形式通知相关家属！请确认是否继续操作！
      </div>

      <div
        slot="footer"
        class="button-box"
        style="padding-bottom: 0;">
        <el-button
          type="default"
          size="mini"
          @click="onClose">取消</el-button>

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

import normalMixins from '../mixins'

import Moment from 'moment'

import isEqual from 'lodash/isEqual'

import cloneDeep from 'lodash/cloneDeep'

import { Message } from 'element-ui'

import { weeks, meetingChargeConfigDurations } from '@/common/constants/const'
// 还有很多小细节需要修改
export default {
  mixins: [normalMixins],

  data() {
    const basicConfig = {
      // 工作日
      days: [1, 2, 3, 4, 5, 6, 0],
      // 配置时间段
      config: [],
      // 时间段队列
      queue: [],
      timeperiod: [],
      timeperiodQueue: [],
      interval: 5,
      duration: 25,
      showError: []
    }
    return {
      // '周'的选项
      week: weeks,
      // 默认初始的时间队列
      queue: ['09:00', '10:00'],
      flag: true,
      // 确定更新按钮加载
      loading: false,
      permission: 'add',
      // 提示对话框显示属性
      visible: false,
      // 原始的配置信息
      orignConfigs: [],
      // 正在生效的配置
      configsBefore: [basicConfig],
      filterDuration: [25, 25],
      // 即将生效的配置
      configsAfter: [basicConfig],
      allConfigs: [],
      basicConfig,
      effectiveDate: '',
      dateValue: '',
      updateShow: false,
      testElFormPrisonAreaItems: [[], []],
      beforeParams: {},
      currentParams: {}
    }
  },

  watch: {
    allConfigs: {
      handler: function (value) {
        if (this.hasOriginConfigAfter) {
          this.updateShow = value[1].some(item => {
            return !item.queue.length
          }) || !this.hasConfigAfter
        }
        else {
          this.updateShow = value[0].some(item => {
            return !item.queue.length
          }) || !this.hasConfigBefore
        }
      },
      deep: true
    }
  },

  computed: {
    // 常规配置
    // 会见楼配置
    ...mapState(['normalCongigs', 'meetingRoomConfigs', 'jailPrisonAreas']),

    // 是否存在正在生效的配置 现在默认情况下 是肯定有的
    hasConfigBefore() {
      return !!(this.allConfigs[0]
        && this.allConfigs[0].length
        && this.allConfigs[0][0].timeperiodQueue.length
        && this.allConfigs[0][0].queue.length)
    },

    // 是否存在即将生效的配置
    hasConfigAfter() {
      return !!(this.allConfigs[1]
        && this.allConfigs[1].length
        && this.allConfigs[1][0].days.length
        && this.allConfigs[1][0].timeperiodQueue.length
        && this.allConfigs[1][0].queue.length)
    },

    // 原来是否用after
    // 现在日期默认是满的
    hasOriginConfigAfter() {
      return !!(this.meetingRoomConfigs['configAfter']
        && this.meetingRoomConfigs['configAfter'].length
        && this.meetingRoomConfigs['configAfter'][0].timeperiodQueue.length
        && this.meetingRoomConfigs['configAfter'][0].queue.length)
    },

    // 当前仅有before config的时候 并且发生改变的时候
    hasConfigBeforeChange() {
      return !!(this.hasConfigBefore && !isEqual(this.allConfigs[0], this.meetingRoomConfigs['configBefore']))
    },

    // 可选日期
    // 如果没有after 取值范围就是当前日期的第二天起 默认是当前 + 15 +1
    // 如果有after 默认值是enableAt 范围是当前日期的第二天起 到 enableAt
    pickerOptions() {
      return {
        disabledDate: (time) => {
          if (!this.hasOriginConfigAfter) {
            return time.getTime() < Date.now()
          }
          else {
            const enabledAt = this.normalCongigs['enabledAt']

            return time.getTime() < Date.now() || time.getTime() > new Date(enabledAt)
          }
        }
      }
    },

    // 生效日期的默认值
    // 还有很多小细节需要修改
    computedEffectiveDate: {
      get() {
        const limitDays = this.normalCongigs['dayInLimit']

        this.dateValue = this.dateValue  || (this.hasOriginConfigAfter ? this.effectiveDate : Moment(Date.now()).add(limitDays, 'days').format('YYYY-MM-DD'))

        return this.dateValue
      },

      set(date) {
        this.dateValue = date
      }
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
          type: 'select',
          options: this.localDurations,
          rules: ['required']
        },
        interval: {
          label: '间隔时间',
          type: 'input',
          append: '分钟',
          rules: ['required', 'isNumber']
        }
      }

      return this.allConfigs.map(configs => {
        return configs.map((config, index, target) => {
          const cloneItem = cloneDeep(item)

          this.$set(cloneItem['duration'], 'disabled', !(!config.queue.length && target.length === 1))

          this.$set(cloneItem['interval'], 'disabled', !!config.queue.length)

          return cloneItem
        })
      })
    },

    filterPrisonAreaOptions() {
      const { prisonBranch } = this.meetingRoomConfigs
      if (!+prisonBranch) return [
        {
          id: null,
          name: '全监狱'
        }
      ]
      else return this.jailPrisonAreas
    },

    localDurations() {
      const { durations } = this.meetingRoomConfigs

      let preHandleDurations = durations && durations.length ? durations : meetingChargeConfigDurations

      return preHandleDurations.map(item => ({ label: item, value: item }))
    },

    // 是否拥有配置
    hasPrisonWeekItemsBefore() {
      return !!(this.testElFormPrisonAreaItems[0] && this.testElFormPrisonAreaItems[0].length)
    }
  },

  // 激活状态
  async activated() {
    // 国科服务管理员权限/信息管理人员权限
    if (this.$route.meta.permission === 'visit.prison.visit-config.search' || this.$route.meta.permission === 'visit.remote-visit-configure.search') this.permission = 'edit'
    if (this.permission === 'edit') {
      // 获取远程通话常规配置
      await this.initConfigs()
    }
  },

  methods: {
    ...mapActions([
      'getRemoteNormalConfigs',
      // 更新通话常规配置
      'updateRemoteNormalConfig',
      // 获取会见楼配置
      'getComplexConfigFloorDetail',

      // 保存会见楼配置
      'saveComplexConfigFloorDetail',

      // 获取监区
      'getJailPrisonAreas'
    ]),

    onClose() {
      this.visible = false
      this.initConfigs()
    },

    async initConfigs() {
      await this.getComplexConfigFloorDetail(this.jailId)

      // await this.getRemoteNormalConfigs({ jailId: this.jailId })

      Message.closeAll()

      const { configBefore, configAfter, enabledAt, prisonBranch } = this.meetingRoomConfigs

      if (+prisonBranch) {
        await this.getJailPrisonAreas({ url: '/prison_config/getPrisonConfigs', params: { jailId: this.jailId } })

        Message.closeAll()
      }

      // const { configBefore, configAfter, enabledAt } = this.normalCongigs

      this.configsBefore = cloneDeep(configBefore)

      this.configsAfter = cloneDeep(configAfter)

      this.effectiveDate = enabledAt

      this.allConfigs = [this.configsBefore, this.configsAfter]

      this.allConfigs.forEach((configs, type) => {
        configs.forEach((_, index) => {
          this.onDeployPrisonArea(index, type, configs, true)
        })
      })
    },

    // 能否新增工作日
    // canAddDay(configs) {
    //   let days = []
    //   configs.forEach(config => {
    //     days = days.concat(config.days)
    //   })
    //   return days.length < 7
    // },

    // 新增时间段(update)
    onNewTimePeriod(timeperiodQueue, index, type) {
      this.allConfigs[type][index].timeperiodQueue.push(this.getNextRange(timeperiodQueue, 180))

      this.allConfigs[type][index].showError.push(false)
    },

    // form组件数据
    onResponse(params) {
      const { index, duration, interval, type } = params

      this.$set(this.filterDuration, type, duration)

      this.$set(this.allConfigs[type][index], 'duration', duration)

      this.$set(this.allConfigs[type][index], 'interval', interval)
    },

    // 生成通话时间段
    async onFigureOut(config, index, type) {
      try {
        const isChecked = await this.$refs[`${type}form${index}`][0].onCheck()

        if (isChecked) this.getConfigsQueue(config)

        else {
          const { timeperiodQueue } = config

          timeperiodQueue.forEach((item, index) => {
            this.$set(config['showError'], index, false)
          })
        }
      } catch(err) {
        Promise.reject(err)
      }
    },

    // 参数化(update)
    filterParams(params) {
      let result = []

      params.forEach(config => {
        const { duration, interval, days, queue, timeperiodQueue } = config

        if (!config.days.length || !config.queue.length || !config.timeperiodQueue.length) return

        let c = []

        let period = []

        queue.forEach(q => c.push(q.join('-')))

        timeperiodQueue.forEach(t => period.push(t.join('-')))

        result.push({ days, config: c, duration, interval, timeperiod: period })
      })

      return result
    },

    // 更新按钮的方法
    // 只有before
    onUpdate() {
      let hasNoChanged

      const [before, after] = this.allConfigs

      const { configBefore, configAfter, enabledAt } = this.normalCongigs

      if (!this.hasOriginConfigAfter) hasNoChanged = isEqual(this.filterParams(before), this.filterParams(configBefore)) && (!enabledAt || enabledAt === this.computedEffectiveDate)

      else hasNoChanged = isEqual(this.filterParams(after), this.filterParams(configAfter)) && enabledAt === this.computedEffectiveDate

      if (hasNoChanged) {
        this.$message({
          showClose: true,
          message: '配置没有变化，无需编辑！',
          duration: 3000,
          type: 'error'
        })
      }
      // 展示提示对话框
      else this.visible = true
    },

    // 更新常规配置
    onSubmit() {
      let params
      const [before, after] = this.allConfigs
      if (this.hasOriginConfigAfter) {
        params = this.filterParams(after)
      } else {
        params = this.filterParams(before)
      }
      const { id, jailId } = this.normalCongigs

      this.loading = true

      this.updateRemoteNormalConfig({
        enabledAt: this.computedEffectiveDate,
        id,
        jailId,
        configAfter: params
      }).then(res => {
        this.loading = false
        if (!res) return
        this.visible = false
      })
    },

    // 新增一个时间段 配置默认的会见时间段(update)
    handleConfig(index, type, configs) {
      const duration = this.filterDuration[type]

      const timeperiodQueue = [this.queue]

      const interval = 5

      const showError = [false]

      const values = {
        duration,
        timeperiodQueue,
        interval,
        showError
      }

      const keys = [
        'duration',
        'timeperiodQueue',
        'interval',
        'showError'
      ]

      keys.forEach(key => {
        this.$nextTick(function() {
          this.$set(this.allConfigs[type][index], key, values[key])
        })
      })
    },

    // 删除当前常规配置(update)
    // handleDeleteConfig(params) {
    //   let { configs, index, type } = params

    //   const { configBefore } = this.normalCongigs

    //   const beforDuration = cloneDeep(configBefore)[0].duration

    //   const initDuration = beforDuration

    //   this.$nextTick(function() {
    //     if (configs.length > 1) this.allConfigs[type].splice(index, 1)

    //     else {
    //       this.$set(this.allConfigs, type, cloneDeep([this.basicConfig]))

    //       this.$set(this.filterDuration, type, initDuration)
    //     }
    //   })
    // },

    // 显示的日 w: 日子对象 config：当前配置信息 index： 当前索引
    showWeek(w, config, index, configs) {
      // 配置信息的时间段队列存在的话
      if (config.timeperiodQueue.length) {
        // 存在就显示
        return config.days.some(v => v === w.value)
      }
      // 没有配置时间(新增工作日)
      else {
        let days = []
        // 新增后的常规配置信息:key
        configs.forEach((config, i) => {
          // 已经配置了的日期
          if (i !== index) days = days.concat(config.days)
        })
        // 过滤已经配置了的日子
        return !days.some(v => v === w.value)
      }
    },

    // 配置监区按钮
    // index：序号 type：正在生效/将要生效 configs：当前配置信息
    onDeployPrisonArea(index, type, configs, init) {
      const selectItem = {
        type: 'select',
        placeholder: '请选择监区',
        multiple: true,
        options: this.filterPrisonAreaOptions,
        props: { label: 'name', value: 'id' },
        rules: ['required']
      },
      formConfigs = {
        labelWidth: '80px',
        hideRequiredAsterisk: true,
        inline: true
      },
      items = {
        Monday: {
          label: '星期一',
          ...selectItem
        },
        Tuesday: {
          label: '星期二',
          ...selectItem
        },
        Wednesday: {
          label: '星期三',
          ...selectItem
        },
        Thursday: {
          label: '星期四',
          ...selectItem
        },
        Friday: {
          label: '星期五',
          ...selectItem
        },
        Saturday: {
          label: '星期六',
          ...selectItem
        },
        Sunday: {
          label: '星期日',
          ...selectItem
        }
      }

      const current = configs[index]

      // 选择的日子
      const { days } = current

      if (init && !this.hasConfigBefore) return

      // 返回的是对应日子的数组
      const _temp = cloneDeep(this.week).filter(weekDay => days.includes(weekDay.value))

      let test = {}

      _temp.forEach(item => {
          for (let [key, value] of Object.entries(cloneDeep(items))) {
            if (item.key === key) {
              const cloneItem = cloneDeep(value)

              if (!init) cloneItem['value'] = this.beforeParams[key]

              else {
                cloneItem['value'] = this.allConfigs[type][index][key]
                cloneItem['disabled'] = true
              }

              test = {
                ...test,
                [key]: cloneItem
              }
            }
          }
        })
      this.$set(this.testElFormPrisonAreaItems[type], index, { formConfigs, ...test })

      this.$refs[`${type}el-form__prison-area${index}`] && this.$refs[`${type}el-form__prison-area${index}`][0].onClearValidate()
    },

    // 修改工作日
    async onChangeConfigDays(index, type, configs) {
      await this.$refs[`${type}el-form__prison-area${index}`][0].onCheck()

      console.log('修改工作日：', index, type, configs)
    },

    // 保存
    onSavePrisonArea(index, type, configs) {
      console.log('保存：', index, type, configs)
    },

    onPrisonAreaResponse(params) {
      this.beforeParams = Object.assign({}, params)
      // const { index, type } = params

      // if (index === undefined || type === undefined) return
      // this.week.forEach(day => {
      //   const { key } = day

      //   const value = params[key]

      //   this.$set(this.allConfigs[type][index], day, value)
      // })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  .m-container + .m-container {
    border-top: 1px solid #dcdfe6;
    padding-top: 10px;
  }
  .config-box{
    overflow: hidden;
    padding-top: 3px;
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

    button {
        margin-bottom: 13px;
    }

    /deep/ .error-status {
      .m-range-selector {
        border-color: #F56C6C;
        margin-bottom: 4px;
      }
      & ~ button {
        margin-bottom: 15px;
      }
    }

  }
}

.after-tip {
  font-size: 14px;
  font-weight: bold;
  border-bottom: 1px solid #dcdfe6;
  padding-bottom: 10px;
}

.error__tip {
  color: #F56C6C;
  font-size: 12px;
  line-height: 1;
}

.effective__date {
  padding-top: 10px;

  .el-date-editor {
    width: 30%;
  }
}

.none_superAdmin {
  line-height: 36px;
  label, span {
    display: inline-block;
  }
  label {
    width: 70px;
    text-align: right;
    margin-right: 10px;
    font-weight: normal;
    color: #606266;
  }
}

.el-form__prison-area {
  /deep/ .el-form {
    max-height: 17.3rem;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: stretch;
    .el-form-item {
      display: flex;
      width: 48%;
      height: 3.1rem;
      margin-bottom: 1.2rem;
      .el-form-item__content {
        width: 65%;
      }
    }
  }
}
</style>
