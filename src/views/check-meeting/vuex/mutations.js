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
  getMeetingsDiplomats(state, params) {
    const { meetings } = params
    const data = meetings.map(meeting => {
      meeting.filterFamilies = []
      if (meeting.families && meeting.families.length) meeting.filterFamilies = meeting.families.slice(0)
      else meeting.filterFamilies = [{ familyId: meeting.familyId, familyName: meeting.name }]
      return meeting
    })
    state.meetingsDiplomats.contents = data
    state.meetingsDiplomats.total = params.total
  },
  getMeetingConfigs(state, params) {
    state.meetingAdjustment.config = params.config
    state.meetingAdjustment.meetingQueue = params.meetingQueue
    state.meetingAdjustment.specialQueue = params.specialQueue
    state.meetingAdjustment.meetings = params.meetings
    state.meetingAdjustment.terminals = params.terminals
    state.meetingAdjustment.separateByArea = params.separateByArea
  },
  getFreeMeetings(state, params) {
    state.freeMeetings = params
  },
  setMeetingsData(state, payload) {
    state.meetingAdjustment.meetings = payload
  },
  meetingApplyDealing(state, params = []) {
    if (params && state.meetings.contents.length) {
      // if (state.meetings.contents.find(m => m.id === parseInt(params))) state.meetingRefresh = parseInt(params)
      if (state.meetings.contents.find(m => params.includes(m.id))) state.meetingRefresh = parseInt(params)
      else state.meetingRefresh = false
    }
    else state.meetingRefresh = false
  },
  // 会见调整处理
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
  setFamilyMeetingDetail: (state, FamilyMeetingDetail) => {
    state.getFamilyMeetingDetail = FamilyMeetingDetail
  },

  setgdmeetingStatisticTotalItem: (state, gdmeetingStatisticTotalItem) => {
    state.gdmeetingStatisticTotalItem = gdmeetingStatisticTotalItem
  },
  setMeetingStatisticTotalItem: (state, meetingStatisticTotalItem) => {
    state.meetingStatisticTotalItem = meetingStatisticTotalItem
  },
  setMeetingCallRecords: (state, meetingCallRecords) => {
    const { filterMeetingCallRecords, meetingCallRecordsSize } = meetingCallRecords
    state.meetingCallRecords.total = meetingCallRecordsSize
    state.meetingCallRecords.contents = _.flattenDepth(filterMeetingCallRecords)
  },
  setMeetingTimes: (state, meetingTimes) => {
    state.meetingTimes = meetingTimes
  },

  setIsSuccessFirstLevelSubmitMeeting(state, isSuccessFirstLevelSubmitMeeting) {
    state.isSuccessFirstLevelSubmitMeeting = isSuccessFirstLevelSubmitMeeting
  },

  setFreeMeetingsFamilyPhone(state, freeMeetingsFamilyPhone) {
    state.freeMeetingsFamilyPhone = Object.assign({}, freeMeetingsFamilyPhone)
  }
}
