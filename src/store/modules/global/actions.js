import api from '@/service/modules/global'

// 获取解析url
const getUrls = (params) => {
  let { urls, contents } = params
  for (var i = 0; i < urls.length; i++) {
    if (!urls[i]) {
      urls.splice(i, 1)
      i--
    }
  }
  if (contents && contents.match(/<img.*? \/>|<source.*? \/>/g)) {
    contents.match(/<img.*? \/>|<source.*? \/>/g).forEach(ele => {
      let a = document.createElement('div')
      a.innerHTML = ele
      if (urls.indexOf(decodeURI(decodeURI(a.lastElementChild.src.split('?token=')[0]))) < 0) urls.push(decodeURI(a.lastElementChild.src.split('?token=')[0]))
    })
  }
  return urls
}
export default {
  setUser({ commit }, params) {
    commit('setUser', params)
  },
  resetState: ({ commit }, params) => {
    if (!params) return
    commit('resetState', params)
  },
  // 保存urls到localstorage
  setUrlStorage({ commit }, params) {
    let urls = getUrls(params),
      urlStorage = localStorage.getItem('urls') ? JSON.parse(localStorage.getItem('urls')) : [],
      u = Array.from(new Set([...urls, ...urlStorage])) // 去重之后 转换为纯数组
    localStorage.setItem('urls', JSON.stringify(u))
  },
  // 把新的urls保存的localstorage
  setNewUrlStorage({ commit }, params) {
    let urls = getUrls(params),
      urlStorage = localStorage.getItem('newUrls') ? JSON.parse(localStorage.getItem('newUrls')) : [],
      u = Array.from(new Set([...urls, ...urlStorage]))
    localStorage.setItem('newUrls', JSON.stringify(u))
  },
  // 删除url state.urlStorage
  removeUrlStorage({ state, dispatch }) {
    if (state.urlStorage && localStorage.getItem('newUrls')) {
      console.log(1)
      localStorage.removeItem('newUrls')
    }
    else if (!state.urlStorage && localStorage.getItem('newUrls')) {
      console.log(2)
      dispatch('deleteUrls', { urls: JSON.parse(localStorage.getItem('newUrls')), destroyed: true })
    }
    else if (!state.urlStorage) {
      localStorage.removeItem('urls')
      localStorage.removeItem('save')
    }
  },
  // 删除图片
  deleteUrls({ commit }, params) {
    let deleteUrls, urls, urlStorage = JSON.parse(localStorage.getItem('urls')) || JSON.parse(localStorage.getItem('save')) || []
    if (JSON.parse(localStorage.getItem('save'))) {
      urlStorage = Array.from(new Set(urlStorage.concat(JSON.parse(localStorage.getItem('save')))))
    }
    commit('setUrlStorage', true)
    if (params.destroyed) {
      urlStorage = params.urls
    }
    else {
      urls = getUrls(params)
      urls.forEach((url) => {
        if (urlStorage.includes(url)) {
          urlStorage.splice(urlStorage.findIndex(u => u === url), 1)
        }
      })
    }
    localStorage.removeItem('newUrls')
    deleteUrls = localStorage.getItem('delete') ? JSON.parse(localStorage.getItem('delete')) : []
    urlStorage = [...urlStorage, ...deleteUrls]
    if (urlStorage.length) {
      api.deleteUrls(urlStorage).then(res => {
        if (!res) {
          localStorage.setItem('delete', JSON.stringify(urlStorage))
        }
        else {
          localStorage.removeItem('delete')
        }
        localStorage.removeItem('urls')
        commit('setUrlStorage', false)
      })
    }
    else {
      localStorage.removeItem('urls')
      commit('setUrlStorage', false)
    }
    if (params.save) localStorage.setItem('save', JSON.stringify(urls))
  },
  // 上传文件
  uploadFile({ commit }, params) {
    let formData = new FormData()
    params && formData.append('file', params)
    return api.uploadFile(formData).then(res => {
      if (!res) return
      commit('uploadFile', res)
      return true
    })
  },
  // 修改用户名密码的方法
  modifyPassword({ commit }, regs) {
    let params = {
      old_password: regs.password,
      new_password: regs.new_password
    }
    api.modifyPassword(params).then(res => res.code === 200 && commit('modifyPassword', res)).catch(err => console.log(err))
  }
}
