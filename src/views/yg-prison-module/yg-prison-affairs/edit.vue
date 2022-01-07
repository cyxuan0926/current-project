<template>
    <div class="form-container">
        <m-form
            ref="form"
            :items="formItems"
            @submit="handleSubmit"
            @preview="handlePreview"
            @back="handleBack"
            :values="affairsStorage">
            <template #seq="{ fields }">
                <el-input-number v-model="fields.seq" :min="1" :step="1" step-strictly placeholder="请输入序号"></el-input-number>
            </template>
        </m-form>
        <affairs-detail-modal v-model="affairsModalVisible" />
    </div>
</template>

<script>
    import http from '@/service'
    import { mapState, mapActions } from 'vuex'
    import affairsDetailModal from './components/affairs-detail-modal.vue'
    export default {
        components: {
            affairsDetailModal
        },
        data() {
            return {
                gid: this.$route.query && this.$route.query.gid || '',
                formItems: {},
                type: '',
                isNeedQuery: false,
                affairsModalVisible: false
            }
        },
        watch: {
            $route: {
                handler(r) {
                    let _type = r.meta.typeId
                    this.isNeedQuery = _type.includes('meetingnotice') || _type.includes('servivceinfo')
                    this.initData(_type)
                },
                immediate: true
            }
        },
        computed: {
            ...mapState({
                affairsStorage: state => state.global.affairsStorage,
                affairsModule: state => state.global.affairsModule,
                user: state => state.global.user
            })
        },
        methods: {
            ...mapActions(['setAffairsStorage']),

            handleTextareaValue(val) {
                return val.replace(/\r/g, '').replace(/\n/g, '<br/>')
            },

            async initData(_type) {
                this.type = _type
                this.module = `sun_jail_${ _type }`
                let _hasTypeSelect = _type.includes('flfg') || _type.includes('xwgs')
                let _formItems = {
                    buttons: !this.gid ?
                        [ { add: { loading: false } }, { preview: { loading: false } }, 'back' ] :
                        [ { update: { loading: false } }, { preview: { loading: false } }, 'back'],
                    formConfigs: { labelWidth: '150px' },
                    dissMissConfigs: !_hasTypeSelect ? ['type'] : [],
                    type: {
                        type: 'select',
                        label: '业务模块',
                        rules: ['required'],
                        options: this.affairsModule
                    },
                    headline: {
                        type: 'input',
                        label: '标题',
                        rules: ['required'],
                        maxlength: 100,
                    },
                    subhead: {
                        type: 'input',
                        label: '副标题',
                        maxlength: 100,
                    },
                    content: {
                        type: 'jaileditor',
                        label: '内容',
                        rules: ['required']
                    },
                    videoUrl: {
                        type: 'uploadVideo',
                        label: '视频',
                        value: this.affairsStorage.videoUrl
                    },
                    seq: {
                        slotName: 'seq',
                        attrs: {
                            label: '序号',
                            prop: 'seq',
                            rules: [{ required: true, message: '请输入序号' }]
                        }
                    }
                }
                if( this.isNeedQuery ) {
                    let { data } = await http.queryPrisonAffairs({ page: 1, rows: 10, module: this.module })
                    if( data && data.list && data.list.length ) {
                        let { headline, subhead, content, seq } = data.list[0]
                        this.setAffairsStorage({ headline, subhead, content, seq })
                    }
                }
                this.formItems = _formItems
            },

            async handleSubmit(fields) {
                let params = Object.assign(
                    {
                        id: this.gid,
                        module: this.module,
                        status: '0',
                        jailId: this.user.jailId
                    },
                    fields
                )
                if( !params.type ) {
                    params.type = this.type
                }
                //fields.preContent = this.handleTextareaValue(fields.content)
                let { data } = await http[ !this.gid ? 'savePrisonAffairs' : 'updatePrisonAffairs' ](params)
                if( !!data ) {
                    if( !this.gid && !this.isNeedQuery ) {
                        // this.setAffairsStorage()
                        // this.initData(this.$route.meta.typeId)
                        this.$router.push({ path: `/prison-affairs-list/${ this.type }` })
                    }else {
                        this.setAffairsStorage({
                            headline: fields.headline,
                            subhead: fields.subhead,
                            content: fields.content,
                            videoUrl: fields.videoUrl,
                            seq: fields.seq
                        })
                    }
                }
            },

            handlePreview(fields) {
                if( !fields.headline ) {
                    this.$message.error('请填写标题')
                    return
                }
                if( !fields.content ) {
                    this.$message.error('请填写内容')
                    return
                }
                this.setAffairsStorage(Object.assign({}, fields))
                this.affairsModalVisible = true
            },

            async handleBack(fields) {
                try {
                    if( !(_.isEqual(this.affairsStorage, fields))) {
                        await this.$confirm('页面内容已更新，您确定要离开吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                    }
                    this.$router.push({ path: `/prison-affairs-list/${ this.$route.meta.typeId }` })
                } catch (error) {
                    Promise.reject(error)
                }
            }
        }
    }
</script>

<style lang="sass" scoped>

</style>
