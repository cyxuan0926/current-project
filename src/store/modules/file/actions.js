import { downloadPublicServiceFile } from '@/service-public/api/file'

import { createObjectURL } from '@/utils/helper'

export default {
  async downloadPublicServiceFile({ commit }, { url, attachment }) {
    try {
      const data = await downloadPublicServiceFile(url, attachment)

      const URL = data ? createObjectURL(data) : ''

      commit('setPublicServiceFileUrl', URL)

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}
