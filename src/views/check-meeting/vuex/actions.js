import http from '@/service'
import repeatAPI from '@/service/modules/repeat'
import { getUserStorage } from '@/utils/store'

import { batchDownloadPublicImageURL } from '@/utils/helper'

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
  setMeetingsData({ commit }, params) {
    commit('setMeetingsData', params)
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
  async getMeetingsFamilyDetail(_, params) {
    try {
      const res = await http.getMeetingsFamilyDetail(params)

      if (res) {
        const {
          familyIdCardBack,
          familyIdCardFront,
          familyRelationalProofUrl,
          familyRelationalProofUrl2,
          familyRelationalProofUrl3,
          familyRelationalProofUrl4,
          meetNoticeUrl
        } = res.family

        const urls = {
          familyIdCardBack,
          familyIdCardFront,
          familyRelationalProofUrl,
          familyRelationalProofUrl2,
          familyRelationalProofUrl3,
          familyRelationalProofUrl4,
          meetNoticeUrl
        }

        const _key = `familyId_${ params['familyId'] }`

        const URLS = await batchDownloadPublicImageURL(urls, _key)

        res.family = {
          ...res.family,
          ...URLS
        }
      }

      return res
    }
    catch (err) {
      Promise.reject(err)
    }
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
  meetingCostCommonAction({ commit }, payload) {
    if (payload && payload.meetingDistances && payload.meetingDistances.length) {
      const _user = getUserStorage()
      const _text = '总计：'
      let _row = {}
      if (_user.role === '0') {
        if (payload.actype) {
          _row = {
            provinceName: _text
          }
        }
      }
      else {
        if (payload.actype === 'INDIVIDUAL') {
          _row = {
            familyName: _text
          }
        }
        else {
          _row = {
            provinceName: _text
          }
        }
      }
      payload.meetingDistances.push(
        Object.assign(
          {
            distance: payload.totalDistance,
            saveMoney: payload.totalSaveMoney
          },
          _row
        )
      )
    }
    commit('setMeetingCostSaving', payload)
  },
  async getMeetingCostSavingIndividual({ dispatch, commit }, payload) {
    const data = await repeatAPI.getMeetingCostSavingIndividual(payload)
    data.meetingDistances = data.personalDimensions
    data.actype = 'INDIVIDUAL'
    // commit('setMeetingCostSaving', data || {})
    dispatch('meetingCostCommonAction', data || {})
    return data
  },
  async getMeetingCostSavingPrisonArea({ dispatch, commit }, payload) {
    const data = await repeatAPI.getMeetingCostSavingPrisonArea(payload)
    data.actype = 'PRISON_AREA'
    // commit('setMeetingCostSaving', data || {})
    dispatch('meetingCostCommonAction', data || {})
    return data
  },
  async getMeetingCostSavingPrison({ dispatch, commit }, payload) {
    const data = await repeatAPI.getMeetingCostSavingPrison(payload)
    // commit('setMeetingCostSaving', data || {})
    dispatch('meetingCostCommonAction', data || {})
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
            durationConcat: itemData['durationConcat'][index],
            conferenceIdConcat: itemData['conferenceIdConcat'][index]
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
  },

  async getPagedFreeMeetingsFamilyPhone({ commit }, params) {
    try {
      const { data = {} } = await repeatAPI.getPagedFreeMeetingsFamilyPhone(params)

      const { total = 0, familyPhone = [] } = (Object.prototype.toString.call(data) === '[object Object]' && data) || {}

      commit('setFreeMeetingsFamilyPhone', { total, contents: familyPhone })

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async getUnusualMeetingPage({ commit }, args) {
    try {
      const { data = {} } = await repeatAPI.getUnusualMeetingPage(args)

      const { total = 0, meetings = [] } = (Object.prototype.toString.call(data) === '[object Object]' && data) || {}

      commit('getMeetings', { total, meetings })

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}
