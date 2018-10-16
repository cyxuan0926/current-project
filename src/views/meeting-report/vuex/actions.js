import http from '@/service'

export default {
  getPrisonReportList: ({ commit }, params) => {
    http.getPrisonReportList(params).then(res => res && commit('getPrisonReportList', res))
  },
  getPrisonAreaReportList: ({ commit }, params) => {
    http.getPrisonAreaReportList(params).then(res => res && commit('getPrisonAreaReportList', res))
  }
}
