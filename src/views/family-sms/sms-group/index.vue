<template>
    <el-row
        class="row-container"
        :gutter="0">
        <m-search
            :items="searchItems"
            ref="$search"
            @search="handleSearch">
            <template #append>
                <el-button type="primary" @click="handleSendAll">群发短信</el-button>
            </template>
        </m-search>
        <el-col :span="24">
            <m-table-new
                stripe
                :data="tableData.data"
                :cols="tableData.cols">
                <!-- <template #operation="{ row }">
                    <el-button
                        :disabled="row.status == 4 || row.status == 5"
                        type="text"
                        size="mini"
                        @click="handleClick(row)">{{ row.status | sendSms }}</el-button>
                </template> -->
            </m-table-new>
        </el-col>
        <m-pagination
            ref="$pagination"
            :total="tableData.total"
            @onPageChange="getData" />
        <sms-group-modal v-model="showModal"  @on-sended="getData" />
    </el-row>
</template>

<script>
import { ref, reactive, onMounted } from '@vue/composition-api'
import smsGroupModal from './components/sms-group-modal.vue'
import http from '@/service'
import { _searchItems, _tableCols } from './constants'

export default {
    components: {
        smsGroupModal
    },

    setup (props, context) {
        // ref search
        const $search = ref(null)

        // ref pagination
        const $pagination = ref(null)

        // 是否发送成功
        const isSended = ref(false)

        // 发送短信弹窗
        const showModal = ref(false)

        // 搜索条件项
        const searchItems = ref(_searchItems())

        // 表格数据
        const tableData = reactive({
            data: [],
            cols: _tableCols(),
            total: 0
        })

        // 搜索条件参数
        const filter = ref({})

        // 分页查询参数
        const pagination = ref({})

        // 点击查询按钮 重置搜索条件
        const handleSearch = () => {
            const { rows } = pagination.value
            $pagination.value.currentPage = 1
            pagination.value = { page: 1, rows }
            getData()
        }

        // 点击发送短信按钮
        const handleSendAll = () => {
            showModal.value = true
        }

        // 查询列表
        const getData = async () => {
            const params = {
                role: 1, // 0-管理员 1-监狱
                jailId: JSON.parse(localStorage.getItem('user')).jailId,
                ...pagination.value,
                ...filter.value
            }
            let { data } = await http.getSendMessageGroupList(params)
            if (data && data.batchNotifyList) {
                tableData.data = data.batchNotifyList
                tableData.total = data.total
            }
        }

        // 初始化
        getData()

        return {
            $search,
            $pagination,
            showModal,
            searchItems,
            tableData,
            filter,
            pagination,
            getData,
            handleSearch,
            handleSendAll
        }
    }
}
</script>

<style lang="scss" scoped>

</style>