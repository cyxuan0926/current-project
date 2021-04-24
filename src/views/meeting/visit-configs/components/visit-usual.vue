<template>
  <div class="container">
    <slot name="windowSize" :scope="windowSizeScope" />

    <div class="el-form-item cycle">
      <label class="el-form-item__label c-label">周期配置</label>

      <div class="form-meeting_cycle">
        <el-switch
          v-model="timeSwitch"
          active-color="#13ce66"
          inactive-color="#dddddd"
          :active-value="1"
          :inactive-value="0"
          :width="60"
          @change="onMeetingCycle($event)"
        />
      </div>
    </div>

    <template v-if="timeSwitch">
      <div
        v-for="(configs, type) in allConfigs"
        class="m-container"
        :key="type"
      >
        <div class="after-tip">
          {{ ' 调整后的时间段配置， 日生效' }}
        </div>

        <template v-for="(config, index) in configs">
          <div :key="index" class="config-box">
            <template>
              <div class="el-form-item days-prison-area_configs">
                <label class="el-form-item__label c-label">工作日和监区配置</label>

                <div class="form-days-prison-area_configs">
                  <template>
                    <m-table-new :cols="daysPrisonAreaConfigsTableCols" />
                  </template>

                  <div class="button-box">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="onHandleDaysPrisonAreaConfigs('new')"
                    >配置工作日和监区</el-button>

                    <el-button
                      type="primary"
                      size="mini"
                      @click="onHandleDaysPrisonAreaConfigs('edit')"
                    >修改工作日和监区</el-button>

                    <el-button
                      type="primary"
                      size="mini"
                      @click="onHandleConfig"
                    >配置时间段参数</el-button>
                  </div>
                </div>
              </div>

              <m-form
                class="duration-interval-form"
                :ref="`${type}form${index}`"
                :items="durationIntervalItems[type][index]"
                :values="{ index: index, duration: config.duration, interval: config.interval, type: type }"
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

                  <template>
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

    <template>
      <div class="effective__date">
        <label class="c-label" style="line-height: 35px; width: 97px;">生效日期</label>

        <el-date-picker
          v-model="computedEffectiveDate"
          :picker-options="pickerOptions"
          type="date"
          :clearable="false"
          :value-format="'yyyy-MM-dd'"
          placeholder="选择生效日期"
        />
      </div>
    </template>

    <slot name="visitNotice" :scope="visitNoticeScope" />

    <div class="button-box">
      <el-button
        v-if="isSuperAdmin"
        size="small"
        @click="onGoBack"
      >返回</el-button>

      <el-button
        size="small"
        type="primary"
        @click="onUpdate"
      >更新</el-button>
    </div>

    <el-dialog
      :visible.sync="daysPrisonAreaDialogVisible"
      class="authorize-dialog"
      title="配置工作日和监区"
      @open="onDaysPrisonAreaDialogOpen"
    >
      <m-form
        :items="daysPrisonAreaDialogFormItems"
        ref="daysPrisonAreaDialogForm"
        @cancel="daysPrisonAreaDialogVisible = false"
      >
        <template v-for="day in daysForm" #[day.key]>
          <el-row :key="day['key']">
            <el-col :offset="3" :span="3">
              <el-form-item :prop="'check' + day['key']">
                <el-checkbox v-model="checkForm[day['key']]" @change="onCheckboxChange($event, day['key'])">{{ day['label'] }}</el-checkbox>
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
                  :disabled="!checkForm[day['key']]"
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

import cloneDeep from 'lodash/cloneDeep'

import normalMixins from '../../mixins'
export default {
  components: {
    remoteWeekCy
  },

  mixins: [normalMixins],

  data() {
    const validateDay = (rule, value, callback) => {
      const {
        key,
        checkForm = {},
        form = {}
      } = rule

      const noChecked = Object.values(checkForm).every(value => !value)

      if (noChecked) callback(new Error('请选择工作日和监区'))

      else if (checkForm[key]) {
        if (!form[key] || (Array.isArray(form[key]) && !form[key].length)) callback(new Error('请选择监区'))

        else callback()
      }

      else callback()
    }
    return {

      daysPrisonAreaDialogVisible: false,

      form: {},

      checkForm: {},

      daysForm: [
        {
          label: '星期一',
          key: 'Monday'
        },
        {
          label: '星期二',
          key: 'Tuesday'
        },
        {
          label: '星期三',
          key: 'Wednesday'
        },
        {
          label: '星期四',
          key: 'Thursday'
        },
        {
          label: '星期五',
          key: 'Friday'
        },
        {
          label: '星期六',
          key: 'Saturday'
        },
        {
          label: '星期日',
          key: 'Sunday'
        }
      ],

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
          width: '200px'
        },
        {
          label: '监区',
          showOverflowTooltip: true
        }
      ],

      allConfigs: [],

      timeSwitch: 0,

      visitNoticeScope: {
        notice: ''
      },

      windowSizeScope: {
        windowSize: '1'
      }
    }
  },

  computed: {
    ...mapState(['jailPrisonAreas']),

    filterPrisonAreaOptions() {
      const noPrisonArea = [
        {
          id: -1,
          name: '全监狱'
        }
      ]

      return this.jailPrisonAreas
    },

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
        formConfigs: {
          labelWidth: '81px',
          hideRequiredAsterisk: true,
        },

        duration: {
          label: '通话时长',
          type: 'input',
          rules: [
            'required',
            'isNumber',
            '1-numberRange-60'
          ]
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

    computedEffectiveDate() {
      return ''
    },

    pickerOptions() {
      return {}
    }
  },

  methods: {
    ...mapActions(['getJailPrisonAreas']),

    async onUpdate() {
      const result = await this.$parent.$parent.$parent.onParentSubimt(this.windowSizeScope['windowSize'])

      console.log(result, this.visitNoticeScope, this.windowSizeScope)
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

    onMeetingCycle(value) {},

    // 新增/修改日期监区配置
    async onHandleDaysPrisonAreaConfigs(type) {
      console.log(type)
      await this.getJailPrisonAreas({ url: '/prison_config/getPrisonConfigs', params: { jailId: this.jailId } })
    },

    // 配置时间段参数
    onHandleConfig() {},

    onResponse(params) {
      console.log(params)
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
    }
  },

  async activated() {
    // this.$nextTick(() => {
    //   this.$emit('input', '3')
    //   // 这个是赋值提示内容
    //   this.$parent.$parent.$parent.onInitMessageValue('撒大大大')
    // })
  }
}
</script>

<style lang="scss" scoped>
.container {
  .m-container + .m-container {
    border-top: 1px solid #dcdfe6;
    padding-top: 10px;
  }

  .after-tip {
    font-size: 14px;
    font-weight: bold;
    border-bottom: 1px solid #dcdfe6;
    padding-bottom: 10px;
  }

  .effective__date {
    padding-top: 10px;

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
    margin-bottom: 0px;
    label {
      width: 95px !important;
      padding-right: 0px;
    }

    .form-meeting_cycle {
      width: calc(100% - 150px);
      /deep/ .el-switch {
        height: 28px;
      }
    }
  }

  .days-prison-area_configs {
    display: flex;
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
}
</style>
