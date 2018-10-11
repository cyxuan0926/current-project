export default {
  getPrisonReportList(state, params) {
    state.prisonReportList.contents = params.report
    state.prisonReportList.total = params.total
  },
  getPrisonAreaReportList(state, params) {
    state.prisonAreaReportList.contents = params.report
    state.prisonAreaReportList.total = params.total
  }
}
