import api from '@/service/modules/global'
import repeatAPI from '@/service/modules/repeat'
import { Message } from 'element-ui'
import { initStore } from '@/common/constants/prisons'
import { setGuideStorage, setAffairsStorage, setAffairsModule, setXmlStorage } from '@/utils/store'
import http from '@/service'

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

      if (urls.indexOf(decodeURI(decodeURI(a.lastElementChild.src.split('?token=')[0]))) < 0) {
        urls.push(decodeURI(a.lastElementChild.src.split('?token=')[0]))
      }
    })
  }

  return urls
}

export default {
  setUser({ commit }, params) {
    commit('setUser', params)
  },

  resetState: ({ commit }, params) => {
    if (!params) {
      return
    }

    commit('resetState', params)
  },

  setUrlStorage(_, params) {
    const urls = getUrls(params)
    const urlStorage = localStorage.getItem('urls') ? JSON.parse(localStorage.getItem('urls')) : []
    const u = Array.from(new Set([...urls, ...urlStorage]))

    localStorage.setItem('urls', JSON.stringify(u))
  },

  setNewUrlStorage(_, params) {
    const urls = getUrls(params)
    const urlStorage = localStorage.getItem('newUrls') ? JSON.parse(localStorage.getItem('newUrls')) : []
    const u = Array.from(new Set([...urls, ...urlStorage]))

    localStorage.setItem('newUrls', JSON.stringify(u))
  },

  removeUrlStorage({ state, dispatch }) {
    if (state.urlStorage && localStorage.getItem('newUrls')) {
      localStorage.removeItem('newUrls')
    } else if (!state.urlStorage && localStorage.getItem('newUrls')) {
      dispatch('deleteUrls', { urls: JSON.parse(localStorage.getItem('newUrls')), destroyed: true })
    } else if (!state.urlStorage) {
      localStorage.removeItem('urls')
      localStorage.removeItem('save')
    }
  },

  deleteUrls({ commit, state }, params) {
    let urlStorage = JSON.parse(localStorage.getItem('urls')) || JSON.parse(localStorage.getItem('save')) || []
    let deleteUrls
    let urls

    if (JSON.parse(localStorage.getItem('save'))) {
      urlStorage = Array.from(new Set(urlStorage.concat(JSON.parse(localStorage.getItem('save')))))
    }

    if (!state.urlStorage) {
      commit('setUrlStorage', true)
    }

    if (params.destroyed) {
      urlStorage = params.urls
    } else {
      urls = getUrls(params)
      urls.forEach(url => {
        if (urlStorage.includes(url)) {
          urlStorage.splice(urlStorage.findIndex(u => u === url), 1)
        }
      })
    }

    if (localStorage.getItem('newUrls')) {
      localStorage.removeItem('newUrls')
    }

    deleteUrls = localStorage.getItem('delete') ? JSON.parse(localStorage.getItem('delete')) : []
    urlStorage = [...urlStorage, ...deleteUrls]

    if (urlStorage.length) {
      api.deleteUrls(urlStorage).then(res => {
        if (!res) {
          localStorage.setItem('delete', JSON.stringify(urlStorage))
        } else {
          localStorage.removeItem('delete')
        }

        localStorage.removeItem('urls')
        commit('setUrlStorage', false)
      })
    } else {
      localStorage.removeItem('urls')
      commit('setUrlStorage', false)
    }

    if (params.save) {
      localStorage.setItem('save', JSON.stringify(urls))
    }
  },

  // 上传文件
  uploadFile({ commit }, params) {
    let formData = new FormData()
    params && formData.append('file', params)

    return api.uploadFile(formData).then(res => {
      if (!res) {
        return
      }

      commit('uploadFile', res)
      return true
    })
  },

  // 初级授权
  async firstLevelAuthorize({ commit }, inputs) {
    try {
      const { url, params, mutationName } = inputs
      const { code } = await repeatAPI.firstLevelAuthorize({ url, params })
      const isSuccess = code === 200

      commit(mutationName, isSuccess)

      return isSuccess
    } catch (err) {
      Promise.reject(err)
    }
  },

  async getJailsMeetingFloorStatus({ commit }, jailId) {
    try {
      const { data } = await repeatAPI.getJailsMeetingFloorStatus(jailId)
      Message.closeAll()
      commit('setJailsMeetingFloorStatus', !!data)

      return data
    } catch (err) {
      Promise.reject(err)
    }
  },

  setGuideStorage({ commit }, storage = initStore.APP_GUIDE_DATA()) {
    setGuideStorage(storage)
    commit('SET_GUIDE_STORAGE', storage)
  },

  setAffairsStorage({ commit }, storage = initStore.APP_AFFAIRS_DATA()) {
    setAffairsStorage(storage)
    commit('SET_AFFAIRS_STORAGE', storage)
  },

  setAffairsModule({ commit }, storage = initStore.APP_AFFAIRS_MODULE_DATA()) {
    setAffairsModule(storage)
    commit('SET_AFFAIRS_MODULE', storage)
  },

  setXmlStorage({ commit }, storage = initStore.APP_AFFAIRS_MODULE_DATA()) {
    setXmlStorage(storage)
    commit('SET_XML_STORAGE', storage)
  },

  // 获取当前任务的下一任务
  async getSubtaskPhone({ commit }, params) {
    try {
      const data = await http.getSubtaskPhone(params)
      commit('setSubtaskPhone', data || [])

      return true
    } catch (err) {
      Promise.reject(err)
    }
  },

  // 获取当前节点任务
  async getProcessTask({ commit }, processInstanceId) {
    try {
      const data = await http.getProcessTask(processInstanceId)
      const currentProcessTaskInformation = data ? (data['data'] || {}) : {}
      commit('setCurrentProcessTaskInformation', currentProcessTaskInformation)

      return true
    } catch (err) {
      Promise.reject(err)
    }
  },

  // 判断是否是同一个审批流
  async getIsSameProcessDefinition({ commit }, instanceIds) {
    try {
      const response = await http.getIsSameProcessDefinition(instanceIds)
      const isSame = response && response['code'] === 200 && response['data']
      commit('setIsSameProcessDefinition', isSame)

      return true
    } catch (err) {
      Promise.reject(err)
    }
  }

  // 修改用户名密码的方法
  // modifyPassword({ commit }, regs) {
  //   let params = {
  //     old_password: regs.password,
  //     new_password: regs.new_password
  //   }
  //   api.modifyPassword(params).then(res => res.code === 200 && commit('modifyPassword', res)).catch(err => console.log(err))
  // }
}
