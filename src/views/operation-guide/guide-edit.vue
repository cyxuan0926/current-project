<template>
    <div class="form-container">
        <m-form
            ref="form"
            :items="formItems"
            @submit="handleSubmit"
            @preview="handlePreview"
            @back="handleBack"
            :values="guideStorage"/>
    </div>
</template>

<script>
    import http from '@/service'
    import isEqual from 'lodash/isEqual'
    import { mapState, mapActions } from 'vuex'
    export default {
        data() {
            const isAdd = this.$route.path.includes('add')
            return {
                formItems: {
                    buttons: isAdd ?
                        [ { add: { loading: false }, text: '存草稿' }, { preview: { loading: false } }, 'back' ] :
                        [ { update: { loading: false } }, { preview: { loading: false } }, 'back'],
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
                isAdd,
                isCanPublish: true,
                gid: !isAdd ? this.$route.params.id : ''
            }
        },
        computed: {
            ...mapState({
                guideStorage: state => state.global.guideStorage
            })
        },
        methods: {
            ...mapActions(['setGuideStorage']),

            handleTextareaValue(val) {
                return val.replace(/\r/g, '').replace(/\n/g, '<br/>')
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
                fields = Object.assign({ updatedTime: this.$_dateNow }, fields)
                fields.preContent = this.handleTextareaValue(fields.content)
                if( !this.isAdd && this.gid ) {
                    fields = Object.assign({ id: this.gid }, fields)
                }
                let { data } = await http[ this.isAdd ? 'addBusGuide' : 'updateBusGuide' ](fields)
                // return
                if( !!data ) {
                    // if( !this.isAdd ) {
                    //     this.setGuideStorage(fields)
                    // }else {
                    //     this.$router.push({ path: '/operation-guide/list' })
                    // }
                    this.$router.push({ path: '/operation-guide/list' })
                }
            },
            handlePreview(fields) {
                fields = Object.assign({ updatedTime: this.$_dateNow }, fields)
                fields.preContent = this.handleTextareaValue(fields.content)
                this.setGuideStorage(fields)
                this.$router.push({ path: '/operation-guide/detail' })
            },
            async handleBack(fields) {
                try {
                    if( (!!fields.guide || !!fields.content) && !isEqual(this.guideStorage, { guide: fields.guide, content: fields.content })) {
                        await this.$confirm('页面内容已更新，您确定要离开吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                    }
                    this.setGuideStorage()
                    this.$router.push({ path: '/operation-guide/list' })
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
</script>

<style lang="sass" scoped>

</style>
