export default {
  getMeetings(state, params) {
    const { meetings } = params
    const data = meetings.map(meeting => {
      meeting.filterFamilies = []
      if (meeting.families && meeting.families.length) meeting.filterFamilies = meeting.families.slice(0)
      else meeting.filterFamilies = [{ familyId: meeting.familyId, familyName: meeting.name }]
      return meeting
    })
    state.meetings.contents = data
    state.meetings.total = params.total
  },
  getMeetingConfigs(state, params) {
    state.meetingAdjustment.config = params.config
    state.meetingAdjustment.meetingQueue = params.meetingQueue
    state.meetingAdjustment.terminals = params.terminals
    state.meetingAdjustment.meetings = params.meetings
  },
  getFreeMeetings(state, params) {
    state.freeMeetings = params
  },
  meetingApplyDealing(state, params) {
    if (params && state.meetings.contents.length) {
      if (state.meetings.contents.find(m => m.id === parseInt(params))) state.meetingRefresh = parseInt(params)
      else state.meetingRefresh = false
    }
    else state.meetingRefresh = false
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
