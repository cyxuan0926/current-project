<template>
    <div class="form-container">
        <m-form
            ref="form"
            :items="formItems"
            @submit="handleSubmit"
            @preview="handlePreview"
            @back="handleBack"
            :values="guideData"/>
    </div>
</template>

<script>
    import http from '@/service'
    import isEqual from 'lodash/isEqual'
    import { mapGetters, mapActions } from 'vuex'
    export default {
        data() {
            const _id = this.$route.query && this.$route.query.gid || ''
            const _type = this.$route.meta.typeId
            return {
                gid: _id,
                type: _type,
                module: `sun_jail_${ _type }`,
                formItems: {
                    buttons: !_id ?
                        [ { add: { loading: false } }, { preview: { loading: false } }, 'back' ] :
                        [ { update: { loading: false } }, { preview: { loading: false } }, 'back'],
                    formConfigs: { labelWidth: '150px' },
                    headline: {
                        type: 'input',
                        label: '标题',
                        rules: ['required'],
                        maxlength: 100,
                    },
                    subhead: {
                        type: 'input',
                        label: '副标题',
                        rules: ['required'],
                        maxlength: 100,
                    },
                    content: {
                        type: 'jaileditor',
                        label: '内容',
                        rules: ['required']
                    },
                    // seq: {
                    //     type: 'jaileditor', label: '更新操作指引', rules: ['required']
                    // }
                },
                guideData: {
                    "content": "",
                    "createTime": "",
                    "headline": "",
                    "id": "",
                    "module": "",
                    "seq": 0,
                    "status": 0,
                    "subhead": "",
                    "type": ""
                }
            }
        },
        // computed: {
        //     ...mapGetters(['guideData'])
        // },
        methods: {
            ...mapActions(['setGuideStorage']),

            handleTextareaValue(val) {
                return val.replace(/\r/g, '').replace(/\n/g, '<br/>')
            },

            async handleSubmit(fields) {
                // if (!fields.content) {
                //     this.$message.warning('请填写更新内容介绍')
                //     return false
                // }
                // if (!fields.guide) {
                //     this.$message.warning('请填写更新操作指引')
                //     return false
                // }
                fields = Object.assign(
                    {
                        id: '',
                        module: this.module,
                        status: '0',
                        type: this.type
                    },
                    fields
                )
                // fields.preContent = this.handleTextareaValue(fields.content)
                // if( !this.isAdd && this.gid ) {
                //     fields = Object.assign({ id: this.gid }, fields)
                // }
                //let { data } = await http[ this.isAdd ? 'addBusGuide' : 'updateBusGuide' ](fields)
                // console.log( fields.content.split('') )
                // return
                await http.savePrisonAffairs(fields)
                if( !!data ) {
                    // if( !this.isAdd ) {
                    //     this.setGuideStorage(fields)
                    // }else {
                    //     this.$router.push({ path: '/operation-guide/list' })
                    // }
                    this.$router.push({ path: `/prison-affairs-list/${ this.$route.meta.typeId }` })
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
                    if( (!!fields.guide || !!fields.content) && !isEqual(this.guideData, { guide: fields.guide, content: fields.content })) {
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
