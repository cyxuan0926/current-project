<template>
    <el-dialog
        title="亲情短信"
        :visible.sync="smsVisible"
        width="720px"
        @close="handleClose">
        <div class="sms-send-content">
            <dl>
                <dt>发送形式：</dt>
                <dd>
                    <el-select v-model="smsContentType" placeholder="请选择发送形式" style="margin-bottom: 16px;">
                        <el-option key="1" label="文字" value="1"></el-option>
                        <!-- <el-option key="2" label="图片" value="2"></el-option> -->
                    </el-select>
                    <template v-if="smsContentType == '1'">
                        <el-input
                            type="textarea"
                            :rows="8"
                            :maxlength="500"
                            placeholder="请输入短信内容"
                            v-model="smsContent">
                        </el-input>
                    </template>
                    <template v-if="smsContentType == '2'">
                        <div class="deli-video" v-if="!imgUrl">
                            <img v-show="isDevOpened" id="deliImg" alt="高拍仪">
                            <div v-show="!isDevOpened" class="tip">{{ !isDevSuccess ? '高拍仪连接失败，请检查设备重试' : '高拍仪连接成功' }}</div>
                        </div>
                        <m-img-viewer
                            v-else
                            style="width: 506px; height: 380px"
                            :url="`${ imgUrl }?token=${ token }`"
                            title="短信内容"
                            isRequired
                            :isLazy="false"
                        />
                    </template>
                </dd>
            </dl>
        </div>
        <span slot="footer" class="dialog-footer">
            <template v-if="smsContentType == '2'">
                <el-button v-if="!imgUrl" type="primary" @click="handleCapture" :disabled="!isDevSuccess || !isDevOpened || isCapture" >{{ isCapture ? '拍照中...' : '拍 照' }}</el-button>
                <el-button v-if="imgUrl" type="primary" @click="handleCancel">重新拍照</el-button>
                <el-button v-if="imgUrl" type="primary" @click="handleSmsSendGroup">发 送</el-button>
            </template>
            <template v-else>
                <el-button type="primary" @click="handleSmsSendGroup">发 送</el-button>
            </template>
            <el-button @click="handleClose">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { toRefs, ref, reactive, watch, onMounted, onUnmounted } from '@vue/composition-api'
import http from '@/service'
import urls from '@/service/urls'
import { Message, MessageBox } from 'element-ui'
import Deli from '@/utils/deliUtil'
import { dataURLtoFile } from '@/utils/helper'

export default {
    props: {
        value: Boolean,
        input: Function,
        onSended: Function
    },
    setup (props, { emit, root }) {
        const smsVisible = ref(false)
        const { value, modalData } = toRefs(props)
        const smsContent = ref('')
        const smsContentType = ref('1')
        const imgUrl = ref('')
        const isCapture = ref(false)
        const isDevSuccess = ref(false)
        const isDevOpened = ref(false)
        const token = ref(urls.token)
        let deliIns = null

        // 创建得力高拍仪实例
        // if (!deliIns) {
        //     deliIns = new Deli({
        //         // 高拍仪连接后回调
        //         onCaptureWSMessage(b) {
        //             if (smsVisible.value && !imgUrl.value && smsContentType.value == '2') {
        //                 isDevOpened.value = true
        //                 let deliImg = document.getElementById("deliImg")
        //                 if (deliImg) {
        //                     deliImg.src = `data:image/jpeg;base64,${ b }`
        //                 }
        //             }
        //         },
        //         // 高拍仪拍照回调
        //         async onCaptureEncodeBase64(re) {
        //             try {
        //                 let { url } = await http.sendMessageFile({
        //                    avatar: dataURLtoFile(`data:image/jpeg;base64,${ re }`, `sms-${ (Math.random() + '').replace('.','').substring(0, 8) }.jpg`)
        //                 })
        //                 imgUrl.value = url
        //                 isCapture.value = false
        //             } catch (error) {
        //                 Message.error('高拍仪拍照失败，请重试')
        //                 isCapture.value = false
        //             }
        //         },
        //         // 打开高拍仪
        //         onCaptureOpen(re) {
        //             // isDevOpen.value = re === 0
        //         },
        //         // 高拍仪连接成功
        //         onWsopen() {
        //             isDevSuccess.value = true
        //         },
        //         // 高拍仪连接失败
        //         onWsError() {
        //             isDevOpened.value = false
        //             isDevSuccess.value = false
        //         }
        //     })
        // }

        watch(value, val => {
            if (val) {
                imgUrl.value = ''
                let deliImg = document.getElementById("deliImg")
                if (deliImg) {
                    deliImg.src = ''
                }
                if (!isDevSuccess.value && smsContentType.value == '2') {
                    // Message.error('高拍仪连接失败，请重试')
                    deliIns.load()
                }
                smsContent.value = ''
            }
            smsVisible.value = val
        })

        onMounted(() => {
            if (deliIns) {
                deliIns.load()
            }
            
        })

        onUnmounted(() => {
            if (deliIns) {
                deliIns.unload()
                deliIns = null
            }
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

        // 群发短信
        // smsContentType 1-文字 2-图片
        const handleSmsSendGroup = async () => {
            if (!smsContent.value) {
                Message.error('请输入短信内容')
                return
            }
            try {
                await MessageBox.confirm('确认群发该消息吗？', '提示')
                try {
                    let res = await http.sendMessageGroup({
                        content: smsContent.value
                    })
                    if (res) {
                        handleClose()
                        emit('on-sended')
                    }
                } catch (error) {
                    this.$message.error('发送短信内容失败，请重试')
                }
            } catch (error) {}
        }

        return {
            smsVisible,
            smsContent,
            smsContentType,
            imgUrl,
            token,
            handleSmsSendGroup,
            handleClose,
            handleCapture,
            handleCancel,
            isCapture,
            isDevSuccess,
            isDevOpened
        }
    }
}
</script>

<style lang="scss" scoped>
    .sms-send-content {
        @include clearfix;
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
                width: $absolutely-measure;
            }
        }
        .deli-video {
            width: 506px;
            height: 380px;
            background-color: #F5F7FA;
            position: relative;

            img {
                position: absolute;
                left: 0;
                top: 0;
                width: $absolutely-measure;
                height: $absolutely-measure;
            }

            .tip {
                position: absolute;
                left: 0;
                top: 45%;
                width: $absolutely-measure;
                text-align: center;
                color: #999;
            }

        }
    }
</style>