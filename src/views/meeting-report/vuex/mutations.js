export default {
  getPrisonReportList(state, params) {
    state.prisonReportList.contents = params.report
    state.prisonReportList.total = params.total
  },
  setPrisonReportDetail(state, prisonReportDetail) {
    state.prisonReportDetail = prisonReportDetail
    // state.prisonReportDetail.contents = prisonReportDetail.meetingDetails
    // state.prisonReportDetail.total = prisonReportDetail.total
  },
  getPrisonAreaReportList(state, params) {
    state.prisonAreaReportList.contents = params.report
    state.prisonAreaReportList.total = params.total
  }
}
