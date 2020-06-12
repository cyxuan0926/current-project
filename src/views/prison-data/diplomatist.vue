<template>
    <el-row
        class="row-container"
        :gutter="0">
        <m-excel-download
        v-if="hasAllPrisonQueryAuth"
        path="/download/exportRegistrations"
        :params="filter" />
        <m-search
        :items="searchItems"
        ref="search"
        @searchSelectChange="searchSelectChange"
        @search="onSearch" />
        <el-col :span="24">
            <el-tabs v-model="tabs" type="card">
                <el-tab-pane v-for="(tab, index) in tabsItems"
                    :key="index"
                    :label="tab.label"
                    :name="tab.name" />
            </el-tabs>
            <dip-table :tableDatas="tableDatas" @on-page="getDatas" />
        </el-col>
    </el-row>
</template>

<script>
    import prisonFilterCreator from '@/mixins/prison-filter-creator'
    import dipTable from '@/components/diplomat/dip-table.vue'
    import http from '@/service'
    export default {
        mixins: [prisonFilterCreator],

        components: {
            dipTable
        },

        data() {
            return {
                tabs: '',
                tabsItems: [
                    {
                        label: '会见申请',
                        name: 'first'
                    },
                    {
                        label: '未授权',
                        name: 'PENDING'
                    }
                ],
                searchItems: {
                    name: {
                        type: 'input',
                        label: '姓名'
                    },
                    applicationDate: {
                        type: 'dateRange',
                        unlinkPanels: true,
                        start: 'applicationStartDate',
                        end: 'applicationEndDate',
                        startPlaceholder: '会见开始时间',
                        endPlaceholder: '会见结束时间',
                        value: ''
                    },
                    auditName: {
                        type: 'input',
                        label: '审核人',
                        miss: true,
                        value: ''
                    },
                    status: {
                        type: 'select',
                        label: '审核状态',
                        options: this.$store.state.applyStatus,
                        miss: true,
                        value: ''
                    },
                    auditAt: {
                        type: 'date',
                        label: '审核时间',
                        miss: true,
                        value: ''
                    },
                },
                tableDatas: {
                    contents: [],
                    total: 0
                },
                pagination: {
                    rows: 10,
                    page: 1
                }
            }
        },

        watch: {
            tabs(val) {
                this.$refs.search.onSearch('tabs')
                if (val !== 'first') {
                    this.searchItems.status.miss = true
                    this.searchItems.auditAt.miss = true
                    this.searchItems.auditName.miss = true
                    delete this.filter.auditAt
                    delete this.filter.auditName
                    this.searchItems.auditName.value = ''
                    this.searchItems.auditAt.value = ''
                    this.searchItems.status.value = ''
                }
                else {
                    delete this.filter.status
                    this.searchItems.status.miss = false
                    this.searchItems.auditName.miss = false
                    this.searchItems.auditAt.miss = false
                }
                this.onSearch()
            },
        },

        created() {
            this.tabs = 'PENDING'
        },

        methods: {
            async getDatas() {
                if (this.tabs !== 'first') {
                    this.filter.status = this.tabs
                }
                const { meetings, total } = await http.getMeetingsDiplomats({ ...this.filter, ...this.pagination })
                this.tableDatas = {
                    contents: meetings,
                    total
                }
            },

            onSearch() {
                this.pagination.page = 1
                this.getDatas()
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>