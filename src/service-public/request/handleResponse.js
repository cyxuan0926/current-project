import { Message } from 'element-ui'

const tip = (message = '操作失败！', type = 'error') => {
  Message({ type, message, duration: 3000, showClose: true })
}

const responseHandlers = {
  200: res => {},
  201: res => {},
  204: res => {},
  400: res => {
    res.data && tip(res.data.message)
  },
  401: res => {
    res.data && tip(res.data.message)
  },
  403: res => {
    res.data && tip(res.data.message)
  },
  404: res => {
    res.data && tip(res.data.message)
  },
  500: res => {
    res.data && tip(res.data.message)
  }
}

export default res => {
  console.log('res', res)
  responseHandlers[res.status](res)
}
