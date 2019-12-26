const PATHS_UN_SHOW_SUCCESS_TIP = ['/prison_config/getPrisonConfigs']

export function showSuccessTip(url) {
  return PATHS_UN_SHOW_SUCCESS_TIP.every(path => {
    return !new RegExp(path, 'i').test(url)
  })
}
