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
                        <m-form
                            ref="form"
                            :items="formItems"
                            @submit="handleSubmit"
                            :values="formValues" />
                    </template>
                </dd>
            </dl>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSmsSend">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { toRefs, ref, reactive, watch } from '@vue/composition-api'
import http from '@/service'
import { smsSendTemplate } from '@/common/constants/const'
export default {
    props: {
        value: Boolean,
        input: Function,
        modalData: Object,
        queryMethod: Function
    },
    setup (props, { emit }) {
        const smsVisible = ref(false)
        const { value, modalData } = toRefs(props)
        const smsContent = ref('')
        // 上传图片表单
        const formItems = reactive({
            imageUrl: {
                type: 'uploadImg',
                label: ''
            }
        })
        // 图片表单值
        const formValues = ref({})

        watch(value, val => {
            smsVisible.value = val
        })

        watch(modalData, val => {
            let tmp = smsSendTemplate.find(s => s.value == val.status)
            if (tmp && tmp.template) {
                smsContent.value = tmp.template.replace('$prisonerName', val.prisonerName)
            }
        })

        const handleClose = () => {
            emit('input', false)
        }
        // status 1发送普通短信 2发送开通亲情提醒短信 3发送缴费提醒短信 4短信已达上限
        // messageType 1文字 2图片 3开通提醒短信 4余额不足提醒
        const handleSmsSend = async () => {
            let { prisonerId, criminalNumber, prisonerName, familyId, familyPhone, familyName, relationship, status } = modalData.value
            let res = await http.sendMessage({
                prisonerId,
                criminalNumber,
                sendName: prisonerName,
                familyId,
                familyPhone,
                receiveName: familyName,
                relationship,
                message: status == 1 ? 'https://bkimg.cdn.bcebos.com/pic/574e9258d109b3de0c72c7e5ccbf6c81810a4c69?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UxMTY=,g_7,xp_5,yp_5/format,f_auto' : smsContent.value,
                messageType: status == 1 ? 2 : ( status == 2 ? 3 : (status == 3 ? 4 : 1) ),
                isPrisonerSend: 1
            })
            console.log('handleSmsSend====', res)
        }

        return {
            smsVisible,
            formItems,
            formValues,
            smsContent,
            handleSmsSend,
            handleClose
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
    }
</style>