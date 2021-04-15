<template>
    <el-row
        class="row-container"
        :gutter="0">
        <m-excel-download
            :path="`${ isAdmin ? '/familyphonesummary/export' : `/download/exportVideoTelSummary?tab=${ tab }` }`"
            :params="filter"
            :apiConfigs="{
              apiHostKey: `${ isAdmin ? 'apiHost' : 'jailApiHost' }`,
              apiPathKey: `${ isAdmin ? 'apiPath' : '' }`
            }" />
        <m-search
            :items="searchItems"
            ref="search"
            @search="onSearch" />
        <el-col :span="24">
            <el-tabs
                v-model="tab"
                type="card">
                <el-tab-pane label="亲情电话" name="1" />
                <el-tab-pane label="可视电话" name="2" />
            </el-tabs>
            <m-table-new
                stripe
                :data="tableDatas"
                :cols="tableCols">
                <template #familyName="{ row }">
                    <template v-if="tab == '1' && !row.isReg">
                        <span v-for="f in row.families" :key="f.familyId">{{ f.familyName }}</span>
                    </template>
                    <template v-if="tab == '1' && row.isReg || tab == '2'">
                        <el-button
                            v-for="f in row.families"
                            :key="f.familyId"
                            type="text"
                            size="mini"
                            @click="handleQueryFamilyDet(row, f.familyId)">{{ f.familyName }}</el-button>
                    </template>
                </template>
                <template #operation="{ row }">
                    <el-button
                        v-if="!isAdmin"
                        type="text"
                        size="mini"
                        @click="handleReview(row, 'media')">查看视频录音详情</el-button>
                    <el-button
                        v-if="isAdmin || !!row.flag"
                        type="text"
                        size="mini"
                        @click="handleReview(row, 'query')">查看通话纪要</el-button>
                    <el-button
                        v-if="!isAdmin && !row.flag"
                        type="text"
                        size="mini"
                        @click="handleReview(row, 'submit')">复核</el-button>
                </template>
            </m-table-new>
        </el-col>
        <m-pagination
            ref="pagination"
            :total="total"
            @onPageChange="getData" />
        <!-- 家属详情 -->
        <family-detail-modal v-model="familyModalVisible" :familyData="familyData" />
        <!-- 音视频和通话纪要 -->
        <call-summary-modal v-model="summaryModalVisible" :reviewData="reviewData" @on-save="handleSaveSummary" />
    </el-row>
</template>

<script>
    import prisonFilterCreator from '@/mixins/prison-filter-creator'
    import familyDetailModal from '@/components/family/family-detail-modal.vue'
    import callSummaryModal from './components/call-summary-modal.vue'
    import http from '@/service'
    import router from '@/router'
    export default {
        components: {
            familyDetailModal,
            callSummaryModal
        },
        mixins: [ window.location.href.includes('call-supervise-admin') ? prisonFilterCreator : {
            data() {
                return {
                    filter: {}
                }
            }
        } ],
        data() {
            const isAdmin = window.location.href.includes('call-supervise-admin')
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
                    slotName: 'familyName'
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
                    align: 'center',
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
                tab: '1', // 1-亲情电话 2-可视电话
                familyModalVisible: false,
                summaryModalVisible: false,
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
                total: 0,
                reviewData: {},
                familyData: {}
            }
        },
        watch: {
            tab() {
                this.$refs.search.onClear()
                this.getData()
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
                const params = Object( this.isAdmin ? { type: this.tab } : { tab: this.tab }, { ...this.filter, ...this.pagination } )
                let { data } = await http[ this.isAdmin ? 'getFamilyphoneSum' : 'getIntraFamilyphoneSum' ](params)
                if( data && data.list ) {
                    data.list.forEach(d => {
                        if( !d.families || !d.families.length ) {
                            d.families = [{
                                familyId: d.familyId,
                                familyName: d.familyName
                            }]
                        }
                    })
                    this.tableDatas = data.list
                    this.total = data.totalElements
                }
            },

            // getFamilyphoneSum - 外网返回 uid
            // getIntraFamilyphoneSum - 监狱内网 callId
            handleReview({ uid, callId, meetingId, flag }, type) {
                this.reviewData = {
                    uid,
                    callId,
                    meetingId,
                    flag,
                    type,
                    tab: this.tab,
                    isAdmin: this.isAdmin
                }
                this.summaryModalVisible = true
            },
            async handleQueryFamilyDet({ criminalNumber, meetingId }, familyId) {
                let _params = {
                    meetingId,
                    criminalNumber,
                    familyId
                }
                if( !this.isAdmin ) {
                    let { data } = await http[ this.tab == '1' ? 'getIntraFamilyInfo' : 'getIntraMeetingInfo' ](_params)
                    this.familyData = data.family
                    this.familyModalVisible = true
                }
            },
            async handleSaveSummary(data) {
                await http.createIntraFamilyReview(data)
                this.getData()
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