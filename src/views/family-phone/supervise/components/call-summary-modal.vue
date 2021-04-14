<template>
    <el-dialog :visible.sync="visible" :title="reviewData.title" width="720px">
        <div class="summary-scroller">
            <el-table
                class="summary-table"
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="地址">
                </el-table-column>
            </el-table>
            <div class="summary-container clearfix">
                <dl class="summary-item">
                    <dt>通话纪要记录人：</dt>
                    <dd>狱警姓名或账号</dd>
                </dl>
                <dl class="summary-item">
                    <dt>记录时间：</dt>
                    <dd>2021-03-10 11:30:23</dd>
                </dl>
                <dl class="summary-item" style="width: 100%;">
                    <dt>通话纪要内容：</dt>
                    <dd>点击通话视频或录音栏的视频录音详情，打开视频录音弹窗，弹窗中包括罪犯姓名、家属姓名、视频录音文件 以及 通话纪要；点击弹窗中的视频或录音，可看或听视频和录音的具体内容，视频录音不可删除、编辑；可查看通话纪要，已符合的通话纪要不可编辑；</dd>
                </dl>
            </div>
            <div class="summary-container clearfix">
                <dl class="summary-item">
                    <dt>通话纪要记录人：</dt>
                    <dd>狱警姓名或账号</dd>
                </dl>
                <dl class="summary-item">
                    <dt>记录时间：</dt>
                    <dd>2021-03-10 11:30:23</dd>
                </dl>
                <dl class="summary-item" style="width: 100%;">
                    <dt>通话纪要内容：</dt>
                    <dd>点击通话视频或录音栏的视频录音详情，打开视频录音弹窗，弹窗中包括罪犯姓名、家属姓名、视频录音文件 以及 通话纪要；</dd>
                </dl>
            </div>
            <div class="summary-form">
                <el-input
                    type="textarea"
                    placeholder="请补充通话纪要"
                    v-model="remarks"
                    :rows="3"></el-input>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
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
        watch: {
            value: {
                handler(val) {
                    this.visible = val
                    this.getSummaryDetails()
                },
                immediate: true
            }
        },
        data() {
            return {
                visible: false,
                tableDatas: [],
                tableCols: [
                    {
                        label: '视频或录音',
                        slotName: 'media'
                    },
                    {
                        label: '通话时间段',
                        prop: 'callTime'
                    },
                    {
                        label: '通话时长',
                        prop: 'duration'
                    }
                ]
            }
        },
        methods: {
            async getSummaryDetails() {
                if( this.reviewData.type == 'media' ) {
                    let _params = {
                        callId: this.reviewData.callId,
                        tab: this.reviewData.tab
                    }
                    if( _params.tab == '2' ) {
                        _params.meetingId = this.reviewData.meetingId
                    }
                    let { data } = http.getIntraFamilyphoneDet(_params)
                    if( data.details && data.details.records ) {
                        this.tableDatas = data.details.records
                    }
                }
            },

            handleSubmit() {

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