<template>
    <el-row class="row-container" :gutter="0">
        <el-button
            class="button-add button-shift-down"
            size="small"
            type="primary"
            plain
            @click="handleClick('add')">
            新增
        </el-button>
        <m-search
            ref="search"
            :items="searchItems"
            @search="handleSearch">
        </m-search>
        <el-col :span="24">
            <m-table-new
                :data="tableDatas"
                :cols="tableCols"
                class="mini-td-padding">
                <template #module="{ row }">
                    <span>{{ moduleItems[row.type] }}</span>
                </template>
                <template #status="{ row }">
                    <span>{{ row.status == '0' ? '否' : '是' }}</span>
                </template>
                <template #operation="{ row }">
                    <el-button
                        type="text"
                        size="mini"
                        @click="handleClick('detail', row)">
                        预览
                    </el-button>
                    <el-button
                        v-if="row.status == '0'"
                        type="text"
                        size="mini"
                        @click="handleClick('edit', row)">编辑
                    </el-button>
                    <el-button
                        v-if="row.status == '0'"
                        type="text"
                        size="mini"
                        @click="handleClick('online', row)">上架
                    </el-button>
                    <el-button
                        v-if="row.status == '0'"
                        type="text"
                        size="mini"
                        @click="handleClick('delete', row)">删除
                    </el-button>
                    <el-button
                        v-if="row.status == '1'"
                        type="text"
                        size="mini"
                        @click="handleClick('offline', row)">下架
                    </el-button>
                </template>
            </m-table-new>
        </el-col>
        <m-pagination
            ref="pagination"
            :total="total"
            @onPageChange="getData"/>
        <affairs-detail-modal v-model="affairsModalVisible" />
    </el-row>
</template>

<script>
    import http from '@/service'
    import Moment from 'moment'
    import { mapState, mapActions } from 'vuex'
    import affairsDetailModal from './components/affairs-detail-modal.vue'
    import { initStore } from '@/common/constants/prisons'
    export default {
        components: {
            affairsDetailModal
        },
        data() {
            return {
                type: '',
                total: 0,
                moduleItems: {},
                tableCols: [],
                searchItems: {},
                tableDatas:[],
                filter: {},
                affairsModalVisible: false
            }
        },
        computed: {
            ...mapState({
                affairsStorage: state => state.global.affairsStorage,
                affairsModule: state => state.global.affairsModule
            })
        },
        watch: {
            $route: {
                handler(r) {
                    this.initData(r.meta.typeId)
                },
                immediate: true
            }
        },
        methods: {
            ...mapActions(['setAffairsStorage', 'setAffairsModule']),

            setTextareaValue(val) {
                return val.replace(/\r/g, '').replace(/\n/g, '<br/>')
            },

            async initData(_type) {
                let _hasTypeSelect = _type.includes('flfg') || _type.includes('xwgs')
                let _moduleItems = {
                    workinfo: '工作动态',
                    flfg: '法律法规',
                    xwgs: '刑务公示',
                    shbj: '社会帮教',
                    meetingnotice: '会见须知',
                    servivceinfo: '服务指南'
                }
                let _searchItems = {
                    type: {
                        type: 'select',
                        label: '业务模块',
                        options: [],
                        miss: !_hasTypeSelect
                    },
                    headline: {
                        type: 'input',
                        label: '标题',
                    },
                    status: {
                        type: 'select',
                        label: '上架状态',
                        options: [
                            {
                                label: '是',
                                value: '1'
                            },
                            {
                                label: '否',
                                value: '0'
                            }
                        ]
                    }
                }
                let _tableCols = [
                    {
                        label: '序号',
                        prop: 'seq',
                        width: '80px'
                    },
                    {
                        label: '标题',
                        prop: 'headline',
                        showOverflowTooltip: true
                    },
                    {
                        label: '副标题',
                        prop: 'subhead',
                        showOverflowTooltip: true
                    },
                    {
                        label: '内容',
                        prop: 'content',
                        showOverflowTooltip: true
                    },
                    {
                        label: '创建时间',
                        prop: 'createTime',
                        width: '150px',
                        align: 'center'
                    },
                    {
                        label: '状态',
                        slotName: 'status',
                        width: '60px',
                        align: 'center'
                    },
                    {
                        label: '操作',
                        slotName: 'operation',
                        width: '200px',
                        align: 'center'
                    }
                ]
                if( _type.includes('flfg') || _type.includes('xwgs') ) {
                    _tableCols.splice(
                        1,
                        0,
                        {
                            label: '业务模块',
                            slotName: 'module',
                            width: '120px',
                            align: 'center'
                        }
                    )
                    let { data } = await http.queryDictItemByDictCode(`sun_jail_${ _type }`)
                    if( data && data.length ) {
                        _searchItems.type.options = data
                        data.forEach(d => {
                            _moduleItems[d.value] = d.label
                        })
                        this.setAffairsModule(data)
                    }
                }
                this.type = _type
                this.module = `sun_jail_${ _type }`
                this.moduleItems = _moduleItems
                this.searchItems = _searchItems
                this.tableCols = _tableCols
                this.$nextTick(() => {
                    this.$refs.search.onGetFilter()
                    this.handleSearch()
                })
            },

            async getData() {
                let params = { ...this.filter, ...this.pagination }
                params.module = this.module
                let { data } = await http.queryPrisonAffairs(params)
                this.tableDatas = data && data.list || []
                this.total = data && data.totalCount
            },

            handleSearch() {
                const { rows } = this.pagination
                this.loading = true
                this.$refs.pagination.currentPage = 1
                this.pagination = Object.assign({}, { page: 1, rows })
                this.getData()
            },

            async handleClick(type, row) {
                // 新增
                if (type == 'add') {
                    this.setAffairsStorage(Object.assign({}, initStore.APP_AFFAIRS_DATA(), { seq: this.total }))
                    this.$router.push({ path: `/prison-affairs-edit/${ this.$route.meta.typeId }` })
                // 修改
                } else if (type == 'edit') {
                    this.setAffairsStorage({
                        headline: row.headline,
                        subhead: row.subhead,
                        content: row.content,
                        videoUrl: row.videoUrl,
                        seq: row.seq
                    })
                    this.$router.push({ path: `/prison-affairs-edit/${ this.$route.meta.typeId }?gid=${ row.id }&type=${ row.type }`
                    })
                // 预览
                } else if (type == 'detail') {
                    this.setAffairsStorage({
                        headline: row.headline,
                        subhead: row.subhead,
                        content: row.content,
                        videoUrl: row.videoUrl
                    })
                    this.affairsModalVisible = true
                // 上下架
                } else if (type == 'online' || type == 'offline') {
                    await this.$confirm(`${ type == 'online' ? '上' : '下' }架此${ this.moduleItems[row.type] }`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    await http.updatePrisonAffairsStatus({ id: row.id, status: type == 'online' ? '1' : '0' })
                    this.getData()

                // 删除
                } else if (type == 'delete') {
                    await this.$confirm('删除此操作指引', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    await http.deletePrisonAffairs(row.id)
                    this.getData()
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
