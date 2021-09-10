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
                        <m-upload-img 
                            v-model="imgUrl"
                            :imgStyle="{'width': '300px', 'height': '400px'}" />
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
import { Message } from 'element-ui';
export default {
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
        const imgUrl = ref('')

        watch(value, val => {
            val && ( imgUrl.value = '' )
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
            if ( status == 1 && !imgUrl.value ) {
                Message.error('请上传短信内容')
                return
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
                console.log('handleSmsSend====', res)
                if (res) {
                    handleClose()
                    props.queryMethod()
                }
            } catch (error) {
                this.$message.error('上传短信内容失败，请重试')
            }
        }

        return {
            smsVisible,
            smsContent,
            imgUrl,
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