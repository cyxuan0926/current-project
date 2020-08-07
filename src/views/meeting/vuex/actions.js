import http from './service'

export default {
  getRemoteAdvanceDayLimit: async({ commit }, params) => {
    try {
      const res = await http.getRemoteAdvanceDayLimit(params)
      res && commit('setAdvanceDayLimit', res)
    }
    catch (err) { console.log(err) }
  },
  updateRemoteAdvanceDayLimit: async({ commit }, params) => {
    try {
      await http.updateRemoteAdvanceDayLimit(params)
      commit('setAdvanceDayLimit', params)
    }
    catch (err) { console.log(err) }
  },
  // v2.6.4 获取远程常规配置
  getRemoteNormalConfig: ({ commit }, params) => {
    return http.getRemoteNormalConfig(params).then(res => {
      if (!res) return
      if (res.configBefore && res.configBefore.length) {
        res.configBefore.forEach(config => {
          config.queue = []
          config.config.forEach(c => {
            config.queue.push(c.split('-'))
          })
          config.timequeue = []
          config.timeperiod.forEach(t => {
            config.timequeue.push(t.split('-'))
          })
        })
      }

      if (res.configAfter && res.configAfter.length) {
        res.configAfter.forEach(config => {
          // 配置的队列 二维数组
          config.queue = []
          config.config.forEach(c => {
            config.queue.push(c.split('-'))
          })
          config.timequeue = []
          config.timeperiod.forEach(t => {
            config.timequeue.push(t.split('-'))
          })
        })
      }

      commit('getRemoteNormalConfig', res)
      return true
    })
  },
  // 更新远程通话常规配置
  updateRemoteNormalConfig: ({ commit }, params) => {
    return http.updateRemoteNormalConfig(params).then(res => res)
  },
  // 获取远程特殊日期配置
  getRemoteSpecialConfig: ({ commit }, params) => {
    return http.getRemoteSpecialConfig(params).then(res => {
      if (!res) return
      if (!res.complexSpecialConfigs || !res.complexSpecialConfigs.length) {
        // enabledMeeting： 默认是支持会见
        res.complexSpecialConfigs = [{ enabledMeeting: 1, day: '', interval: '5', duration: '25', config: [], queue: [], timeperiod: [], timequeue: [] }]
        commit('getRemoteSpecialConfig', res)
        return true
      }
      res.complexSpecialConfigs.forEach(c => {
        // 时间段
        c.queue = []
        // 通话时长
        c.timequeue = []
        // 初始化的特殊日期
        c.oldDay = c.day
        // 初始化的是否支持通话申请
        c.oldEnabled = c.enabledMeeting
        // 支持通话申请 把通话时间变成二维数组的结构
        if (c.enabledMeeting) {
          c.config.forEach(q => c.queue.push(q.split('-')))
          c.timeperiod.forEach(t => c.timequeue.push(t.split('-')))
        }
      })
      commit('getRemoteSpecialConfig', res)
      return true
    })
  },
  deleteSpecialConfig: ({ commit }, params) => {
    return http.deleteSpecialConfig(params).then(res => res)
  },
  addSpecialConfig: ({ commit }, params) => {
    return http.addSpecialConfig(params).then(res => res)
  },
  updateSpecialConfig: ({ commit }, params) => {
    return http.updateSpecialConfig(params).then(res => res)
  },
  getRemoteUsualConfig({ commit }, params) {
    return http.getRemoteUsualConfig(params).then(res => {
      if (!res) return
      res.queue = []
      res.settings.forEach(queue => {
        res.queue.push(queue.split('-'))
      })
      commit('getRemoteUsualConfig', res)
      return true
    })
  },
  updateRemoteUsualConfig: ({ commit }, params) => {
    return http.updateRemoteUsualConfig(params).then(res => res)
  },
  getRemoteWeekendConfig({ commit }, params) {
    return http.getRemoteWeekendConfig(params).then(res => {
      if (!res) return
      res.queue = [null]
      if (res.settings) {
        res.queue = []
        res.settings.forEach(queue => {
          res.queue.push(queue.split('-'))
        })
      }
      commit('getRemoteWeekendConfig', res)
      return true
    })
  },
  updateRemoteWeekendConfig: ({ commit }, params) => {
    return http.updateRemoteWeekendConfig(params).then(res => res)
  },
  getRemoteSpecialConfigOld({ commit }, params) {
    return http.getRemoteSpecialConfigOld(params).then(res => {
      if (!res) return
      if (res.specialConfigs) {
        res.specialConfigs.forEach(config => {
          let queue = []
          config.settings.forEach(setting => {
            queue.push(setting.split('-'))
          })
          config.canAddQueue = true
          config.loading = false
          config.update = false
          config.deleting = false
          config.queue = queue
          config.originQueue = queue.toString()
          config.originDate = config.effectDate
        })
      }
      commit('getRemoteSpecialConfigOld', res.specialConfigs)
      return true
    })
  },
  addRemoteSpecialConfig: ({ commit }, params) => {
    return http.addRemoteSpecialConfig(params).then(res => res)
  },
  updateRemoteSpecialConfig: ({ commit }, params) => {
    return http.updateRemoteSpecialConfig(params).then(res => res)
  },
  deleteRemoteSpecialConfig: ({ commit }, params) => {
    return http.deleteRemoteSpecialConfig(params).then(res => res)
  },
  getPrisonVisitConfigDetail({ commit }, params) {
    return http.getPrisonVisitConfigDetail(params).then(res => {
      if (!res) return
      res.queue = [[]]
      if (res.batchQueue && res.batchQueue.length) {
        res.queue = []
        res.batchQueue.forEach(queue => {
          res.queue.push(queue.split('-'))
        })
        // res.canNotChange = true
      }
      commit('getPrisonVisitConfigDetail', res)
      return true
    })
  },
  updatePrisonVisitConfig: ({ state, commit }, params) => {
    return http.updatePrisonVisitConfig(params).then(res => {
      const config = Object.assign({}, state.prisonVisitConfigDetail, params)
      commit('getPrisonVisitConfigDetail', config)
      return res
    })
  }
}
