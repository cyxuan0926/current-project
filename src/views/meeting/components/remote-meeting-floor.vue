<template>
  <div class="container">
    <!-- 正在生效的就放在正在生效的数组/即将生效的就放在即将生效的数组里面/但更新的时候都是传给即将生效的数组 -->
    <template v-for="(configs, type) in allConfigs">
      <!-- 渲染出正在生效部分: 必须有正在生效的 -->
      <!-- 渲染出即将生效的部分: 没有正在生效的或者有即将生效的 -->
      <div
        v-if="(type === 0 && hasOriginConfigBefore) || (type === 1 && (!hasOriginConfigBefore || hasOriginConfigAfter))"
        :class="['m-container', { 'new': type === 1 }]"
        :key="type"
      >
        <!-- 只在有即将生效的情况下并且只显示在即将生效的部分 -->
        <div v-if="type === 1 && hasOriginConfigAfter" class="after-tip">
          {{ meetingRoomConfigs['updatedAt'] + ' 调整后的时间段配置，' + meetingRoomConfigs['enabledAt'] + ' 日生效' }}
        </div>

        <template v-for="(config, index) in configs">
          <div :key="index" class="config-box">
            <div class="day-box">
              <label class="c-label">选择工作日</label>

              <el-checkbox-group v-model="config.days" :min="1">
                <template v-for="(w, i) in week">
                  <el-checkbox
                    :key="i"
                    :label="w.value"
                    :disabled="hasChangeDaysDisabled[type][index]">{{ w.label }}</el-checkbox>
                </template>
              </el-checkbox-group>

              <template v-if="!hasOriginConfigAfter || type === 1">
                <el-button
                  v-if="hasOriginConfigBefore || hasPrisonWeekItemsAfter"
                  type="primary"
                  size="mini"
                  @click="onChangeConfigDays(index, type, configs)"
                >修改工作日</el-button>

                <el-button
                  v-if="hasChangeDaysPrisonAreConfigShow[type][index]"
                  type="primary"
                  size="mini"
                  @click="onDeployPrisonArea(index, type, configs, false)"
                >配置监区</el-button>

                <el-button
                  v-if="editPrisonAreConfigShow[type][index]"
                  type="primary"
                  size="mini"
                  @click="onEditPrisonArea(index, type, configs)"
                >修改监区</el-button>

                <el-button
                  v-if="hasChangePrisonAreConfigSaveShow[type][index]"
                  type="primary"
                  size="mini"
                  @click="onSavePrisonArea(index, type, configs)"
                >保存</el-button>
              </template>

              <el-button
                v-if="!config.timeperiodQueue.length"
                type="primary"
                size="mini"
                @click="handleConfig(index, type, configs)">配置时间段参数</el-button>
            </div>

            <!-- 配置监区区域 -->
            <template v-if="hasPrisonWeekItemsAfter">
              <m-form
                class="el-form__prison-area"
                :items="prisonAreaDaysFormItems[type][index]"
                :ref="`${type}el-form__prison-area${index}`"
                :initFields="{ index: index, type: type }"
                @response="onPrisonAreaResponse"
              />
            </template>
            
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

                  <template v-if="o === config.timeperiodQueue.length -1 && !config.queue.length  && (!hasOriginConfigAfter || type === 1)">
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
                    v-if="!hasOriginConfigAfter || type === 1"
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

    <div v-if="hasOriginConfigAfter || hasConfigBeforeChange || newStatusHasConfigAfterChange" class="effective__date">
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
        :disabled="updateShow || permission !== 'edit' || !allTypedPreSaveSucceeded"
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

      <!-- 这里需要修改文案 -->
      <div>
        修改配置后，如有家属已预约，将重新分配相关可视电话时间段，调整后会以短信形式通知相关家属。
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

import { daysTransformWeeksParams, dayTransformProp } from '../utils'

// 现在交互流程这样 修改工作日后 必须先配置监区 才会有保存按钮
// 修改工作日:工作日 不禁用 保存按钮显示/新增的时候隐藏并且没有配置监区的时候隐藏
// 修改监区:监区配置 不禁用 保存按钮显示/ 新增的时候并且没有保存的情况下隐藏/
// 配置监区:禁用工作日、清除验证、监区配置不禁用、新增监区配置 保存按钮显示/预先保存成功后 就隐藏/ 新增的时候默认显示或者日期变化后显示
// 保存：验证监区配置 预先保存 日期-监区配置/ 配置监区后才显示/ 预先保存成功后 就隐藏
// 更新按钮： 在原有的基础上 增加 不预先保存监区-日期配置 就不能操作
export default {
  mixins: [normalMixins],

  data() {
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

      filterDuration: [25, 25],

      allConfigs: [],

      effectiveDate: '',

      dateValue: '',
      // 是否显示更新按钮
      // 时间配置最小元是时间段 必须保证每个配置都配置了时间段
      updateShow: false,

      // 日期监区表单
      prisonAreaDaysFormItems: [[], []],

      // 工作日是否禁用
      hasChangeDaysDisabled: [[false], [false]],

      // 是否显示配置监区
      hasChangeDaysPrisonAreConfigShow: [[false], [false]],

      // 监区日期配置是否变化
      hasChangePrisonAreConfigSaveShow: [[false], [false]],

      // 是否显示修改监区按钮
      editPrisonAreConfigShow: [[false], [false]],

      // 预先保存成功
      preSaveSuccess: [[false], [false]]
    }
  },

  watch: {
    // 这里好像也有问题
    allConfigs: {
      handler: function (value) {
        if (this.hasConfigAfter) this.updateShow = value[1].some(item => !item.queue.length)

        else this.updateShow = value[0].some(item => !item.queue.length)
      },
      deep: true
    }
  },

  computed: {
    // 常规配置
    // 会见楼配置
    ...mapState(['meetingRoomConfigs', 'jailPrisonAreas']),

    hasConfigAfter() {
      return !!(this.allConfigs[1]
        && this.allConfigs[1].length
        && this.allConfigs[1][0].timeperiodQueue.length
        && this.allConfigs[1][0].queue.length)
    },

    // 初始化的时候是否有即将生效的配置
    hasOriginConfigAfter() {
      return !!(this.meetingRoomConfigs['configAfter']
        && this.meetingRoomConfigs['configAfter'].length
        && this.meetingRoomConfigs['configAfter'][0].timeperiodQueue.length
        && this.meetingRoomConfigs['configAfter'][0].queue.length)
    },

    // 初始化的时候是否有正在生效的配置
    hasOriginConfigBefore() {
      return !!(this.meetingRoomConfigs['configBefore']
        && this.meetingRoomConfigs['configBefore'].length
        && this.meetingRoomConfigs['configBefore'][0].timeperiodQueue.length
        && this.meetingRoomConfigs['configBefore'][0].queue.length)
    },

    // 新增/只有即将生效情况下
    hasPrisonWeekItemsAfter() {
      return !!(this.prisonAreaDaysFormItems[1] && this.prisonAreaDaysFormItems[1].length)
    },

    // 当前仅有before config的时候 并且发生改变的时候
    hasConfigBeforeChange() {
      return !isEqual(this.allConfigs[0], this.meetingRoomConfigs['configBefore'])
    },

    newStatusHasConfigAfterChange() {
      return !this.hasOriginConfigBefore && !this.hasOriginConfigAfter && !isEqual(this.allConfigs[1], this.meetingRoomConfigs['configAfter'])
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
            // 生效日期
            const { enabledAt } = this.meetingRoomConfigs

            return time.getTime() < Date.now() || time.getTime() > new Date(enabledAt)
          }
        }
      }
    },

    // 生效日期的默认值
    computedEffectiveDate: {
      get() {
        const { dayInLimit } = this.meetingRoomConfigs

        this.dateValue = this.dateValue  || (this.hasOriginConfigAfter ? this.effectiveDate : Moment(Date.now()).add(dayInLimit, 'days').format('YYYY-MM-DD'))

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
          id: -1,
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

    // 当前监区日期配置是否全部完成
    allTypedPreSaveSucceeded() {
      if (this.hasPrisonWeekItemsAfter) return this.preSaveSuccess[1].every(item => item)

      else return this.preSaveSuccess[0].every(item => item)
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

      Message.closeAll()

      const {
        configBefore,
        configAfter,
        enabledAt,
        prisonBranch
      } = this.meetingRoomConfigs

      if (+prisonBranch) {
        await this.getJailPrisonAreas({ url: '/prison_config/getPrisonConfigs', params: { jailId: this.jailId } })

        Message.closeAll()
      }

      const configsBefore = cloneDeep(configBefore)

      const configsAfter = cloneDeep(configAfter)

      this.effectiveDate = enabledAt

      this.allConfigs = [configsBefore, configsAfter]

      this.allConfigs.forEach((configs, type) => {
        if (!this.hasOriginConfigAfter && !this.hasOriginConfigBefore) this.$set(this.prisonAreaDaysFormItems, type, [])

        configs.forEach((_, index) => {
          // 新增
          if (!this.hasOriginConfigBefore && !this.hasOriginConfigAfter) {
            this.$set(this.hasChangeDaysPrisonAreConfigShow[type], index, true)

            this.$set(this.editPrisonAreConfigShow[type], index, false)

            this.$set(this.hasChangeDaysDisabled[type], index, false)
          }

          else {
            this.$set(this.hasChangeDaysDisabled[type], index, true)

            this.$set(this.editPrisonAreConfigShow[type], index, true)

            this.$set(this.preSaveSuccess[type], index, true)
          }

          this.onDeployPrisonArea(index, type, configs, true)
        })
      })
    },

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

        const weeksPrisonAreas = daysTransformWeeksParams(days, config)

        result.push({ days, config: c, duration, interval, timeperiod: period, floorDetai: weeksPrisonAreas })
      })

      return result
    },

    // 更新按钮的方法
    // 只有before
    onUpdate() {
      let hasNoChanged = false

      const [before, after] = this.allConfigs

      const { configBefore, configAfter, enabledAt } = this.meetingRoomConfigs

      // 只有正在生效的
      if (this.hasOriginConfigBefore && !this.hasOriginConfigAfter) hasNoChanged = !this.hasConfigBeforeChange

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
    // 不分监区的情况 监区id 传空
    async onSubmit() {
      let filterParams

      const [before, after] = this.allConfigs

      if (this.hasOriginConfigBefore && !this.hasOriginConfigAfter) filterParams = this.filterParams(before)

      else filterParams = this.filterParams(after)

      const {
        id,
        jailId,
        prisonBranch
      } = this.meetingRoomConfigs

      const params = filterParams.reduce((accumulator, currentItem) => {
        const { floorDetai, ...configAfter } = currentItem

        const { days } = configAfter

        // 这里需要变得是

        let configurationsFloorDetailItem = days.map(day => {
          const { key } = dayTransformProp(day)

          let prisonConfigId = +prisonBranch ? floorDetai[key] : ''

          return {
            days: day,
            jailId,
            prisonConfigId,
            effectiveDate: this.computedEffectiveDate
          }
        })

        accumulator.configurationsFloorDetail = [...accumulator.configurationsFloorDetail, ...configurationsFloorDetailItem]

        accumulator.complexNormalConfig.configAfter.push(configAfter)

        return accumulator
      }, { configurationsFloorDetail: [], complexNormalConfig: { enabledAt: this.computedEffectiveDate, jailId, configAfter: [] }})

      this.loading = true

      const isSucess = await this.saveComplexConfigFloorDetail(params)

      this.loading = false

      isSucess && this.onClose()
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

      // 新增的情况
      if (init && !this.hasOriginConfigBefore && !this.hasOriginConfigAfter) return

      // 配置监区后 就禁用工作日
      this.$set(this.hasChangeDaysDisabled[type], index, true)

      if (!init) {
        this.preSaveSuccess[type][index] && this.$set(this.preSaveSuccess[type], index, false)

        this.$set(this.hasChangePrisonAreConfigSaveShow[type], index, true)
      }

      // 返回的是对应日子的数组
      const haveDaysConfigs = cloneDeep(this.week).filter(weekDay => days.includes(weekDay.value))

      let haveItems = {}

      const { prisonBranch } = this.meetingRoomConfigs

      haveDaysConfigs.forEach(item => {
        for (let [key, value] of Object.entries(cloneDeep(items))) {
          if (item.key === key) {
            const cloneItem = cloneDeep(value)

            cloneItem['value'] = this.allConfigs[type][index][key]
            // 点击配置监区
            if (!init && !+prisonBranch) cloneItem['value'] = [-1]

            // 初始化数据
            else if (init) cloneItem['disabled'] = true

            haveItems = {
              ...haveItems,
              [key]: cloneItem
            }
          }
        }
      })

      this.$set(this.prisonAreaDaysFormItems[type], index, { formConfigs, ...haveItems })

      this.$refs[`${type}el-form__prison-area${index}`] && this.$refs[`${type}el-form__prison-area${index}`][0].onClearValidate()
    },

    // 修改工作日
    async onChangeConfigDays(index, type, configs) {
      this.preSaveSuccess[type][index] && this.$set(this.preSaveSuccess[type], index, false)
      // 取消禁用工作日
      this.$set(this.hasChangeDaysDisabled[type], index, false)

      this.$set(this.hasChangeDaysPrisonAreConfigShow[type], index, true)
    },

    // 保存
    async onSavePrisonArea(index, type, configs) {
      const isChecked = this.$refs[`${type}el-form__prison-area${index}`]
        && await this.$refs[`${type}el-form__prison-area${index}`][0].onCheck()

      if (isChecked) {
        this.onHandlePrisonAreaDaysDisabled(type, index, true)

        this.hasChangeDaysPrisonAreConfigShow[type][index] && this.$set(this.hasChangeDaysPrisonAreConfigShow[type], index, false)

        this.$set(this.hasChangePrisonAreConfigSaveShow[type], index, false)

        if (!this.hasOriginConfigBefore && !this.hasOriginConfigAfter) this.$set(this.editPrisonAreConfigShow[type], index, true)

        this.$set(this.preSaveSuccess[type], index, true)

        Message({
          showClose: true,
          message: '预保存日期监区配置成功',
          duration: 2000,
          type: 'success'
        })
      }
    },

    // 日期监区配置表单响应数据
    onPrisonAreaResponse(params) {
      const { index, type, ...configs } = params

      const {
        Monday,
        Wednesday,
        Thursday,
        Friday,
        Tuesday,
        Saturday,
        Sunday,
        ...others
      } = this.allConfigs[type][index]

      this.$set(this.allConfigs[type], index, { ...others, ...configs })
    },

    // 修改监区
    onEditPrisonArea(index, type, configs) {
      this.preSaveSuccess[type][index] && this.$set(this.preSaveSuccess[type], index, false)

      this.onHandlePrisonAreaDaysDisabled(type, index, false)

      this.$set(this.hasChangePrisonAreConfigSaveShow[type], index, true)
    },

    // 控制日期监区配置禁用状态
    onHandlePrisonAreaDaysDisabled(type, index, disabled) {
      if (Object.keys(this.prisonAreaDaysFormItems[type][index]).length === 1) return

      for (let [key, value] of Object.entries(this.prisonAreaDaysFormItems[type][index])) {
        const disCheck = ['formConfigs']

        if (disCheck.includes(key)) continue

        const status = value['disabled']

        if (status === disabled) break

        this.$set(value, 'disabled', disabled)
      }
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
