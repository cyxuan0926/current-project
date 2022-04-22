import * as service from '@/service/config/service'

export default {
  getMailboxes: params => service.get('/mailboxes/page', params).then(res => res && res.data),

  getMailboxTypes: () => service.get('/mailboxes/types').then(res => res && res.data),

  deleteMailbox: params => service.post('/mailboxes/delete', params).then(res => res && res.code === 200),

  replyMailbox: params => service.post('/mailboxes/reply', params).then(res => res && res.code === 200),

  getMailboxDetail: params => service.get('/mailboxes/detail', params).then(res => res && res.data)
}
