import diplomaticConsulOfficialAPI from '@/service/modules/diplomatic-consul-official'

export default {
  async getPageData({ commit }, configs) {
    try {
      const { url, params } = configs

      const response = await diplomaticConsulOfficialAPI.getPageData(url, params)

      if (response) {
        const { content = [], totalElements = 0 } = response

        const urlsParams = ['', '', '']

        const titles = {
          0: '身份证正面',
          1: '身份证反面',
          2: '头像'
        }

        content.map(item => {
          item.diplomaticConsulOfficialUrls = []

          urlsParams.forEach((url, index) => {
            item[url] && item.diplomaticConsulOfficialUrls.push({
              url: item[url],
              title: titles[index],
              type: index
            })
          })
        })

        commit('setPageData', { content, totalElements })
      }

      return response
    }
    catch (err) {
      throw err
    }
  }
}
