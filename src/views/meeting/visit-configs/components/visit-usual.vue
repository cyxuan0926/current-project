<template>
  <div v-if="inited" class="container">
    <div class="el-form-item cycle">
      <label class="el-form-item__label c-label">现场探视预约开关</label>

      <div class="form-meeting_cycle">
        <el-switch
          v-model="timeSwitch"
          active-color="#13ce66"
          inactive-color="#dddddd"
          :active-value="1"
          :inactive-value="0"
          :width="60"
          :disabled="!!timeSwitch && initComponentStatus && newStatusHasPrisonAreaConfigs"
        />
      </div>
    </div>

    <template v-for="(configs, type) in allConfigs">
      <div
        v-if="(type === 0 && hasOriginConfigBefore) || (type === 1 && (!hasOriginConfigBefore || hasOriginConfigAfter)) "
        :class="['m-container', { 'border_top': type === 1 && hasOriginConfigAfter && !hasOriginConfigBefore }]"
        :key="type"
      >
        <template v-if="type === 1 && hasOriginConfigAfter">
          <div class="after-tip">
            {{ visitNormalConfigs['updatedAt'] + ' 调整后的时间段配置，' + visitNormalConfigs['enabledAt'] + ' 日生效' }}
          </div>
        </template>

        <template v-for="(config, index) in configs">
          <div :key="index" class="config-box">
            <slot name="windowSize" :scope="config" :attrsConfigs="windowSizesDisabled[type][index]" />

            <div class="el-form-item days-prison-area_configs">
              <label class="el-form-item__label c-label">工作日和监区配置</label>

              <div class="form-days-prison-area_configs">
                <template v-if="!!daysPrisonAreaConfigsTableData[type][index].length">
                  <m-table-new :cols="daysPrisonAreaConfigsTableCols" :data="daysPrisonAreaConfigsTableData[type][index]">
                    <template #day="{ row }">{{ row.day | weeksOptions }}</template>

                    <template #prisonArea="{ row }">{{ filterPrisonArea(row.prisonArea) }}</template>
                  </m-table-new>
                </template>

                <div :class="['button-box', { 'no_margin-top': !daysPrisonAreaConfigsTableData[type][index].length }]">
                  <el-button
                    v-if="!daysPrisonAreaConfigsTableData[type][index].length"
                    :disabled="!timeSwitch"
                    type="primary"
                    size="mini"
                    @click="onHandleDaysPrisonAreaConfigs(type, index, config)"
                  >配置工作日和监区</el-button>

                  <el-button
                    v-if="daysPrisonAreaConfigsTableData[type][index].length && (!hasOriginConfigAfter || type === 1)"
                    type="primary"
                    :disabled="!timeSwitch"
                    size="mini"
                    @click="onHandleDaysPrisonAreaConfigs(type, index, config)"
                  >修改工作日和监区</el-button>
                    
                  <el-button
                    v-if="!config.timeperiodQueue.length && daysPrisonAreaConfigsTableData[type][index].length"
                    type="primary"
                    size="mini"
                    @click="onHandleConfig(index, type)"
                  >配置时间段参数</el-button>
                </div>
              </div>
            </div>

            <template v-if="config.timeperiodQueue.length">
              <m-form
                class="duration-interval-form"
                :ref="`${type}form${index}`"
                :items="durationIntervalItems[type][index]"
                :values="{
                  index: index,
                  duration: config.duration,
                  interval: config.interval,
                  type: type
                }"
                @response="onResponse"
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

                  <template v-if="o === config.timeperiodQueue.length -1 && !config.queue.length  && (!hasOriginConfigAfter || type === 1) && !!timeSwitch">
                    <el-button
                      v-if="config.timeperiodQueue[config.timeperiodQueue.length - 1][1] !== '23:59'"
                      type="primary"
                      size="mini"
                      style="margin-right: 10px;"
                      @click="onNewTimePeriod(config.timeperiodQueue[config.timeperiodQueue.length - 1], index, type)"
                    >新增时间段</el-button>

                    <el-button
                      type="primary"
                      size="mini"
                      @click="onFigureOut(config, index, type)"
                    >生成探视时间段</el-button>

                    <el-button
                      v-if="config.timeperiodQueue.length > 1"
                      size="mini"
                      type="danger"
                      @click="onDelTimePriod(config)"
                    >删除时间段</el-button>
                  </template>
                </div>
              </template>

              <div v-if="config.queue.length" class="el-row_queue">
                <label class="c-label">时间段分配</label>

                <div class="el-row_queue-configs">
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
                    v-if="(!hasOriginConfigAfter || type === 1) && !!timeSwitch"
                    size="mini"
                    class="button-float"
                    :style="index === configs.length - 1 ? 'margin-right: 10px;' : ''"
                    @click="onRestQueue(config)"
                  >重置时间段</el-button>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </template>

    <template v-if="hasOriginConfigAfter || hasConfigBeforeChange || newStatusHasConfigAfterChange">
      <div class="effective__date">
        <label class="c-label" style="line-height: 35px; width: 95px;">生效日期</label>

        <el-date-picker
          v-model="computedEffectiveDate"
          :picker-options="pickerOptions"
          type="date"
          :disabled="!timeSwitch"
          :clearable="false"
          :value-format="'yyyy-MM-dd'"
          placeholder="选择生效日期"
        />
      </div>
    </template>

    <div class="button-box">
      <el-button
        v-if="!updateShow"
        size="small"
        type="primary"
        @click="onUpdate"
      >更新</el-button>
    </div>

    <slot name="visitNotice" />

    <el-dialog
      :visible.sync="daysPrisonAreaDialogVisible"
      class="authorize-dialog"
      title="配置工作日和监区"
      :close-on-click-modal="false"
      @open="onDaysPrisonAreaDialogOpen"
      @close="onDaysPrisonAreaDialogClose"
    >
      <m-form
        :items="daysPrisonAreaDialogFormItems"
        ref="daysPrisonAreaDialogForm"
        @submit="onPreHandleDaysPrisonAreaData"
        @cancel="onDaysPrisonAreaDialogClose"
      >
        <template v-for="day in daysForm" #[day.key]>
          <el-row :key="day['key']">
            <el-col :offset="3" :span="3">
              <el-form-item :prop="'check' + day['key']">
                <el-checkbox-group v-model="checkForm">
                  <el-checkbox :label="day['key']" @change="onCheckboxChange($event, day['key'])">{{ day['label'] }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>

            <el-col :span="15">
              <el-form-item
                :ref="day['key']"
                :prop="day['key']"
                :rules="daysPrisonAreaDialogFormRules[day['key']]"
              > 
                <el-select
                  v-model="form[day['key']]"
                  multiple
                  collapse-tags
                  placeholder="请选择探视监区"
                  :disabled="onPrisonAreaDisabled(day['key'])"
                >
                  <template v-for="prisonAreas in filterPrisonAreaOptions">
                    <el-option
                      :key="prisonAreas.id"
                      :label="prisonAreas.name"
                      :value="prisonAreas.id"
                    />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </m-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import remoteWeekCy from '../../components/remote-week-cy'

import normalMixins from '../../mixins'

import { weeks } from '@/common/constants/const'

import Moment from 'moment'

import { Message } from 'element-ui'
export default {
  components: {
    remoteWeekCy
  },

  mixins: [normalMixins],

  inject: ['onParentSubimt'],

  data() {
    const validateDay = (rule, value, callback) => {
      const {
        key,
        checkForm = [],
        form = {}
      } = rule

      const noChecked = !checkForm.length

      if (noChecked) callback(new Error('请选择工作日和监区'))

      else if (checkForm.includes(key)) {
        if (!form[key] || (Array.isArray(form[key]) && !form[key].length)) callback(new Error('请选择监区'))

        else callback()
      }

      else callback()
    }
    return {
      inited: false,

      queue: ['09:00', '10:00'],

      daysPrisonAreaDialogVisible: false,

      form: {},

      checkForm: [],

      daysForm: weeks,

      daysPrisonAreaDialogFormItems: {
        Monday: {
          slotName: 'Monday'
        },
        Tuesday: {
          slotName: 'Tuesday'
        },
        Wednesday: {
          slotName: 'Wednesday'
        },
        Thursday: {
          slotName: 'Thursday'
        },
        Friday: {
          slotName: 'Friday'
        },
        Saturday: {
          slotName: 'Saturday'
        },
        Sunday: {
          slotName: 'Sunday'
        },
        buttons: [{
          add: true,
          text: '确定',
        }, 'cancel']
      },

      validateDay,

      daysPrisonAreaConfigsTableCols: [
        {
          label: '工作日',
          width: '200px',
          slotName: 'day'
        },
        {
          label: '监区',
          slotName: 'prisonArea',
          showOverflowTooltip: true
        }
      ],

      allConfigs: [],

      allConfigsType: 0,

      configIndex: 0,

      updateShow: false,

      dateValue: '',

      timeSwitch: 0,

      newStatusHasPrisonAreaConfigs: false
    }
  },

  computed: {
    ...mapState(['visitNormalConfigs', 'visitTimeSwitch']),

    daysPrisonAreaDialogFormRules() {
      const temp = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ]

      const params = {
        checkForm: this.checkForm,
        form: this.form
      }

      return temp.reduce((rules, day) => {
        rules[day] = [{
          validator: this.validateDay,
          trigger: 'change',
          ...params,
          key: day
        }]

        return rules
      }, {})
    },

    durationIntervalItems() {
      const item = {
        formConfigs: { ...(_.cloneDeep(this.durationIntervalormConfigs)), labelWidth: '106px' },

        duration: {
          label: '通话时长',
          type: 'input',
          rules: [
            'required',
            'isNumber',
            'numberRange1-60'
          ]
        },

        interval: _.cloneDeep(this.interval)
      }

      return this.allConfigs.map(configs => {
        return configs.map((config, index, target) => {
          const cloneItem = _.cloneDeep(item)

          this.$set(cloneItem['duration'], 'disabled', !(!config.queue.length && target.length === 1))

          this.$set(cloneItem['interval'], 'disabled', !!config.queue.length)

          return cloneItem
        })
      })
    },

    computedEffectiveDate: {
      get() {
        const { enabledAt } = this.visitNormalConfigs

        this.dateValue = this.dateValue  || (this.hasOriginConfigAfter ? enabledAt : Moment(Date.now()).add(1, 'days').format('YYYY-MM-DD'))

        return this.dateValue
      },

      set(date) {
        this.dateValue = date
      }
    },

    pickerOptions() {
      return {
        disabledDate: time => {
          if (!this.hasOriginConfigAfter) {
            return time.getTime() < Date.now()
          }
          else {
            // 生效日期
            const { enabledAt } = this.visitNormalConfigs

            return time.getTime() < Date.now() || time.getTime() > new Date(enabledAt)
          }
        }
      }
    },

    // 初始化的时候是否有即将生效的配置
    hasOriginConfigAfter() {
      return !!(this.visitNormalConfigs['configAfter']
        && this.visitNormalConfigs['configAfter'].length
        && this.visitNormalConfigs['configAfter'][0].timeperiodQueue.length
        && this.visitNormalConfigs['configAfter'][0].queue.length)
    },

    daysPrisonAreaConfigsTableData() {
      return this.allConfigs.map(configs => {
        return configs.map(config => {
          if (config.timeperiodQueue.length || !this.hasOriginConfigBefore) {
            const { checkForm = [] } = config

            return checkForm.reduce((accumulator, currentDay) => {
              let _temp = {}

              _temp = {
                day: currentDay,
                prisonArea: config[currentDay]
              }

              accumulator.push(_temp)

              return accumulator
            }, [])
          }

          else return []
        })
      })
    },

    // 初始化的时候是否有正在生效的配置
    hasOriginConfigBefore() {
      return !!(this.visitNormalConfigs['configBefore']
        && this.visitNormalConfigs['configBefore'].length
        && this.visitNormalConfigs['configBefore'][0].timeperiodQueue.length
        && this.visitNormalConfigs['configBefore'][0].queue.length)
    },

    hasConfigAfter() {
      return !!(this.allConfigs[1]
        && this.allConfigs[1].length
        && this.allConfigs[1][0].timeperiodQueue.length
        && this.allConfigs[1][0].queue.length)
    },

    // 当前仅有before config的时候 并且发生改变的时候
    hasConfigBeforeChange() {
      return this.hasOriginConfigBefore && !_.isEqual(this.allConfigs[0], this.visitNormalConfigs['configBefore'])
    },

    // 周期配置开关
    timeSwitchHasChanged() {
      return this.timeSwitch !== this.visitTimeSwitch
    },

    // 不能修改情况
    // isCantUpdate() {
    //   return !this.visitTimeSwitch && (this.hasOriginConfigBefore || (!this.hasOriginConfigBefore && this.hasOriginConfigAfter))
    // },

    windowSizesDisabled() {
      return this.allConfigs.map((configs, type) => {
        return configs.map((config, index, target) => {
          const disabled = (this.hasOriginConfigAfter && type !== 1) || !this.timeSwitch

          return { disabled }
        })
      })
    },

    newStatusHasConfigAfterChange() {
      return !this.hasOriginConfigBefore && !this.hasOriginConfigAfter && !_.isEqual(this.allConfigs[1], this.visitNormalConfigs['configAfter'])
    },

    initComponentStatus() {
      return !(this.hasOriginConfigBefore || this.hasOriginConfigAfter)
    }
  },

  watch: {
    allConfigs: {
      handler: function(value) {
        if (this.hasConfigAfter) this.updateShow = value[1].some(item => !item.queue.length)

        else this.updateShow = value[0].some(item => !item.queue.length)
      },
      deep: true
    }
  },

  methods: {
    ...mapActions([
      'getVisitNormalConfigs',
      'updateVisitNormalConfigs',
      'updateTimeSwitch',
      'getVisitTimeSwitch'
    ]),

    async initTimeSwitch() {
      await this.getVisitTimeSwitch(this.jailId)

      this.timeSwitch = this.visitTimeSwitch
    },

    async initConfigs() {
      await this.getVisitNormalConfigs(this.jailId)

      const {
        prisonBranch,
        configBefore,
        configAfter
      } = this.visitNormalConfigs

      if (+prisonBranch) {
        await this.getJailPrisonAreas({ url: '/prison_config/getPrisonConfigs', params: { jailId: this.jailId } })

        this.prisonBranch = prisonBranch

        this.$message.closeAll()
      }

      const configsBefore = _.cloneDeep(configBefore)

      const configsAfter = _.cloneDeep(configAfter)

      this.allConfigs = [configsBefore, configsAfter]
    },

    async onUpdate() {
      const [configsBefore, configsAfter] = this.allConfigs

      let windowSizes = configsBefore.map(item => item.window_size)

      if (this.hasOriginConfigAfter) {
        windowSizes = [
          ...windowSizes,
          ...(configsAfter.map(item => item.window_size))
        ]
      }

      const result = await this.onParentSubimt(windowSizes)

      if (result) {
        let hasNoChanged = false

        const {
          configBefore,
          configAfter,
          enabledAt
        } = this.visitNormalConfigs

        const [before, after] = this.allConfigs

        if (this.hasOriginConfigBefore && !this.hasOriginConfigAfter) hasNoChanged = !this.hasConfigBeforeChange

        else hasNoChanged = _.isEqual(this.daysAndPrisonAreaFilterParams(after, ['window_size']), this.daysAndPrisonAreaFilterParams(configAfter, ['window_size'])) && enabledAt === this.computedEffectiveDate

        let updateMaps = [], initMaps = []

        if (this.timeSwitchHasChanged) {
          if (!this.timeSwitch) {
            this.onMessage({
              message: '现场探视开关关闭后，家属的现场探视申请通道就会关闭！',
              type: 'warning',
              duration: 700
            })
          }
        } else {
          if (hasNoChanged) this.onMessage()
        }

        if (this.timeSwitchHasChanged) {
          const params = {
            jailId: this.jailId,
            timeSwitch: this.timeSwitch
          }

          updateMaps = [
            ...updateMaps,
            {
              method: this.updateTimeSwitch,
              params
            }
          ]

          initMaps = [
            ...initMaps,
            {
              method: this.initTimeSwitch
            }
          ]
        }

        if (!hasNoChanged) {
          let filterParams

          if (this.hasOriginConfigBefore && !this.hasOriginConfigAfter) filterParams = this.daysAndPrisonAreaFilterParams(before, ['window_size'])

          else filterParams = this.daysAndPrisonAreaFilterParams(after, ['window_size'])

          const params = this.filterSubmittingParams(
            this.visitNormalConfigs,
            filterParams,
            this.computedEffectiveDate,
            'configurationsNoramlDetail',
            'complexNormalNormal'
          )

          updateMaps = [
            {
              method: this.updateVisitNormalConfigs,
              params
            },
            ...updateMaps
          ]

          initMaps = [
            {
              method: this.initConfigs
            },
            ...initMaps
          ]
        }

        if (initMaps.length || updateMaps.length) {
          setTimeout(async () => {
            await Promise.all(updateMaps.map(item => item['method'](item['params'])))

            Message.closeAll()

            await Promise.all(initMaps.map(item => item['method'](item['params'])))

            Message.closeAll()
          }, 500)
        }
      }
    },

    onCheckboxChange(value, key) {
      if (!value) this.$set(this.form, key, [])

      this.$refs[key] && this.$refs[key][0].clearValidate()
    },

    onDaysPrisonAreaDialogOpen() {
      this.$nextTick(() => {
        this.$refs.daysPrisonAreaDialogForm.onClearValidate()
      })
    },

    // 新增/修改日期监区配置
    onHandleDaysPrisonAreaConfigs(type, index, config) {
      const { checkForm = [] } = config

      this.allConfigsType = type

      this.configIndex = index

      this.checkForm = [ ...checkForm ]

      checkForm.forEach(key => {
        this.form = {
          ...this.form,
          [key]: config[key]
        }
      })

      this.daysPrisonAreaDialogVisible = true
    },

    // 配置时间段参数
    onHandleConfig(index, type) {
      const duration = 25

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

    onResponse(params) {
      const {
        index,
        duration,
        interval,
        type
      } = params

      this.$set(this.allConfigs[type][index], 'duration', duration)

      this.$set(this.allConfigs[type][index], 'interval', interval)
    },

    onNewTimePeriod(timeperiodQueue, index, type) {
      this.allConfigs[type][index].timeperiodQueue.push(this.getNextRange(timeperiodQueue, 180))

      this.allConfigs[type][index].showError.push(false)
    },

    // 生成探视时间段
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

    // 更新监区日期数据
    onPreHandleDaysPrisonAreaData() {
      this.$set(this.allConfigs[this.allConfigsType][this.configIndex], 'checkForm', this.checkForm)

      const days = this.daysForm.reduce((accumulator, day) => {
        if (this.checkForm.includes(day['key'])) accumulator.push(day['value'])

        return accumulator
      }, [])

      this.$set(this.allConfigs[this.allConfigsType][this.configIndex], 'days', days)

      Object.entries(this.form).forEach(([key, value]) => {
        if (value.length) this.$set(this.allConfigs[this.allConfigsType][this.configIndex], key, value)

        else this.allConfigs[this.allConfigsType][this.configIndex][key] && delete this.allConfigs[this.allConfigsType][this.configIndex][key]
      })

      this.newStatusHasPrisonAreaConfigs = true

      this.onDaysPrisonAreaDialogClose()
    },

    // label化监区
    filterPrisonArea(prisonArea) {
      if (prisonArea.includes(-1)) return '全监狱'

      return (this.filterPrisonAreaOptions.reduce((accumulator, item) => {
        let label

        if (prisonArea.includes(item.id)) {
          label = item['name']

          accumulator.push(label)
        }

        return accumulator
      }, [])).join('、')
    },

    onDaysPrisonAreaDialogClose() {
      this.daysPrisonAreaDialogVisible = false

      this.form = {}

      this.$refs.daysPrisonAreaDialogForm.onClearValidate()
    },

    onPrisonAreaDisabled(key) {
      return !this.checkForm.includes(key)
    },

    onMessage(params = {}) {
      const configs = {
        showClose: true,
        message: '配置没有变化，无需编辑！',
        duration: 3000,
        type: 'error',
        ...params
      }

      this.$message(configs)
    }
  },

  async activated() {
    this.inited = false

    await Promise.all([this.initConfigs(), this.initTimeSwitch()])

    this.inited = true
  }
}
</script>

<style lang="scss" scoped>
.container {
  .border_top {
    border-top: 1px solid #dcdfe6;
    padding-top: 10px;
    margin-top: 5px;
  }

  .m-container + .m-container {
    border-top: 1px solid #dcdfe6;
    padding-top: 10px;
  }

  .duration-interval-form {
    padding-top: 5px;
    /deep/ .el-form-item {
      margin-bottom: 13px;

      .el-form-item__content {
        width: 30% !important;
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
      line-height: 36px !important;
      width: 95px !important;
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

  .after-tip {
    font-size: 14px;
    font-weight: bold;
    border-bottom: 1px solid #dcdfe6;
    padding-bottom: 10px;
  }

  .effective__date {
    padding: 10px 0px;

    .el-date-editor {
      width: 30%;
    }
  }

  .error__tip {
    color: #F56C6C;
    font-size: 12px;
    line-height: 1;
  }

  .cycle {
    padding-top: 10px;
    margin-bottom: 0px;
    display: flex;
    label {
      width: 97px !important;
      padding-right: 0px;
    }

    .form-meeting_cycle {
      width: calc(100% - 150px);
      /deep/ .el-switch {
        height: 28px;
      }
    }
  }

  .config-box {
    overflow: hidden;
    padding-top: 3px;
  }

  label.c-label {
    width: 70px;
    text-align: right;
    font-weight: normal;
    float: left;
    color: #606266;
    line-height: 28px;
    margin-right: 10px;
  }

  .button-float {
    float: left;
    margin-bottom: 10px;
    margin-left: 0;
  }

  .days-prison-area_configs {
    display: flex;
    margin-bottom: 10px;
    label {
      width: 97px !important;
      padding-right: 0px;
      float: none;
    }

    .form-days-prison-area_configs {
      width: calc(100% - 150px);
      .button-box {
        margin-top: 10px;
        justify-content: flex-start;
        button {
          padding: 11px;
        }
      }
    }
  }

  .button-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    clear: both;
  }

  .authorize-dialog {
    /deep/ .button-box{
      padding: 0px;
      button {
        width: 15% !important;
        padding: 10px 12px !important;
      }
    }
  }

  .el-row_queue {
    display: flex;
    overflow: hidden;
    margin-bottom: 10px;
    
    label {
      float: none;
      width: 94px !important;
    }

    &-configs {
      overflow: hidden;
      width: calc(100% - 94px);
    }
  }
}

.display_none {
  display: none;
}

.no_margin-top {
  margin-top: 0px !important;
}
</style>
