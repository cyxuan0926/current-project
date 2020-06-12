import diplomaticConsulOfficialAPI from '@/service/modules/diplomatic-consul-official'

export default {
  async getPageData({ commit }, configs) {
    try {
      const { url, params } = configs

      const { data } = await diplomaticConsulOfficialAPI.getPageData(url, params)

      if (data) {
        const { registrations = [], total = 0 } = data

        const urlsParams = ['idCardFront', 'idCardBack', 'avatarUrl']

        const titles = {
          0: '身份证正面',
          1: '身份证反面',
          2: '头像'
        }

        registrations.map(item => {
          item.diplomaticConsulOfficialUrls = []

          urlsParams.forEach((url, index) => {
            item[url] && item.diplomaticConsulOfficialUrls.push({
              url: item[url],
              title: titles[index],
              type: index
            })
          })
        })

        commit('setPageData', { registrations, total })
      }

      return data
    }
    catch (err) {
      throw err
    }
  },

  async registrationAuthorize({ commit }, params) {
    try {
      const res = await diplomaticConsulOfficialAPI.registrationAuthorize(params)

      return res
    }
    catch (err) {
      throw err
    }
  }
}
