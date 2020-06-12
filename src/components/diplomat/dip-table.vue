<template>
    <div>
        <el-table
            :data="tableDatas.contents"
            :cols="tableCols"
            stripe
            class="mini-td-padding"
            style="width: 100%">
            <template #name="{ row }">
                <span>{{row.name}}</span>
            </template>
            <template #operation="{ row }">
                <el-button
                    size="mini"
                    @click="handleShowDetails(row.meeting_details)">详情
                </el-button>
            </template>
        </el-table>
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
            }
        },
        computed: {
            tableCols() {
                let cols = [
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
                        prop: 'a',
                        slotName: 'name'
                    },
                    {
                        label: '所在机构/馆名',
                        prop: 'b'
                    },
                    {
                        label: '申请时间',
                        prop: 'c'
                    },
                    {
                        label: '申请通话时间',
                        prop: 'd',
                    },
                    {
                        label: '申请时长',
                        prop: 'd',
                    },
                    {
                        label: '申请状态',
                        prop: 'd',
                    },
                    {
                        label: '操作',
                        slotName: 'operation'
                    }
                ]
                if (!this.hasAuth) {
                    cols.splice(0, 2)
                }
                return cols
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