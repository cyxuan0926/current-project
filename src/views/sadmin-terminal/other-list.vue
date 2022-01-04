<template>
    <el-row
        class="row-container"
        :gutter="0">
        <el-button
            size="small"
            class="button-add button-shift-down"
            type="primary"
            plain
            @click="handleAdd">添加终端信息</el-button>
        <m-search
            :items="searchItems"
            ref="search"
            @search="onSearch"
            @searchSelectChange="searchSelectChange">
        </m-search>
        <el-col :span="24">
            <m-table-new
                stripe
                :data="tableDatas"
                :cols="tableCols">
                <template #isEnabled="{ row }">{{ row.isEnabled | isOpened}}</template>
                <template #terminalType="{ row }">{{ row.orgType | orgTypes }}</template>
                <template #operation="{ row }">
                    <el-button
                        type="primary"
                        size="mini"
                        @click="handleEdit(row.id)">编辑</el-button>
                    <el-button
                        :type="row.isEnabled ? 'danger': 'primary'"
                        size="mini"
                        @click="handleEnable(row)">{{ row.isEnabled ? '停用' : '启用' }}</el-button>  
                </template>
            </m-table-new>
        </el-col>
        <m-pagination
            ref="pagination"
            :total="total"
            @onPageChange="getData" />
    </el-row>
</template>

<script>
    import http from '@/service'
    import filters from '@/filters/modules/switches'
    export default {
        name: 'OtherTerminalList',
        data() {
            return {
                searchItems: {
                    orgType: {
                        label: '单位类型',
                        type: 'select',
                        options: filters.orgTypes.slice(1),
                        selectKey: 'orgType',
                        value: ''
                    },
                    orgName: {
                        label: '单位名称',
                        type: 'select',
                        options: [],
                        belong: {
                            label: 'orgName',
                            value: 'orgName'
                        },
                        value: ''
                    },
                    isEnabled: {
                        type: 'select',
                        label: '终端状态',
                        options: this.$store.state.isOpened
                    }
                },
                tableDatas: [],
                tableCols: [
                    {
                        label: '终端号',
                        prop: 'terminalNumber'
                    },
                    {
                        label: '终端别名',
                        prop: 'terminalName',
                        showOverflowTooltip: true,
                        minWidth: 70
                    },
                    {
                        label: '终端唯一标识',
                        prop: 'terminalSn',
                        minWidth: 100
                    },
                    {
                        label: '会议室号',
                        prop: 'roomNumber'
                    },
                    {
                        label: '单位类型',
                        slotName: 'orgType',
                        minWidth: 70
                    },
                    {
                        label: '单位名称',
                        prop: 'orgName',
                        showOverflowTooltip: true,
                    },
                    {
                        label: '主持人密码',
                        prop: 'hostPassword'
                    },
                    {
                        label: '参会密码',
                        prop: 'mettingPassword'
                    },
                    {
                        label: '终端状态',
                        slotName: 'isEnabled',
                        minWidth: 60
                    },
                    {
                        label: '操作',
                        slotName: 'operation',
                        width: '150px',
                        align: 'center'
                    }
                ],
                total: 0
            }
        },
        methods: {
            // 增加
            handleAdd() {
                this.$router.push({ path: '/other-terminal/add' })
            },
            // 编辑
            handleEdit(id) {
                this.$router.push({ path: `/other-terminal/edit/${ id }` })
            },
            // 启用 停用
            async handleEnable(row) {
                let { id, isEnabled, terminalNumber } = row
                try {
                    await this.$confirm(
                        `${ isEnabled ? '停用后终端不可用，确认停用吗？' : '确定启用吗？' }`,
                        '提示',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }
                    )
                    let _isEnabled = isEnabled ? 0 : 1
                    let res = await http.enableOtherTerminal({ id, isEnabled: _isEnabled, terminalNumber })
                    if (res) {
                        row.isEnabled = _isEnabled
                    }
                } catch (e) {}
            },
            // 查询
            onSearch() {
                const { rows } = this.pagination
                this.loading = true
                this.$refs.pagination.currentPage = 1
                this.pagination = Object.assign({}, { page: 1, rows })
                this.getData()
            },
            // 获取列表数据
            async getData() {
                const params = Object.assign( {}, { ...this.filter, ...this.pagination } )
                let { data } = await http.getOtherTerminal(params)
                if( data && data.terminals ) {
                    this.tableDatas = data.terminals
                    this.total = data.total
                }
            },
            async searchSelectChange(key, val) {
                if( key == 'orgType' ) {
                    let { data } = await http.getOrgNames(val, 0)
                    this.searchItems.orgName.options = data || []
                    this.searchItems.orgName.value = ''
                }
            }
        },
        activated() {
            this.$refs.search.onGetFilter()
            this.getData()
        }
    }
</script>
