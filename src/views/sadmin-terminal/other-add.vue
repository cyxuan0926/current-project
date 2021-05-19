<template>
    <div style="padding: 30px 0;">
        <el-col
            :span="10"
            :offset="7">
            <m-form
                ref="form"
                :items="formItems"
                @submit="handleSubmit"
                @back="handleBack"
                :values="otherTerminalData"/>
        </el-col>
    </div>
</template>

<script>
    import filters from '@/filters/modules/switches'
    import http from '@/service'
    export default {
        data() {
            return {
                otherTerminalData: {
                    terminalNumber: '',
                    terminalName: '',
                    terminalSn: '',
                    roomNumber: '',
                    orgType: '',
                    orgName: '胡陛个人律师事务所',
                    hostPassword: '',
                    mettingPassword: ''
                },
                formItems: {
                    buttons: [ { add: { loading: false } }, 'back' ],
                    formConfigs: { labelWidth: '150px' },
                    terminalNumber: {
                        type: 'input',
                        label: '终端号',
                        maxlength: 30,
                        rules: ['required']
                    },
                    terminalName: {
                        type: 'input',
                        label: '终端别名',
                        maxlength: 10,
                        rules: ['required']
                    },
                    terminalSn: {
                        type: 'input',
                        label: '终端唯一标识',
                        maxlength: 10
                    },
                    roomNumber: {
                        type: 'input',
                        label: '会议室号',
                        maxlength: 20,
                        rules: ['required']
                    },
                    orgType: {
                        type: 'select',
                        label: '单位类型',
                        options: filters.orgTypes,
                        rules: ['required']
                    },
                    orgName: {
                        type: 'select',
                        label: '单位名称',
                        options: [],
                        rules: ['required']
                    },
                    hostPassword: {
                        type: 'input',
                        label: '主持人密码',
                        maxlength: 20,
                        rules: ['required']
                    },
                    mettingPassword: {
                        type: 'input',
                        label: '参会密码',
                        maxlength: 20,
                        rules: ['required']
                    }
                }
            }
        },
        methods: {
            async handleSubmit(fields) {
                let params = Object.assign({}, fields)
                let res = await http.addOtherTerminal(params)
                if( res ) {
                    this.$router.push({ path: '/other-terminal/list' })
                }
            },
            handleBack() {
                this.$router.push({ path: '/other-terminal/list' })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>