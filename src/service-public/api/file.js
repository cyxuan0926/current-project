import { get } from '../request'

export const downloadPublicServiceFile = (url, attachment = true) => {
  const responseType = 'blob'
  return get(url, { attachment }, { responseType })
}

