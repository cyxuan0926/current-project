import * as service from '../config/service'
export default {
    // 查询发送短信列表
    getSendMessageList: data => service.postObj('/msg/sendMessageList', data),
    // 发送短信
    sendMessage: data => service.post('/msg/saveMsg', data)
}
