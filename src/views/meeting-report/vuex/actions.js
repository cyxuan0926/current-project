import http from '@/service'

export default {
  getPrisonReportList: ({ commit }, params) => {
    http.getPrisonReportList(params).then(res => res && commit('getPrisonReportList', res))
  },
  getPrisonAreaReportList: ({ commit }, params) => {
    return http.getPrisonAreaReportList(params).then(res => {
      if (!res) return
      commit('getPrisonAreaReportList', res)
      return true
    })
  }
}
