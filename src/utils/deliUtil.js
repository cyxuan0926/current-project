import { Message } from 'element-ui'
import initWebSocket from './deliWebsoket'

export default class {
    constructor(options) {
        this.ws = null
        this.m_isConnectWS = false
        this.m_splitTag = '$*$'
        this.m_closed = true
        this.m_error = false
        this.devIndex = 0
        this.options = options
    }

    load() {
        let _this = this
        this.ws = initWebSocket({
            onOpen() {
                _this.m_isConnectWS = true
                _this.unload()
                _this.sendInit()
                _this.sendGetPath()
                _this.m_closed = false
                _this.options.onWsopen()
            },
            onMessage(str) {
                if (str.includes(_this.m_splitTag)) {
                    // 视频的每一帧
                    _this.options.onCaptureWSMessage(str.split(_this.m_splitTag)[1])
                }
                else {
                    // 处理其他请求
                    _this.handleWSMessage(str)
                }
            },
            onClose() {
                _this.m_isConnectWS = false
                _this.m_closed = true
            },
            onError() {
                _this.options.onWsError()
                _this.m_error = true
            }
        })
    }

    unload() {
        if (this.m_closed) {
            return
        }
        // 反初始化
        this.send({ FuncName: 'camUnInitCameraLib' })
        this.ws.close()
    }
    // 初始化
    sendInit() {
        this.send({ FuncName: 'camInitCameraLib' })
    }

    // 获取电脑路径
    sendGetPath() {
        this.send({ FuncName: 'GetSpecialFolderPath', argument: { nFolder: 5 } })
    }

    // 打开高拍仪
    openDev() {
        if (this.m_closed) {
            this.load()
        }
        // 打开摄像头
        this.send({ FuncName: 'camOpenDev', argument: { devIndex: this.devIndex, subtype: 0, width: 0, height: 0 } })
    }

    // 发送ws请求
    send(jsonObj) {
        try {
            this.ws.send(JSON.stringify(jsonObj))
        }
        catch (error) {
            Message.error('发送高拍仪请求失败')
        }
    }

    // 响应ws请求
    handleWSMessage(str) {
        let { FuncName, result } = JSON.parse(str)
        // 初始化
        if (FuncName === 'camInitCameraLib') {
            this.openDev()
        }
        // 打开设备
        else if (FuncName === 'camOpenDev') {
            this.options.onCaptureOpen(result)
        }
        // 拍照base64
        else if (FuncName === 'CaptureEncodeBase64') {
            this.options.onCaptureEncodeBase64(result)
        }
    }
}
