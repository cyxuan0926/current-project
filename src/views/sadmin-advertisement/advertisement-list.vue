<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-button
      size="small"
      type="primary"
      plain
      class="button-add button-shift-down"
      @click="onAdd">添加广告</el-button>
    <m-search
      :items="searchItems"
      @search="onSearch" />
    <el-col :span="24">
      <m-table-new
        stripe
        :data="tabledata.content"
        :cols="tableCols">
         <template #title="{ row }">
                <span v-if="row.adForm==1">
                    <el-popover placement="right" trigger="click">
                            <el-image slot="reference" :src="row.title" :alt="row.title" style="max-height: 100px;max-width: 150px"></el-image>
                            <el-image :src="row.title"></el-image>
                    </el-popover>
                </span>
                <span v-if="row.adForm==3">
                    {{row.title}}
                </span>
            </template>
            <template #content="{ row }">
                <span v-if="row.adContentForm==1">
                    <el-popover placement="right" trigger="click">
                            <el-image slot="reference" :src="row.content" :alt="row.content" style="max-height: 100px;max-width: 150px"></el-image>
                            <el-image :src="row.content"></el-image>
                    </el-popover>
                </span>
                 <span v-if="row.adContentForm==2">
                    <video :src="row.content"
                                    style="width:155px"
                                    controls="controls" class="avatar"></video>
                </span>
                <span v-if="row.adContentForm==3">
                    {{row.content}}
                </span>
            </template>
            <template #zip="{ row }">
                <span>
                    {{row.startDate.replace(/T/g, ' ')}}至{{row.endDate.replace(/T/g, ' ')}}
                </span>
            </template>
              <template #createdTime="{ row }">
                    <span>{{(row.createdTime).replace(/T/g, ' ')}}</span>
            </template>  
              <template  #status="{ row }">
                        <span v-if="row.status=='1'">上架</span>
                        <span v-if="row.status=='0'">未上架</span>
            </template>
            <template #operate="{ row }" >
                      <el-button
                        type="text"
                        @click="detailView(row)"
                        >详情</el-button>
                        <el-button
                        type="text"
                        v-if="row.status=='0'"
                        @click="updateInside(row)"
                        >编辑</el-button>
                        <el-button 
                        v-if="row.sysFlag&&!row.status"
                        type="text"
                        @click="onlineInside(row.id)"
                        >上架</el-button>
                        <el-button
                        v-if="row.sysFlag&&row.status"
                        type="text"
                        @click="offlineInside(row.id)"
                        >下架</el-button>
                        <el-button
                        v-if="row.status=='0'"
                        type="text"
                        @click="deleteInsideChange(row.id)"
                        >删除</el-button>
            </template>
            
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :size='true'
      :total="tabledata.totalElements"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>

import { mapActions, mapState } from 'vuex'
import { getPagedMessagInside, getadserviceslist } from '@/service-public/api/inside'
export default {
  data() {
    return {
      tabledata:{},
      searchItems: {
          adservicesId:{ type: 'select', label: '广告所属服务', getting: true, belong: { value: 'id', label: 'name' }, filterable: true },
          status: { type: 'select', label: '广告状态', options:this.$store.state.statusOptions},
          startDate: {
            type: 'dateRange',
            unlinkPanels: true,
            start: 'startDateStart',
            end: 'startDateEnd',
            startPlaceholder: '周期开始时间',
            endPlaceholder: '周期结束时间'
            // miss: true,
            // value: [yesterdayDate, yesterdayDate]
          },
           createdDate: {
            type: 'dateRange',
            unlinkPanels: true,
            start: 'createdAtStart',
            end: 'createdAtEnd',
            startPlaceholder: '新增开始时间',
            endPlaceholder: '新增结束时间'
            // miss: true,
            // value: [yesterdayDate, yesterdayDate]
          },

        // provinceId: { type: 'select', label: '省份', getting: true, belong, filterable: true },
        // typeId: { type: 'select', label: '广告类型', getting: true, belong },
        // name: { type: 'input', label: '广告名称' }
      },
      tableCols: [
            {
                prop: 'adservicesName',
                label: '广告所属服务',
                width: '130px'
            },
            {
                prop: 'typeName',
                label: '广告位置',
                width: '120px'
            },
            {
                prop: 'sort',
                label: '序号',
                width: '60px'
            },
            {
                slotName: 'title',
                label: '广告封面',
                width: '200px'
            },
            {
                slotName: 'content',
                label: '广告内容',
                width: '200px'
            },
            {
                slotName: 'zip',
                label: '广告周期',
                width: '320px'
            },
            {
                prop: 'duration',
                label: '播放时长',
                width: '120px'
            },
            {
                slotName: 'createdTime',
                label: '新增时间',
                width: '200px'
            },{
                slotName: 'status',
                label: '广告状态',
                width: '120px'
            },
            {
                slotName: 'operate',
                label: '操作',
                fixed: "right",
                align: 'center',
                width: '240px'
            },
        ]
    }
  },
  computed: {
    ...mapState([
      'advertisements',
      'provincesAll',
      'advertisementTypes'
    ])
  },
  async mounted() {
      this.getDatas()
      let res= await  getadserviceslist()
     this.searchItems.adservicesId.options= res
     this.searchItems.adservicesId.getting = false
  },
  methods: {
    async getDatas() {
       let res = await  getPagedMessagInside({ ...this.filter, ...this.pagination })
        this.tabledata= res
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(0)
    },
    onAdd() {
      this.$router.push('/advertisement/add')
    },
     //详情展示
        detailView(row){
         this.$router.push({
           path:'/advertisement/add',
            query: {
              formDate: row,
              status:"detail"
            }
           })
        },
        //编辑更新
        updateInside(row){
          this.$router.push({
           path:'/advertisement/add',
            query: {
              formDate: row,
              status:"edit"
            }
           })
        },
        //根据id上架
       async onlineInside(rowId){
            let parmas=rowId
            try {
               await this.$confirm('当前广告是否上架?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                await onlineInside(parmas)
                this.$refs.appManagementTable.queryTable()
                this.$message({
                  type: 'success',
                  message: '上架成功!'
                });
            } catch (error) {
                this.$message({
                  type: 'error',
                  message: '已取消'
                });
            }
       },
        //根据id下架
       async offlineInside(rowId){
            let parmas=rowId
             try {
               await this.$confirm('当前广告是否下架?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
             await offlineInside(parmas)
             this.$refs.appManagementTable.queryTable()
                this.$message({
                  type: 'success',
                  message: '下架成功!'
                });
            } catch (error) {
                this.$message({
                  type: 'error',
                  message: '已取消'
                });
            }
       },
       async deleteInsideChange(rowId){
         let parmas=rowId
          try {
               await this.$confirm('是否删除当前广告?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
           await deleteInside(parmas)
                this.$refs.appManagementTable.queryTable()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
            } catch (error) {
                this.$message({
                  type: 'error',
                  message: '已取消'
                });
            }
       }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>
