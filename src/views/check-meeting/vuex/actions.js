import http from '@/service'

import repeatAPI from '@/service/modules/repeat'

export default {
  getMeetings({ commit }, params) {
    return http.getMeetings(params).then(res => {
      if (!res) return
      commit('getMeetings', res)
      return true
    })
  },
  getMeetingsDiplomats({ commit }, params) {
    return http.getMeetingsDiplomats(params).then(res => {
      if (!res) return
      commit('getMeetingsDiplomats', res)
      return true
    })
  },
  getMeetingsAll({ commit }, params) {
    return http.getMeetingsAll(params).then(res => {
      if (!res) return
      commit('getMeetings', res)
      return true
    })
  },
  async authorizeMeeting({ commit }, params) {
    // return http.authorizeMeeting(params).then(res => res)
    try {
      const res = await http.authorizeMeeting(params)
      return res && res.code === 200
    }
    catch (err) {
      throw err
    }
  },
  async authorizeDiplomatsMeeting({ commit }, params) {
    // return http.authorizeMeeting(params).then(res => res)
    try {
      const res = await http.authorizeDiplomatsMeeting(params)
      return res && res.code === 200
    }
    catch (err) {
      throw err
    }
  },
  withdrawMeeting({ commit }, params) {
    return http.withdrawMeeting(params).then(res => res)
  },

  async getMeetingConfigs({ commit }, params) {
    try {
      const { data } = await http.getMeetingConfigs(params)

      commit('getMeetingConfigs', data)

      return true
    }
    catch (err) {
      throw err
    }
  },
  adjustMeeting({ commit }, params) {
    return http.adjustMeeting(params).then(res => res)
  },
  getFreeMeetings({ commit }, params) {
    http.getFreeMeetings(params).then(res => res && commit('getFreeMeetings', { contents: res.freeMeetings, total: res.total }))
  },
  getMeetingsDiplomatsDetail({ commit }, params) {
    return http.getMeetingsDiplomatsDetail(params).then(res => res)
  },
  getMeetingsFamilyDetail({ commit }, params) {
    return http.getMeetingsFamilyDetail(params).then(res => res)
  },
  getMeettingsChangelogDetail({ commit }, params) {
    return http.getMeettingsChangelogDetail(params).then(res => res)
  },
  getMeettingsDetail({ commit }, params) {
    return http.getMeettingsDetail(params).then(res => res)
  },
  meetingApplyDealing({ commit }, params) {
    commit('meetingApplyDealing', params)
  },
  // 会见调整处理
  meetingAdjustDealing({ commit }, params) {
    commit('meetingAdjustDealing', params)
  },
  getVisits({ commit }, params) {
    http.getVisits(params).then(res => res && commit('getVisits', res))
  },
  getCanceledVisit({ commit }, params) {
    http.getCanceledVisit(params).then(res => res && commit('getVisits', res))
  },
  authorizeVisit({ commit }, params) {
    return http.authorizeVisit(params).then(res => res)
  },
  withdrawVisit({ commit }, params) {
    return http.withdrawVisit(params).then(res => res)
  },
  async getMeetingCostSavingIndividual({ commit }, payload) {
    const data = await repeatAPI.getMeetingCostSavingIndividual(payload)

    data.meetingDistances = data.personalDimensions
    commit('setMeetingCostSaving', data || {})

    return data
  },
  async getMeetingCostSavingPrisonArea({ commit }, payload) {
    const data = await repeatAPI.getMeetingCostSavingPrisonArea(payload)

    commit('setMeetingCostSaving', data || {})

    return data
  },
  async getMeetingCostSavingPrison({ commit }, payload) {
    const data = await repeatAPI.getMeetingCostSavingPrison(payload)

    commit('setMeetingCostSaving', data || {})

    return data
  },
  async gdGetFamilyMeetingDetail({ commit }, params) {
    try {
      const res = await http.getFamilyMeetingDetail(params)
      const { item, meetings, total } = res.data
      commit('setFamilyMeetingDetail', meetings || [])
      commit('setgdmeetingStatisticTotalItem', item || {})
      return total || 0
    }
    catch (err) {
      throw err
    }
  },
  async getMeetingStatics({ commit }, params) {
    try {
      const res = await http.getMeetingStatics(params)

      const { item, list, totalCount } = res.data

      const percentProps = [
        'noAuthToExpiredPercentShowValue',
        'finishedPercentShowValue',
        'deniedPercentShowValue',
        'authedToExpiredPercentShowValue'
      ]

      const data = [[item], list]

      const usefullData = data.map(element => {
        return (
          element.map(subItem => {
            percentProps.forEach(prop => {
              subItem[prop] = `${ (+(subItem[prop].replace('%', ''))) }%`
            })
            return subItem
          })
        )
      })

      commit('setMeetingStatistics', usefullData[1] || [])

      commit('setMeetingStatisticTotalItem', ...usefullData[0] || {})

      return totalCount || 0
    }
    catch (err) {
      throw err
    }
  },
  async getMeetingCallRecords({ commit }, params) {
    try {
      const { meetingCallRecords, meetingCallRecordsSize } = await repeatAPI.getMeetingCallRecords(params)
      const { page, rows } = params
      const filterMeetingCallRecords = meetingCallRecords.map((item, num) => {
        let itemData = {}
        for (let [key, value] of Object.entries(item)) {
          if (![
            'jailId',
            'STATUS',
            'jailName',
            'meetingId',
            'provincesName',
            'meetingTime',
            'conferenceName',
            'roomNumber'
            ].includes(key)) itemData = Object.assign({}, itemData, { [key]: value.replace(/BLANK_DATA/ig, '').split('==') })
          else itemData = Object.assign({}, itemData, { [key]: value })
        }
        return itemData['startTimeConcat'].map((value, index) => (Object.assign({}, { count: itemData['startTimeConcat'].length, orderNumber: index, orderIndex: rows * (page - 1) + num + 1 },
          itemData, {
            startTimeConcat: value,
            mcstatusConcat: itemData['mcstatusConcat'][index],
            zijingStartTimeConcat: itemData['zijingStartTimeConcat'][index],
            zijingEndTimeConcat: itemData['zijingEndTimeConcat'][index],
            zijingDurationConcat: itemData['zijingDurationConcat'][index],
            endTimeConcat: itemData['endTimeConcat'][index],
            remarksConcat: itemData['remarksConcat'][index],
            durationConcat: itemData['durationConcat'][index]
          })))
      })
      commit('setMeetingCallRecords', { filterMeetingCallRecords, meetingCallRecordsSize })
      return true
    }
    catch (err) {
      throw err
    }
  },
  async getBackupMeetingCallRecords({ commit }, params) {
    try {
      const { meetingCallRecords, meetingCallRecordsSize } = await repeatAPI.getMeetingCallRecords(params)
      const filterMeetingCallRecords = meetingCallRecords.map((item, num) => {
        let itemData = {}
        for (let [key, value] of Object.entries(item)) {
          if (!['jailId', 'STATUS', 'jailName', 'meetingId'].includes(key)) itemData = Object.assign({}, itemData, { [key]: value.replace(/BLANK_DATA/ig, '').split('==') })
          else itemData = Object.assign({}, itemData, { [key]: value })
        }
        return itemData
      })
      commit('setMeetingCallRecords', { filterMeetingCallRecords, meetingCallRecordsSize })
      return true
    }
    catch (err) {
      throw err
    }
  },
  async authorizeBatchMeetings({ commit }, params) {
    try {
      // 只要有一条不通过就是code 为 -1 全部通过才是200
      await http.authorizeBatchMeetings(params)
      return true
    }
    catch (err) {
      throw err
    }
  },
  async getMeetingTimes({ commit }, params) {
    try {
      const { data } = await http.getMeetingTimes(params)
      const { meetingQueue = [], terminals = [], meetings = [] } = data
      commit('setMeetingTimes', Object.assign({}, data, { meetingQueue, terminals, meetings }))
      return true
    }
    catch (err) {
      throw err
    }
  },
  async authorizeSingleMeeting({ commit }, params) {
    try {
      const res = await http.authorizeSingleMeeting(params)
      return res.code === 200
    }
    catch (err) {
      throw err
    }
  },
  async getPoliceFamilyFreeMeetings({ commit }, params) {
    try {
      const policeFamilyFreeMeetings = await repeatAPI.getPoliceFamilyFreeMeetings(params)
      const { total, freeMeetings } = policeFamilyFreeMeetings.data
      commit('getFreeMeetings', { contents: freeMeetings, total })
      return true
    }
    catch (err) {
      throw err
    }
  }
}
