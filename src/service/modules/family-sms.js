import * as service from '../config/service'
export default {
    getSendMessageList: data => service.postObj('/msg/sendMessageList', data)
}
