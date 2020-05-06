import coopertivePartnerAPI from '@/service/modules/coopertive-partner'

export default {
  async getPageData({ commit }, configs) {
    try {
      const { url, params } = configs

      const response = await coopertivePartnerAPI.getPageData(url, params)

      if (response) {
        const { content = [], totalElements = 0 } = response

        commit('setPageData', { content, totalElements })
      }

      return response
    }
    catch (err) {
      throw err
    }
  }
}
