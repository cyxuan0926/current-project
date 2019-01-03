import * as service from '@/service/config/service'

export default {
  getMailboxes: params => {
    return service.get('/mailboxes/page', params).then(res => res && res.data)
  },
  getMailboxTypes: () => {
    return service.get('/mailboxes/types').then(res => res && res.data)
  },
  deleteMailbox: params => {
    return service.post('/mailboxes/delete', params).then(res => res && res.code === 200)
  },
  replyMailbox: params => {
    return service.post('/mailboxes/reply', params).then(res => res && res.code === 200)
  },
  getMailboxDetail: params => {
    return service.get('/mailboxes/detail', params).then(res => res && res.data)
  }
}
