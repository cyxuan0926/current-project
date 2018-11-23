import http from '@/service'

export default {
  getPrisons: ({ commit }, params) => {
    http.getPrisons(params).then(res => res && commit('getPrisons', res))
  },
  addPrison: ({ commit }, params) => {
    return http.addPrison(params).then(res => res)
  },
  getPrisonDetail: ({ commit }, params) => {
    return http.getPrisonDetail(params).then(res => {
      if (!res) return
      let regs = res.jails
      if (regs) {
        regs.usual = []
        regs.meetingQueue.forEach(queue => {
          regs.usual.push(queue.split('-'))
        })
        regs.weekend = [null]
        if (regs.weekendQueue) {
          regs.weekend = []
          regs.weekendQueue.forEach(queue => {
            regs.weekend.push(queue.split('-'))
          })
        }
        regs.special = [{ date: '', queue: [null] }]
        if (regs.specialQueue) {
          regs.special = []
          regs.specialQueue.forEach(queue => {
            let day = { date: queue.day, queue: [] }
            queue.config.forEach(q => {
              day.queue.push(q.split('-'))
            })
            regs.special.push(day)
          })
        }
      }
      commit('getPrisonDetail', regs)
      return true
    })
  },
  updatePrison: ({ commit, dispatch }, params) => {
    delete params.usual
    delete params.weekend
    delete params.special
    return http.updatePrison(params).then(res => {
      let excpt = []
      params.imageUrl && excpt.push(params.imageUrl)
      params.audioPath && excpt.push(params.audioPath)
      params.videoPath && excpt.push(params.videoPath)
      dispatch('handleDeleteImage', [excpt, params.description])
      return res
    })
  }
}
