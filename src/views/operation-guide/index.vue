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
        @click="openPush('add')">新增</el-button>
    <m-search
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch">
    </m-search>
    <el-col :span="24">
      <m-table-new
        :data="tableDatas"
        :cols="tableCols"
        class="mini-td-padding">
            <template #guide="{ row }">
                <el-button
                    type="text"
                    size="mini"
                    @click="openPush('detail',row)">
                    更新指引
                </el-button>
            </template>
            <template #operation="{ row }" v-if="isAdmin">
                <el-button
                    v-if="row.id == maxId"
                    type="text"
                    size="mini"
                    @click="openPush('edit',row)">编辑
                </el-button>
                <!-- <el-button
                    type="text"
                    size="mini"
                    @click="openPush('detail',row)">预览
                </el-button> -->
            </template>
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="total"
      @onPageChange="getData"/>
  </el-row>
</template>


<script>
  import prisonFilterCreator from '@/mixins/prison-filter-creator'
  import registrationDialogCreator from '@/mixins/registration-dialog-creator'
  import http from '@/service'
  import Moment from 'moment'
  import { mapState, mapGetters, mapActions } from 'vuex'
    export default {
        mixins: [prisonFilterCreator,registrationDialogCreator],
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
                        endPlaceholder: '结束时间'
                        // miss: true,
                        // value: ''
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
                this.tableCols.push({
                    label: '操作',
                    slotName: 'operation',
                    width: '120px',
                    align: 'center'
                })
            }
        },
        methods:{
            ...mapActions(['setGuideStorage']),

            handleTextareaValue(val) {
                return val.replace(/\r/g, '').replace(/\n/g, '<br/>')
            },

            getData(flag){
                let params={...this.filter,...this.pagination}
                http.businessList(params).then(res=>{
                    this.tableDatas=res.list
                    this.total=res.total
                    if( flag == 'mounted' && res.list && res.list.length ) {
                        this.maxId = res.list[0].id
                    }
                })
            },
             async onSearch() {
                const { rows } = this.pagination
                this.loading = true
                this.$refs.pagination.currentPage = 1
                this.pagination = Object.assign({}, { page: 1, rows })
                await this.getData()
            },
            openPush(even,row){
                if(even=='add'){
                    this.$router.push({
                        path: '/operation-guide/add'
                    })
                    this.setGuideStorage()
                }
                if(even=='edit'){
                    this.$router.push({
                        path: `/operation-guide/edit/${row.id}`
                    })
                    this.setGuideStorage({
                        guide: row.guide,
                        content: row.content
                    })
                }
                if(even=='detail'){
                    this.$router.push({
                        path: '/operation-guide/detail'
                    })
                    this.setGuideStorage({
                        updatedTime: row.updatedTime,
                        guide: row.guide,
                        content: row.content,
                        preContent: this.handleTextareaValue(row.content)
                    })
                }
            }
        },
        async mounted() {
            await this.getData('mounted')
        },
    }
</script>

<style lang="scss" scoped>

</style>
