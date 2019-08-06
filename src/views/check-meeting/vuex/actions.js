import http from '@/service'

export default {
  getMeetings({ commit }, params) {
    return http.getMeetings(params).then(res => {
      if (!res) return
      commit('getMeetings', res)
      return true
    })
  },
  authorizeMeeting({ commit }, params) {
    return http.authorizeMeeting(params).then(res => res)
  },
  withdrawMeeting({ commit }, params) {
    return http.withdrawMeeting(params).then(res => res)
  },
  getMeetingConfigs({ commit }, params) {
    return http.getMeetingConfigs(params).then(res => {
      if (!res) return
      commit('getMeetingConfigs', res)
      return true
    })
  },
  adjustMeeting({ commit }, params) {
    return http.adjustMeeting(params).then(res => res)
  },
  getFreeMeetings({ commit }, params) {
    http.getFreeMeetings(params).then(res => res && commit('getFreeMeetings', res))
  },
  getMeetingsFamilyDetail({ commit }, params) {
    return http.getMeetingsFamilyDetail(params).then(res => res)
  },
  getMeettingsDetail({ commit }, params) {
    return http.getMeettingsDetail(params).then(res => res)
  },
  meetingApplyDealing({ commit }, params) {
    commit('meetingApplyDealing', params)
  },
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
  }
}
