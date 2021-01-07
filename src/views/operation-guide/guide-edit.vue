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
                    content: {
                        type: 'textarea',
                        label: '更新内容介绍',
                        rules: ['required'],
                        showWordLimit: true,
                        maxlength: 1000,
                        rows: 5
                    },
                    guide: { type: 'jaileditor', label: '更新操作指引', rules: ['required']}
                },
                guideData: {},
                isAdd,
                gid: !isAdd ? this.$route.params.id : ''
            }
        },
        created() {
            if(!this.isAdd && window.sessionStorage) {
                let guideData = window.sessionStorage.getItem('APP_GUIDE_DATA')
                if(guideData) {
                    this.guideData = JSON.parse(guideData)
                }else {
                    this.$router.push({ path: '/operation-guide/list' })
                }
            }
        },
        methods: {
            setGuideStorage(data) {
                if( window.sessionStorage ) {
                    window.sessionStorage.removeItem('APP_GUIDE_DATA')
                    window.sessionStorage.setItem('APP_GUIDE_DATA', JSON.stringify(data))
                }
            },
            async handleSubmit(fields) {
                if (!fields.content) {
                    this.$message.warning('请填写更新内容介绍')
                    return false
                }
                if (!fields.guide) {
                    this.$message.warning('请填写更新操作指引')
                    return false
                }
                fields = Object.assign({ updatedTime: Moment().format('YYYY-MM-DD') }, fields)
                if( !this.isAdd && this.gid ) {
                    fields = Object.assign({ id: this.gid }, fields)
                }
                let { data } = await http[ this.isAdd ? 'addBusGuide' : 'updateBusGuide' ](fields)
                if( !!data ) {
                    if( !this.isAdd ) {
                        this.setGuideStorage(fields)
                    }else {
                        this.$router.push({ path: '/operation-guide/list' })
                    }
                }
            },
            handleBack() {
                this.$router.push({ path: '/operation-guide/list' })
            }
        }
    }
</script>

<style lang="sass" scoped>

</style>
