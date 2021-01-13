import http from '@/service'

export default {
  getWhitemembers: async({ commit }, params) => {
    try {
      const { total, familyWhiteLists } = await http.getWhitemembers(params)

      commit('getWhitemembers', { contents: familyWhiteLists, total })

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  deleteWhitemember: async(_, params) => {
    try {
      const isSuccess = await http.deleteWhitemember(params)

      return isSuccess
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  addWhitemember: async(_, params) => {
    try {
      const isSuccess = await http.addWhitemember(params)

      return isSuccess
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  updateWhitemember: async(_, params) => {
    try {
      const isSuccess = await http.updateWhitemember(params)

      return isSuccess
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}
