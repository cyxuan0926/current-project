<template>
    <el-row
        class="row-container"
        :gutter="0">
        <m-search
        :items="searchItems"
        ref="search"
        @searchSelectChange="searchSelectChange"
        @search="onSearch" />
        <el-col :span="24">
            <dip-det-table :tableDatas="tableDatas" :isAdmin="false" @on-page="handlePage" :hasAuth="hasAllPrisonQueryAuth" />
        </el-col>
    </el-row>
</template>

<script>
    import prisonFilterCreator from '@/mixins/prison-filter-creator'
    import dipDetTable from '@/components/diplomat/dip-det-table.vue'
    import http from '@/service'
    import Moment from 'moment'
    const startDate = Moment().format('YYYY-MM')
    const endDate = Moment().format('YYYY-MM')
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
                        type: 'monthRangeSelector',
                        canNotClear: true,
                        startKey: 'startDate',
                        endKey: 'endDate',
                        range: {
                            max: Moment().format('YYYY-MM'),
                            maxMonthRange: 24
                        },
                        value: [startDate, endDate]
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
            handlePage(page, rows) {
                if( page ) {
                    this.pagination.page = page
                }
                if( rows ) {
                    this.pagination.rows = rows
                }
                this.getDatas()
            },

            setDiplomatsNameData(data) {
                if( data && data.length ) {
                    return data.map(d => {
                        let dips = []
                        if( d.diplomatsName ) {
                            d.diplomatsName.split(',').forEach(dip => {
                                let _dip = dip.split(':')
                                dips.push({
                                    name: _dip[0],
                                    id: _dip[1]
                                })
                            })
                        }
                        d.diplomatsName = dips
                        return d
                    })
                }
                return []
            },

            async getDatas() {
                const { diplomatsMeetingDetails,  total} = await http.getDiplomatistDetail({
                    startDate,
                    endDate,
                    ...this.filter,
                    ...this.pagination
                })
                this.tableDatas = {
                    contents: this.setDiplomatsNameData(diplomatsMeetingDetails),
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
