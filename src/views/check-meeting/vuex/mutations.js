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
        console.log(parseInt(params), '需要刷新')
      }
      else {
        state.meetingRefresh = false
        console.log(parseInt(params), 'meetings有值但该会见不在meetings中', state.meetings.contents[0].id)
      }
    }
    else {
      state.meetingRefresh = false
      console.log(params, '没有params')
    }
  },
  meetingAdjustDealing(state, params) {
    state.meetingAdjustRefresh = params
  }
}
