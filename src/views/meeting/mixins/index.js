import {
  countTimes,
  getNextQueue,
  convertToChinaNum
} from '@/utils/helper'

import Moment from 'moment'

import roles from '@/common/constants/roles'

export default {
  data() {
    return {
      jailId: this.$route.meta.role === '3' ? JSON.parse(localStorage.getItem('user')).jailId : this.$route.params.id
    }
  },

  computed: {
    // 国科服务管理员
    superAdmin() {
      return this.$store.getters.role === roles.SUPER_ADMIN
    }
  },

  methods: {
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
    }
  }
}
