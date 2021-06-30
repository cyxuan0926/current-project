<template>
    <el-row
        class="row-container"
        :gutter="0">
        <m-search
            :items="searchItems"
            ref="search"
            @search="onSearch">
            <template slot="append">
                <el-button
                    type="primary"
                    :loading="loading.download"
                    @click="handleExportExcel"
                    >导出 Excel</el-button>
            </template>
            <template slot="append">
                <el-button
                    type="primary"
                    :loading="loading.refresh"
                    @click="handleRefresh"
                    >{{ loading.refresh ? '刷新中...' : '刷新' }}</el-button>
            </template>
        </m-search>
        <el-col :span="24">
            <el-tabs
                v-model="tab"
                type="card">
                <el-tab-pane label="终端设备升级详情表" name="1" />
                <el-tab-pane label="终端设备升级统计表" name="2" />
            </el-tabs>
            <m-table-new
                stripe
                :data="tableDatas"
                :cols="tableCols">
                <template #status="{ row }">
                    <span>{{ row.status == '1' ? '已升级' : '未升级' }}</span>
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
    import prisonFilterCreator from '@/mixins/prison-filter-creator'
    import http from '@/service'
    import { tabcols, searchItems } from './constants/index'
    import { saveAs } from 'file-saver'
    import { DateFormat } from '@/utils/helper'
    export default {
        mixins: [ prisonFilterCreator ],
        data() {
            return {
                loading: {
                    download: false,
                    refresh: false
                },
                tab: '1', // 1-终端设备升级详情表 2-终端设备升级统计表
                searchItems: searchItems(),
                tableDatas: [],
                tableCols: tabcols(true),
                total: 0
            }
        },
        watch: {
            tab: {
                handler(val) {
                    let _searchItems = {}
                    Object.keys(this.searchItems).forEach(k => {
                        if (k == 'provincesId' || k == 'jailId') {
                            _searchItems[k] = this.searchItems[k]
                        }
                    })
                    this.searchItems = Object.assign(_searchItems, val == '1' ? searchItems() : null)
                    this.tableCols = tabcols(val == '1')
                    this.$nextTick(() => {
                        this.$refs.search.onClear()
                        this.getData()
                    })
                }
            }
        },
        methods: {
            onSearch() {
                const { rows } = this.pagination
                this.$refs.pagination.currentPage = 1
                this.pagination = Object.assign({}, { page: 1, rows })
                this.getData()
            },

            async getData() {
                const params = Object.assign({ ...this.filter, ...this.pagination })
                // 为了兼容接口 getTerminalStatistics 传provinceId
                if( this.tab == '2' ) {
                    params.provinceId = params.provincesId
                }
                let { data } = await http[ this.tab == '1' ? 'getTerminalDetlist' : 'getTerminalStatistics' ](params)
                if( data && (data.records || data.pageInfo) ) {
                    let _records = data.records || data.pageInfo.records || []
                    if (this.tab == '2') {
                        _records.push({
                            provinceName: '总计：',
                            jailName: '',
                            jailTotalEquipment: data.totalEquipment,
                            jailUpgradeTotal: data.upgradeTotal,
                            jailNotUpgradeTotal: data.notUpgradeTotal,
                            jailUpgradePercentage: data.upgradePercentage
                        })
                    }
                    this.tableDatas = _records
                    this.total = this.tab == '1' ? data.total : data.pageInfo.total
                }
            },
            // 点击导出
            async handleExportExcel() {
                if (this.loading.download) {
                    return
                }
                this.loading.download = true
                const params = { ...this.filter, page: 1, rows: this.total }
                try {
                    let data = await http.exportTerminalUpgrade(params)
                    saveAs(data, `终端设备升级${ this.tab == '1' ? '详情表' : '统计表' }-${ DateFormat(Date.now(),'YYYYMMDDHHmmss') }.xls`)
                    this.loading.download = false
                } catch (error) {
                    this.loading.download = false
                }
            },
            // 点击刷新
            async handleRefresh() {
                if (this.loading.refresh) {
                    return
                }
                this.loading.refresh = true
                try {
                    this.$refs.search.onGetFilter()
                    await this.getData()
                    this.loading.refresh = false
                } catch (error) {
                    this.loading.refresh = false
                }
            }
        },
        mounted() {
            this.handleRefresh()
        }
    }
</script>

<style lang="scss" scoped>

</style>