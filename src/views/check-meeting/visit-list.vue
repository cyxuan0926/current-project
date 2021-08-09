<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      :items="searchItems"
      ref="search"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    >
      <template slot="append">
        <el-button
          type="primary"
          :loading="downloading"
          @click="handleExportExcel"
        >导出 Excel</el-button>
      </template>
    </m-search>

    <el-col :span="24">
      <el-tabs v-model="tabs" type="card">
        <template v-for="(tab, index) in tabsItems">
          <el-tab-pane
            :key="index"
            :label="tab.label"
            :name="tab.name"
          />
        </template>
      </el-tabs>

      <m-table-new
        stripe
        :data="visits.contents"
        @sort-change="sortChange"
        :cols="tableCols"
        ref="parentElTable"
      >
        <template #createdAt="{ row }">{{ row.createdAt | momentDateFormate }}</template>

        <template #level="{ row }">
         <span v-if="row.level==1">
              宽管级
           </span>
           <span v-if="row.level==2">
              普管级
           </span>
           <span v-if="row.level==3">
              考察级
           </span>
           <span v-if="row.level==4">
              严管级
           </span>
        </template>
        <template #meetingTime="{ row }">
          <span >{{ row.meetingTime || row.applicationDate }}</span>
        </template>

        <!-- <template #families="{ row }">
          <div v-if="row.filterFamilies && row.filterFamilies.length">
            <el-button
              type="text"
              size="small"
              v-for="family in row.filterFamilies"
              :key="family.familyId"
              style="margin-left: 0px; margin-right: 8px;"
              @click="showFamilyDetail(family.familyId, row.id)">{{ family.familyName }}</el-button>
          </div>
        </template> -->

        <template #families="{ item, scope }">
          <el-button
            type="text"
            size="small"
            style="margin-left: 0px; margin-right: 8px;"
            @click="showFamilyDetail(item.familyId, scope.row.id)"
          >{{ item.familyName | asteriskDisplay('asterisk_name')}}</el-button>
        </template>

        <template #content="{ row }">
          <span v-if="!row.content">
            <template v-if="row.status === 'PENDING' && row.isLock === 1">处理中</template>
            <template v-else>{{ row.status | applyStatus }}</template>
          </span>
          <el-tooltip
            v-else
            :content="row.content"
            placement="top" >
            <span v-if="row.status === 'PENDING' && row.isLock === 1">处理中</span>
            <span v-else>{{ row.status | applyStatus }}</span>
          </el-tooltip>
        </template>

        <template #operate="{ row }">
          <!-- authorizeLevel 等于1就是一级审核人员提交，等于2就是高级审核人员审核过了 && scope.row.isCheck==1 -->
         <el-button
            v-if="(
              row.status == 'PENDING' && 
              row.isLock !== 1 && 
              operateQueryAuth === true && 
              ( 
                !( 
                  haveMultistageExamine && 
                  row.authorizeLevel === 1 && 
                  !isAdvancedAuditor
                ) || row.isCheck  
              )
            )"
            size="mini"
            @click="handleAuthorization(row)">授权</el-button>
          <el-button
            v-else-if="
              row.status === 'PASSED' && 
              operateQueryAuth === true && 
                !( haveMultistageExamine && row.authorizeLevel === 1 && !isAdvancedAuditor )"
            size="mini"
            @click="handleWithdraw(row)"
          >撤回</el-button>

          <el-button
            v-if="
              row.status != 'PENDING' || 
              ( haveMultistageExamine && row.authorizeLevel === 1 && !isAdvancedAuditor ) || 
              row.isCheck==0"
            type="text"
            size="mini"
            class="button-detail"
            @click="onDetail(row)"
          >详情</el-button>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="visits.total"
      @onPageChange="getDatas"
    />
    
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="show.agree"
      class="authorize-dialog"
      title="请选择探视时间段"
      width="900px">
      <div class="button-box">
          <el-table
            :data="meetingAdjustment.windows"
            border
            @cell-click="cellClick"
            class="tableBorder">
            <el-table-column
              fixed
              prop="window"
              label="窗口序号"
              min-width="80">
            </el-table-column>
            <el-table-column
              v-for="(item,index) in meetingAdjustment.meetingQueue" :key="index"
              :prop="item"
              :label="item"
              min-width="84">
              <template #default>
                <span class="meetingQueue-sp"></span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="show.meetingQueue"
              prop="noTimes"
              label="当日没有可选时间段"
              min-width="84">
            </el-table-column>
          </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSuccess" :disabled="!submitSuccessParams">确 定</el-button>
        <el-button @click="show.agree=false">取 消</el-button>
      </span>
    </el-dialog>
    
    <el-dialog
      :visible.sync="show.authorize"
      class="authorize-dialog"
      @close="closeAuthorize"
      title="审核"
      :close-on-click-modal="false"
      width="780px"
    >
      <div style="max-height:380px;overflow: auto">
        <div style="display: flex;border: 1px solid #E4E7ED;">
          <div class="family-detail">基本信息</div>
          <div class="detail-message">
            <p class="detail-message-family">
              <span class="family-name">家属姓名</span>
              <span class="family-nameDetail">{{toShow.familyName}}</span>
            </p>
            <p class="detail-message-family" style="border: none">
              <span class="family-name">关系</span>
              <span class="family-nameDetail">{{toShow.relation}}</span>
            </p>
          </div>
          <div class="detail-content">
            <p class="detail-message-family">
              <span class="family-name">罪犯姓名</span>
              <span class="family-nameDetail">{{toShow.prisonerName}}</span>
            </p>
            <p class="detail-message-family" style="border: none">
              <span class="family-name">申请探视时间</span>
              <span class="family-nameDetail">{{ toShow.visitTime }}</span>
            </p>
          </div>
        </div>
      </div>
      
      <template v-if="isAdvancedAuditor && toAuthorize.changeLogs && toAuthorize.changeLogs.length">
        <m-multistage-records :values="toAuthorize.changeLogs" :keys="multistageExamineKeys" />
      </template>

      <span slot="footer" class="dialog-footer">
        <div v-if="!show.agree && !show.disagree">
          <repetition-el-buttons :buttonItems="authorizeButtons" />
        </div>

        <div v-if="show.disagree" class="button-box logMgCls">
          <div style="margin-bottom: 10px;">请选择驳回原因</div>
          <div>
            <el-select 
              style="width:70%; margin-right:10px"
              v-model="remarks"
              :multiple="true"
              :multiple-limit="5"
              @change="refuseFormChange"
              collapse-tags>
              <el-option
              class="select_edit"
                v-for="(remark,index) in content"
                :value="remark"
                :label="(index+1)+'、'+remark"
                :key="index"/>
            </el-select>
            <el-button
              type="primary"
              :loading="btnDisable"
              @click="onRejectshow('PASSED')">编辑驳回原因</el-button>
          </div>
          <el-form
            :model="refuseForm"
            :rules="withdrawRule"
            ref="refuseForm"
            class="withdraw-box">
            <el-form-item prop="anotherRemarks">
              <el-input
                :autosize="{ minRows: 6 ,maxRows:8 }"
                type="textarea"
                show-word-limit
                maxlength="1000"
                placeholder="请输入驳回原因..."
                v-model="refuseForm.anotherRemarks"/>
            </el-form-item>
          </el-form>
          <el-button
            plain
            :loading="btnDisable"
            @click="onAuthorization('DENIED')">提交</el-button>
          <el-button
            plain
            @click="show.disagree = false">返回</el-button>
          <el-button
            type="danger"
            plain
            @click="closeWithdraw('refuseForm')">关闭</el-button>
        </div>
      </span>
    </el-dialog>
    
    <el-dialog
      :visible.sync="show.withdraw"
      @close="closeWithdraw"
      class="authorize-dialog logMgCls"
      title="撤回"
      :close-on-click-modal="false"
      width="530px">
      <div style="margin-bottom: 10px;">请选择撤回原因</div>
        <div style="margin-bottom: 10px;">
          <el-select
            v-model="remarks"
            :multiple="true"
            :multiple-limit='5'
            collapse-tags
            @change="withdrawFormChange"
            style="width:70%;margin-right:10px">
              <el-option
              class="select_edit"
                v-for="(remark,index) in content"
                :value="remark"
                :label="(index+1)+'、'+remark"
                :key="index"/>
          </el-select>
          <el-button
            type="primary"
            :loading="btnDisable"
            @click="onRejectshow('PASSED')">编辑驳回原因</el-button>
        </div>
        <el-form
          :model="withdrawForm"
          :rules="withdrawRule"
          ref="withdrawForm"
          class="withdraw-box">
          <el-form-item prop="withdrawReason" >
            <el-input
              type="textarea"
              show-word-limit
              maxlength="1000"
              :autosize="{ minRows: 6,maxRows:8 }"
              placeholder="请输入撤回理由..."
              v-model="withdrawForm.withdrawReason" />
          </el-form-item>
        </el-form>
        <el-button
          plain
          :loading="btnDisable"
          @click="onWithdraw('WITHDRAW')">提交</el-button>
        <el-button
          type="danger"
          plain
          @click="closeWithdraw('withdrawForm')">关闭</el-button>
    </el-dialog>

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
              <span class="family-name">家属</span>

              <span class="family-nameDetail">{{toShow.familyName}}</span>
            </p>

            <p class="detail-message-family" style="border: none">
              <span class="family-name">预约时间</span>

              <span class="family-nameDetail">{{toShow.visitTime}}</span>
            </p>
          </div>

          <div class="detail-content">
            <p class="detail-message-family">
              <span class="family-name">与罪犯关系</span>

              <span class="family-nameDetail">{{toShow.relation}}</span>
            </p>

            <p class="detail-message-family" style="border: none">
              <span class="family-name">窗口号</span>

              <span class="family-nameDetail">{{ toShow.window ? `${ toShow.window }号` : ''}}</span>
            </p>
          </div>
        </div>

        <div
          v-for="(item,index) in toShow.changeLogs"
          :key=index
          style="display: flex;border: 1px solid #E4E7ED;border-top: none"
        >
          <div class="family-detail">{{index+1}}</div>

          <div class="detail-message">
            <p class="detail-message-family" v-if="item.operateAccount">

              <span class="family-name" v-if="item.status!='CANCELED'">审核人员账号</span>

              <span class="family-name" v-if="item.status=='CANCELED'" >取消人账号</span>

              <span class="family-nameDetail">{{item.operateAccount}}</span>
            </p>

            <template v-if="item.meetingCalls" >
              <label v-for="(val,keys) in item.meetingCalls" :key=keys >
                <p class="detail-message-family" >
                  <span class="family-name">通话时间</span>

                  <span class="family-nameDetail">{{ val.callTime }}</span>
                </p>

                <p class="detail-message-family" v-if="isDevelop(val,keys )"  >
                  <span class="family-name">结束原因</span>

                  <span
                    class="family-nameDetail"
                    :ref="`itemHeigh+${keys}`"
                    style="padding: 10px;text-align: justify;line-height: 15px;">
                    {{ val.remark }}
                  </span>
                </p>
              </label>
            </template>

            <p class="detail-message-family" style="border: none" >
              <span class="family-name" v-if="item.status!='CANCELED'&&item.status!='EXPIRED'&&item.status!='FINISHED'&&item.status!='MEETING_ON'&&item.status!='CALL'">审核时间</span>

              <span class="family-name" v-if="item.status=='CANCELED'">取消时间</span>

              <span class="family-name" v-if="item.status=='EXPIRED'">过期时间</span>
              <span class="family-name" v-if="item.status=='CALL'">呼叫时间</span>
              <template  v-if="item.status=='CALL'">
                 <span class="family-nameDetail">{{ item.createdAt | Date }}</span>
              </template>
              <template  v-else>
                <span class="family-nameDetail" v-if="!item.meetingCalls ||item.status=='EXPIRED'">{{ item.operateTime | Date }}</span>
              </template>
               </p>
            <p
              v-if="item.remark && item.status=='DENIED'"
              class="detail-message-family"
              style="border-top:  1px solid #E4E7ED;border-bottom: none;text-align: justify;line-height: 18px">
              <span class="family-name" style="line-height: 40px">拒绝原因</span>

              <span class="family-nameDetail" style="padding: 10px;text-align: justify;line-height: 15px;">{{ item.remark }}</span>
            </p>

            <p
              v-if="item.remark && item.status=='CANCELED'"
              class="detail-message-family"
              style="border-top:  1px solid #E4E7ED;border-bottom: none;text-align: justify;line-height: 18px"
            >
              <span class="family-name"  style="line-height: 40px">取消原因</span>

              <span class="family-nameDetail" style="padding: 10px;text-align: justify;line-height: 15px;">{{ item.remark }}</span>
            </p>
            <p
              v-if="item.remark && item.status=='SUBMIT'"
              class="detail-message-family"
              style="border-top:  1px solid #E4E7ED;border-bottom: none;text-align: justify;line-height: 18px"
            >
              <span class="family-name"  style="line-height: 40px">初审意见</span>

              <span class="family-nameDetail" style="padding: 10px;text-align: justify;line-height: 15px;">{{ item.remark }}</span>
            </p>
          </div>

          <div class="detail-content">
            <p class="detail-message-family"  v-if="item.operateName">
              <span class="family-name" v-if="item.status!='CANCELED'">审核人姓名</span>

              <span class="family-name" v-if="item.status=='CANCELED'" >取消人姓名</span>

              <span class="family-nameDetail">{{item.operateName}}</span></p>

              <template v-if="item.meetingCalls">
                <label v-for="(val,keys) in item.meetingCalls" :key=keys  >
                  <p class="detail-message-family" >
                    <span class="family-name">通话时长</span>

                    <span class="family-nameDetail">{{ val.callDuration | time }}</span>
                  </p>

                  <label v-if="val.remark">
                    <p
                      v-if="keys!=item.meetingCalls.length-1"
                      class="detail-message-family"
                      :style="{height:parseInt( val.itemHeigh+1)+'px'}"
                    >
                      <span class="family-name">&nbsp;</span>

                      <span class="family-nameDetail">&nbsp;</span>
                    </p>
                  </label>
                </label>
              </template>

            <p class="detail-message-family">
              <template v-if="item.status!=='CALL'">
                 <span class="family-name">申请状态</span>

              <span class="family-nameDetail" v-if="item.status=='PASSED'">已通过</span>

              <span class="family-nameDetail" v-if="item.status=='CANCELED'">已取消</span>

              <span class="family-nameDetail" v-if="item.status=='DENIED'">已拒绝</span>

              <span class="family-nameDetail" v-if="item.status=='EXPIRED'">已过期</span>
              <span class="family-nameDetail" v-if="item.status=='ENDED'">已结束</span>

              <span class="family-nameDetail" v-if="item.status=='FINISHED'">已完成</span>

              <span class="family-nameDetail" v-if="item.status=='MEETING_ON'">通话中</span>
              <span class="family-nameDetail" v-if="item.status=='SUBMIT'">已提交二级审核</span>

              </template>
              <template v-if="item.status=='CALL'">
                <span class="family-name">呼叫状态</span>
                <span class="family-nameDetail">{{ item.statusName }}</span>
              </template>
            </p>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>

    <el-dialog
      title="家属信息"
      class="family-dialog"
      :visible.sync="show.familiesDetialInform"
      @close="closeFamilyDetail">
      <family-detail-information
        :elItems="familyDetailInformationItems"
        :detailData="family">
        <template #familyInformation="{ scope }">
          <div class="img-items">
            <m-img-viewer
              :url="scope.familyIdCardFront"
              title="身份证正面"
              isRequired
            />
            <m-img-viewer
              :url="scope.familyIdCardBack"
              title="身份证背面"
              isRequired
            />
            <m-img-viewer
              :url="scope.familyAvatarUrl"
              title="头像"
              isRequired
            />
          </div>
        </template>
        <template #familyRelationalInformation="{ scope }">
          <div class="img-items">
            <m-img-viewer
              v-for="(item, index) of scope.relationalProofUrls"
              :key="index"
              title="关系证明图"
              :class="{ 'relation_img': scope.relationalProofUrls.length !== 1 }"
              :url="item.url"
            />
          </div>
        </template>
        <template #familyMeetNoticeInformation="{ scope }">
          <div class="img-items">
            <m-img-viewer
              :url="scope.meetNoticeUrl"
              title="可视电话通知单"
            />
          </div>
        </template>
      </family-detail-information>
    </el-dialog>

     <el-dialog
      :visible.sync="show.rejectEdit"
      title="编辑"
      width="530px"
      @close="changeClose"
      class="authorize-dialog">
      <div class="flex-dialog" v-if="show.editRebut">
        <ul class="infinite-list" style="margin-left:20px;min-height:400px;width:100%">
           <li v-for="(item,index) in content"
               :key='index'
               class="infinite-list-item" style="line-height:32px">
               {{index+1}}.{{ item }}
            </li>
        </ul>
         <p style="margin-left:20px;">编辑用户:{{updateer}}</p>
      </div>
       <div class="infinite-list" v-else style="margin-left:20px;min-height:400px">
         <span v-for="(item,index) in content" :key="index">
        <el-input style="margin-bottom:10px" maxlength="200" v-model="content[index]" placeholder="请输入内容" clearable>
           <el-button slot="append" icon="el-icon-close" @click="removeReject(index)"></el-button>
        </el-input>
         </span>
      </div>
      <el-row :gutter="0">

        <el-button
           v-if='show.editRebut'
           type="primary"
          class="button-add"
          size="mini"
          @click="onRejectEditshow">编辑</el-button>
          <span v-else>
          <el-button
          v-if='content.length>0'
          type="primary"
          class="button-add"
          size="mini"
          @click="onSubmitReject">保存</el-button>
           <el-button
          type="primary"
          class="button-add"
          size="mini"
          v-if='content.length<10'
          @click="addReject">新增</el-button>
          </span>
      </el-row>
    </el-dialog>
  </el-row>
</template>

<script>
  import {
    mapActions,
    mapState,
    mapMutations,
    mapGetters
  } from 'vuex'

  import Moment from 'moment'

  import validator, { helper } from '@/utils'

  import prisonFilterCreator from '@/mixins/prison-filter-creator'

  import prisons from '@/common/constants/prisons'
  import registrationDialogCreator from '@/mixins/registration-dialog-creator'
  import http from '@/service'
  import { saveAs } from 'file-saver'
  import {
    withdrawOrAnthorinputReason,
    $likeName,
    $likePrisonerNumber,
    $likePhone
  } from '@/common/constants/const'
  export default {
    mixins: [prisonFilterCreator, registrationDialogCreator],
    data() {
      // 标签元素
      const tabsItems = [
        {
          label: '现场探视申请',
          name: 'first'

        },
        {
          label: '审核已通过',
          name: 'PASSED'
        },
        {
          label: '审核未通过',
          name: 'DENIED,CANCELED'
        },
        {
          label: '未审核',
          name: 'PENDING'
        }
      ]
      // 证件照片class
      // const idCardClassName = 'img-idCard'
      const { belong } = prisons.PRISONAREA

      const { options } = this.$store.getters.prisonAreaOptions

      const freeMeetingsOptions = [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]

      // const yesterdayDate = Moment().subtract(1, 'days').format('YYYY-MM-DD')
      const todayDate = this.$_dateNow

      const oneMonthLater = Moment().add(1, 'months').format('YYYY-MM-DD')
      return {
        user: this.$store.state.global.user,
        visitsFlag: true, // 实地探视不需要多级审批 只需再visit-list.vue中定义
        visits: {
          contents: [],
          total: 0
        },
        withdrawOrAnthorinputReason,
        tabsItems,
        tabs: 'PENDING',
        searchItems: {
          name: {
            type: 'input',
            label: '家属姓名'
          },

          prisonerNumber: {
            type: 'input',
            label: '罪犯编号'
          },

          applicationDate: {
            type: 'dateRange',
            unlinkPanels: true,
            start: 'applicationStartDate',
            end: 'applicationEndDate',
            startPlaceholder: '通话开始时间',
            endPlaceholder: '通话结束时间',
            value: [ this.$_dateNow, Moment().add(1, 'months').format('YYYY-MM-DD') ]
          },

          prisonerName: {
            type: 'input',
            label: '罪犯姓名',
            miss: false,
            value: ''
          },

          level:{
            type: 'select',
            label: '管教级别',
            options: [
              { label: '宽管级', value: 1 },
              { label: '普管级', value: 2 },
              { label: '考察级', value: 3 },
              { label: '严管级', value: 4 }
            ],
            value: ''
          },

          status: {
            type: 'select',
            label: '申请状态',
            options: this.$store.state.applyStatus.filter(s => s.value != 'MEETING_ON'),
            miss: true,
            correlation: "status",
            value: ''
          },

          changerType:{
            type: 'select',
            label: '取消操作人',
            options: this.$store.state.canceledStatus,
            miss: true,
            value: ''
          },

          auditAt: {
            type: 'date',
            label: '审核时间',
            miss: true,
            value: ''
          },

          isFree: {
            type: 'select',
            label: '免费',
            options: freeMeetingsOptions,
            miss: true,
            value: ''
          }
        },
        show: {
          authorize: false,
          agree: false,
          disagree: false,
          withdraw: false,
          detail: false,
          dialog:false,
          rejectEdit:false,
          editRebut:true,
          meetingQueue:false,
          familiesDetialInform: false,
          userRemarks:false

          // subTask: true,
          // authorize: true,
          // agree: false,
          // disagree: false,
          // withdraw: false,
          // detail: false,
          // dialog:false,
          // rejectEdit:false,
          // editRebut: false,
          // meetingQueue: false,
          // familiesDetialInform: false,
          // userRemarks: false
        },
        operateQueryAuth:false,
        toAuthorize: {},
        toShow: {},
        family: {},
        sortObj: {},
        submitSuccessParams: {},
        nextAuth:'',
        familyShows: [],
        // 家属详情信息组件
        familyDetailInformationItems: [
          {
            label: '姓名',
            prop: 'familyName'
          },
          {
            label: '关系',
            prop: 'relationship'
          },
          {
            label: '家属信息',
            prop: 'familyInformation',
            definedClass: 'img-box'
          },
          {
            label: '关系证明',
            prop: 'familyRelationalInformation',
            definedClass: 'img-box'
          },
          {
            label: '可视电话通知单',
            prop: 'familyMeetNoticeInformation',
            definedClass: 'img-box'
          }
          // {
          //   label: '身份证正面',
          //   prop: 'familyIdCardFront',
          //   definedClass: idCardClassName
          // },
          // {
          //   label: '身份证背面',
          //   prop: 'familyIdCardBack',
          //   definedClass: idCardClassName
          // },
          // {
          //   label: '关系证明图',
          //   prop: 'familyRelationalProofUrl',
          //   definedClass: idCardClassName
          // }
        ],
        meetingAdjustment: {},

        selectProcessOption:[],

        multistageExamineKeys: {
          userName: 'operateName',

          reamrks: 'remark',

          createAt: 'operateTime',

          status: 'status'
        },

        // yesterdayDate,

        // todayDate,

        oneMonthLater,
        submitParams:{},
        filterInit: {},
        btnDisable: false, // 按钮禁用与启用
        content:[],
        updateer:'',
        contentId:"",
         withdrawForm: {
        selectRemark:"",
        withdrawReason: ""
      },
      refuseForm: {
        selectRemark:"",
        anotherRemarks: ""
      },
      withdrawRule: {
        anotherRemarks: [
          {
            validator:(rule,value,callback)=>{
              if(this.refuseForm.anotherRemarks){
                  callback()
              }else{
                  callback(new Error('请填写驳回原因'))
              }
            }
          }
        ],
        withdrawReason: [
          {
            validator:(rule,value,callback)=>{
              if(this.withdrawForm.withdrawReason){
                  callback()
              }else{
                  callback(new Error('请填撤回原因'))
              }
            }
          }
        ]
      },
      remarks: [],

      downloading: false
      }
    },
    computed: {
      ...mapState([
        // 'meetings',
        'frontRemarks',
        'meetingRefresh',
        'global'
      ]),

      ...mapState({
        isAdmin: state => state.global.user.role == '0'
      }),

      ...mapGetters([
        'isShowPhone',
        'isSuperAdmin'
      ]),

      // excel的参数 需要添加当前标签页的label
      excelFilter() {
        const tabItem = this.tabsItems.filter(tabItem => tabItem.name === this.tabs)

        const TABName = tabItem[0]['label']

        if (this.toShow.changerType === true) this.filter.changerType = '2'

        if (helper.isEmptyObject(this.sortObj)) this.filter = Object.assign(this.filter, this.sortObj)

        else {
          this.$refs.elTable && this.$refs.elTable.clearSort()
          delete this.filter.sortDirection
          delete this.filter.orderField
        }

        if (this.tabs !== 'first') {
          if (this.tabs !== 'DENIED,CANCELED' || !this.filter.status) {
            this.filter.status = this.tabs
          }
        }

        const { jailId } = this.$store.state.global.user

        let params = {
          ...this.filter
        }

        if (!this.isSuperAdmin) params = {
          jailId,
          ...params
        }

        return {
          ...params,
          TABName
        }
      },

      tableCols() {
        // const { applicationStartDate, applicationEndDate } = this.filter
        const basicCols = [
            {
              label: '监区',
              prop: 'prisonArea',
              showOverflowTooltip: true
            },
            {
              label: '罪犯编号',
              prop: 'prisonerNumber',
              ...$likePrisonerNumber
            },
            {
              label: '罪犯姓名',
              prop: 'prisonerName',
              showOverflowTooltip: true,
              ...$likeName
            },
            {
              label: '管教级别',
              slotName: 'level',
              minWidth: 75
            },
            {
              label: '性别',
              prop: 'gender',
              minWidth: 50
            },
            {
              label: '申请时间',
              prop: 'createdAt',
              minWidth: 130,
              slotName: 'createdAt'
            },
            {
              label: '申请通话时间',
              prop: 'meetingTime',
              slotName: 'meetingTime',
              sortable: 'custom',
              minWidth: 135
            },
            {
              label: '家属',
              prop: 'filterFamilies',
              minWidth: 115,
              ...$likeName,
              desensitizationColsConfigs: {
                keyWord: 'familyId',
                prop: 'familyName',
                desensitizationColSlotName: 'families'
              }
            },
            {
              label: '家属电话',
              prop: 'phone',
              ...$likePhone
            },
            {
              label: '关系',
              prop: 'relationship'
            },
            {
              label: '申请状态',
              slotName: 'content',
              minWidth: 80,
              className: 'orange'
            }
          ],
          allPrisonQueryAuthLeadingCols = [
            {
              label: '监狱名称',
              prop: 'jailName',
              minWidth: 100,
              showOverflowTooltip: true
            }
          ],
          noAllPrisonQueryAuthLeadingCols = [
            {
              label: '操作',
              slotName: 'operate',
              width: 150,
              align: 'center'
            }
          ]

        const terminaUniquelId = {
          label: '终端唯一标识',
          prop: 'terminalNo',
          minWidth: 100
        }

        // if (!applicationStartDate || !applicationEndDate) {
        //   for(let i = 0; i < basicCols.length; i++) {
        //     if (basicCols[i].prop === 'meetingTime') {
        //       delete basicCols[i].sortable
        //       break
        //     }
        //   }
        // }

        if (!this.isShowPhone) {
          const index = basicCols.findIndex(col => col.label === '家属电话')
          basicCols.splice(index, 1)
        }

        if (this.hasAllPrisonQueryAuth || this.hasProvinceQueryAuth) {
          this.operateQueryAuth=false
          let cols = [
            {
              label: '省份',
              prop: 'provinceName'
            },
            ...allPrisonQueryAuthLeadingCols,
            ...basicCols.filter(c => c.prop != 'phone')
          ]

          if (this.tabs === 'first' || this.tabs === 'PASSED' ) {
            cols = [ ...cols, terminaUniquelId,...noAllPrisonQueryAuthLeadingCols]
          }
          else if(this.tabs === 'PENDING' ) {

          }else{
            cols=[...cols, ...noAllPrisonQueryAuthLeadingCols]
          }
          return cols
        }
        else{
          this.operateQueryAuth=true
          return [
            ...basicCols,
            ...noAllPrisonQueryAuthLeadingCols
          ]
        }
      }
    },
    watch: {
      meetingRefresh(val) {
        if (val) {
          if (!this.show.authorize && !this.show.withdraw && !this.toShow.id && !this.show.familiesDetialInform) this.getDatas('meetingRefresh')
        }
      },

      tabs(val) {
        this.$refs.search.onSearch('tabs')
        this.searchItems.changerType.miss = true
        delete this.filter.changerType
        this.searchItems.changerType.value = ''
        this.toShow.changerType=false
        if (val === 'PENDING') {
          this.searchItems.isFree.miss = true
          this.searchItems.status.miss = true
          this.searchItems.auditAt.miss = true
          this.searchItems.prisonerName.miss = false
          delete this.filter.auditAt
          delete this.filter.prisonerName
          delete this.filter.isFree
          this.searchItems.prisonerName.value = ''
          this.searchItems.auditAt.value = ''
          this.searchItems.status.value = ''
          this.searchItems.isFree.value = ''
        }
        else if(val === 'PASSED') {
          this.searchItems.isFree.miss = true
          this.searchItems.status.miss = true
          this.searchItems.auditAt.miss = false
          this.searchItems.prisonerName.miss = false
          delete this.filter.auditAt
          delete this.filter.prisonerName
          delete this.filter.isFree
          this.searchItems.prisonerName.value = ''
          this.searchItems.auditAt.value = ''
          this.searchItems.status.value = ''
          this.searchItems.isFree.value = ''
        } else{
          //options
          if (this.hasAllPrisonQueryAuth || this.hasProvinceQueryAuth) {
            this.searchItems.isFree.miss = false
          } else {
            this.searchItems.isFree.miss = true
            delete this.filter.isFree
            this.searchItems.isFree.value = ''
          }
          this.searchItems.status.miss = false
          this.searchItems.prisonerName.miss = false
          this.searchItems.auditAt.miss = false
          delete this.filter.status
          delete this.filter.prisonerName
          this.searchItems.status.value = ''
          this.searchItems.prisonerName.value = ''
          if(val === 'DENIED,CANCELED'){
            this.searchItems.status.options=this.$store.state.deniedStatus
            this.toShow.changerType=true
            this.filter.changerType = '2'
          }else{
            this.searchItems.status.options = this.$store.state.applyStatus.filter(s => s.value != 'MEETING_ON')
          }
        }
        this.onSearch()
      },

      toShow: {
        handler: function(val) {
          if (val.id) this.show.detail = true
          else this.show.detail = false
        },
        deep: true
      }
    },

    created() {
      this.filterInit = Object.assign({}, this.filterInit, {
        applicationStartDate: this.todayDate,
        applicationEndDate: this.oneMonthLater
      })
    },

    async mounted() {
      this.$refs.search.onGetFilter()
      this.getDatas()
    },

    methods: {
      ...mapActions([
        'withdrawVisit'
      ]),

      refuseFormChange(e){
        let str=""
         if(!this.refuseForm.anotherRemarks){
            this.refuseForm.anotherRemarks=""
          }
        e.forEach((item,index)=>{
          if(!this.refuseForm.anotherRemarks.includes(item)){
            str +=`${item}。\n`
          }
        })
        this.refuseForm.anotherRemarks+=str
      },
    withdrawFormChange(e){
      let str=""
       if(!this.withdrawForm.withdrawReason){
            this.withdrawForm.withdrawReason=""
          }
        e.forEach((item,index)=>{
          if(!this.withdrawForm.withdrawReason.includes(item)){
            str +=`${item}。\n`
          }
        })
        this.withdrawForm.withdrawReason+=str
    },

    // 获取当前驳回原因列表
    async getRejectContent() {
      let { content, id, updateEr } = await http.getRejectEdit({
        type: 3,
        jailId: this.user.jailId
      })
      this.content = content || []
      this.contentId = id
      this.updateer = updateEr
    },

    async onRejectshow(str,isform){
      await this.getRejectContent()
      this.show.rejectEdit = str == 'PASSED'
    },

    addReject(){
      this.content.push('')
    },

    removeReject(index){
      this.content.splice(index,1)
    },

    onRejectEditshow(){
      this.show.editRebut=false
    },

    async changeClose(){
      this.remarks=[]
      await this.onRejectshow(false,this.isform)
      this.show.editRebut=true
    },

    async onSubmitReject(){
      this.content = this.content.filter(c => c && c.trim() )
      if (!this.content.length) {
        this.$message({
          message: '新增编辑内容不能为空',
          type: 'error'
        })
        return
      }
      try {
        await http.setRejectEdit({
          id: this.contentId,
          type: 3,
          content: this.content,
          updateer: this.user.realName,
          jailId: this.user.jailId
        })
        await this.getRejectContent()
        this.show.editRebut = true
      } catch (error) {}
    },
    clearCellText() {
      let _spans = document.querySelectorAll('.meetingQueue-sp')
      if (_spans.length) {
        Array.from(_spans).forEach(sp => sp.innerText = '')
      }
    },
      cellClick(row, column, cell, event){
        let _cell = cell.querySelector(".meetingQueue-sp")
        if (!_cell.textContent && column.label != '窗口序号' && column.label != '当日没有可选时间段') {
          this.clearCellText()
          _cell.innerText = this.toAuthorize.familyName
          this.submitSuccessParams = {
            window: parseInt(row.window),
            meetingTime: column.label
          }
        }
      },

      async getDatas() {
        if (this.tabs !== 'first') {
          if (this.tabs !== 'DENIED,CANCELED' || !this.filter.status) {
            this.filter.status = this.tabs
          }
        }
        let params = {
          ...this.filter,
          ...this.pagination
        }
        let { visits, total } = await http[ this.isAdmin ? 'getVisitsByAdmin' : 'getVisits' ](params)
        if (visits && visits.length) {
          visits.forEach(m => {
            if (!m.filterFamilies) {
              m.filterFamilies = [{
                familyId: m.familyId,
                familyName: m.familyName
              }]
            }
          })
        }
        this.visits.contents = visits || []
        this.visits.total = total
      },

      async onSearch() {
        if (this.toShow.changerType === true) {
          this.filter.changerType = '2'
        }
        if (helper.isEmptyObject(this.sortObj)) this.filter = Object.assign(this.filter, this.sortObj)
        else {
          this.$refs.parentElTable && this.$refs.parentElTable.elTableClearSort()
          delete this.filter.sortDirection
          delete this.filter.orderField
        }

        await this.$refs.pagination.handleCurrentChange(1)
      },

      // 获取数据
      async onGetDetailAndInitData(id) {
        let { data = {} } = await http.getVisitsChangelog(id)
        if (!data.changeLogs) {
          data.changeLogs = []
        }
        this.toAuthorize = Object.assign({ id }, data)
      },

      // 获取实地探监预约配置
      async getVisitTimeConfig(id) {
        let { data } = await http.getVisitsConfigMeetingtime(id)
        if (data) {
          let { windows = [], meetingQueue = [] } = data
          windows = windows.map(w => {
            let _w = {
              window: w
            }
            meetingQueue.forEach(m => {
              _w[m] = ''
            })
            return _w
          })
          this.meetingAdjustment = {
            windows,
            meetingQueue
          }
        }
      },

      // 表格操作-审核
      async handleAuthorization(e) {
        const { id } = e
        await this.onGetDetailAndInitData(id)
        this.show.agree = false
        this.show.disagree = false
        this.submitSuccessParams = null
        await this.onRejectshow(false,false)
        this.isform = false
        this.$message.closeAll()
        // 获取实地探监的配置信息
        await this.getVisitTimeConfig(id)
        this.show.authorize = true
        this.toShow = JSON.parse(JSON.stringify(this.toAuthorize))
      },
      async handleWithdraw(e) {
        const { id } = e

        await this.onRejectshow(false,true)

        this.isform=true

        await this.onGetDetailAndInitData(id)

        this.show.withdraw = true
      },
      async onDetail(e) {
        const constFamilyShows = [
            {
              label: '与囚犯关系',
              prop: 'relationship',
              style: { width: '100%' }
            },
            {
              label: '预约时间',
              prop: 'meetingTime'
            },
            {
              label: '窗口号',
              prop: 'window'
            },
            {
              label: '审核人账号',
              prop: 'auditUserName'
            },
            {
              label: '审核人姓名',
              prop: 'auditRealName'
            },
            {
              label: '审核时间',
              slotName: 'auditAt'
            },
            {
              label: '申请状态',
              slotName: 'status'
            },
            {
              label: '通话时长',
              slotName: 'duration'
            },
            {
              label: '拒绝原因',
              prop: 'content',
              style: { width: '100%' }
            }
          ]
        let { data = {} } = await http.getVisitsChangelog(e.id)
        // if(data.callLogs && data.callLogs.length) {
        //   data.callLogs.forEach((item,index)=>{
        //     item.status="CALL"
        //     data.changeLogs.splice(1+index, 0, item)
        //   })
        // }
        this.toShow = Object.assign({}, data)
        this.show.dialog = true
        this.familyShows = this.toShow.status !== 'DENIED' ? constFamilyShows.slice(0, constFamilyShows.length - 1) : constFamilyShows
      },
      isDevelop(val, key) {//判断结束原因是否存在多行
        this.$nextTick(() => {
          if(this.$refs[`itemHeigh+${key}`]){
            this.$set(val,'itemHeigh', this.$refs[`itemHeigh+${key}`][0].clientHeight)
          }
        })
        return val.remark
      },
      onCloseShow() {
        this.toShow.id = ''
        this.show.dialog=false
        if (this.meetingRefresh) this.getDatas('onCloseShow')
      },
      closeFamilyDetail() {
        this.show.familiesDetialInform = false
        if (this.meetingRefresh) this.getDatas('closeFamilyDetail')
      },
      //覆盖mixin 授权不同意情况下的提交操作
      onDeniedSubmit() {
        if (this.$refs.refuseForm) this.$refs.refuseForm.onSubmit()
        else this.onAuthorization('DENIED')
      },
      //覆盖mixin 授权对话框的关闭操作
      onCloseAuthorize() {
        this.show.authorize = false
      },
      //覆盖mixin 授权对话框的同意操作
      onAgreeAuthorize() {
        this.show.agree = true
        this.buttonLoading = false
        this.submitSuccessParams = null
        this.clearCellText()
      },
      //覆盖mixin 授权对话框的不同意操作
      onDisagreeAuthorize() {
        this.show.disagree = true
        this.buttonLoading = false
      },
      //覆盖mixin 授权对话框同意情况下的确认操作
      // onPassedAuthorize() {
      //   this.onAuthorization('PASSED')
      // },
      //覆盖mixin 授权对话框同意情况下的返回操作
      onAgreeAuthorizeGoBack() {
        this.show.agree = false
      },
      //覆盖mixin 授权对话框不同意情况下的返回操作
      onDisagreeAuthorizeGoBack() {
        this.closeAuthorize('back')
      },

        // 比较时间大小
      compareDate(date1,date2) {
        let oDate1 = new Date(date1);
        let oDate2 = new Date(date2);
        if (oDate1.getTime() > oDate2.getTime()) {
          return true; //第一个大
        } else {
          return false; //第二个大
        }
      },
      onAuthorization(e, args) {
        this.btnDisable =true
        let params = { id: this.toAuthorize.id, status: e }
        if ((e === 'DENIED' || e === 'WITHDRAW')) {
        if(e === 'DENIED'){
          this.$refs.refuseForm.validate(valid => {
            if(!this.refuseForm.anotherRemarks){
              this.refuseForm.anotherRemarks=""
            }
            if (valid) params.remarks =this.refuseForm.anotherRemarks.replace(/\s*/g, '')
            else this.btnDisable = false
          })
        }
        if (this.btnDisable) this.handleSubmit(params)
      }
      else this.handleSubmit(params)
      },
      handleSubmit(params) {
        this.buttonLoading = true
        http.authorizeVisitByProcess(params).then(res => {
          this.buttonLoading = false
          this.btnDisable = false
          if (!res) return
          this.closeAuthorize()
          this.toAuthorize = {}
          this.getDatas('handleSubmit')
        })
      },
      submitSuccess() {
        //第一个是当前系统时间，第二个提交时间
        if (this.compareDate(new Date(), `${this.toAuthorize.meetingTime || this.toAuthorize.applicationDate} ` + this.submitSuccessParams.meetingTime.toString().substring(0, 5))) {
          this.$message.closeAll()
          this.$message({
            showClose: true,
            message: '请选择其他探视时间段',
            type: 'error'
          });
          this.handleAuthorization(this.toAuthorize)
        } else {
            this.submitParams.id = this.toAuthorize.id
            this.submitParams.window = this.submitSuccessParams.window
            this.submitParams.meetingTime = this.submitSuccessParams.meetingTime
            this.submitParams.status = 'PASSED'
            this.submitParams.nextAuth = this.nextAuth
            this.show.agree = false
            this.submitMeetingAuthorize()
        }
      },
      submitMeetingAuthorize() {
         http.authorizeVisitByProcess(this.submitParams).then(res => {
            if (!res) return
            this.closeAuthorize()
            this.toAuthorize = {}
            this.submitSuccessParams = null
            this.getDatas('handleSubmit')
          })
      },
      onWithdraw(arg) {
       this.btnDisable = true
       let params = {
          id: this.toAuthorize.id,
          status: 'CANCELED'
        }
        this.$refs.withdrawForm.validate(valid => {
          if(!this.withdrawForm.withdrawReason){
            this.withdrawForm.withdrawReason=''
          }
            if (valid) params.remarks  =this.withdrawForm.withdrawReason.replace(/\s*/g, '')
            else this.btnDisable = false
          })
        if (this.btnDisable){
          this.withdrawVisit(params).then(res => {
                    if (!res) return
                    this.buttonLoading = false
                    this.btnDisable = false
                    this.closeWithdraw(true)
                    this.toAuthorize = {}
                    this.getDatas('onWithdraw')
                  })
        }
      },
      closeAuthorize(e) {
        this.withdrawForm.withdrawReason=""
        this.refuseForm.anotherRemarks=""
         if (this.$refs.refuseForm) this.$refs.refuseForm.clearValidate()
         if (this.$refs.withdrawForm) this.$refs.withdrawForm.clearValidate()
        if (e === 'back') this.show.disagree = false
        else {
          this.show.authorize = false
          if (this.meetingRefresh) this.getDatas('closeAuthorize')
        }
        this.remarks =[]
        this.submitParams=null
        this.nextAuth=''
      },
      closeWithdraw(e) {
        this.show.withdraw=false
        this.show.authorize=false
        this.remarks = []
        this.withdrawForm.withdrawReason=""
        this.refuseForm.anotherRemarks=""
        if (this.$refs.refuseForm) this.$refs.refuseForm.clearValidate()
        if (this.$refs.withdrawForm) this.$refs.withdrawForm.clearValidate()
        this.$refs.dialogForm && this.$refs.dialogForm.onCancel()
        if (e !== true && this.meetingRefresh) this.getDatas('closeWithdraw')
      },
      async showFamilyDetail(familyId, visitId) {
        let { data = {} } = await http.getVisitsFamilyDetail({ familyId, visitId })
        data.family = data.family || {}
        data.family.relationalProofUrls = []
        for(let [key, value] of Object.entries(data.family)) {
          const keys = ['familyRelationalProofUrl', 'familyRelationalProofUrl2', 'familyRelationalProofUrl3', 'familyRelationalProofUrl4']
          keys.includes(key) && value && data.family.relationalProofUrls.push({
            url: value
          })
        }
        this.family = Object.assign({}, data.family)
        this.show.familiesDetialInform = true
      },
      sortChange({ column, prop, order }) {
        if (!prop || !order) {
          this.sortObj = {}
          delete this.filter.sortDirection
          delete this.filter.orderField
        }
        else {
          this.sortObj.orderField = prop
          if (order === 'descending') this.sortObj.sortDirection = 'desc'
          else if (order === 'ascending') this.sortObj.sortDirection = 'asc'
          this.filter = Object.assign(this.filter, this.sortObj)
        }
        this.getDatas('sortChange')
      },

      async handleExportExcel() {
        if (this.downloading) {
            return
        }
        this.downloading = true
        const params = { ...this.filter }
        try {
            let data = await http[ this.isAdmin ? 'exportVisitsByAdmin' : 'exportVisits' ](params)
            let _tab = this.tabsItems.find(t => t.name == this.tabs)
            saveAs(data, `现场探视预约管理列表-${ _tab && _tab.label }-${ helper.DateFormat(Date.now(),'YYYYMMDDHHmmss') }.xls`)
            this.downloading = false
        } catch (error) {
            this.downloading = false
        }
      },

      // async onDownloadExcel() {
      //   this.downloading = true

      //   const times = helper.DateFormat(Date.now(),'YYYYMMDDHHmmss'),
      //     tabItem = this.tabsItems.filter(tabItem => tabItem.name === this.tabs),
      //     TABName = tabItem[0]['label'],
      //     actionName = 'exportVisitExcel',
      //     params = {
      //       url: `/prisoner_visits/${ this.isAdmin ? 'exportAdminPrisonerVisits' : 'exportPrisonerVisits' }`,
      //       params: { ...this.filter, tab: this.tabs }
      //     }

      //   await tokenExcel({
      //     params,
      //     actionName,
      //     menuName: `现场探视预约管理-${ TABName }-${ times }`,
      //   })

      //   setTimeout(() => {
      //     this.downloading = false
      //   }, 300)
      // }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/css/list";
  .el-table /deep/ {
    th {
      padding: 5px 0 3px !important;
    }
  }

  #body .el-table.tableBorder /deep/{
    td{
      border-bottom: 1px solid #e6e6e6;
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
  .across-filter {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .filter__label {
      font-size: 12px;
      margin-right: 10px;
      color: #666;

      &.special {
        min-width: 110px;
        text-align: right;
      }
    }
  }
  .timerange-tips {
    padding-left: 120px;
    color: red;
    font-size: 12px;
  }
  .meetingQueue-sp {
    color: #409EFF;
  }
</style>

<style lang="stylus">
.logMgCls {
  text-align:left
}
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
    .select_edit.el-select-dropdown__item{
        display: inline-block;
    }
    .select_edit.el-select-dropdown__item span {
        min-width: 400px;
        display: inline-block;
   }
</style>

<style type="text/stylus" lang="stylus" scoped>
  .cell img
    width: 126.8px;
    cursor: pointer;
  .button-detail
    display: block;
    margin-left: 0;
    width: 56px;
  .flex-dialog
    display: flex;
    flex-wrap: wrap;
    >>> label
      display: inline-block;
      width: 90px;
      text-align: right;
  .withdraw-box
    margin-bottom: 20px;
  .withdraw-form
    >>> .button-box
      padding-bottom: 0px
  .img-box
    display: flex;
    flex-direction: column !important;
    .img-items
      padding-top: 10px;
      .el-image
        width: 32%;
        height: 110px;
        margin-bottom: 5px;
        >>> img
          width: 100%;
          height: 100%;
          cursor: pointer;
  .el-image.relation_img
    width: 24% !important;
  .family-dialog
    >>> .el-dialog__body
      padding: 10px 20px !important;
    >>> .el-dialog__header
      border-bottom: 1px solid #f4f4f4 !important;
  .button-box
    >>> .el-button
      width: 23% !important;
      &:first-of-type
        margin-left: 0px !important;
  .more-button__box
    >>> .el-button
      &:first-of-type
        width: 31% !important;
</style>
