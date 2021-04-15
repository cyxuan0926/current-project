<template>
    <el-dialog :visible.sync="visible" :title="`${ reviewData.type == 'media' ? '通话视频或录音' : '通话纪要' }`" width="720px" @close="handleClose">
        <div class="summary-scroller">
            <template v-if="reviewData.type == 'media'">
                <m-table-new
                    stripe
                    :data="tableDatas"
                    :cols="tableCols"
                    :height="245">
                    <template #media="{ row }">
                        <template v-if="row.phoneType == '1'">
                            <m-audio v-if="row.filePath" :value="`${ row.filePath }?token=${ $urls.token }`" />
                            <span v-else>暂无音频</span>
                        </template>
                        <template v-if="row.phoneType != '1'">
                            <video
                                v-if="row.filePath"
                                controls
                                poster="/static/images/video-background.png"
                                style="width: 198px; height: 112px;"
                                :src="`${ row.filePath }?token=${ $urls.token }`">
                            </video>
                            <span v-else>暂无视频</span>
                        </template>
                    </template>
                    <template #duration="{ row }">
                        {{ row.duration | formatDuration }}
                    </template>
                </m-table-new>
            </template>
            <div class="summary-container clearfix" v-for="r in records">
                <dl class="summary-item">
                    <dt>通话纪要记录人：</dt>
                    <dd>{{ r.createdBy }}</dd>
                </dl>
                <dl class="summary-item">
                    <dt>记录时间：</dt>
                    <dd>{{ r.createdAt }}</dd>
                </dl>
                <dl class="summary-item" style="width: 100%;">
                    <dt>通话纪要内容：</dt>
                    <dd>{{ r.remarks }}</dd>
                </dl>
            </div>
            <div class="summary-form" v-if="reviewData.flag == '0'">
                <el-input
                    type="textarea"
                    placeholder="请补充通话纪要"
                    v-model="remarks"
                    :rows="3"></el-input>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import http from '@/service'
    export default {
        props: {
            value: Boolean,
            input: Function,
            reviewData: Object,
            onSave: Function
        },
        filters: {
            formatDuration(val) {
                let _h, _m, _s;
                _h = parseInt(val / 3600)
                _s = val % 3600
                _m = parseInt( _s / 60 )
                _s %= 60
                return `${ _h ? `${ _h }时` : '' }${ _m ? `${ _m }分` : '' }${ _s ? `${ _s }秒` : '' }`
            }
        },
        watch: {
            value: {
                handler(val) {
                    this.visible = val
                    val && this.getSummaryDetails()
                }
            }
        },
        data() {
            return {
                visible: false,
                remarks: '',
                records: [],
                tableDatas: [],
                tableCols: [
                    {
                        label: '视频或录音',
                        slotName: 'media',
                        align: 'center'
                    },
                    {
                        label: '通话时间段',
                        prop: 'callTime',
                        align: 'center'
                    },
                    {
                        label: '通话时长',
                        slotName: 'duration',
                        width: '100px',
                        align: 'center'
                    }
                ]
            }
        },
        methods: {
            async getSummaryDetails() {
                let _params = this.reviewData.isAdmin ? {
                    videoId: this.reviewData.uid,
                    type: this.reviewData.tab
                } : {
                    callId: this.reviewData.callId,
                    tab: this.reviewData.tab
                }
                if( this.reviewData.type == 'media' ) {
                    if( _params.tab == '2' ) {
                        _params.meetingId = this.reviewData.meetingId
                    }
                    let { data } = await http.getIntraFamilyphoneDet(_params)
                    if( data.details && data.details.records ) {
                        this.tableDatas = data.details.records
                    }
                }
                let { data: _data } = await http[ this.reviewData.isAdmin ? 'getFamilyphoneSumCons' : 'getIntraFamilyphoneCon' ](_params)
                if( _data ) {
                    this.records = _data
                }
            },

            handleSubmit() {
                if( this.reviewData.flag == '0' && !this.remarks ) {
                    this.$message.error('请输入通话纪要')
                    return
                }
                let _summary = Object.assign(
                    { type: '2', remarks: this.remarks },
                    this.reviewData.tab == '1' ? { videoId: this.reviewData.callId } : { sequence: this.reviewData.callId }
                )
                this.$emit('on-save', _summary)
                this.handleClose()
            },

            handleClose() {
                this.$emit('input', false)
                this.remarks = ''
            }
        },
    }
</script>

<style lang="scss" scoped>
    .summary-scroller {
        width: 100%;
        max-height: 360px;
        overflow: auto;
    }
    .summary-table {
        margin-bottom: 30px;
    }
    .summary-container {
        padding: 0 16px;
        &.clearfix {
            display: table;
            content: '';
            clear: both;
        }
        & + .summary-container {
            padding-top: 16px;
            border-top: 1px solid #ededed;
        }
    }
    .summary-item {
        margin: 0 16px 16px 0;
        float: left;
        dt,
        dd {
            color: #333;
            margin: 0;
            float: left;
        }
        dd {
            color: #999;
        }
    }
    .summary-form {
        padding: 16px 16px 0;
    }
</style>