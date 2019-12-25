// 监狱范围内的常量
export default {
  PRISONAREA: {
    options: (JSON.parse(localStorage.getItem('user')).prisonConfigList || []),
    belong: { value: 'prisonConfigName', label: 'prisonConfigName' }
  }
}
