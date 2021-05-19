<template>
    <el-row
        class="row-container"
        :gutter="0">
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
                <!-- <template #operation="{ row }">
                </template> -->
                <template #callOrgType="{ row }">
                    <span>{{ row.callOrgType | orgTypes }}</span>
                </template>
                <template #calledOrgType="{ row }">
                    <span>{{ row.calledOrgType | orgTypes }}</span>
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
    import { mapActions } from 'vuex'
    export default {
        data() {
            let _isAdmin = this.$store.state.global.user.role == '0'
            let _tableCols = [
                {
                    label: '监狱名称',
                    prop: 'callOrgName',
                    showOverflowTooltip: true
                },
                {
                    label: '终端',
                    prop: 'callTerminal'
                },
                {
                    label: '被呼叫单位类型',
                    slotName: 'calledOrgType'
                },
                {
                    label: '被呼叫单位名称',
                    prop: 'calledOrgName',
                    showOverflowTooltip: true
                },
                {
                    label: '终端',
                    prop: 'calledTerminal'
                },
                {
                    label: '开始时间',
                    prop: 'startTime',
                    width: '150px'
                },
                {
                    label: '结束时间',
                    prop: 'endTime',
                    width: '150px'
                },
                {
                    label: '时长',
                    prop: 'duration',
                    width: '80px'
                }
            ]
            let _searchItems = {
                applicationDate: {
                    type: 'dateRange',
                    unlinkPanels: true,
                    start: 'startTime',
                    end: 'endTime',
                    startPlaceholder: '开始时间',
                    endPlaceholder: '结束时间',
                    // miss: true,
                    value: [this.$_dateOneWeekAgo, this.$_dateNow]
                }
            }
            if (_isAdmin) {
                _tableCols[0].label = '单位名称'
                _tableCols.unshift(
                    {
                        label: '省份',
                        prop: 'callOrgProvince'
                    },
                    {
                        label: '单位类型',
                        slotName: 'callOrgType'
                    }
                )
                _searchItems = {
                    callOrgProvince: {
                        label: '省份',
                        type: 'select',
                        options: [],
                        belong: {
                            label: 'name',
                            value: 'id'
                        },
                        selectKey: 'callOrgProvince',
                        value: ''
                    },
                    callOrgType: {
                        label: '单位类型',
                        type: 'select',
                        options: filters.orgTypes,
                        selectKey: 'callOrgType',
                        value: ''
                    },
                    callOrgName: {
                        label: '单位名称',
                        type: 'select',
                        options: [],
                        belong: {
                            label: 'orgName',
                            value: 'id'
                        },
                        value: ''
                    },
                    calledOrgType: {
                        label: '被呼叫单位类型',
                        type: 'select',
                        options: filters.orgTypes,
                        selectKey: 'calledOrgType',
                        value: ''
                    },
                    calledOrgName: {
                        label: '被呼叫单位名称',
                        type: 'select',
                        options: [],
                        belong: {
                            label: 'orgName',
                            value: 'id'
                        },
                        value: ''
                    },
                    ..._searchItems
                }
            } else {
                _searchItems = {
                    calledOrgName: {
                        label: '被呼叫单位名称',
                        type: 'input'
                    },
                    ..._searchItems
                }
            }
            return {
                isAdmin: _isAdmin,
                searchItems: _searchItems,
                tableDatas: [],
                tableCols: _tableCols,
                total: 0
            }
        },
        async created() {
            if( this.isAdmin ) {
                let { options } = await this.getProvincesAll()
                this.searchItems.callOrgProvince.options = options || []
            }
        },
        methods: {
            ...mapActions(['getProvincesAll']),

            onSearch() {
                const { rows } = this.pagination
                this.loading = true
                this.$refs.pagination.currentPage = 1
                this.pagination = Object.assign({}, { page: 1, rows })
                this.getData()
            },

            async getData() {
                const params = Object.assign( this.isAdmin ? {} : { callOrgId: this.$store.state.global.user.jailId }, { ...this.filter, ...this.pagination } )
                let { data } = await http.getTerminalCallTerminal(params)
                if( data && data.terminalCallTerminals ) {
                    this.tableDatas = data.terminalCallTerminals
                    this.total = data.total
                }
            },

            async searchSelectChange(key, val) {
                if( key == 'callOrgType' || key == 'calledOrgType' ) {
                    let { data } = await http.getOrgNames(val)
                    let _key = key == 'callOrgType' ? 'callOrgName' : 'calledOrgName'
                    this.searchItems[ _key ].options = data || []
                    this.searchItems[ _key ].value = ''
                }
                if( key == 'callOrgProvince' ) {
                    this.searchItems.callOrgType.value = ''
                    this.searchItems.calledOrgType.value = ''
                    this.searchItems.callOrgName.value = ''
                    this.searchItems.calledOrgName.value = ''
                }
            }
        },
        mounted() {
            this.$refs.search.onGetFilter()
            this.getData()
        }
    }
</script>

<style lang="scss" scoped>

</style>