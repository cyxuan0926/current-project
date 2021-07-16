import { downloadPublicServiceFile } from '@/service-public/api/file'

import { createObjectURL } from '@/utils/helper'

export default {
  async downloadPublicServiceFile({ commit }, { filename, attachment }) {
    try {
      const data = await downloadPublicServiceFile(filename, attachment)

      const url = createObjectURL(data)

      commit('setPublicServiceFileUrl', url)

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}
