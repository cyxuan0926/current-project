import diplomaticConsulOfficialAPI from '@/service/modules/diplomatic-consul-official'

export default {
  async getPageData({ commit }, configs) {
    try {
      const { url, params } = configs

      const response = await diplomaticConsulOfficialAPI.getPageData(url, params)

      if (response && response['data']) {
        const { data } = response
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
            // item[url] &&
            item.diplomaticConsulOfficialUrls.push({
              url: item[url],
              title: titles[index],
              type: index
            })
          })
        })

        commit('setPageData', { registrations, total })
      }

      return response
    }
    catch (err) {
      throw err
    }
  },

  async registrationAuthorize({ commit }, params) {
    try {
      const response = await diplomaticConsulOfficialAPI.registrationAuthorize(params)

      const isSucess = response ? response['code'] === 200 : response

      return isSucess
    }
    catch (err) {
      throw err
    }
  }
}
