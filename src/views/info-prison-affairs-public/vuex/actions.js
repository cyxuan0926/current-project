import http from '@/service'

export default {
  // 获取狱务公开信息
  getNewsList: ({ commit }, params) => {
    return http.getNewsList(params).then(res => {
      if (!res) return false
      if (res.news && res.news.length) {
        res.news.forEach(news => { news.ellipsis = false })
      }
      commit('getNewsList', Object.assign({}, res))
      return true
    })
  },
  getNewsDetail: ({ commit }, params) => {
    return http.getNewsDetail(params).then(res => {
      if (!res || res.code !== 200) return
      commit('getNewsDetail', res)
      return true
    })
  },
  // 编辑狱务公开信息
  editNews({ commit, dispatch }, params) {
    return http.editNews(params).then(res => {
      if (res.code !== 200) return
      let excpt = []
      params.imageUrl && excpt.push(params.imageUrl)
      params.audioPath && excpt.push(params.audioPath)
      params.videoPath && excpt.push(params.videoPath)
      dispatch('deleteUrls', { urls: [params.imageUrl, params.audioPath, params.videoPath], contents: params.contents })
      return true
    })
  },
  // 添加狱务公开信息
  addNews({ commit, dispatch }, params) {
    return http.addNews(params).then(res => {
      if (res.code !== 200) return
      let excpt = []
      params.imageUrl && excpt.push(params.imageUrl)
      params.audioPath && excpt.push(params.audioPath)
      params.videoPath && excpt.push(params.videoPath)
      dispatch('handleDeleteImage', [excpt, params.contents])
      return true
    })
  },
  // 根据id删除狱务公开信息
  deleteNews({ commit }, params) {
    return http.deleteNews(params).then(res => res.code === 200)
  }
}
