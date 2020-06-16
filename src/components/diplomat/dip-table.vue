<template>
    <div>
        <m-table-new
            ref="mtableNew"
            :data="tableDatas.contents"
            :cols="tableCols"
            @sort-change="handleSortChange"
            stripe
            class="mini-td-padding"
            style="width: 100%">
            <template #name="{ row }">
                <span v-for="(f, i) in row.families" :key="f.familyId">{{f.familyName}}<i v-if="i != row.families.length - 1">，</i></span>
            </template>
            <template #status="{ row }">
                <span v-if="row.status === 'PENDING' && row.isLock === 1">处理中</span>
                <span v-else>{{ row.status | applyStatus }}</span>
            </template>
            <template #operation="{ row }">
                <el-button
                    size="mini"
                    @click="handleShowDetails(row)">详情
                </el-button>
            </template>
        </m-table-new>
        <m-pagination
            ref="pagination"
            :total="tableDatas.total"
            @onPageChange="handlePageChange" />
        <el-dialog
            title="姓名：令狐冲"
            width="530px"
            :visible.sync="detailsVisible"
            class="dip-dialog"
            >
            <table class="dipdetail__table">
                <tbody>
                    <tr>
                        <td colspan="2">所在机构/馆名：{{currentData.orgName}}</td>
                    </tr>
                    <tr>
                        <td width="50%">预约时间：{{currentData.meetingTime}}</td>
                        <td width="50%">终端号：{{currentData.terminalNumber}}</td>
                    </tr>
                    <tr>
                        <td>审核人账号：{{currentData.auditUserName}}</td>
                        <td>审核人姓名：{{currentData.auditRealName}}</td>
                    </tr>
                    <tr>
                        <td>审核时间：{{currentData.auditAt | Date}}</td>
                        <td>审核状态：{{currentData.status | applyStatus}}</td>
                    </tr>
                    <tr>
                        <td>通话时长：{{currentData.applyTimes | time}}</td>
                    </tr>
                    <tr>
                        <td>拒绝原因：{{currentData.content}}</td>
                    </tr>
                </tbody>
            </table>
        </el-dialog>
    </div>
</template>

<script>
    import http from '@/service'
    export default {
        props: {
            role: {
                type: String,
                default: '0'
            },
            hasAuth: Boolean,
            tableDatas: Object
        },
        data() {
            return {
                detailsVisible: false,
                currentData: {},
                tableCols: [
                    {
                        label: '省份',
                        prop: 'provinceName',
                        width: '80px'
                    },
                    {
                        label: '监狱名称',
                        prop: 'jailName'
                    },
                    {
                        label: '姓名',
                        prop: 'name',
                        slotName: 'name'
                    },
                    {
                        label: '所在机构/馆名',
                        prop: 'orgName'
                    },
                    {
                        label: '申请时间',
                        prop: 'applicationDate'
                    },
                    {
                        label: '申请通话时间',
                        prop: 'meetingTime',
                        sortable: 'custom',
                    },
                    {
                        label: '申请时长',
                        prop: 'applyTimes',
                        width: '80px'
                    },
                    {
                        label: '申请状态',
                        prop: 'status',
                        slotName: 'status'
                    },
                    {
                        label: '操作',
                        slotName: 'operation'
                    }
                ]
            }
        },
        methods: {
            async handleShowDetails({ id }) {
                let { data } = await http.getMeettingsDetail({
                    meetingId: id
                })
                this.currentData = data
                this.detailsVisible = true
            },

            handlePageChange(page, rows) {
                this.$emit('on-page', page, rows)
            },

            handleSortChange({ prop, order }) {
                this.$emit('on-order', prop, order)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dip-dialog {
        
        /deep/ .el-dialog__header {
            border-bottom: 1px solid #E4E7ED;
        }
    }
    .dipdetail__table {
        width: 100%;
        td {
            padding: 5px;
        }
    }
</style>