export default {
  getMeetings(state, params) {
    state.meetings.contents = params.meetings
    state.meetings.total = params.total
  },
  getMeetingConfigs(state, params) {
    state.meetingAdjustment.config = params.config
    state.meetingAdjustment.meetingQueue = params.meetingQueue
    state.meetingAdjustment.terminals = params.terminals
    state.meetingAdjustment.meetings = params.meetings
  },
  getFreeMeetings(state, params) {
    state.freeMeetings = {
      contents: params.freeMeetings,
      total: params.total
    }
  },
  meetingApplyDealing(state, params) {
    if (params && state.meetings.contents.length) {
      if (state.meetings.contents.find(m => m.id === parseInt(params))) {
        state.meetingRefresh = parseInt(params)
      }
      else {
        state.meetingRefresh = false
      }
    }
    else {
      state.meetingRefresh = false
    }
  },
  meetingAdjustDealing(state, params) {
    state.meetingAdjustRefresh = params
  },
  getVisits(state, params) {
    state.visits.contents = params.visits
    state.visits.total = params.total
  },
  setMeetingCostSaving(state, payload) {
    state.meetingCostSaving.total = payload.total || 0
    state.meetingCostSaving.meetingDistances = payload.meetingDistances || []
  },
  setMeetingStatistics: (state, meetingStatistics) => {
    state.meetingStatistics = meetingStatistics
  },
  setMeetingStatisticTotalItem: (state, meetingStatisticTotalItem) => {
    state.meetingStatisticTotalItem = meetingStatisticTotalItem
  }
}
