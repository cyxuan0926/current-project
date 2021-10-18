import { Message } from 'element-ui'

export default function({ url = 'ws://localhost:9000/', onOpen, onMessage, onClose, onError }) {
    let ws
    if ('WebSocket' in window) {
        ws = new WebSocket(url)
    }
    else if ('MozWebSocket' in window) {
        // eslint-disable-next-line
        ws = new MozWebSocket(url)
    }
    else {
        Message.warning('浏览器版本过低，请升级您的浏览器。浏览器要求：IE10+、Chrome14+、FireFox7+、Opera11+')
    }

    ws.onopen = function() {
        onOpen()
    }

    ws.onmessage = function(evt) {
        if (typeof evt.data === 'string') {
            let str = evt.data
            if (str.length <= 0) {
                return
            }
            onMessage(str)
        }
    }

    ws.onclose = function() {
        onClose()
    }

    ws.onerror = function() {
        onError()
    }

    return ws
}
