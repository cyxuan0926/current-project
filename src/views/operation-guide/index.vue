<template>
  <el-row
    class="row-container"
    :gutter="0">
     <el-button
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
        <template #createdAt="{ row }">
             <span >{{ row.createdAt }}</span>
            </template>
            <template #detail="{ row }">
                <el-button
                    type="text"
                    size="mini"
                    @click="openPush('detail',row)">更新指引
                </el-button>
            </template>
            <template #operation="{ row }">
                <el-button
                    type="text"
                    size="mini"
                    @click="openPush('edit',row)">编辑
                </el-button>
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
    export default {
        mixins: [prisonFilterCreator,registrationDialogCreator],
        data() {
                return {
                 total: 0,
                tableCols: [
                    {
                        label: '更新时间',
                        prop: 'createdAt',
                    },
                    {
                        label: '更新内容简介',
                        prop: 'content',
                        showOverflowTooltip: true
                    },
                    {
                        label: '更新指引',
                        slotName: 'detail'
                    },
                    {
                        label: '操作',
                        slotName: 'operation'
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
                                label: '请输入更新内容',
                                }
                            },
                tableDatas:[],
                filter: {}
            }
        },
        methods:{
            getData(){
                let params={...this.filter,...this.pagination}
                http.businessList(params).then(res=>{
                    this.tableDatas=res.list
                    this.total=res.total
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
                        this.$router.push('/operation-guide/add')
                    }
                    if(even=='edit'){
                        this.$router.push(
                            {path:' /operation-guide/edit/',
                            query: {id:row.id}
                            })
                    }
                    if(even=='detail'){
                          this.$router.push(
                            {path:' /operation-guide/detail',
                            query: {id:row.id}
                            })
                    }
                }

        },
        async mounted() {
            await this.getData()
        },
    }
</script>

<style lang="scss" scoped>

</style>
