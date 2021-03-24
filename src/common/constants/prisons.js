// 监狱范围内的常量
export default {
  PRISONAREA: {
    belong: { value: 'name', label: 'name' }
  }
}

export const initStore = {
  APP_AFFAIRS_DATA() {
    return {
      headline: '',
      subhead: '',
      content: '',
      videoUrl: '',
      seq: 0
    }
  },
  APP_AFFAIRS_MODULE_DATA() {
    return []
  },
  APP_GUIDE_DATA() {
    return {
      content: '',
      guide: '',
      updatedTime: '',
      preContent: ''
    }
  }
}
