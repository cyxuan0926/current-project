import http from '@/service'

export default {
  getPrisonReportList: ({ commit }, params) => {
    http.getPrisonReportList(params).then(res => res && commit('getPrisonReportList', res))
  },
  getPrisonReportDetail: ({ commit }, params) => {
    http.getPrisonReportDetail(params).then(res => res && commit('setPrisonReportDetail', res))
  },
  getPrisonAreaReportList: ({ commit }, params) => {
    return http.getPrisonAreaReportList(params).then(res => {
      if (!res) return
      commit('getPrisonAreaReportList', res)
      return true
    })
  }
}
