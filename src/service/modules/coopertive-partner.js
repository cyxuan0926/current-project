import { getFinance } from '@/service-public/request'

export default {
  getPageData: (url, params) => getFinance(url, params)
}
