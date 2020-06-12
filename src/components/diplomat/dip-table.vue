<template>
    <div>
        <m-table-new
            :data="tableDatas.contents"
            :cols="tableCols"
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
                    @click="handleShowDetails(row.meeting_details)">详情
                </el-button>
            </template>
        </m-table-new>
        <m-pagination
            ref="pagination"
            :total="tableDatas.total"
            @onPageChange="emit('on-page')" />
    </div>
</template>

<script>
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
                callRecords: [],
                recordsVisible: false,
                tableCols: [
                    {
                        label: '省份',
                        prop: 'provinceName'
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
                    },
                    {
                        label: '申请时长',
                        prop: 'applyTimes',
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
        watch: {
            tableDatas(val) {
                console.log( '====', val )
                this.contents = val.contents
                this.total = val.total
                console.log( this.contents )
            }
        },
        methods: {
            handleShowDetails(records) {
                // this.recordsVisible = true
                // this.callRecords = records
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>