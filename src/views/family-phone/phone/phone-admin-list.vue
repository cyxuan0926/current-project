<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
    >
        <m-excel-download
          slot="append"
          :path="'/'"
          :params="{}"
        />
    </m-search>
    <el-col :span="24">
      <el-tabs v-model="tabs" type="card">
        <template v-for="tab in tabsItems">
          <el-tab-pane
            :key="tab.name"
            :label="tab.label"
            :name="tab.name"
          />
        </template>
      </el-tabs>

      <m-table-new stripe
         :data="tabledate.list"
         :cols="tableCols">

        <template #applyReason="{row}">
           <span style="color:#409EFF;cursor: pointer;" @click="messageDetail(row)">申请理由</span>
        </template>

        <template #operation="{row}">
          <el-button type="text" @click="getDetail(row,true)">详情</el-button>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      @onPageChange="getDatas" 
      :total="tabledate.size"
    />
     <el-dialog
      :visible.sync="show.dialog"
      title="详情"
      width="780px"
      class="authorize-dialog"
      lock-scroll
      @close="onCloseShow">
       <div style="max-height:380px;overflow: auto">
        <div style="display: flex;border: 1px solid #E4E7ED;">
          <div class="family-detail">基本信息</div>
          <div class="detail-message">
            <p class="detail-message-family">
              <span class="family-name">家属姓名</span>
              <span class="family-nameDetail">{{toShow.familyName}}</span>
            </p>
            <p class="detail-message-family" style="border: none">
              <span class="family-name">罪犯姓名</span>
              <span class="family-nameDetail">{{toShow.criminalName}}</span>
            </p>
          </div>
          <div class="detail-content">
            <p class="detail-message-family">
              <span class="family-name">与罪犯关系</span>
              <span class="family-nameDetail">{{toShow.relationship}}</span>
            </p>
            <p class="detail-message-family" style="border: none">
              <span class="family-name">申请理由</span>
              <span class="family-nameDetail">{{toShow.applyReason}}</span>
            </p>
          </div>
        </div>
         <div
          v-for="(item,index) in toShow.logs"
          :key='index'
          style="display: flex;border: 1px solid #E4E7ED;border-top: none"
        >
          <div class="family-detail">{{index+1}}</div>
          <div class="detail-message">
            <p class="detail-message-family">
              <span class="family-name">审核人员账号</span>
              <span class="family-nameDetail">{{item.createUser}}</span>
            </p>
            <p class="detail-message-family">
              <span class="family-name">审核时间</span>
              <span class="family-nameDetail">{{item.createTime}}</span>
            </p>
          </div>
          <div class="detail-content">
            <p class="detail-message-family" >
              <span class="family-name">审核人姓名</span>
              <span class="family-nameDetail">{{item.nextCheckRole}}</span></p>
              <p class="detail-message-family" >
              <span class="family-name">审核人意见</span>
              <span class="family-nameDetail">{{item.remarks}}</span></p>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
     <el-dialog
      :visible.sync="show.message"
      title="申请理由"
      width="530px"
      class="authorize-dialog">
      <div class="flex-dialog">
        <div class="infinite-list" style="margin-left:20px;min-height:400px;width:100%">
          {{ messageContent }}
        </div>
      </div>
    </el-dialog>

  </el-row>
</template>

<script>

import prisonFilterCreator from '@/mixins/prison-filter-creator'
import { mapActions, mapState } from 'vuex'
import registrationDialogCreator from '@/mixins/registration-dialog-creator'
import Moment from 'moment'
import http from '@/service'
export default {
  name: 'FamilyPhone_Families',

  mixins: [prisonFilterCreator,registrationDialogCreator],

  data() {
   const todayDate = Moment().format('YYYY-MM-DD')
    const oneMonthLater = Moment().add(-7, 'days').format('YYYY-MM-DD')
    const tabsItems = [
      {
        label: '亲情电话申请',
        name: '0'
      },
      {
        label: '已通过',
        name: '1'
      },
      {
        label: '未通过',
        name: '2'
      },
      {
        label: '待审核',
        name: '3'
      }
    ]

    const clearable = true
    return {
      tabsItems,
      messageContent:"",
      tabs: '0',
      todayDate,
      oneMonthLater,
      tabledate:{},
      toShow:{},
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
            endPlaceholder: '结束时间'
          },

        state: {
          type: 'select',
          label: '审核状态',
          options:[{label: '待审核', value: '0'},{label: '已通过', value: '1'},{label: '未通过', value: '2'}],
          miss: false,
          value:"",
        },
      },
      show:{
        isAdd:false,
        message:false,
        disagree: false,
        authorize:false,
        agree: false,
        process:false,
        editRebut:true,
        dialog:false
      }
    }
  },
  computed: {
    ...mapState({
        uploadResult: state => state.global.uploadResult,
        validatePhoneResult: state => state.familyPhone.validatePhoneResult
      }),
    tableCols() {
      const cols = [
        {
          label: '监区',
          prop: 'prisonArea'
        },
        {
          label: '罪犯编号',
          prop: 'criminalNumber',
        },
        {
          label: '罪犯姓名',
          prop: 'criminalName'
        },
        {
          label: '申请时间',
           minWidth: 120,
          prop: 'applyTime'
        },
        {
          label: '申请月份',
          prop: 'applyMonth'
        },
        {
          label: '家属姓名',
          prop: 'familyName'
        },
        {
          label: '家属电话',
          minWidth: 120,
          prop: 'familyPhone'
        },
        {
          label: '关系',
          prop: 'relationship'
        },
        {
          label: '申请理由',
          slotName: 'applyReason'
        },
        {
          label: '申请状态',
          prop: 'aduitDetail'
        },
        {
          label: '操作',
          slotName: 'operation',
           minWidth: 140,
        }
      ], onlySuperAdminCols = [
        {
          label: '省份',
          prop: 'provinceName'
        },
        {
          label: '监狱名称',
          prop: 'jailName',
          showOverflowTooltip: true
        }
      ]

      if (this.isSuperAdmin) return [ ...onlySuperAdminCols, ...cols ]

      return cols
    }
  },

  watch: {
    tabs(val) {
      delete this.filter.state
      if( val=='0') {
          this.searchItems.state.miss = false
          this.searchItems.state.value= ''
      }else{
        this.searchItems.state.miss = true
      }
      this.onSearch()
    }
  },

  methods: {
    async getDetail(e,type=false){
      console.log(e)
       let res= await http.familyPhoneDetail({ id: e.id })
          if (!res) return
        this.toShow = Object.assign({}, res, {processInstanceId: e.processInstanceId,id: e.id })
          if(type){
            alert(111111)
            this.show.dialog = true
          }
    },
      onCloseShow() {
        this.show.dialog=false
        this.toShow ={}
      },
    async getDatas() {
     this.filter.tab = this.tabs
     let res = await http.familyPhoneList({
        ...this.filter,
        ...this.pagination
      })
      this.tabledate=res
    },
     messageDetail(row){
        this.messageContent=row.applyReason
        this.show.message=true
      },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
  },
  created() {
      this.filterInit = Object.assign({}, this.filterInit, {
        startTime: this.oneMonthLater,
        endTime: this.todayDate
      })
    },
  mounted() {
     this.$set(this.searchItems.applicationDate, 'value', [this.oneMonthLater, this.todayDate])
    this.getDatas()
  }
}
</script>
<style lang="stylus">
.logMgCls .el-select__tags-text {
  display: inline-block;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.logMgCls .el-select .el-tag__close.el-icon-close {
  top: -7px;
}
 .el-select-dropdown{
        max-width: 243px;
    }
    .el-select-dropdown__item{
        display: inline-block;
    }
    .el-select-dropdown__item span {
        min-width: 400px;
        display: inline-block;
   }
</style>


<style lang="scss" scoped>
.el-steps {
  /deep/ .el-step__title {
    font-size: 12px;
    line-height: 32px;
  }
}

.process-col_tips {
  width: 68%;
  margin-left: 32%;
  span {
    color: #303133;
    font-weight: bold;
    & + span {
      padding-left: 3%;
    }
  }
}

.process-col_waiting {
  width: 60%;
  margin-left: 40%;
  color: #303133;
  font-weight: bold;
}

.upload-dialog {
  /deep/ .el-dialog__body {
    padding-bottom: 30px !important;
  }

  /deep/ .button-box {
    padding-bottom: 0px;
  }
}

.el-upload__excel {
  margin-right: 0px !important;
}

.m-excel-export {
  float: none;
}

.authorize-dialog {
  /deep/ .el-dialog__footer {
    padding: 0px 20px 20px 0px;
  }
}
  .family-detail{
    width: 100px;
    display: flex;
    align-items:center;
    justify-content: center;
    border-right: 1px solid #E4E7ED
  }
  .detail-message{
    width: 380px;
  }
  .detail-message-family{
    display: flex;
    line-height: 40px ;
    font-size: 12px;
    border-bottom: 1px solid #E4E7ED;
    .family-name{
      width: 120px;
      background: #F5F7FA;
      text-align: right;
      padding-right: 10px;
      border-right: 1px solid #E4E7ED;
    }
    .family-nameDetail{
      flex: 1;
      padding-left: 10px;
      border-right: 1px solid #E4E7ED
    }

  }
  .detail-content{
    flex: 1;
    line-height: 30px ;
    font-size: 12px;
    .family-name{
      width: 120px;
      background: #F5F7FA;
      padding-right: 10px;
      text-align: right;
      border-right: 1px solid #E4E7ED;
    }
  }
</style>
