<template>
    <div class="form-container">
        <m-form
            ref="form"
            :items="formItems"
            @submit="handleSubmit"
            @back="handleBack"
            :values="guideData"/>
    </div>
</template>

<script>
    import http from '@/service'
    import Moment from 'moment'
    export default {
        data() {
            const isAdd = this.$route.path.includes('add')
            return {
                formItems: {
                    buttons: isAdd ?
                        [ { add: { loading: false } }, 'back' ] :
                        [ { update: { loading: false } }, 'back'],
                    formConfigs: { labelWidth: '150px' },
                    guide: {
                        type: 'textarea',
                        label: '更新内容介绍',
                        rules: ['required'],
                        showWordLimit: true,
                        maxlength: 1000,
                        rows: 5
                    },
                    contents: { type: 'jaileditor', label: '更新操作指引', rules: ['required']}
                },
                guideData: {},
                isAdd,
                gid: !isAdd ? this.$route.params.id : ''
            }
        },
        methods: {
            async handleSubmit(fields) {
                if (!fields.guide) {
                    this.$message.warning('请填写更新内容介绍')
                    return false
                }
                if (!fields.contents) {
                    this.$message.warning('请填写更新操作指引')
                    return false
                }
                fields = Object.assign({ updatedTime: Moment().format('YYYY-MM-DD') }, fields)
                if( !this.isAdd && this.gid ) {
                    fields = Object.assign({ id: this.gid }, fields)
                }
                await http[ this.isAdd ? 'addBusGuide' : 'updateBusGuide' ](fields)
            },
            handleBack() {
                this.$router.push({ path: '/operation-guide/list' })
            }
        }
    }
</script>

<style lang="sass" scoped>

</style>
