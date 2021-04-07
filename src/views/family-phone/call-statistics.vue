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
    import http from '@/service'
    export default {
        data() {
            return {
                a: 1
            }
        },
        created() {
            this.getFamilyphoneSum()
            this.getIntraFamilyphoneSum()
        }
    }
</script>

<style lang="scss" scoped>

</style>