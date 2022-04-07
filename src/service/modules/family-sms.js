import * as service from '../config/service'
import urls from '@/service/urls'
export default {
    // 查询发送短信列表
    getSendMessageList: data => service.postObj('/msg/sendMessageList', data),

    // 查询发送短信列表
    sendMessageFile: data => service.postFormData(urls.imageUrl, data),

    // 发送短信
    sendMessage: data => service.post('/msg/saveMsg', data),

    // 获取群发短信列表-监狱
    getSendMessageGroupList: params => service.get('/batchNotify/page', params),

    // 群发短信-监狱
    sendMessageGroup: data => service.post('/batchNotify/jail', data)
}
