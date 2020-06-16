<template>
    <div>
        <m-table-new
            :data="tableDatas.contents"
            :cols="tableCols"
            stripe
            class="mini-td-padding"
            style="width: 100%">
            <template #diplomatsName="{ row }">
                <span v-for="(n, i) in row.diplomatsName" :key="n.id">
                    <label v-if="isAdmin">{{n.name}}</label>
                    <a v-else @click="handleShowInfo(n.id)">{{n.name}}</a>
                    <em v-if="i != row.diplomatsName.length - 1">，</em>
                </span>
            </template>
            <template #duration="{ row }">
                <span>{{ row.duration | time }}</span>
            </template>
            <template #operation="{ row }">
                <el-button
                    size="mini"
                    @click="handleShowRecords(row.meeting_details)">详情内容
                </el-button>
            </template>
        </m-table-new>
        <m-pagination
            ref="pagination"
            :total="tableDatas.total"
            @onPageChange="handlePageChange" />
        <el-dialog
            title="通话记录"
            :visible.sync="recordsVisible"
            @close="clearRecords"
            >
            <el-table :data="callRecords" stripe>
                <el-table-column label="开始时间">
                    <template slot-scope="scope">
                        {{ scope.row.start_time }}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间">
                    <template slot-scope="scope">
                        {{ scope.row.end_time }}
                    </template>
                </el-table-column>
                <el-table-column label="会见时长">
                    <template slot-scope="scope">
                        {{ scope.row.duration | time }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="remarks"
                    label="备注" />
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            isAdmin: {
                type: Boolean,
                default: false
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
                        prop: 'diplomatsName',
                        slotName: 'name'
                    },
                    {
                        label: '所在机构/馆名',
                        prop: 'orgName'
                    },
                    {
                        label: '可视电话时间段',
                        prop: 'c'
                    },
                    {
                        label: '通话时长',
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
            handleShowRecords(records) {
                this.recordsVisible = true
                this.callRecords = records
            },

            handleShowInfo() {
            },

            clearRecords() {
                this.callRecords = []
            },

            handlePageChange(page, rows) {
                this.$emit('on-page', page, rows)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
