<template>
    <el-row
        class="row-container"
        :gutter="0">
        <m-search
            :items="searchItems"
            ref="$search"
            @search="handleSearch"
            @searchSelectChange="searchSelectChange">
        </m-search>
        <el-col :span="24">
            <m-table-new
                stripe
                :data="tableData.data"
                :cols="tableData.cols">
                <template #operation="{ row }">
                    <el-button
                        type="text"
                        size="mini">发送短信</el-button>
                        <!-- 发送提醒短信 短信已达上线 -->
                </template>
            </m-table-new>
        </el-col>
        <m-pagination
            ref="$pagination"
            :total="tableData.total"
            @onPageChange="getData" />
    </el-row>
</template>

<script>
import { ref, reactive, onMounted } from '@vue/composition-api'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import http from '@/service'
import { searItems, tableCols } from './constants'

export default {
    mixins: [ prisonFilterCreator ],

    setup (props, context) {
        // ref search
        const $search = ref(null)
        // ref pagination
        const $pagination = ref(null)
        // 搜索条件
        const searchItems = searItems()
        // 表格数据
        const tableData = reactive({
            data: [],
            cols: tableCols(),
            total: 0
        })
        // 分页数据
        const pagination = ref({})

        // 点击查询按钮 重置搜索条件
        const handleSearch = () => {
            const { rows } = pagination
            $pagination.value.currentPage = 1
            pagination.value = { page: 1, rows }
            getData()
        }

        // 查询列表
        const getData = async () => {
            const params = {
                ...pagination.value
            }
            let { data } = await http.getSendMessageList(params)
            console.log(data)
        }

        // 生命周期 mounted
        onMounted(() => {
            $search.value.onGetFilter()
            getData()
        })

        return {
            $search,
            $pagination,
            searchItems,
            tableData,
            pagination,
            handleSearch,
            getData
        }
    }
}
</script>

<style lang="scss" scoped>

</style>