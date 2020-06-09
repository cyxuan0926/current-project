import { get } from '../config/service'

export default {
  getPageData: (url, params) => {
    return get(url, params)
  }
}
