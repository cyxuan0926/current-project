<template>
  <el-row
    class="row-container"
    :gutter="0">
     <el-button
       v-if="isAdmin"
        size="small"
        type="primary"
        plain
        class="button-add button-shift-down"
        @click="handleClick('add')">新增</el-button>
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch">
    </m-search>
    <el-col :span="24">
      <m-table-new
        :data="tableDatas"
        :cols="tableCols"
        class="mini-td-padding">
            <template #status="{ row }">
                <span>{{ row.status == '0' ? '草稿' : '已上线' }}</span>
            </template>
            <template #guide="{ row }">
                <el-button
                    type="text"
                    size="mini"
                    @click="handleClick('detail',row)">
                    查看更新指引
                </el-button>
            </template>
            <template #operation="{ row }" v-if="isAdmin">
                <el-button
                    v-if="row.status == '0'"
                    type="text"
                    size="mini"
                    @click="handleClick('edit',row)">编辑
                </el-button>
                <el-button
                    v-if="row.status == '0'"
                    type="text"
                    size="mini"
                    @click="handleClick('online',row)">上线
                </el-button>
                <el-button
                    v-if="row.status == '1'"
                    type="text"
                    size="mini"
                    @click="handleClick('offline',row)">删除
                </el-button>
            </template>
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="total"
      @onPageChange="getData"
    />
  </el-row>
</template>


<script>
  import http from '@/service'
  import { mapState, mapGetters, mapActions } from 'vuex'
    export default {
        data() {
            return {
                total: 0,
                tableCols: [
                    {
                        label: '更新时间',
                        prop: 'createdAt',
                        width: '200px'
                    },
                    {
                        label: '更新内容简介',
                        prop: 'content',
                        showOverflowTooltip: true
                    },
                    {
                        label: '更新指引',
                        // prop: 'guide',
                        // showOverflowTooltip: true
                        slotName: 'guide',
                        width: '120px',
                    }
                ],
                searchItems: {
                    applicationDate: {
                        type: 'dateRange',
                        unlinkPanels: true,
                        start: 'startTime',
                        end: 'endTime',
                        startPlaceholder: '开始时间',
                        endPlaceholder: '结束时间',
                        // miss: true,
                        value: [this.$_dateOneWeekAgo, this.$_dateNow]
                    },
                    content: {
                        type: 'input',
                        label: '更新内容',
                    }
                },
                tableDatas:[],
                filter: {},
                maxId: 0
            }
        },
        computed: {
            ...mapState({
                isAdmin: state => state.global.user.role == '0'
            })
        },
        created() {
            if( this.isAdmin ) {
                this.tableCols.push(
                    {
                        label: '状态',
                        // prop: 'guide',
                        // showOverflowTooltip: true
                        slotName: 'status',
                        width: '120px',
                    },
                    {
                        label: '操作',
                        slotName: 'operation',
                        width: '120px',
                        align: 'center'
                    }
                )
            }
        },
        methods:{
            ...mapActions(['setGuideStorage']),

            handleTextareaValue(val) {
                return val.replace(/\r/g, '').replace(/\n/g, '<br/>')
            },

            getData(){
                let params={...this.filter,...this.pagination, statusList: this.isAdmin ? '0,1' : '1'}
                http.businessList(params).then(res=>{
                    this.tableDatas = res.list
                    this.total = res.total
                    // if( flag == 'mounted' && res.list && res.list.length ) {
                    //     this.maxId = res.list[0].id
                    // }
                })
            },
             async onSearch() {
                const { rows } = this.pagination
                this.loading = true
                this.$refs.pagination.currentPage = 1
                this.pagination = Object.assign({}, { page: 1, rows })
                await this.getData()
            },
            async handleClick(type, row){
                if(type == 'add'){
                    let { list } = await http.businessList({ statusList: '0', page: 1, rows: 999 })
                    if( list && list.length ) {
                        this.$message.closeAll()
                        this.$message.warning("还有未上线的草稿")
                        return
                    }
                    this.$router.push({
                        path: '/operation-guide/add'
                    })
                    this.setGuideStorage()
                }else if(type == 'edit'){
                    this.$router.push({
                        path: `/operation-guide/edit/${row.id}`
                    })
                    this.setGuideStorage({
                        guide: row.guide,
                        content: row.content
                    })
                }else if(type == 'detail'){
                    this.$router.push({
                        path: '/operation-guide/detail'
                    })
                    this.setGuideStorage({
                        updatedTime: row.updatedTime,
                        guide: row.guide,
                        content: row.content,
                        preContent: this.handleTextareaValue(row.content)
                    })
                }else if (type == 'online') {
                    await this.$confirm('上线此操作指引', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    await http.businessOnLine(row.id)
                    this.getData()

                }else if(type == 'offline') {
                    await this.$confirm('删除此操作指引', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    await http.businessOffLine(row.id)
                    this.getData()
                }
            }
        },
        async mounted() {
            // this.$set(this.searchItems['applicationDate'], 'value', [this.$_timeOneWeekAgo, this.$_timeNow])

            this.$refs.search.onGetFilter()

            await this.getData('mounted')
        },
    }
</script>

<style lang="scss" scoped>

</style>
