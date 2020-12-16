<template>
    <div>
        <m-table-new
            ref="mtableNew"
            :data="tableDatas"
            :cols="tableCols"
            stripe
            class="mini-td-padding"
            style="width: 100%">
            <template #name="{ row }">
                
            </template>
            <template #status="{ row }">

            </template>
            <template #operation="{ row }">
                <el-button
                    size="mini"
                    @click="handleGuideEdit(row)">编辑
                </el-button>
                <el-button
                    size="mini"
                    @click="handleGuideDetail(row)">详情
                </el-button>
            </template>
        </m-table-new>
        <m-pagination
            ref="pagination"
            :total="tableDatas.total"
            @onPageChange="handlePageChange" />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableCols: [
                    {
                        label: '更新时间',
                        prop: '',
                    },
                    {
                        label: '更新内容简介',
                        prop: '',
                        showOverflowTooltip: true
                    },
                    {
                        label: '操作',
                        slotName: 'operation',
                        minWidth: 80
                    }
                ]
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>
