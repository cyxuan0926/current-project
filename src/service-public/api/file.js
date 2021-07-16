import { get } from '../request'

export const downloadPublicServiceFile = (filename, attachment = true) => {
  const responseType = 'blob'

  return get(`/files/${filename}`, { attachment }, { responseType })
}