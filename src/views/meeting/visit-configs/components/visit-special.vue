<template>
  <div class="m-container">
    <template v-for="(config, index) in configs">
      <div class="config-box" :key="index">
        <div class="day-box">
          <label class="c-label">选择日期</label>

          <el-tooltip
            effect="light"
            popper-class="color-transprant__tooltip"
            :content="config.day.join(',')"
            placement="top-start"
          >
            <el-date-picker
              size="mini"
              type="dates"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              @change="onSureDates"
            />
          </el-tooltip>

          <el-radio-group v-model="config.enabledMeeting" @change="onChangeEnabledMeeting(config)">
            <el-radio :label="1">支持预约申请</el-radio>
            <el-radio :label="0">不支持预约申请</el-radio>
          </el-radio-group>

          <el-button
            v-if="(config.enabledMeeting === 0 || config.queue.length)"
            plain
            type="danger"
            size="mini"
            @click="onDeleteConfig"
          >删除当前日期配置</el-button>

          <!--可保存状态并且是国科服务管理员并且是编辑状态-->
          <el-button
            v-if="canSave(config)"
            type="primary"
            size="mini"
            @click="onSave"
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
            :values="{ index: index, interval: config.interval, duration: configs.duration }"
            @response="onResponse"
          />

          <template v-for="(queue, o) in config.timeperiodQueue">
            <div class="timeperiod" :key="o">
              <label class="c-label">{{ '时间段' + convertToChinaNum(0 + 1) }}</label>

              <div :class="['range-selecor__container']">
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
              </div>

              <div v-if="config['showError'][o]" class="error__tip">时间段区间小于通话时长</div>

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

              <template v-if="config.enabledMeeting && config.queue.length">
                <div style="overflow: hidden; margin-bottom: 10px;">
                  <label class="c-label">时间段分配</label>

                  <div style="float: left; width: calc(100% - 80px); overflow: hidden;">
                    <m-time-range-selector
                      v-for="(queue, o) in config.queue"
                      :key="o"
                      :val="queue"
                      :disabled="true"
                      :prev="config.queue[o - 1]"
                      :next="config.queue[o + 1]"
                      type="queue"
                      @handleBlur="handleBlur($event, config.timeperiodQueue, index)"
                    />

                    <!-- 通常规时间配置 -->
                    <el-button
                      size="mini"
                      class="button-float"
                      :style="index === configs.length - 1 ? 'margin-right: 10px;' : ''"
                      @click="onRestQueue(config)"
                    >重置会见时间段</el-button>

                    <!--编辑状态并且支持通话并且选择了日期并且国科服务管理员角色并且是最新配置并且初始化了通话时间段-->
                    <el-button
                      v-if="configs.length < 10 && index === configs.length - 1 && config.queue.length > 0"
                      class="button-float"
                      size="mini"
                      type="success"
                      @click="onAddDay"
                    >新增特殊日期</el-button>
                  </div>
                </div>
              </template>
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

import cloneDeep from 'lodash/cloneDeep'

import remoteWeekCy from '../../components/remote-week-cy'

import { mapActions, mapState } from 'vuex'

import Moment from 'moment'
export default {
  components: {
    remoteWeekCy
  },

  mixins: [normalMixins],

  data() {
    return {
      configs: [],

      pickerOptions: {
        disabledDate: time => {
          const formatDate = Moment(new Date(time)).format('YYYY-MM-DD')

          return (time.getTime() < Date.now() || this.configs.find(item => item.day === formatDate))
        }
      },

      showTooltip: []
    }
  },

  computed: {
    ...mapState([]),

    durationIntervalItems() {
      const item = {
        formConfigs: {
          ...cloneDeep(this.durationIntervalormConfigs),
          labelWidth: '106px'
        },

        prisonAreas: cloneDeep(this.prisonAreasItem),

        duration: {
          label: '通话时长',
          type: 'input',
          rules: [
            'required',
            'isNumber',
            'numberRange1-60'
          ]
        },

        interval: cloneDeep(this.interval)
      }

      return this.configs.map((config, index, target) => {
        const cloneItem = cloneDeep(item)

        this.$set(cloneItem['interval'], 'disabled', !!config.queue.length)

        this.$set(cloneItem['duration'], 'disabled', !!config.queue.length)

        return cloneItem
      })
    }
  },

  methods: {
    ...mapActions([
      'getVisitSpecialConfigs',
      'addVisitSpecialConfig',
      'delVisitSpecialConfig',
      'updateVisitSpecialConfig'
    ]),

    onResponse(values) {},

    onDeleteConfig(config, index) {
      if (config.id) {
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {})
      } else this.splice(index)
    },

    // 切换是否支持会见
    onChangeEnabledMeeting(config) {
      console.log(config)
    },

    // 确定选择的日期
    onSureDates() {},

    // 保存按钮
    async onSave() {
      try {
        const result = await this.onPreOperation()
        console.log(result)
      } catch (err) {
        Promise.reject(err)
      }
    },

    // 新增特殊日期
    onAddDay() {
      this.configs.push(cloneDeep(this.basicConfig))
    },

    // 新增时间段
    onNewTimePeriod() {
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

        customClass: 'a'
      }

      return this.$confirm('修改特殊日期配置后，系统会取消或调整当前日期已有的申请，确定修改吗？', {
        ...basicOptins,
        ...options
      })
    },

    async initData() {
      await this.getVisitSpecialConfigs(this.jailId)
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
        for (let i = 0; i < config.queue.length; i++) {
          if (config.queue[i].join('-') !== config.config[i]) return true
        }
      }
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
      width: 30%;
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
    line-height: 36px !important;
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
</style>
