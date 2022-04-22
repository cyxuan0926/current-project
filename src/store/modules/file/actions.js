import { downloadPublicServiceFile } from '@/service-public/api/file'
import { createObjectURL } from '@/utils/helper'
import urls from '@/service/urls'

export default {
  async downloadPublicServiceFile(_, { url, attachment }) {
    try {
      const data = await downloadPublicServiceFile(url, attachment)
      const URL = data ? createObjectURL(data) : `${ url }?token=${ urls.token }`

      return URL
    } catch (err) {
      Promise.reject(err)
    }
  }
}
