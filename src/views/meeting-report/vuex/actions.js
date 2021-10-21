import http from '@/service'

export default {
  getPrisonReportList: ({ commit }, params) => {
    http.getPrisonReportList(params).then(res => res && commit('getPrisonReportList', res))
  },
  getNewPrisonReportList: ({ commit }, params) => {
    http.getNewPrisonReportList(params).then(res => res && commit('getPrisonReportList', res))
  },
  getPrisonReportListAll: ({ commit }, params) => {
    http.getPrisonReportListAll(params).then(res => res && commit('getPrisonReportList', res))
  },
  getPrisonReportDetail: ({ commit }, params) => {
    http.getPrisonReportDetail(params).then(res => res && commit('setPrisonReportDetail', res))
  },
  getPrisonReportDetailAll: ({ commit }, params) => {
    http.getPrisonReportDetailAll(params).then(res => res && commit('setPrisonReportDetail', res))
  },
  getPrisonAreaReportList: ({ commit }, params) => {
    const { page, rows } = params
    return http.getPrisonAreaReportList(params).then(res => {
      if (!res) return
      const { total } = res

      let { report } = res

      if (Math.ceil(total / rows) === page) {
        let lastItem = report[report.length - 1]

        report.splice(-1, 1)

        lastItem = {
          ...lastItem,
          prisonArea: '',
          prisonerName: '总计',
          $isSpecialTotalCol: true
        }
        report = [...report, lastItem]
      }

      commit('getPrisonAreaReportList', { report, total })

      return true
    })
  },
  getPrisonAreaReportListAll: ({ commit }, params) => {
    return http.getPrisonAreaReportListAll(params).then(res => {
      if (!res) return
      commit('getPrisonAreaReportList', res)
      return true
    })
  }
}
