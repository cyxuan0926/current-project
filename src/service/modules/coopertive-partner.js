import { getFinance } from '@/service-public/request'

export default {
  getPageData: (url, params) => {
    return getFinance(url, params)
  }
}
