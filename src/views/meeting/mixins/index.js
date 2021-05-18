import {
  countTimes,
  getNextQueue,
  convertToChinaNum
} from '@/utils/helper'

import Moment from 'moment'

import { weeks } from '@/common/constants/const'

import { daysTransformWeeksParams, dayTransformProp } from '../utils'

import {
  mapGetters,
  mapActions,
  mapState
} from 'vuex'
export default {
  data() {
    const interval = {
      label: '间隔时间',
      type: 'input',
      append: '分钟',
      rules: ['required', 'isNumber']
    }

    const durationIntervalormConfigs = {
      labelWidth: '81px',
      hideRequiredAsterisk: true
    }
    return {
      jailId: this.$route.meta.role === '3' ? JSON.parse(localStorage.getItem('user')).jailId : this.$route.params.id,

      prisonBranch: '0',

      interval,

      durationIntervalormConfigs
    }
  },

  computed: {
    // 国科服务管理员
    ...mapGetters(['isSuperAdmin']),

    ...mapState(['jailPrisonAreas']),

    filterPrisonAreaOptions() {
      if (!+this.prisonBranch) {
        return [
          {
            id: -1,
            name: '全监狱'
          }
        ]
      }

      else return this.jailPrisonAreas
    },

    prisonAreasItem() {
      return {
        label: '选择监区',
        type: 'select',
        placeholder: '请选择监区',
        rules: ['required'],
        options: this.filterPrisonAreaOptions,
        props: { label: 'name', value: 'id' },
        multiple: true,
        collapseTags: true
      }
    }
  },

  methods: {
    ...mapActions(['getJailPrisonAreas']),

    // 数字转汉字
    convertToChinaNum(o) {
      return convertToChinaNum(o)
    },

    // 时间范围选择器组件 自定义的handleblur事件实际触发方法
    handleBlur(e, queue) {
      this.flag = false
      queue[queue.length - 1] = e
      this.flag = true
    },

    // 重置时间段
    onRestQueue(e) {
      // e: 是当前配置信息
      e.queue = []
    },

    // 计算下一个配置时间段
    getNextRange(e, timeDuration) {
      // e：是当前日子配置时间段的最后一个时间段
      let sh = parseInt(e[0]), // 开始时间
        eh = parseInt(e[1]), // 结束时间
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

    getConfigsQueue(config) {
      let result = []

      const { interval, duration, timeperiodQueue } = config

      timeperiodQueue.forEach((item, index) => {
        const totalTime = Moment(item[1], 'HH:mm').diff(Moment(item[0], 'HH:mm'), 'minutes')

        if (this.compareTimes(totalTime, duration)) {
          this.$set(config['showError'], index, true)
        }
        else {
          this.$set(config['showError'], index, false)

          const times = countTimes(totalTime, duration, interval)

          result = [...result, ...getNextQueue(item, duration, interval, times)]
        }
      })
      if (!config['showError'].includes(true)) this.$set(config, 'queue', result)
    },

    // 计算时长是否大于时间段
    compareTimes(time, duration) {
      return time - duration < 0
    },

    // 删除时间段
    onDelTimePriod(config) {
      config.timeperiodQueue.splice(-1, 1)
    },

    onGoBack() {
      this.$router.back()
    },

    // 比较实际选择的工作日 和 实际渲染的日期监区 item一致不
    onCompareDaysAndPrisonAreaItems(type, index, configs, items, noEqual = [[], []]) {
      const { days } = configs

      // 这个处理只适合少数情况下 只要 formconfigs 这个无用的配置/全部item 都显示
      const allProps = Object.keys(items)

      let result = false
      // 这种是个数都不相同
      if (days.length !== allProps.length - 1) result = true
      // 个数相同的情况 就看元素是否全部一样
      else {
        const haveWeeks = weeks.filter(day => days.includes(+day))

        result = haveWeeks.every(day => allProps.includes(day.key))
      }

      this.$set(noEqual[type], index, result)
    },

    // 日期监区配置过滤
    daysAndPrisonAreaFilterParams(params, selfKeys = []) {
      let result = []

      params.forEach(config => {
        const {
          duration,
          interval,
          days,
          queue,
          timeperiodQueue
        } = config

        if (!config.days.length || !config.queue.length || !config.timeperiodQueue.length) return

        let c = [], period = []

        queue.forEach(q => c.push(q.join('-')))

        timeperiodQueue.forEach(t => period.push(t.join('-')))

        const weeksPrisonAreas = daysTransformWeeksParams(days, config)

        const basic = { days, config: c, duration, interval, timeperiod: period, floorDetai: weeksPrisonAreas }

        selfKeys.forEach(key => {
          basic[key] = config[key]
        })

        result.push(basic)
      })

      return result
    },

    // 提交参数
    filterSubmittingParams(
      configs,
      filterParams,
      effectiveDate,
      configurationsFloorDetailKey = 'configurationsFloorDetail',
      complexNormalConfigKey = 'complexNormalConfig'
    ) {
      const { jailId = this.jailId, prisonBranch } = configs

      return filterParams.reduce((accumulator, currentItem) => {
        const { floorDetai, ...configAfter } = currentItem

        const { days } = configAfter

        let configurationsFloorDetailItem = days.map(day => {
          const { key } = dayTransformProp(day)

          let prisonConfigId = +prisonBranch ? floorDetai[key] : []

          return {
            days: day,
            jailId: jailId || +this.jailId,
            prisonConfigId,
            effectiveDate
          }
        })

        accumulator[configurationsFloorDetailKey] = [...accumulator[configurationsFloorDetailKey], ...configurationsFloorDetailItem]

        accumulator[complexNormalConfigKey].configAfter.push(configAfter)

        return accumulator
      }, { [configurationsFloorDetailKey]: [], [complexNormalConfigKey]: { enabledAt: effectiveDate, jailId: jailId || +this.jailId, configAfter: [] } })
    }
  }
}
