<template>
    <el-dialog
        :visible.sync="dialogVisible"
        width="480px"
        @close="handleClose"
        >
        <h3 class="bind-phone-modal-title">该账号未配置手机号，请输入你的手机号码，用于双因素认证登录使用</h3>
        <el-form
            class="bind-phone-modal-form"
            ref="bindForm"
            :model="loginData"
            :rules="loginRules"
            @keyup.enter.native="handleSubmit">
            <el-form-item prop="phoneNumber">
                <el-input
                    clearable
                    v-model.trim="loginData.phoneNumber"
                    placeholder="请输入手机号">
                </el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input
                    v-model.trim="loginData.code"
                    :maxlength="4"
                    placeholder="请输入验证码">
                    <el-button slot="append" @click="handleSmscode" :disabled="isGetSmscode">{{ smsCodeText }}</el-button>
                </el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
    import http from '@/service'
    import validate from '@/utils/validate'
    import { mapActions } from 'vuex'
    import { sendSmsByPhone } from '@/service-public/api/account'
    export default {
        props: {
            value: Boolean,
            input: Function,
            username: String,
            loading: false
        },
        data() {
            return {
                dialogVisible: false,
                isGetSmscode: false,
                smsCountdown: 60,
                smsInterval: null,
                smsCodeText: '获取验证码',
                loginData: {
                    phoneNumber: '',
                    code: ''
                },
                loginRules: {
                    phoneNumber: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        {
                            validator: validate.phone,
                            trigger: 'blur'
                        }
                    ],
                    code: [
                        { required: true, message: '请输入验证码', trigger: 'blur' },
                        {
                            validator(rule, value, callback) {
                                if (!/^\d{4}$/.test(value)) {
                                    callback( new Error('请输入4位数字验证码') )
                                }
                                callback()
                            }
                        }
                    ],
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ]
                }
            }
        },
        watch: {
            value(v) {
                this.dialogVisible = v
            }
        },
        methods: {
            handleClose() {
                this.$emit('input', false)
                this.loading = false
                this.$refs.bindForm.resetFields()
            },
            // 设置倒计时文案
            setSmsText() {
                this.smsCodeText = `${ !this.smsCountdown ? '获取验证码' : `重发(${ this.smsCountdown }s)` }`
            },
            // 倒计时
            setSmsCountdown() {
                if (!this.smsInterval) {
                    this.setSmsText()
                    this.smsInterval = setInterval(() => {
                        this.smsCountdown--
                        this.setSmsText()
                        if (!this.smsCountdown) {
                            this.smsCountdown = 60
                            this.isGetSmscode = false
                            clearInterval(this.smsInterval)
                            this.smsInterval = null
                        }
                    }, 1000)
                }
            },
            // 发送验证码
            handleSmscode() {
                if (this.isGetSmscode) {
                    return
                }
                this.$refs.bindForm.validateField('phoneNumber', async err => {
                    if (!err) {
                        this.isGetSmscode = true
                        try {
                            let res = await sendSmsByPhone(this.loginData.phoneNumber)
                            if (res == 'SMS_SEND_OK') {
                                this.setSmsCountdown()
                            }
                        } catch (error) {
                            this.$message.error('获取验证码失败，请重试！')
                            this.isGetSmscode = false
                        }
                    }
                })
            },
            // 绑定手机号
            handleSubmit() {
                if (this.loading) {
                    return
                }
                if (!this.username) {
                    return
                }
                this.$refs.bindForm.validate(async valid => {
                    let { phoneNumber, code } = this.loginData
                    if (valid) {
                        this.loading = true
                        let res = http.updatePrisonUserPhone({
                            username: this.username,
                            phoneNumber,
                            code
                        })
                        if (res) {
                            this.handleClose()
                        }
                        this.loading = false
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .bind-phone-modal {
        &-title {
            font-size: 14px;
            text-align: center;
        }
        &-form {
            width: 80%;
            margin: 20px auto 0;
        }
    }
</style>