<template>
  <div class="m-container">
    <template v-for="(config, index) in configs">
      <div class="config-box" :key="index">
        <div class="day-box">
          <label class="c-label">选择日期</label>

          <el-date-picker
            v-model="config.day"
            size="mini"
            type="date"
            :disabled="!!config.id"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            @change="onChangeEnabledMeeting(config, index)"
          />

          <el-radio-group v-model="config.enabledMeeting" @change="onChangeEnabledMeeting(config)">
            <el-radio :label="1">支持预约申请</el-radio>
            <el-radio :label="0">不支持预约申请</el-radio>
          </el-radio-group>

          <el-button
            v-if="(config.enabledMeeting === 0 || (config.queue.length && config.prisonConfigIds.length && !errorMsg(config.window_size)))"
            plain
            type="danger"
            size="mini"
            @click="onDeleteConfig(config, index)"
          >删除当前日期配置</el-button>

          <!--可保存状态并且是国科服务管理员并且是编辑状态-->
          <el-button
            v-if="canSave(config)"
            type="primary"
            size="mini"
            @click="onSave(config, index)"
          >保存</el-button>

          <!--编辑状态并且不支持通话并且选择了日期并且国科服务管理员角色并且是最新一个配置的-->
          <el-button
            v-if="configs.length < 10 && (index === configs.length - 1 && config.enabledMeeting === 0 && config.day)"
            size="mini"
            type="success"
            class="button-float"
            @click="onAddDay"
          >新增特殊日期</el-button>
        </div>

        <template v-if="config.timeperiodQueue.length && config.enabledMeeting">
          <slot name="windowSize" :scope="config" />

          <m-form
            :ref="`form${index}`"
            class="duration-interval-form"
            :items="durationIntervalItems[index]"
            :values="{
              index: index,
              interval: config.interval,
              duration: config.duration,
              prisonConfigIds: config.prisonConfigIds
            }"
            @response="onResponse"
          />

          <template v-for="(queue, o) in config.timeperiodQueue">
            <div class="timeperiod" :key="o">
              <label class="c-label">{{ '时间段' + convertToChinaNum(0 + 1) }}</label>

              <div :class="['range-selecor__container', { 'error-status': config['showError'][o] }]">
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

              <template v-if="o === config.timeperiodQueue.length -1 && !config.queue.length">
                <el-button
                  v-if="config.timeperiodQueue[config.timeperiodQueue.length - 1][1] !== '23:59'"
                  type="primary"
                  size="mini"
                  style="margin-right: 10px;"
                  @click="onNewTimePeriod(config.timeperiodQueue[config.timeperiodQueue.length - 1], index)"
                >新增时间段</el-button>

                <el-button
                  type="primary"
                  size="mini"
                  @click="onFigureOut(config, index)"
                >生成通话时间段</el-button>

                <el-button
                  v-if="config.timeperiodQueue.length > 1"
                  size="mini"
                  type="danger"
                  @click="onDelTimePriod(config)"
                >删除时间段</el-button>
              </template>
            </div>
          </template>

          <template v-if="config.enabledMeeting && config.queue.length">
            <div class="el-row_queue">
              <label class="c-label">时间段分配</label>

              <div class="el-row_queue-configs">
                <template v-for="(queue, o) in config.queue">
                  <m-time-range-selector
                    :key="o"
                    :val="queue"
                    :disabled="true"
                    :prev="config.queue[o - 1]"
                    :next="config.queue[o + 1]"
                    type="queue"
                    @handleBlur="handleBlur($event, config.timeperiodQueue, index)"
                  />
                </template>

                <!-- 通常规时间配置 -->
                <el-button
                  size="mini"
                  class="button-float"
                  :style="index === configs.length - 1 ? 'margin-right: 10px;' : ''"
                  @click="onRestQueue(config)"
                >重置会见时间段</el-button>

                <!--编辑状态并且支持通话并且选择了日期并且国科服务管理员角色并且是最新配置并且初始化了通话时间段-->
                <el-button
                  v-if="
                    configs.length < 10 &&
                    index === configs.length - 1 &&
                    config.queue.length > 0 &&
                    config.prisonConfigIds.length &&
                    !errorMsg(config.window_size)
                  "
                  class="button-float"
                  size="mini"
                  type="success"
                  @click="onAddDay"
                >新增特殊日期</el-button>
              </div>
            </div>
          </template>
        </template>
      </div>
    </template>

    <slot name="visitNotice" />

    <div v-if="isSuperAdmin" class="button-box">
      <el-button size="small" @click="onGoBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import normalMixins from '../../mixins'

import remoteWeekCy from '../../components/remote-week-cy'

import { mapActions, mapState } from 'vuex'

import Moment from 'moment'
export default {
  components: {
    remoteWeekCy
  },

  mixins: [normalMixins],

  inject: ['errorMsg'],

  data() {
    return {
      configs: [],

      pickerOptions: {
        disabledDate: time => {
          const formatDate = Moment(new Date(time)).format('YYYY-MM-DD')

          return (time.getTime() < Date.now() || this.configs.find(item => item.day === formatDate))
        }
      },

      queue: ['09:00', '12:00']
    }
  },

  computed: {
    ...mapState(['visitSpecialConfigs']),

    durationIntervalItems() {
      const item = {
        formConfigs: {
          ...(_.cloneDeep(this.durationIntervalormConfigs)),
          labelWidth: '107px'
        },

        prisonConfigIds: _.cloneDeep(this.prisonAreasItem),

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

      return this.configs.map((config, index, target) => {
        const cloneItem = _.cloneDeep(item)

        this.$set(cloneItem['interval'], 'disabled', !!config.queue.length)

        this.$set(cloneItem['duration'], 'disabled', !!config.queue.length)

        return cloneItem
      })
    },

    basicConfig() {
      const { prisonBranch } = this.visitSpecialConfigs

      return {
        enabledMeeting: 1,
        day: '',
        config: [],
        queue: [],
        duration: 25,
        interval: 5,
        timeperiod: [],
        timeperiodQueue: [],
        showError: [],
        window_size: '1',
        status: 1,
        jailId: +this.jailId,
        prisonConfigIds: +prisonBranch ? [] : [-1]
      }
    }
  },

  methods: {
    ...mapActions([
      'getVisitSpecialConfigs',
      'addVisitSpecialConfig',
      'delVisitSpecialConfig',
      'updateVisitSpecialConfig'
    ]),

    onResponse(values) {
      const {
        index,
        interval,
        duration,
        prisonConfigIds
      } = values

      this.$set(this.configs[index], 'interval', interval)

      this.$set(this.configs[index], 'duration', duration)

      this.$set(this.configs[index], 'prisonConfigIds', prisonConfigIds)
    },

    onDeleteConfig(config, index) {
      if (config.id) {
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { jailId, day } = config
          const params = {
            jailId: +jailId,
            day,
            confirm: 0
          }
          const isSucess = await this.delVisitSpecialConfig(params)
          if(isSucess.secondConfirmation){
                  this.$confirm('当前日期有会见申请记录，删除后系统会取消申请，确定删除吗？', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(async () => {
                      const { jailId, day } = config
                      const params = {
                        jailId: +jailId,
                        day,
                        confirm: 1
                      }
                      const isSucess = await this.delVisitSpecialConfig(params)
                      if(isSucess){
                            this.splice(index)
                      }
                    })
        } else this.splice(index)
      })
      }else this.splice(index)
    },

    // 切换是否支持会见
    onChangeEnabledMeeting(config, index) {
      const { enabledMeeting } = config

      if (config.day && config.enabledMeeting && config.queue.length < 1) this.$set(config, 'timeperiodQueue', [this.queue])

      const { timeperiod, window_size } = config

      const length = (timeperiod && Array.isArray(timeperiod) && timeperiod.length) || 1

      config['showError'] = new Array(length).fill(false)

      config['window_size'] = window_size || '1'

      enabledMeeting && this.$refs[`form${index}`] && this.$refs[`form${index}`][0].onClearValidate()
    },

    // 保存按钮
    async onSave(config, index) {
      try {
        const {
          day,
          enabledMeeting,
          id,
          jailId,
          prisonConfigIds,
          status,
          window_size,
          interval,
          duration,
          queue,
          timeperiodQueue
        } = config

        let params = {
          day,
          enabledMeeting,
          jailId,
          status
        }

        if (enabledMeeting) {
          let config = [], timeperiod = []

          queue.forEach(q => config.push(q.join('-')))

          timeperiodQueue.forEach(q => timeperiod.push(q.join('-')))

          const settings = {
            duration,
            interval,
            config,
            timeperiod
          }

          params = {
            ...params,
            windowNum: +window_size,
            prisonConfigIds: prisonConfigIds.join(','),
            settings
          }
        }

        const callback = async () => {
          let isSucess = false

          if (id) {
            params = {
              ...params,
              id,
              confirm: 0
            }

            isSucess = await this.updateVisitSpecialConfig(params)
          } else {
            if (!enabledMeeting) {
              params = {
                ...params,
                windowNum: -1,
                prisonConfigIds: '-1',
                confirm: 0,
                settings: {}
              }
            }

            isSucess = await this.addVisitSpecialConfig(params)
          }

          if (isSucess) await this.initData()
        }

        await this.onPreOperation({ callback })
      } catch (err) {
        Promise.reject(err)
      }
    },

    // 新增特殊日期
    onAddDay() {
      this.configs.push(_.cloneDeep(this.basicConfig))
    },

    // 新增时间段
    onNewTimePeriod(timeperiodQueue, index) {
      this.configs[index].timeperiodQueue.push(this.getNextRange(timeperiodQueue, 180))

      this.configs[index].showError.push(false)
    },

    // 生成通话时间段
    async onFigureOut(config, index) {
      try {
        const isChecked = await this.$refs[`form${index}`][0].onCheck()

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

    onPreOperation(options = {}) {
      const basicOptins = {
        closeOnClickModal: false,

        closeOnPressEscape: false,

        customClass: 'confirm_pre-operation'
      }

      return this.$confirm('修改特殊日期配置后，系统会取消或调整当前日期已有的申请，确定修改吗？', {
        ...basicOptins,
        ...options
      })
    },

    async initData() {
      await this.getVisitSpecialConfigs(this.jailId)

      const { prisonBranch, complexVisitSpecialConfigs }  = this.visitSpecialConfigs

      if (+prisonBranch) {
        await this.getJailPrisonAreas({ url: '/prison_config/getPrisonConfigs', params: { jailId: this.jailId } })

        this.prisonBranch = prisonBranch

        this.$message.closeAll()
      }

      this.configs = _.cloneDeep(complexVisitSpecialConfigs)
    },

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

      // 没有配置通话时间段
      else if (config.queue.length === 0) return false

      else if (!config.prisonConfigIds.length) return false

      else if (this.errorMsg(config.window_size)) return false

      // 新增的特殊日期配置 或者 是新增了通话时间段 或者是更换了新的配置日期
      else if (
        !config.id ||
        config.config.length !== config.queue.length ||
        config.day !== config.oldDay ||
        config.old_window_size !== config.window_size ||
        !(_.isEqual(config.prisonConfigIds, config.oldPrisonConfigIds))
      ) return true

      // 修改了某个通话时间段
      else {
        for (let i = 0; i < config.queue.length; i++) {
          if (config.queue[i].join('-') !== config.config[i]) return true
        }
      }
    },

    splice(index) {
      if (this.configs.length > 1) this.configs.splice(index, 1)

      else this.configs = _.cloneDeep([this.basicConfig])
    }
  },

  async activated() {
    await this.initData()
  }
}
</script>

<style lang="scss" scoped>
.m-container {
  .day-box {
    .el-date-editor.el-input {
      width: 22%;
    }
  }

  .config-box {
    overflow: hidden;
  }

  .config-box + .config-box {
    border-top: 1px solid #dcdfe6;
    padding-top: 10px;
  }

  label.c-label {
    width: 97px;
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
    padding-bottom: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    clear: both;
  }
}

.duration-interval-form {
  padding-top: 5px;
  /deep/ .el-form-item {
    margin-bottom: 13px;

    &__content {
      width: 30%;
    }

    label {
      line-height: 36px;
    }

    &__error {
      padding-top: 0px;
      top: 95%
    }
  }
}

.timeperiod {
  display: flex;

  /deep/ label {
    line-height: 36px !important;
    width: 97px !important;
  }

  /deep/ .range-selecor__container {
    display: flex;
    flex-direction: column;
    width: 30%;
    margin-right: 10px;

    .m-range-selector {
      float: none;
      width: $absolutely-measure;
      height: 36px;
      margin-bottom: 13px;
    }
  }

  button {
    margin-bottom: 13px;
  }

  /deep/ .error-status {
    .m-range-selector {
      border-color: $red;
      margin-bottom: 4px;
    }
    & ~ button {
      margin-bottom: 15px;
    }
  }
}

.el-row_queue {
  display: flex;
  overflow: hidden;
  margin-bottom: 10px;

  label {
    float: none !important;
    width: 98px !important;
  }

  &-configs {
    overflow: hidden;
    width: calc(#{$absolutely-measure} - 98px);
  }
}

.error__tip {
  color: $red;
  font-size: 12px;
  line-height: 1;
}
</style>
