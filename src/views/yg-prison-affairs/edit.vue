<template>
    <div class="form-container">
        <m-form
            ref="form"
            :items="formItems"
            @submit="handleSubmit"
            @preview="handlePreview"
            @back="handleBack"
            :values="affairsData">
            <template #seq="fields">
                <el-input-number v-model="fields.seq" :min="0" :step="1" step-strictly placeholder="请输入序号"></el-input-number>
            </template>
        </m-form>
    </div>
</template>

<script>
    import http from '@/service'
    import isEqual from 'lodash/isEqual'
    import { mapGetters, mapActions } from 'vuex'
    export default {
        data() {
            return {
                gid: this.$route.query && this.$route.query.gid || '',
                formItems: {},
            }
        },
        watch: {
            $route: {
                handler(r) {
                    this.initData(r.meta.typeId)
                },
                immediate: true
            }
        },
        computed: {
            ...mapGetters(['affairsData'])
        },
        methods: {
            ...mapActions(['setAffairsStorage']),

            handleTextareaValue(val) {
                return val.replace(/\r/g, '').replace(/\n/g, '<br/>')
            },

            async initData(_type) {
                let _hasTypeSelect = _type.includes('flfg') || _type.includes('xwgs')
                let _module = `sun_jail_${ _type }`
                let _formItems = {
                    buttons: !_id ?
                        [ { add: { loading: false } }, { preview: { loading: false } }, 'back' ] :
                        [ { update: { loading: false } }, { preview: { loading: false } }, 'back'],
                    formConfigs: { labelWidth: '150px' },
                    dissMissConfigs: _hasTypeSelect ? ['type'] : [],
                    type: {
                        type: 'select',
                        label: '业务模块',
                        rules: ['required'],
                        options: []
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
                        rules: ['required'],
                        maxlength: 100,
                    },
                    content: {
                        type: 'jaileditor',
                        label: '内容',
                        rules: ['required']
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
                if( _type.includes('meetingnotice') || _type.includes('servivceinfo') ) {
                    let { data } = await http.queryPrisonAffairs({ page: 1, rows: 10 })
                    if( data && data.list && data.list.length ) {
                        let { headline, subhead, content, seq } = data[0]
                        this.affairsData = { headline, subhead, content, seq }
                    }
                }

                this.type = _type
                this.module = _module
                this.formItems = _formItems
            },

            async handleSubmit(fields) {
                fields = Object.assign(
                    {
                        id: this.gid,
                        module: this.module,
                        status: '0',
                        type: this.type
                    },
                    fields
                )
                //fields.preContent = this.handleTextareaValue(fields.content)
                let { data } = await http[ this.isAdd ? 'savePrisonAffairs' : 'updatePrisonAffairs' ](fields)
                if( !!data ) {
                    this.$router.push({ path: `/prison-affairs-list/${ this.$route.meta.typeId }` })
                }
            },

            handlePreview(fields) {
                // fields = Object.assign({ updatedTime: this.$_dateNow }, fields)
                // fields.preContent = this.handleTextareaValue(fields.content)
                // this.setGuideStorage(fields)
                // this.$router.push({ path: '/operation-guide/detail' })
            },

            async handleBack(fields) {
                try {
                    if( !isEqual(this.affairsData, fields)) {
                        await this.$confirm('页面内容已更新，您确定要离开吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                    }
                    this.setGuideStorage()
                    this.$router.push({ path: `/prison-affairs-list/${ this.$route.meta.typeId }` })
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
</script>

<style lang="sass" scoped>

</style>
