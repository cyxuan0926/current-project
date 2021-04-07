<template>
    <el-row
        class="row-container"
        :gutter="0">
        <m-excel-download
            v-if="hasAllPrisonQueryAuth"
            path="/download/exportMettings"
            :params="filter" />
        <m-search
            :items="searchItems"
            ref="search"
            @searchSelectChange="searchSelectChange"
            @search="onSearch" />
        <el-col :span="24">
            <m-table-new
                stripe
                :data="meetingsDiplomats.contents"
                :cols="tableCols" >
                <template
                slot-scope="scope"
                slot="meetingTime">
                <span >{{ scope.row.meetingTime || scope.row.applicationDate }}</span>
                </template>
                <template
                slot-scope="scope"
                slot="families">
                <div v-if="scope.row.filterFamilies && scope.row.filterFamilies.length">
                    <el-button
                    type="text"
                    size="small"
                    v-for="family in scope.row.filterFamilies"
                    :key="family.familyId"
                    style="margin-left: 0px; margin-right: 8px;"
                    @click="showFamilyDetail(family.familyId, scope.row.id)">{{ family.familyName }}</el-button>
                </div>
                </template>
                <template
                slot-scope="scope"
                slot="status">
                <span v-if="!scope.row.content">
                    <template v-if="scope.row.status === 'PENDING' && scope.row.isLock === 1">处理中</template>
                    <template v-else>{{ scope.row.status | applyStatus }}</template>
                </span>
                <el-tooltip
                    v-else
                    :content="scope.row.content"
                    placement="top" >
                    <span v-if="scope.row.status === 'PENDING' && scope.row.isLock === 1">处理中</span>
                    <span v-else>{{ scope.row.status | applyStatus }}</span>
                </el-tooltip>
                </template>
                <template
                slot-scope="scope"
                slot="operate">
                <el-button
                    v-if="scope.row.status == 'PENDING' && scope.row.isLock !== 1"
                    size="mini"
                    @click="handleAuthorization(scope.row)">授权</el-button>
                <el-button
                    v-else-if="scope.row.status === 'PASSED' && scope.row.isWithdrawFlag === 1"
                    size="mini"
                    @click="handleWithdraw(scope.row)">撤回</el-button>
                <el-button
                    v-if="scope.row.status != 'PENDING'"
                    type="text"
                    size="mini"
                    class="button-detail"
                    @click="onDetail(scope.row)">详情</el-button>
                </template>
            </m-table-new>
        </el-col>
        <m-pagination
            ref="pagination"
            :total="meetingsDiplomats.total"
            @onPageChange="getDatas" />
    </el-row>
</template>

<script>
    import prisonFilterCreator from '@/mixins/prison-filter-creator'
    import http from '@/service'
    import router from '@/router'
    export default {
        mixins: [
            router.currentRoute.meta.isAdmin ? prisonFilterCreator : {
                data() {
                    return {
                        filter: {}
                    }
                }
            }
        ],
        data() {
            const tableCols = [
                {
                    label: '监区名称',
                    prop: 'prisonArea'
                }
            ]
            return {
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
                tableData: [],
                tableCols: []
            }
        },
        created() {
            http.getFamilyphoneSum()
            http.getIntraFamilyphoneSum()
            http.getIntraFamilyphoneCon('18')
            http.getIntraFamilyphoneDet('18')
            http.createIntraFamilyReview({
                videoId: '18',
                remarks: '测试测试测试测试用。。。',
                createdBy: '9999_sh',
                type: '2'
            })
        }
    }
</script>

<style lang="scss" scoped>

</style>