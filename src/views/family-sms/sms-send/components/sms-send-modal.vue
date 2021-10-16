<template>
    <el-dialog
        title="亲情短信"
        :visible.sync="smsVisible"
        width="720px"
        @close="handleClose">
        <div class="sms-send-content clearfix">
            <dl>
                <dt>家属姓名：</dt>
                <dd>{{ modalData.familyName }}</dd>
            </dl>
            <dl>
                <dt>家属电话：</dt>
                <dd>{{ modalData.familyPhone }}</dd>
            </dl>
            <dl>
                <dt>罪犯姓名：</dt>
                <dd>{{ modalData.prisonerName }}</dd>
            </dl>
            <dl>
                <dt>罪犯编号：</dt>
                <dd>{{ modalData.criminalNumber }}</dd>
            </dl>
            <dl>
                <dt>短信内容：</dt>
                <dd>
                    <template v-if="modalData.status == 2 || modalData.status == 3">
                        {{ smsContent }}
                    </template>
                    <template v-if="modalData.status == 1">
                        <div class="deli-video" v-if="!imgUrl">
                            <img id="deliImg" alt="高拍仪" style="width: 506px; height: 380px">
                        </div>
                        <m-img-viewer
                            v-else
                            style="width: 506px; height: 380px"
                            :url="imgUrl"
                            title="短信内容"
                            isRequired
                            :isLazy="false"
                        />
                    </template>
                </dd>
            </dl>
        </div>
        <span slot="footer" class="dialog-footer">
            <template v-if="modalData.status == 1">
                <el-button v-if="!imgUrl" type="primary" @click="handleCapture" :disabled="!isDevSuccess || isCapture" >拍 照</el-button>
                <el-button v-else type="primary" @click="handleCancel">重新拍照</el-button>
            </template>
            <el-button type="primary" @click="handleSmsSend">发 送</el-button>
            <el-button @click="handleClose">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { toRefs, ref, reactive, watch, onMounted, onUnmounted } from '@vue/composition-api'
import http from '@/service'
import { smsSendTemplate } from '@/common/constants/const'
import { Message } from 'element-ui'
import highBeatMeter from './high-beat-meter.vue'
import Deli from '@/utils/deliUtil'
import { dataURLtoFile } from '@/utils/helper'

export default {
    components: {
        highBeatMeter
    },
    props: {
        value: Boolean,
        input: Function,
        modalData: Object,
        queryMethod: Function
    },
    setup (props, { emit, root }) {
        const smsVisible = ref(false)
        const { value, modalData } = toRefs(props)
        const smsContent = ref('')
        const imgUrl = ref('1')
        const deliDevSrc = ref('')
        const isCapture = ref(false)
        const isDevSuccess = ref(false)
        let deliIns = null

        // 创建得力高拍仪实例
        if (!deliIns) {
            deliIns = new Deli({
                // 高拍仪连接后回调
                onCaptureWSMessage(b) {
                    if (smsVisible.value && !imgUrl.value) {
                        // deliDevSrc.value = `data:image/png;base64,${ b }`
                        document.getElementById("deliImg").src = `data:image/png;base64,${ b }`
                    }
                },
                // 高拍仪拍照回调
                onCaptureEncodeBase64(re) {
                    isCapture.value = false
                    // imgUrl.value = deliDevSrc.value = `data:image/png;base64,${ re }`
                    http.sendMessageFile({
                        file: dataURLtoFile(`data:image/png;base64,${ re }`)
                    })
                },
                // 高拍仪连接成功
                onWsopen() {
                    isDevSuccess.value = true
                },
                // 高拍仪连接失败
                onWsError() {
                    isDevSuccess.value = false
                }
            })
        }

        watch(value, val => {
            if (val) {
                imgUrl.value = ''
                if (!isDevSuccess.value && modalData.value.status == 1) {
                    Message.error('高拍仪连接失败，请重试')
                    deliIns.load()
                }
            }
            smsVisible.value = val
        })

        watch(modalData, val => {
            let tmp = smsSendTemplate.find(s => s.value == val.status)
            if (tmp && tmp.template) {
                smsContent.value = tmp.template.replace('$prisonerName', val.prisonerName)
            }
        })

        onMounted(() => {
            deliIns.load()
        })

        onUnmounted(() => {
            deliIns.unload()
            deliIns = null
        })

        // 关闭弹窗
        const handleClose = () => {
            emit('input', false)
        }

        // 连接搞拍仪-拍照
        const handleCapture = () => {
            if (isCapture.value) {
                return
            }
            isCapture.value = true
            try {
                deliIns.send({ FuncName: 'CaptureEncodeBase64' })
            } catch (error) {
                isCapture.value = false
                Message.error('拍照失败，请重试')
            }
        }

        // 连接高拍仪-重新拍照
        const handleCancel = () => {
            if (imgUrl.value) {
                imgUrl.value = ''
            }
        }

        // 发送亲情短信
        // status 1发送普通短信 2发送开通亲情提醒短信 3发送缴费提醒短信 4短信已达上限
        // messageType 1文字 2图片 3开通提醒短信 4余额不足提醒
        const handleSmsSend = async () => {
            let { prisonerId, criminalNumber, prisonerName, familyId, familyPhone, familyName, relationship, status } = modalData.value
            if (status == 1) {
                if (!imgUrl.value) {
                    Message.error('请上传短信内容')
                    return
                }
                else {
                    try {
                       let { url } = await http.sendMessageFile({
                           file: dataURLtoFile(imgUrl.value)
                       })
                        imgUrl.value = url
                    } catch (error) {
                        this.$message.error('上传短信内容失败，请重试')
                    }
                }
            }
            try {
                let res = await http.sendMessage({
                    prisonerId,
                    criminalNumber,
                    sendName: prisonerName,
                    familyId,
                    familyPhone,
                    receiveName: familyName,
                    relationship,
                    message: status == 1 ? imgUrl.value : smsContent.value,
                    messageType: status == 1 ? 2 : ( status == 2 ? 3 : (status == 3 ? 4 : 1) ),
                    isPrisonerSend: 1
                })
                if (res) {
                    handleClose()
                    props.queryMethod()
                }
            } catch (error) {
                this.$message.error('发送短信内容失败，请重试')
            }
        }

        return {
            smsVisible,
            smsContent,
            imgUrl,
            handleSmsSend,
            handleClose,
            deliDevSrc,
            handleCapture,
            isCapture,
            isDevSuccess
        }
    }
}
</script>

<style lang="scss" scoped>
    .sms-send-content {
        dl {
            display: flex;
            float: left;
            width: 50%;
            margin: 0 0 16px 0;
            dt {
                width: 120px;
                text-align: right;
            }
            dd {
                flex: 1;
                margin: 0;
                padding: 0 16px;
            }
            &:last-child {
                width: 100%;
            }
        }
        .deli-video {
            width: 506px;
            height: 380px;
            background-color: #F5F7FA;
        }
    }
</style>