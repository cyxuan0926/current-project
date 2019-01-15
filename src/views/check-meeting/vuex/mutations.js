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
      if (state.meetings.contents.find(m => m.id === params)) state.meetingRefresh = params
      else state.meetingRefresh = false
    }
    else {
      state.meetingRefresh = false
    }
    console.log(state.meetingRefresh)
  }
}
