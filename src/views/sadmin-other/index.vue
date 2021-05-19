<template>
    <el-row
        class="row-container"
        :gutter="0">
        <m-search
            :items="searchItems"
            ref="search"
            @search="onSearch">
        </m-search>
        <el-col :span="24">
            <m-table-new
                stripe
                :data="tableDatas"
                :cols="tableCols">
                <!-- <template #operation="{ row }">
                </template> -->
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
    export default {
        data() {
            return {
                searchItems: {},
                tableDatas: [],
                tableCols: [
                    {
                        label: '省份',
                        prop: 'provinceName'
                    },
                    {
                        label: '市',
                        prop: 'cityName'
                    },
                    {
                        label: '区县',
                        prop: 'prisonArea'
                    },
                    {
                        label: '单位类型',
                        prop: 'prisonArea'
                    },
                    {
                        label: '单位名称',
                        prop: 'prisonArea'
                    },
                    {
                        label: '地址',
                        prop: 'prisonArea',
                        showOverflowTooltip: true
                    }
                ],
                total: 0
            }
        },
        methods: {
            onSearch() {
                const { rows } = this.pagination
                this.loading = true
                this.$refs.pagination.currentPage = 1
                this.pagination = Object.assign({}, { page: 1, rows })
                this.getData()
            },

            async getData() {
                const params = Object.assign( {}, { ...this.filter, ...this.pagination } )
                let { data } = await http.getOtherOrgs(params)
                if( data && data.list ) {
                    this.tableDatas = data.list
                    this.total = data.totalElements
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