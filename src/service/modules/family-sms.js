import * as service from '../config/service'
import urls from '@/service/urls'
export default {
    // 查询发送短信列表
    getSendMessageList: data => service.postObj('/msg/sendMessageList', data),

    // 查询发送短信列表
    sendMessageFile: data => service.postFormData(urls.imageUrl, data),

    // 发送短信
    sendMessage: data => service.post('/msg/saveMsg', data)
}
