import http from './service'

import { weeks } from '@/common/constants/const'

/* eslint-disable */
export default {
  getRemoteAdvanceDayLimits: async({ commit }, inputs) => {
    try {
      const res = await http.getRemoteAdvanceDayLimit(inputs)

      const advanceDayLimit = res ? (res['advanceDayLimit'] || res['startDay'] || 2) : 2

      const dayInLimit = res ? (res['dayInLimit'] || res['endDay'] || 15) : 15

      commit('setAdvanceDayLimits', [advanceDayLimit, dayInLimit])

      return res
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  updateRemoteAdvanceDayLimit: async({ commit }, params) => {
    try {
      await http.updateRemoteAdvanceDayLimit(params)

      commit('setAdvanceDayLimit', params)

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },
  // v2.6.4 获取远程常规配置(hb)
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
  // 远程常规配置(调整)(cy)
  getRemoteNormalConfigs: async({ commit }, params) => {
    try {
      let {
        jailId,
        configBefore,
        configAfter,
        enabledAt,
        dayInLimit,
        updatedAt,
        separateByArea,
        durations,
        id
      } = await http.getRemoteNormalConfig(params)

      const allConfigs = [configBefore, configAfter]

      const filterAllConfigs = allConfigs.map((configs, index) => {
        if (!configs || (Array.isArray(configs) && !configs.length)) {
          return [{ days: [], interval: 5, duration: 25, timeperiod: [], config: [], queue: [], timeperiodQueue: [], showError: [], type: index }]
        }
        else {
          return configs.map(config => {
            const { timeperiod } = config

            const length = (timeperiod && Array.isArray(timeperiod) && timeperiod.length) || 1

            config['showError'] = new Array(length).fill(false)

            const filterParams = [
              {
                key: 'config',
                value: 'queue'
              },
              {
                key: 'timeperiod',
                value: 'timeperiodQueue'
              }
            ]
            filterParams.forEach(params => {
              config[params['value']] = []
              if (config[params['key']] && Array.isArray(config[params['key']]) && config[params['key']].length) {
                config[params['key']].forEach(c => {
                  config[params['value']].push(c.split('-'))
                })
              }
              else {
                config[params['key']] = []
              }
            })
            return config
          })
        }
      })

      commit('setRemoteNormalConfigs', {
        jailId,
        enabledAt,
        id,
        updatedAt,
        dayInLimit,
        separateByArea,
        durations,
        configBefore: filterAllConfigs[0],
        configAfter: filterAllConfigs[1]
      })
      return true
    }
    catch (err) {
      throw err
    }
  },

  // 更新远程通话常规配置
  updateRemoteNormalConfig: ({ commit }, params) => {
    return http.updateRemoteNormalConfig(params).then(res => res)
  },

  // 获取远程特殊日期配置(hb)
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

  // 新的 数据初始化
  // 正在使用的通话时长
  // 要处理相同配置的
  // beforeDuration ：正在使用的通话时长
  // afterDuration：即将使用的通话时长(cy)
  async getRemoteSpecialConfigs({ commit }, params) {
    try {
      // complexNormalConfig:常规配置 unMeetingDays：不可以申请的日期 complexSpecialConfigs：特使日期配置
      const { complexNormalConfig, complexSpecialConfigs, unMeetingDays, separateByArea } = await http.getRemoteSpecialConfig(params)
      // configAfter: 将要生效的常规配置, configBefore：正在生效的常规配置, enabledAt：生效日期 , enabledAt
      const { configAfter, configBefore, enabledAt } = complexNormalConfig
      let afterDuration = 25, beforeDuration = 25, filterConfigs = []
      if (configAfter && configAfter.length && configAfter[0].config && configAfter[0].config.length) {
        afterDuration = configAfter[0].duration
      }
      if (configBefore && configBefore.length && configBefore[0].config && configBefore[0].config.length) {
        beforeDuration = configBefore[0].duration
      }
      // 初始化

      if (!complexSpecialConfigs || !complexSpecialConfigs.length) {
        filterConfigs = [
          {
            enabledMeeting: 1,
            day: '',
            config: [],
            queue: [],
            duration: 25,
            interval: 5,
            timeperiod: [],
            timeperiodQueue: [],
            showError: []
          }
        ]
      }
      else {
        filterConfigs = complexSpecialConfigs.map(config => {
          const {
            enabledMeeting,
            day,
            timeperiod,
            interval,
            duration
          } = config

          const length = (timeperiod && Array.isArray(timeperiod) && timeperiod.length) || 1

          config['showError'] = new Array(length).fill(false)

          config['oldDay'] = day

          config['oldEnabled'] = enabledMeeting || 0

          config['duration'] = duration || 25

          config['interval'] = interval || 5

          const filterParams = [
            {
              key: 'config',
              value: 'queue'
            },
            {
              key: 'timeperiod',
              value: 'timeperiodQueue'
            }
          ]

          filterParams.forEach(params => {
            config[params['value']] = []
            if (config[params['key']] && Array.isArray(config[params['key']]) && config[params['key']].length) {
              config[params['key']].forEach(c => {
                config[params['value']].push(c.split('-'))
              })
            }
            else {
              config[params['key']] = []
            }
          })
          return config
        })
      }

      commit('setRemoteSpecialConfigs', {
        afterDuration,
        beforeDuration,
        unMeetingDays,
        enabledAt,
        configAfter,
        separateByArea,
        complexSpecialConfigs: filterConfigs
      })

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
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
  },
  getTerminalsByArea: ({ commit }, params) => {
    return http.getTerminalsByArea(params).then(res => res)
  },
  deleteSpecialConfigById: ({ commit }, params) => {
    return http.deleteSpecialConfigById(params).then(res => res)
  },

  async getComplexConfigFloorDetail({ commit }, prisonId) {
    try {
      const {
        configurationsFloorDetailNow,
        configurationsFloorDetailFuture,
        complexNormalConfig,
        prisonBranch
      } = await http.getComplexConfigFloorDetail(prisonId)

      // 是否分监区
      // configurationsFloorDetailNow: 正在生效的会见楼配置 监区配置
      // configurationsFloorDetailFuture：即将生效的会见楼配置 监区配置 都需要初始化成对应的最基本的数据结构
      // complexNormalConfig：会见楼时间配置 configAfter：即将生效的时间  configBefore： 正在生效的时间
      // 还要考虑是否分监区 不分监区的话 就需要初始为 全监狱
      // 先初始化时间配置
      const {
        configBefore,
        configAfter,
        durations,
        dayInLimit,
        enabledAt,
        updatedAt,
        jailId,
        id
      } = complexNormalConfig

      const allTimeConfigs = [configBefore, configAfter]

      const allPrisonWeekConfigs = [configurationsFloorDetailNow, configurationsFloorDetailFuture]

      const filterAllTimeConfigs = allTimeConfigs.map((configs, index) => {
        // 新增 就是都是空 这种不管怎么样都是改变的
        // 只有正在生效的 没有即将生效的为空 只能操作正在生效的 更新到即将生效的
        // 既有正在生效的 又有即将生效的 只能操作即将生效的 更新到正在生效的
        // 只有即将生效的
        if (!configs || (Array.isArray(configs) && !configs.length)) {
          return [
            { days: [1, 2, 3, 4, 5, 6, 0],
              interval: 5,
              duration: 25,
              timeperiod: [],
              config: [],
              queue: [],
              timeperiodQueue: [],
              showError: [],
              type: index,
              Monday: [],
              Wednesday: [],
              Thursday: [],
              Friday: [],
              Tuesday: [],
              Saturday: [],
              Sunday: []
            }
          ]
        }
        else {
          return configs.map(config => {
            const { timeperiod } = config

            const length = (timeperiod && Array.isArray(timeperiod) && timeperiod.length) || 1

            config['showError'] = new Array(length).fill(false)

            const filterParams = [
              {
                key: 'config',
                value: 'queue'
              },
              {
                key: 'timeperiod',
                value: 'timeperiodQueue'
              }
            ]
            filterParams.forEach(params => {
              config[params['value']] = []
              if (config[params['key']] && Array.isArray(config[params['key']]) && config[params['key']].length) {
                config[params['key']].forEach(c => {
                  config[params['value']].push(c.split('-'))
                })
              }
              else config[params['key']] = []
            })

            let weekConfigs = {}

            allPrisonWeekConfigs[index].forEach(prisonWeekConfig => {
              weeks.forEach(day => {
                // 拥有的日期
                if (+day.value === +prisonWeekConfig.days) {
                  const { key } = day

                  let { prisonConfigId } = prisonWeekConfig

                  prisonConfigId = prisonConfigId || []

                  // 特殊处理 全监狱 id默认为 -1
                  if (!+prisonBranch) prisonConfigId = [-1]

                  weekConfigs = {
                    ...weekConfigs,
                    [key]: prisonConfigId
                  }
                }
              })
            })

            return { ...config, ...weekConfigs }
          })
        }
      })

      commit('setMeetingRoomConfigs', {
        prisonBranch,
        durations,
        enabledAt,
        dayInLimit,
        updatedAt,
        jailId,
        id,
        configBefore: filterAllTimeConfigs[0],
        configAfter: filterAllTimeConfigs[1]
      })
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async saveComplexConfigFloorDetail(_, params) {
    try {
      const data = await http.saveComplexConfigFloorDetail(params)

      return data && data['code'] === 200
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async getVisitNormalConfigs({ commit }, prisonId) {
    try {
      const response = await http.getVisitNormalConfigs(prisonId)

      if (!response) return

      const {
        complexNormalConfig,
        prisonBranch,
        configurationsFloorDetailNow,
        configurationsFloorDetailFuture
      } = response

      const {
        configAfter,
        configBefore,
        enabledAt,
        endDay,
        id,
        jailId,
        updatedAt,
        startDay
      } = complexNormalConfig

      // 时间配置
      const allTimeConfigs = [configBefore, configAfter]

      // 日期监区配置
      const allPrisonWeekConfigs = [configurationsFloorDetailNow, configurationsFloorDetailFuture]

      const filterAllTimeConfigs = allTimeConfigs.map((configs, index) => {
        if (!configs || (Array.isArray(configs) && !configs.length)) {
          return [
            { days: [],
              interval: 5,
              duration: 25,
              timeperiod: [],
              config: [],
              queue: [],
              timeperiodQueue: [],
              showError: [],
              type: index,
              Monday: [],
              Wednesday: [],
              Thursday: [],
              Friday: [],
              Tuesday: [],
              Saturday: [],
              Sunday: [],
              window_size: '1',
              checkForm: []
            }
          ]
        }
        else {
          return configs.map(config => {
            const { timeperiod } = config

            const length = (timeperiod && Array.isArray(timeperiod) && timeperiod.length) || 1

            config['showError'] = new Array(length).fill(false)

            config['window_size'] = String(config['window_size']) || '1'

            const filterParams = [
              {
                key: 'config',
                value: 'queue'
              },
              {
                key: 'timeperiod',
                value: 'timeperiodQueue'
              }
            ]
            filterParams.forEach(params => {
              config[params['value']] = []
              if (config[params['key']] && Array.isArray(config[params['key']]) && config[params['key']].length) {
                config[params['key']].forEach(c => {
                  config[params['value']].push(c.split('-'))
                })
              }
              else config[params['key']] = []
            })

            let weekConfigs = {}, checkForm = []

            allPrisonWeekConfigs[index].forEach(prisonWeekConfig => {
              weeks.forEach(day => {
                // 拥有的日期
                if (+day.value === +prisonWeekConfig.days) {
                  const { key } = day

                  let { prisonConfigId } = prisonWeekConfig

                  prisonConfigId = prisonConfigId && Array.isArray(prisonConfigId) ? prisonConfigId.map(item => +item) : []

                  // 特殊处理 全监狱 id默认为 -1
                  if (!+prisonBranch) prisonConfigId = [-1]

                  weekConfigs = {
                    ...weekConfigs,
                    [key]: prisonConfigId
                  }

                  checkForm.push(key)
                }
              })
            })

            return { ...config, ...weekConfigs, checkForm }
          })
        }
      })

      commit('setVisitNormalConfigs', {
        prisonBranch,
        jailId,
        id,
        updatedAt,
        startDay,
        enabledAt,
        endDay,
        configBefore: filterAllTimeConfigs[0],
        configAfter: filterAllTimeConfigs[1]
      })

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async updateVisitNormalConfigs(_, params) {
    try {
      const result = await http.updateVisitNormalConfigs(params)

      return result
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async getVisitNotice({ commit }, jailId) {
    try {
      let notice = await http.getVisitNotice(jailId)

      if (!notice || Object.prototype.toString.call(notice) === '[object Object]') notice = `
        根据疫情防控相关要求，现场会见实行预约办理。
        会见当天，提供健康码、旅居史和7日内核酸检测报告，对体温超过37.3℃、有咳嗽、流涕、红眼、皮疹等可疑传染性疾病症状的人员，
        以及到过中高风险地区疫情地区的和境外人员一律不允许进入监管区。具体情况请咨询各监狱。
      `

      commit('setVisitNotice', notice.replace(/\s*/g, ''))

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async updateTimeSwitch(_, params) {
    try {
      await http.updateTimeSwitch(params)

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async getVisitSpecialConfigs({ commit }, jailId) {
    try {
      const response = await http.getVisitSpecialConfigs(jailId)

      console.log(response)
      if (!response) return
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async addVisitSpecialConfig(_, parmas) {
    try {
      const response = await http.addVisitSpecialConfig(parmas)

      console.log(response)
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async delVisitSpecialConfig(_, parmas) {
    try {
      const response = await http.delVisitSpecialConfig(parmas)

      console.log(response)
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async updateVisitSpecialConfig(_, parmas) {
    try {
      await http.updateVisitSpecialConfig(parmas)

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async getVisitTimeSwitch({ commit }, jailId) {
    try {
      const response = await http.getVisitTimeSwitch(jailId)

      const timeSwitch = response ? response['data'] ? +response['data'] : 0 : 0

      commit('setVisitTimeSwitch', timeSwitch)

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async updateVisitNotice(_, params) {
    try {
      await http.updateVisitNotice(params)

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}
