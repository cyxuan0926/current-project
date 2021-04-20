<template>
  <div class="container">
    <template>
      <template>
        <!-- <m-form
          class="duration-interval-form"
          :ref="`${type}form${index}`"
          :items="durationIntervalItems[type][index]"
          :values="{ index: index, duration: config.duration, interval: config.interval, type: type }"
          @response="onResponse"
        /> -->

        <!-- <template v-for="(queue, o) in config.timeperiodQueue">
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
                @click="onNewTimePeriod(config.timeperiodQueue[config.timeperiodQueue.length - 1], index, type)"
              >新增时间段</el-button>

              <el-button
                type="primary"
                size="mini"
                @click="onFigureOut(config, index, type)"
              >生成通话时间段</el-button>

              <el-button
                v-if="config.timeperiodQueue.length > 1"
                size="mini"
                type="danger"
                @click="onDelTimePriod(config)"
              >删除时间段</el-button>
            </template>
          </div>
        </template> -->

        <!-- 当有配置时间队列并且flag -->
        <!-- <div v-if="config.queue.length && flag" style="overflow: hidden; margin-bottom: 10px;"> -->
          <!-- <label class="c-label">时间段分配</label> -->

          <!-- <div style="float: left; width: calc(100% - 80px); overflow: hidden;"> -->
            <!-- 时间范围选择器 -->
            <!-- <template v-for="(queue, o) in config.queue">
              <m-time-range-selector
                :key="o"
                :val="queue"
                :disabled="true"
                :prev="config.queue[o - 1]"
                :next="config.queue[o + 1]"
                type="queue"
              />
            </template> -->

            <!-- 国科服务管理员角色 -->
            <!-- <el-button
              v-if="!hasOriginConfigAfter || type === 1"
              size="mini"
              class="button-float"
              :style="index === configs.length - 1 ? 'margin-right: 10px;' : ''"
              @click="onRestQueue(config)"
            >重置时间段</el-button> -->
          <!-- </div> -->
        <!-- </div> -->
      </template>
    </template>

    <el-dialog
      :visible.sync="daysPrisonAreaDialogVisible"
      class="authorize-dialog"
      title="配置工作日和监区"></el-dialog>

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
  </div>
</template>

<script>
import remoteWeekCy from '../../components/remote-week-cy'

import normalMixins from '../../mixins'
export default {
  components: {
    remoteWeekCy
  },

  mixins: [normalMixins],

  props: {
    value: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      windowSize: 1,

      daysPrisonAreaDialogVisible: true
    }
  },

  watch: {
    value: {
      handler: val => {
        this.windowSize = val
      }
    }
  },

  methods: {
    onUpdate() {}
  },

  activated() {
    // this.$emit('input', 2)
  }
}
</script>

<style lang="scss" scoped>
.container {
  .button-box{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    clear: both;
  }
}
</style>
