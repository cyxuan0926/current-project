import http from '@/service'

export default {
  // 获取狱务公开信息
  getNewsList: ({ commit }, params) => {
    http.getNewsList(params).then(res => res && commit('getNewsList', res))
  },
  getNewsDetail: ({ commit }, params) => {
    return http.getNewsDetail(params).then(res => {
      if (!res || res.code !== 200) return
      commit('getNewsDetail', res)
      let images = res.data.imageUrl ? [res.data.imageUrl] : []
      if (res.data.contents.match(/<img.*? \/>/g)) {
        res.data.contents.match(/<img.*? \/>/g).forEach(ele => {
          let a = document.createElement('div')
          a.innerHTML = ele
          if (images.indexOf(a.lastElementChild.src.split('?token=')[0]) < 0) images.push(a.lastElementChild.src.split('?token=')[0])
        })
        localStorage.setItem('images', JSON.stringify(images))
      }
      return true
    })
  },
  // 编辑狱务公开信息
  editNews({ commit, dispatch }, params) {
    return http.editNews(params).then(res => {
      if (res.code !== 200) return
      dispatch('handleDeleteImage', [params.imageUrl, params.contents])
      return true
    })
  },
  // 添加狱务公开信息
  addNews({ commit, dispatch }, params) {
    return http.addNews(params).then(res => {
      if (res.code !== 200) return
      dispatch('handleDeleteImage', [params.imageUrl, params.contents])
      return true
    })
  },
  // 根据id删除狱务公开信息
  deleteNews({ commit }, params) {
    return http.deleteNews(params).then(res => res.code === 200)
  }
}
