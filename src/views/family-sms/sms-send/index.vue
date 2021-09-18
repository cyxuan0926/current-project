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
                        :disabled="row.status == 4"
                        type="text"
                        size="mini"
                        @click="handleClick(row)">{{ row.status | sendSms }}</el-button>
                </template>
            </m-table-new>
        </el-col>
        <m-pagination
            ref="$pagination"
            :total="tableData.total"
            @onPageChange="getData" />
        <smsSendModal v-model="showModal" :modalData="modalData" :queryMethod="getData" />
    </el-row>
</template>

<script>
import { ref, reactive, onMounted } from '@vue/composition-api'
import smsSendModal from './components/sms-send-modal.vue'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import http from '@/service'
import { _searchItems, _tableCols } from './constants'

export default {
    components: {
        smsSendModal
    },

    mixins: [ prisonFilterCreator ],

    setup (props, context) {
        // ref search
        const $search = ref(null)
        // ref pagination
        const $pagination = ref(null)

        // 发送短信弹窗
        const showModal = ref(false)
        // 发送短信弹窗数据
        const modalData = ref({})

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
        const handleClick = (row) => {
            modalData.value = row
            showModal.value = true
        }

        // 查询列表
        const getData = async () => {
            const params = {
                jailId: this.$store.state.global.user.jailId,
                ...pagination.value,
                ...filter.value
            }
            let { data } = await http.getSendMessageList(params)
            if (data && data.list) {
                tableData.data = data.list
                tableData.total = data.total
            }
        }

        // 生命周期 mounted
        onMounted(() => {
            $search.value.onGetFilter()
            getData()
        })

        return {
            $search,
            $pagination,
            showModal,
            modalData,
            searchItems,
            tableData,
            filter,
            pagination,
            getData,
            handleSearch,
            handleClick
        }
    }
}
</script>

<style lang="scss" scoped>

</style>