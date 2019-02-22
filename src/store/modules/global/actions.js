import api from '@/service/modules/global'

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
  setUrlStorage({ commit }, params) {
    let urls = getUrls(params),
      urlStorage = localStorage.getItem('urls') ? JSON.parse(localStorage.getItem('urls')) : [],
      u = Array.from(new Set([...urls, ...urlStorage]))
    localStorage.setItem('urls', JSON.stringify(u))
  },
  setNewUrlStorage({ commit }, params) {
    let urls = getUrls(params),
      urlStorage = localStorage.getItem('newUrls') ? JSON.parse(localStorage.getItem('newUrls')) : [],
      u = Array.from(new Set([...urls, ...urlStorage]))
    localStorage.setItem('newUrls', JSON.stringify(u))
  },
  removeUrlStorage({ state, dispatch }) {
    console.log(111, state.urlStorage)
    if (state.urlStorage && localStorage.getItem('newUrls')) {
      localStorage.removeItem('newUrls')
      console.log(222)
    }
    else if (!state.urlStorage && localStorage.getItem('newUrls')) {
      dispatch('deleteUrls', { urls: JSON.parse(localStorage.getItem('newUrls')), destroyed: true })
      console.log(333)
    }
    else if (!state.urlStorage) {
      localStorage.removeItem('urls')
      localStorage.removeItem('save')
      console.log(444)
    }
  },
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
    console.log(urlStorage, params.save)
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
      console.log(999)
      localStorage.removeItem('urls')
      commit('setUrlStorage', false)
    }
    if (params.save) localStorage.setItem('save', JSON.stringify(urls))
  }
}
