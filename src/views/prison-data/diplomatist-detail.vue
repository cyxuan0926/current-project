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
            <dip-det-table :tableDatas="tableDatas" @on-page="getDatas" :hasAuth="hasAllPrisonQueryAuth" />
        </el-col>
    </el-row>
</template>

<script>
    import prisonFilterCreator from '@/mixins/prison-filter-creator'
    import dipDetTable from '@/components/diplomat/dip-det-table.vue'
    import http from '@/service'
    export default {
        mixins: [prisonFilterCreator],

        components: {
            dipDetTable
        },

        data() {
            return {
                searchItems: {
                    diplomatsName: {
                        type: 'input',
                        label: '姓名'
                    },
                    applicationDate: {
                        type: 'dateRange',
                        unlinkPanels: true,
                        start: 'applicationStartDate',
                        end: 'applicationEndDate',
                        startPlaceholder: '会见开始时间',
                        endPlaceholder: '会见结束时间'
                        // miss: true,
                        // value: ''
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

        created() {
            this.getDatas()
        },

        methods: {
            async getDatas() {
                const { diplomatsMeetingDetails,  total} = await http.getDiplomatistDetail({ ...this.filter, ...this.pagination })
                this.tableDatas = {
                    contents: diplomatsMeetingDetails,
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