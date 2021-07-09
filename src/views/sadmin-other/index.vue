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
                <template #orgType="{ row }">
                    <span>{{ row.orgType | orgTypes }}</span>
                </template>
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
    import filters from '@/filters/modules/switches'
    import { mapActions } from 'vuex'
    export default {
        data() {
            return {
                searchItems: {
                    provinceCode: {
                        label: '省份',
                        type: 'select',
                        options: [],
                        belong: {
                            label: 'name',
                            value: 'id'
                        },
                        selectKey: 'provinceCode',
                        value: ''
                    },
                    cityCode: {
                        label: '市',
                        type: 'select',
                        options: [],
                        belong: {
                            label: 'name',
                            value: 'id'
                        },
                        selectKey: 'cityCode',
                        value: ''
                    },
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
                    }
                },
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
                        prop: 'countyName'
                    },
                    {
                        label: '单位类型',
                        slotName: 'orgType'
                    },
                    {
                        label: '单位名称',
                        prop: 'orgName'
                    },
                    {
                        label: '地址',
                        prop: 'streetDetail',
                        showOverflowTooltip: true
                    }
                ],
                total: 0
            }
        },
        async created() {
            let { options } = await this.getProvincesAll()
            this.searchItems.provinceCode.options = options || []
        },
        methods: {
            ...mapActions(['getProvincesAll', 'getCities']),

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
                if( data && data.otherOrgInfo ) {
                    this.tableDatas = data.otherOrgInfo
                    this.total = data.total
                }
            },

            async searchSelectChange(key, val) {
                if( key == 'orgType' ) {
                    let { data } = await http.getOrgNames(val)
                    this.searchItems.orgName.options = data || []
                    this.searchItems.orgName.value = ''
                }
                if( key == 'cityCode' ) {
                    this.searchItems.orgType.value = ''
                    this.searchItems.orgName.value = ''
                }
                if( key == 'provinceCode' ) {
                    let { citys } = await http.getCities(val)
                    this.searchItems.cityCode.options = citys || []
                    this.searchItems.cityCode.value = ''
                    this.searchItems.orgType.value = ''
                    this.searchItems.orgName.value = ''
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