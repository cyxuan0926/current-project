<template>
    <el-row
        class="row-container"
        :gutter="0">
        <!-- <m-excel-download
            v-if="hasAllPrisonQueryAuth"
            path="/download/exportMettings"
            :params="filter" /> -->
        <m-search
            :items="searchItems"
            ref="search"
            @search="onSearch" />
        <el-col :span="24">
            <m-table-new
                stripe
                :data="tableDatas"
                :cols="tableCols" >
                <template #operation="{ row }">
                    <el-button
                        v-if="!isAdmin"
                        size="mini"
                        @click="handleMediaDet(row.uid)">查看视频录音详情</el-button>
                    <el-button
                        v-if="isAdmin || !!row.flag"
                        size="mini"
                        @click="handleQueryDet(row.uid)">查看通话纪要</el-button>
                    <el-button
                        v-if="!isAdmin && !row.flag"
                        size="mini"
                        @click="handleReview(row.uid)">复核</el-button>
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
    import router from '@/router'
    const isAdmin = window.location.href.includes('call-supervise-admin')
    export default {
        mixins: [ isAdmin ? prisonFilterCreator : {
            data() {
                return {
                    filter: {}
                }
            }
        } ],
        data() {
            const tableCols = [
                {
                    label: '监区名称',
                    prop: 'prisonArea'
                },
                {
                    label: '罪犯编号',
                    prop: 'criminalNumber'
                },
                {
                    label: '罪犯姓名',
                    prop: 'criminalName'
                },
                {
                    label: '家属姓名',
                    prop: 'familyName'
                },
                {
                    label: '家属电话',
                    prop: 'familyPhone'
                },
                {
                    label: '通话开始时间',
                    prop: 'startAt'
                },
                {
                    label: '操作',
                    slotName: 'operation'
                }
            ]
            if( isAdmin ) {
                tableCols.unshift(
                    {
                        label: '省份',
                        prop: 'provinceName'
                    },
                    {
                        label: '监狱名称',
                        prop: 'jailName'
                    }
                )
            }
            return {
                isAdmin,
                searchItems: {
                    familyName: {
                        type: 'input',
                        label: '家属姓名'
                    },
                    criminalName: {
                        type: 'input',
                        label: '罪犯姓名'
                    },
                    criminalNumber: {
                        type: 'input',
                        label: '罪犯编号'
                    },
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
                },
                tableDatas: [],
                tableCols,
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
                const params = { ...this.filter, ...this.pagination }
                let { data } = await http[ this.isAdmin ? 'getFamilyphoneSum' : 'getIntraFamilyphoneSum' ](params)
                if( data && data.list ) {
                    this.tableDatas = data.list
                    this.total = data.totalElements
                }
            },

            handleMediaDet() {
                console.log(1)
            },

            handleQueryDet() {
                console.log(1)
            },

            handleReview() {

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