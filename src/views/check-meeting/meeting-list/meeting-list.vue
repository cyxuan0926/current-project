<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      :items="searchItems"
      ref="search"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    >
      <m-excel-download
        slot="append"
        :path="excelDownloadUrl"
        :params="excelFilter"
      />
    </m-search>

    <el-col :span="24">
      <el-tabs
        v-model="tabs"
        type="card">
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
        :cols="tableCols"
        ref="parentElTable"
        :data="meetings.contents"
        @sort-change="sortChange"
      >
        <template #level="{ row }">
          <span v-if="row.level === 1">宽管级</span>

          <span v-if="row.level === 2">普管级</span>

          <span v-if="row.level === 3">考察级</span>

          <span v-if="row.level === 4">严管级</span>
        </template>

        <template #meetingTime="{ row }">
          <span >{{ row.meetingTime || row.applicationDate }}</span>
        </template>

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
          <!-- authorizeLevel 等于1就是一级审核人员提交，等于2就是高级审核人员审核过了  -->
          <el-button
            v-if="(row.status == 'PENDING' && row.isLock !== 1 && operateQueryAuth === true && !(haveMultistageExamine && row.authorizeLevel === 1 && !isAdvancedAuditor)) && row.isCheck"
            size="mini"
            @click="handleAuthorization(row)">授权</el-button>

          <el-button
            v-else-if="row.status === 'PASSED' && row.isWithdrawFlag === 1  && operateQueryAuth === true && !(haveMultistageExamine && row.authorizeLevel === 1 && !isAdvancedAuditor)"
            size="mini"
            @click="handleWithdraw(row)">撤回</el-button>

          <el-button v-if="tabs == 'UNUSUAL'&& row.unusualRemark" @click="handleWithdraw(row)">撤回</el-button>

          <el-button
            v-if="tabs == 'UNUSUAL'&& row.unusualRemark"
            size="mini"
            class="button-detail"
            @click="detailRemarks(row)"
          >已备注</el-button>

          <el-button
            v-if="tabs == 'UNUSUAL'&& !row.unusualRemark"
            size="mini"
            class="button-detail"
            @click="setRemarks(row)"
          >备注</el-button>

          <el-button
            v-if="row.status != 'PENDING' || (haveMultistageExamine && row.authorizeLevel === 1 && !isAdvancedAuditor) || !row.isCheck"
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
      :total="meetings.total"
      @onPageChange="getDatas"
    />

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="show.agree"
      class="authorize-dialog"
      title="请选择通话时间段"
      width="900px">
      <div
        v-if="show.agree"
        class="button-box">
        <section v-show="isSpecial">
          <div class="across-filter" v-if="isSeparateByArea || isUseMeetingFloor">
            <label class="filter__label special">选择区域</label>
            <el-select style="width: 200px" v-model="areaTypes" placeholder="请选择区域">
              <el-option
                v-for="item in areaOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="across-filter">
            <label class="filter__label special">通话时长</label>
            <el-select style="width: 200px" v-model="crossDuration" placeholder="请选择通话时长" @change="handleDurationChange">
              <el-option
                v-for="d in durationOptions"
                :key="d.value"
                :label="d.label"
                :value="d.value">
              </el-option>
            </el-select>
          </div>
          <div class="across-filter">
            <label class="filter__label special">可视电话通话时间</label>
            <el-time-picker
              style="width: 150px;"
              v-model="timeRangeStart"
              format="HH:mm"
              :picker-options="selectRange"
              :clearable="false"
              @change="handleTimepickerChange">
            </el-time-picker>
            <label style="margin: 0 10px;">至</label>
            <el-time-picker
              style="width: 150px;"
              v-model="timeRangeEnd"
              format="HH:mm"
              disabled>
            </el-time-picker>
          </div>
          <p class="timerange-tips" v-show="isShowTips">{{showTips}}</p>
        </section>
        <section v-show="!isSpecial">
          <el-tabs
            v-if="isSeparateByArea || isUseMeetingFloor"
            v-model="areaTabs"
            type="card">
            <el-tab-pane v-for="t in areaOptions"
              :key="t.value"
              :label="t.label"
              :name="t.value" />
          </el-tabs>
          <el-table
            :data="meetingAdjustmentCopy.terminals"
            border
            @cell-click="cellClick"
            :row-class-name="tableRowClassName"
            :cell-style="cellStyle"
            class="tableBorder">
            <el-table-column
              v-if="meetingAdjustmentCopy.meetingQueue && meetingAdjustmentCopy.meetingQueue.length > 7"
              fixed
              prop="terminalNumber"
              label="终端号"
              min-width="80">
            </el-table-column>
            <el-table-column
              v-else
              prop="terminalNumber"
              label="终端号"
              min-width="80">
            </el-table-column>
            <el-table-column
              v-if="meetingAdjustmentCopy.meetingQueue && meetingAdjustmentCopy.meetingQueue.length > 7"
              fixed
              prop="prisonConfigName"
              label="监区"
              min-width="110">
            </el-table-column>
            <el-table-column
              v-else
              prop="prisonConfigName"
              label="监区"
              min-width="110">
            </el-table-column>
            <el-table-column
              v-for="(item,index) in meetingAdjustmentCopy.meetingQueue" :key="index"
              :prop="item"
              :label="item"
              min-width="84">
            </el-table-column>
            <el-table-column
              v-if="show.meetingQueue"
              prop="noTimes"
              label="当日没有可选时间段"
              min-width="84">
            </el-table-column>
          </el-table>
        </section>
      </div>
      <div v-if="show.agree" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleShowOther" v-if="submitSuccessParams && userDefinedDuration">{{ `选择${ !isSpecial ? '其他' : '常规' }时间段` }}</el-button>
          <el-button type="primary" @click="submitSuccess" :disabled="!submitSuccessParams">确 定</el-button>
          <el-button @click="show.agree=false">取 消</el-button>
        </div>
    </el-dialog>
    <el-dialog
      :visible.sync="show.authorize"
      class="authorize-dialog"
      @close="closeAuthorize"
      title="审核"
      :close-on-click-modal="false"
      width="780px">
        <div style="max-height:380px;overflow: auto">
        <div style="display: flex;border: 1px solid #E4E7ED;">
          <div class="family-detail">基本信息</div>
          <div class="detail-message">
            <p class="detail-message-family">
              <span class="family-name">家属姓名</span>
              <span class="family-nameDetail">{{toShow.names}}</span>
            </p>
            <p class="detail-message-family" style="border: none">
              <span class="family-name">关系</span>
              <span class="family-nameDetail">{{toShow.relationship}}</span>
            </p>
          </div>
          <div class="detail-content">
            <p class="detail-message-family">
              <span class="family-name">罪犯姓名</span>
              <span class="family-nameDetail">{{toShow.prisonerName}}</span>
            </p>
            <p class="detail-message-family" style="border: none">
              <span class="family-name">申请通话时间</span>
              <span class="family-nameDetail">{{ toShow.meetingTime || toShow.applicationDate }}</span>
            </p>
          </div>
        </div>
         <!-- <div
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
        </div> -->
      </div>

      <template v-if="isAdvancedAuditor && toAuthorize.changeLogs && Array.isArray(toAuthorize.changeLogs) && toAuthorize.changeLogs.length">
        <m-multistage-records :values="toAuthorize.changeLogs" :keys="multistageExamineKeys" />
      </template>

      <div slot="footer" class="dialog-footer">
        <div class="process-select-block clearfix" v-if="!show.agree && !show.disagree">
        <!-- 审批流 -->
        <label v-if="show.subTask && show.process" style="float: left; padding-left: 20px;">
          <span style="padding-right: 12px;">选择流程节点:</span>
            <el-select v-model="nextCheckCode" placeholder="请选择流程节点">
            <el-option
              v-for="item in selectProcessOption"
              :key="item.taskCode"
              :label="item.taskName"
              :value="item.taskCode">
            </el-option>
          </el-select>
        </label>
        <!-- show.multistageExamine 审批流：一直是false  非审批流：根据是否有二级审批   -->
        <repetition-el-buttons v-if="!show.multistageExamine"  style="float: right" :buttonItems="authorizeButtons" />
      </div>

      <!-- 非审批流-二级审批 -->
      <div v-if="show.multistageExamine" style="margin-top:20px" class="button-box more-button__box">
        <div style="margin-bottom: 10px;">初审意见：</div>
        <m-form
          class="multistage_examine-form"
          ref="multistage_examine-form"
          :items="localFirstLevelExamineFormItems"
          @submit="onMultistageExamineCheck"
        />
        <repetition-el-buttons :buttonItems="showMultistageExamineButtons" />
      </div>

      <div
        v-if="show.disagree"
        class="button-box logMgCls">
        <div style="margin-bottom: 10px;">请选择驳回原因</div>
          <div>
            <el-select v-model="remarks" :multiple="true" :multiple-limit='5'  collapse-tags @change="refuseFormChange" style="width:70%;margin-right:10px">
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
            <el-form-item prop="anotherRemarks"  >
               <el-input
                :autosize="{ minRows: 6 ,maxRows:8 }"
                type="textarea"
                show-word-limit
                maxlength="1000"
                placeholder="请输入驳回原因..."
                v-model="refuseForm.anotherRemarks"
              />
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
      </div>
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
            <el-select v-model="remarks" :multiple="true"  :multiple-limit='5'  collapse-tags @change="withdrawFormChange" style="width:70%;margin-right:10px">
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

              <span class="family-nameDetail">{{toShow.createTime}}</span>
            </p>
          </div>

          <div class="detail-content">
            <p class="detail-message-family">
              <span class="family-name">与罪犯关系</span>

              <span class="family-nameDetail">{{toShow.relation}}</span>
            </p>

            <p class="detail-message-family" style="border: none">
              <span class="family-name">终端号</span>

              <span class="family-nameDetail">{{toShow.terminalNumber}}</span>
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
              :isLazy="false"
            />
          </div>
        </template>
        <template #familyMeetNoticeInformation="{ scope }">
          <div class="img-items">
            <m-img-viewer
              :url="scope.meetNoticeUrl"
              title="可视电话通知单"
              :isLazy="false"
            />
          </div>
        </template>
      </family-detail-information>
    </el-dialog>

    <el-dialog
      :visible.sync="show.setRemarks"
      class="authorize-dialog"
      width="600px"
      @close="closeAuthorize"
      title="备注信息">
      <el-form label-width="80px" class="demo-ruleForm">
        <el-form-item label="备注" prop="desc">
          <el-input type="textarea" v-model="getRemarks" :autosize="{ minRows: 6, maxRows: 8}" maxlength="300"  placeholder="请输入内容" show-word-limit></el-input>
        </el-form-item>
      </el-form>
       <span  slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitRemarks()">提 交</el-button>
        </span>
    </el-dialog>
     <el-dialog
      :visible.sync="show.userRemarks"
      class="authorize-dialog"
      width="600px"
      @close="closeAuthorize"
      title="备注信息">
      <el-form label-width="130px" style="max-height:400px" class="demo-ruleForm">
        <el-form-item label="增加备注用户:" prop="desc">
          <span >{{optionsRemarks.unusualRemarkUser}}</span>
        </el-form-item>
        <el-form-item label="增加备注内容:" prop="desc">
          <span >{{optionsRemarks.unusualRemark}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
     <el-dialog
      :visible.sync="show.rejectEdit"
      title="编辑"
      width="530px"
      @close="changeClose()"
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
          @click="onRejectEditshow()">编辑</el-button>
          <span v-else>
          <el-button
          v-if='content.length>0'
          type="primary"
          class="button-add"
          size="mini"
          @click="onSubmitReject()">保存</el-button>
           <el-button
          type="primary"
          class="button-add"
          size="mini"
          v-if='content.length<10'
          @click="addReject()">新增</el-button>
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
  import {
    withdrawOrAnthorinputReason,
    $likeName,
    $likePrisonerNumber,
    $likePhone
  } from '@/common/constants/const'

  import cloneDeep from 'lodash/cloneDeep'

  export default {
    mixins: [prisonFilterCreator, registrationDialogCreator],
    data() {
      // 标签元素
      const tabsItems = [
        {
          label: '可视电话申请',
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
          label: '通话异常统计',
          name: 'UNUSUAL'
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

      const AreaObj = [{label:"监舍区",value:1},{label:"会见楼",value:3}]
      // const todayDate = this.$_dateNow

      // const oneMonthLater = Moment().add(10, 'days').format('YYYY-MM-DD')
      return {
        showTips: '',
        isShowTips: false,
        isSeparateByArea: false,
        isUseMeetingFloor: false,
        selectRange: {},
        AreaObj,
        timeRangeStart: new Date(),
        timeRangeEnd: new Date(),
        userDefinedDuration: false,
        durationOptions: [],
        crossDuration: '',
        isSpecial: false,
        areaTabs: '1',
        areaTypes: '1',
        areaOptions: Array.from(this.$store.state.areaOptions),
        getMeetingId: '',
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
            canNotClear: true,
            //canNotClear: this.$store.state.global.user.role == '0',
            value: [this.$_dateNow, Moment().add(10, 'days').format('YYYY-MM-DD')]
            // miss: true,
            // value: [yesterdayDate, yesterdayDate]
          },
          area: {
            type: 'select',
            label: '通话区域',
            options: this.$store.state.areaOptions,
            value: ''
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
            options: this.$store.state.applyStatus,
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
          subTask: false,
          process: false,
          authorize: false,
          agree: false,
          disagree: false,
          withdraw: false,
          detail: false,
          dialog: false,
          rejectEdit: false,
          editRebut: true,
          meetingQueue: false,
          familiesDetialInform: false,
          multistageExamine: false,
          setRemarks: false,
          userRemarks: false
        },
        getRemarks:'',
        optionsRemarks:{},
        operateQueryAuth:false,
        toAuthorize: {},
        toShow: {},
        family: {},
        sortObj: {},
        submitSuccessParams: null,
        nextCheckCode: '',
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

        meetingAdjustmentCopy: {},

        multistageExamineKeys: {
          userName: 'operateName',

          reamrks: 'remark',

          createAt: 'operateTime',

          status: 'status'
        },

        // yesterdayDate,

        // todayDate,

        // oneMonthLater,
        submitParams: {},
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
      }
    },
    computed: {
      ...mapState([
        'meetings',
        'frontRemarks',
        'meetingRefresh',
        'isSuccessFirstLevelSubmitMeeting'
      ]),

      ...mapGetters([
        'isShowPhone',
        'isSuperAdmin'
      ]),

      excelDownloadUrl() {
        return this.hasAllPrisonQueryAuth || this.hasProvinceQueryAuth ? '/download/exportMettings' : '/download/exportMettingsJail'
      },

      localFirstLevelExamineFormItems() {
        const { remarks } = this.firstLevelExamineFormItems

        return {
          remark: remarks
        }
      },

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

        if (this.tabs !== 'first' && this.tabs !== 'UNUSUAL') {
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

      // 本地实例化的授权表单组件元素
      localAuthorizeFormItems() {
        const { refuseRemark } = this.authorizeFormItems

        return ({
          refuseRemark: {
            ...refuseRemark,
            autosize: {
              minRows: 4
            },
            value: this.withdrawOrAnthorinputReason
          }
        })
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
              ...$likeName
            },
            {
              label: '罪名',
              prop: 'crimes',
              showOverflowTooltip: true
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
              minWidth: 130
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
              className: '',
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
            },

            {
              label: '终端唯一标识',
              prop: 'terminalNo',
              minWidth: 100
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
              minWidth: 120,
              align: 'center'
            }
          ]

        // if (!applicationStartDate || !applicationEndDate) {
        //   for(let i = 0; i < basicCols.length; i++) {
        //     if (basicCols[i].prop === 'meetingTime') {
        //       delete basicCols[i].sortable
        //       break
        //     }
        //   }
        // }
        if (!this.isShowPhone) helper.arrayRemove(basicCols, '家属电话', 'label')

        if (!['first'].includes(this.tabs)) helper.arrayRemove(basicCols, '终端唯一标识', 'label')

        if (this.hasAllPrisonQueryAuth || this.hasProvinceQueryAuth) {
          this.operateQueryAuth = false

          let cols = [
            {
              label: '省份',
              prop: 'provinceName'
            },
            ...allPrisonQueryAuthLeadingCols,
            ...basicCols
          ]

          cols = [...cols, ...noAllPrisonQueryAuthLeadingCols]

          return cols
        }

        else {
          this.operateQueryAuth = true

          return [
            ...basicCols,
            ...noAllPrisonQueryAuthLeadingCols
          ]
        }
      }
    },

    watch: {
      areaTabs() {
        this.submitSuccessParams = null
        this.getMeetTimeConfig()
      },

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
          }else if(val === 'UNUSUAL') {
            this.searchItems.status.options=this.$store.state.unusualStatus
          }else{
            this.searchItems.status.options=this.$store.state.applyStatus
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
      this.searchItems.area.options = JSON.parse(localStorage.getItem('user')).separateByArea ? this.$store.state.areaOptions : this.AreaObj
    },

    methods: {
      ...mapActions([
        'getMeetings',
        'getMeetingsAll',
        'authorizeMeeting',
        'withdrawMeeting',
        'getMeetingsFamilyDetail',
        'getMeettingsDetail',
        'firstLevelAuthorize',
        'getMeettingsChangelogDetail',
        'getUnusualMeetingPage'
      ]),

      ...mapMutations(['setIsRefreshMultistageExamineMessageBell']),
      setRemarks(row){
        this.show.setRemarks=true
         this.getMeetingId=row.id
      },
      submitRemarks(){
        if(this.getRemarks){
           http.addUnusualRemark({
            id: this.getMeetingId,
            unusualRemark: this.getRemarks
          }).then(res=>{
            this.show.setRemarks=false
            this.getRemarks=''
            if (this.tabs === 'UNUSUAL') {
              delete this.filter.status
               const params = {
                    ...this.filter,
                    ...this.pagination
                  }
            let url = '/meetings/findUnusualPage'
            if (this.hasAllPrisonQueryAuth) url = '/meetings/findUnusualAdminPage'
             this.getUnusualMeetingPage({ url, params })
            }
          })
        }else{
           this.$message.error('请输入备注内容');
        }
      },
      detailRemarks(row){
        this.optionsRemarks=row
        this.show.userRemarks=true
      },
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
  async onRejectshow(str,isform){
       let params={}
          params.jailId=JSON.parse(localStorage.getItem('user')).jailId
          params.type=2
      let res = await http.getRejectEdit( params )
      if(res.content){
        this.content = res.content
        this.contentId=res.id
        this.updateer=res.updateEr
      }else{
        this.content = []
      }
      if(str=='PASSED'){
        this.show.rejectEdit=true
      }else{
        this.show.rejectEdit=false
      }
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
     changeClose(){
      this.remarks=[]
      this.onRejectshow(false,this.isform)
       this.show.editRebut=true
    },
     async onSubmitReject(){
      this.content=this.content.filter((res)=>res&&res.trim())
       if(this.content.length<1){
         this.$message({
            message: '新增编辑内容不能为空',
            type: 'error'
          });
          return false
      }else{
        let params={
        id: this.contentId,
        type:2,
        content:this.content,
        updateer:JSON.parse(localStorage.getItem('user')).realName,
        jailId:JSON.parse(localStorage.getItem('user')).jailId
        }
        let res = await http.setRejectEdit(params)
        if(res){
          let params={}
              params.jailId=JSON.parse(localStorage.getItem('user')).jailId
              params.type=2
          let res = await http.getRejectEdit( params )
          if(res.content){
            this.content = res.content
            this.contentId=res.id
            this.updateer=res.updateEr
          }else{
            this.content = []
          }
      }
       this.show.editRebut=true
      }
    },
      tableRowClassName ({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;  //拿到的索引赋值给row的index,在这个表格中能拿到row的里面都会包含index
        return 'row-remarks'  //className(类名)
      },
      cellStyle ({ row, column, rowIndex, columnIndex }) {
        // 状态列字体颜色
        if(row[column.label]){
          if(row[column.label]==this.toAuthorize.name){
            return "background:#fae9db"
          }else{
            return  'background:#DCDFE6'
          }
        }
      },
      cellClick(row, column,cell,event){
        let cellStr=cell.querySelector(".cell").textContent
        if(cellStr){
        }else{
          if(column.label=='监区'){
            return false
          }else if(column.label=='当日没有可选时间段'){
            return false
          }
          else{
            this.meetingAdjustmentCopy.terminals.filter(item=>{
              this.meetingAdjustmentCopy.meetingQueue.forEach(val=>{
                if(item[val]==this.toAuthorize.name){
                  item[val] = ""
                }
              })
            } )
            row[column.label]=this.toAuthorize.name
            this.$set(this.meetingAdjustmentCopy.terminals, row.index,row)
          }
          for (let index in row) {
            if(row[index]==this.toAuthorize.name){
              this.submitSuccessParams={terminalId:row.id,meetingTime:index}
            }
          }
        }
      },
      setMeetingAdjustment({meetingQueue,meetings,terminals}){
        terminals.filter(item=>{
          meetings.forEach(val=>{
            if(item.terminalNumber==val.terminalNumber){
              item[val.meetingTime.slice(-11)]= val.name
            }
          })
          item.noTimes='已没有可安排的通话时间段'
        })
      },

      async getDatas(e) {
        if (this.tabs !== 'first' && this.tabs !== 'UNUSUAL') {
          if (this.tabs !== 'DENIED,CANCELED' || !this.filter.status) {
            this.filter.status = this.tabs
          }
        }

        const params = {
          ...this.filter,
          ...this.pagination
        }

        if (this.tabs === 'UNUSUAL') {
          let url = '/meetings/findUnusualPage'

          if (this.hasAllPrisonQueryAuth) url = '/meetings/findUnusualAdminPage'

          await this.getUnusualMeetingPage({ url, params })
        }

        else {
          if (this.hasAllPrisonQueryAuth) await this.getMeetingsAll(params)

          else {
            const res = await this.getMeetings(params)

            if (!res) return

            if (this.meetingRefresh) this.meetingApplyDealing()
          }
        }
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

      // filterParams () {
      //   //下载表格查询条件处理
      //   const tabItem = this.tabsItems.filter(tabItem => tabItem.name === this.tabs)

      //   const TABName = tabItem[0]['label']

      //   if (this.toShow.changerType === true) this.filter.changerType = '2'

      //   if (helper.isEmptyObject(this.sortObj)) this.filter = Object.assign(this.filter, this.sortObj)

      //   else {
      //     this.$refs.elTable && this.$refs.elTable.clearSort()
      //     delete this.filter.sortDirection
      //     delete this.filter.orderField
      //   }

      //   if (this.tabs !== 'first') {
      //     if (this.tabs !== 'DENIED,CANCELED' || !this.filter.status) {
      //       this.filter.status = this.tabs
      //     }
      //   }

      //   const { jailId } = this.$store.state.global.user

      //   jailId === -1 ? '' : ''

      //   return {
      //     ...this.filter,
      //     TABName
      //   }
      // },

      // 获取数据
      async onGetDetailAndInitData(meetingId) {
        const res = await this.getMeettingsDetail({ meetingId })

        if (!res) return

        return res
      },

      setSelectRange() {
        let _now = new Date()
        this.selectRange = {
          selectableRange: `${ this.toAuthorize && this.toAuthorize.applicationDate === Moment(_now).format('YYYY-MM-DD') ? Moment(_now).format('HH:mm') : '00:00'}:00 - 23:58:00`,
          format: 'HH:mm'
        }
      },

      getMeetTimeConfig() {
        http.getMeetTimeConfig({
          id: this.getMeetingId,
          area: this.isSeparateByArea || this.isUseMeetingFloor ? this.areaTabs : ''
        }).then(res=>{
          this.show.authorize = true
          this.meetingAdjustment=res
          this.show.meetingQueue=this.meetingAdjustment.meetingQueue.length>0?false:true
          this.meetingAdjustmentCopy=JSON.parse(JSON.stringify(this.meetingAdjustment))
          this.setMeetingAdjustment(this.meetingAdjustmentCopy)
          this.userDefinedDuration = this.meetingAdjustment.userDefinedDuration
          this.durationOptions = this.meetingAdjustment.meetingChargeTemplates && this.meetingAdjustment.meetingChargeTemplates.map(c => {
            return {
              label: c.duration,
              value: c.duration
            }
          })
          if (this.durationOptions && this.durationOptions.length) {
            this.crossDuration = this.durationOptions[0].value
          }
        })
      },

      handleShowOther() {
        this.isSpecial = !this.isSpecial
        if( this.isSpecial ) {
          this.setSelectRange()
          this.setTimeRange(new Date())
        }
      },

      handleDurationChange(val) {
        this.crossDuration = val
        this.setTimeRange(this.timeRangeStart.toDate())
      },

      handleTimepickerChange(val) {
        this.isShowTips = false
        this.setTimeRange(val)
      },

      checkInmeetings() {
        return this.meetingAdjustmentCopy.meetingQueue.some(m => {
          let {sm, em} = this.getStartandEndTime(m)
          return this.timeRangeStart.diff(sm) > 0 && this.timeRangeStart.diff(em) < 0 || this.timeRangeEnd.diff(sm) > 0 && this.timeRangeEnd.diff(em) < 0
        })
      },

      getStartandEndTime(time) {
        let _timeRange = time.split('-')
        let sm = _timeRange[0].split(':')
        sm = Moment({ hour: sm[0], minute: sm[1] })
        let em = _timeRange[1].split(':')
        em = Moment({ hour: em[0], minute: em[1] })
        return {
          sm,
          em
        }
      },

      setTimeRange(dateObj) {
        let _start = Moment(dateObj)
        let _end = Moment(dateObj).add(this.crossDuration, 'm')
        let _last = Moment({ hour: '23', minute: '59' })
        this.timeRangeStart = _start
        this.timeRangeEnd = _last.diff(_end) > 0 ? _end : _last
      },
      // 授权
      async handleAuthorization(e) {
        const { id } = e
        this.getMeetingId = id
        this.toAuthorize = await this.onGetDetailAndInitData(id)
        this.submitParams = {}
        this.show.subTask = false
        this.show.agree = false
        this.show.disagree = false
        this.show.multistageExamine = false
        this.submitSuccessParams = null
        this.isSpecial = false
        this.showTips = ''
        this.isShowTips = false
        this.areaTabs = '1'
        this.areaTypes = '1'
        this.onRejectshow(false,false)
        this.isform=false
        // this.areaOptions = Array.from(this.$store.state.areaOptions)
        let { data } = await http.getMeetingSeparateArea({
          inputDate: this.toAuthorize && this.toAuthorize.applicationDate
        })
        // 是否分监舍区和生产区
        this.isSeparateByArea = data && data.separateByArea
        // 是否打开会见楼开关
        this.isUseMeetingFloor = data && !!data.useMeetingFloor
        // 分监舍区和生产区 关闭会见楼开关
        if( this.isSeparateByArea && !this.isUseMeetingFloor ) {
          this.areaOptions = this.areaOptions.filter(item => item.value != '3')
        }
        // 不分监舍区和生产区 打开会见楼开关
        if( !this.isSeparateByArea && this.isUseMeetingFloor ) {
          this.areaOptions = this.areaOptions.filter(item => item.value != '2')
        }
        // 如果配置了审批流
        if( e.processInstanceId ) {
          this.getSubtask(e)
        }
        this.getMeetTimeConfig()
        this.$message.closeAll()
        this.toShow = Object.assign( {}, this.toShow, e )
      },
      // 获取下一级节点
      async getSubtask({ processInstanceId }){
        let _data = await http.getSubtaskPhone({ processInstanceId })
        this.selectProcessOption = _data || []
        this.show.process = !!this.selectProcessOption.length
        this.nextCheckCode = !this.selectProcessOption.length ? '' : this.selectProcessOption[0].taskCode
      },
      async handleWithdraw(e) {
        const { id } = e
        this.onRejectshow(false,true)
        this.isform=true

        this.toAuthorize = await this.onGetDetailAndInitData(id)

        this.show.withdraw = true
      },
      onDetail(e) {
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
              label: '终端号',
              prop: 'terminalNumber'
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
          ],
          params = { meetingId: e.id }
        this.getMeettingsChangelogDetail(params).then(res => {
          if (!res) return
          if(res.callLogs.length){
              res.callLogs.forEach((item,index)=>{
              item.status="CALL"
              res.changeLogs.splice(1+index, 0, item)
            })
          }
          this.toShow = Object.assign({}, res)
          this.show.dialog = true
          this.familyShows = this.toShow.status !== 'DENIED'
            ? constFamilyShows.slice(0, constFamilyShows.length - 1)
            : constFamilyShows
        })
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
        // 1. 非审批流
        // 2. 审批流 只有第一级审核人员可以选择申请时间 未选时间先选择时间 选完时间后可以提交给下一级
        if (!this.toShow.processInstanceId || this.toShow.isChoiceTime && !this.show.subTask) {
          this.show.agree = true
          this.buttonLoading = false
        } else {
          let { id, terminalId, meetingTime, processInstanceId, isChoiceTime } = this.toShow
          this.submitParams = {
            meetingId: id,
            terminalId: terminalId || this.submitSuccessParams.terminalId,
            meetingTime: meetingTime || this.submitSuccessParams.meetingTime,
            processInstanceId,
            isChoiceTime,
            nextCheckCode: this.nextCheckCode
          }
          this.submitMeetingAuthorize()
        }
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

      // 覆盖mixin 高级审批提交情况下的提交操作
       onMultistageExamineGoSubmit() {
         this.show.multistageExamine = true

         this.buttonLoading = false
       },

      // 覆盖mixin 高级审批提交情况下的返回操作
       onMultistageExamineGoBack() {
         this.show.multistageExamine = false

         this.$refs['multistage_examine-form'].handleResetField()
       },

      // 覆盖mixin 高级审批提交情况下的确认操作
      onMultistageExamineSubmit() {
        this.$refs['multistage_examine-form'].onSubmit()
      },

      async onMultistageExamineCheck(params) {
        const { id } = this.toAuthorize

        const { remark } = params

        this.buttonLoading = true

        await this.firstLevelAuthorize({
          params: {
            meetingId: id,
            remark
          },

          url: '/meetings/submitMeeting',

          mutationName: 'setIsSuccessFirstLevelSubmitMeeting'
        })

        this.buttonLoading = false

        if (this.isSuccessFirstLevelSubmitMeeting) {
          this.closeAuthorize()
          this.toAuthorize = {}
          this.getDatas('handleSubmit')
        }
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
        this.authorizeMeeting(params).then(res => {
          this.buttonLoading = false
          this.btnDisable = false
          if (!res) return
          this.closeAuthorize()
          this.setIsRefreshMultistageExamineMessageBell(true)
          this.toAuthorize = {}
          this.getDatas('handleSubmit')
        })
      },
      // 选择时间段提交审核
      submitSuccess: function () {
        //第一个是当前系统时间，第二个提交时间
        if (this.compareDate(new Date(), `${this.toAuthorize.meetingTime || this.toAuthorize.applicationDate} ` + this.submitSuccessParams.meetingTime.toString().substring(0, 5))) {
          this.$message.closeAll()
          this.$message({
            showClose: true,
            message: '请选择其他通话时间段',
            type: 'error'
          });
          this.handleAuthorization(this.toAuthorize)
        } else {
          this.submitParams = {
            meetingId: this.toAuthorize.id,
            terminalId: this.submitSuccessParams.terminalId,
            meetingTime: this.submitSuccessParams.meetingTime
          }
          // 是否分监舍区生产区或者会见楼
          if (this.isSeparateByArea || this.isUseMeetingFloor) {
            this.submitParams.area = this.isSpecial ? this.areaTypes : this.areaTabs
          }
          // 是否选择特殊时间段
          if (this.isSpecial) {
            if (this.checkInmeetings()) {
              this.showTips = '（通话时间与常规配置中的通话时间冲突，请重新选择！）'
              this.isShowTips = true
              return
            }
            this.submitParams.meetingTime = `${Moment(this.timeRangeStart).format('HH:mm')}-${Moment(this.timeRangeEnd).format('HH:mm')}`
          }
          // 非审批流 选择完时间则直接提交审核
          if ( !this.toShow.processInstanceId ) {
            this.submitMeetingAuthorize()
          // 审批流
          } else {
            this.submitParams.processInstanceId = this.toShow.processInstanceId
            this.submitParams.isChoiceTime = this.toShow.isChoiceTime
            this.submitParams.nextCheckCode = this.nextCheckCode
            this.show.subTask = !!this.submitParams.meetingTime
            // 如果没有下一级审核 则直接提交
            if (!this.nextCheckCode) {
              this.submitMeetingAuthorize()
            }
          }
          // 关闭选择时间弹窗
          this.show.agree = false
        }
      },
      // 1. 非审批流 正常审核
      // 2. 审批流 最后一级审核人员提交审核
      async submitMeetingAuthorize() {
        // true 选择自定义特殊时间段  false 选择指定时间段
        let res = await http[ this.isSpecial ? 'meetingSelectOtherAuthorize' : 'meetingSelectAuthorize' ](this.submitParams)
        if (res) {
          this.closeAuthorize()
          this.toAuthorize = {}
          this.setIsRefreshMultistageExamineMessageBell(true)
          this.getDatas('handleSubmit')
        }
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
          this.withdrawMeeting(params).then(res => {
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
      showFamilyDetail(...args) {
        const [ familyId, meetingId ] = args
        this.getMeetingsFamilyDetail({ meetingId, familyId }).then(res => {
          if (res.family) {
            res.family.relationalProofUrls = []
            for(let [key, value] of Object.entries(res.family)) {
              const keys = ['familyRelationalProofUrl', 'familyRelationalProofUrl2', 'familyRelationalProofUrl3', 'familyRelationalProofUrl4']
              keys.includes(key) && value && res.family.relationalProofUrls.push({
                url: value
              })
            }
            // if (!res.family.relationalProofUrls.length) res.family.relationalProofUrls.push({
            //   url: ''
            // })
            this.family = Object.assign({}, res.family)
          }
          else this.family = {}
          this.show.familiesDetialInform = true
        })
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/css/list";
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
  .process-select-block {
    padding: 20px 0 10px;
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
