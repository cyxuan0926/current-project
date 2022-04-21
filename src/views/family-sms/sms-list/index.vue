<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      :items="searchItems"
      ref="search"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    >
      <template #append>
        <el-button
          class="m-excel-download"
          type="primary"
          @click="onDownloadExcel"
          >导出 Excel</el-button
        >

        <template v-if="[0, 1].includes(+tabs)">
          <el-button  v-if="!$store.getters.isSuperAdmin"  type="primary" class="button-add" @click="printList"
            >批量打印</el-button
          >
        </template>
      </template>
    </m-search>

    <el-col :span="24">
      <el-tabs v-model="tabs" type="card">
        <template v-for="(pane, index) in tabPanes">
          <el-tab-pane
            :key="`id-visit-pane-${index + Math.random()}`"
            :label="pane.label"
            :name="pane.name"
          />
        </template>
      </el-tabs>

      <m-table-new
        stripe
        :data="tabledate.messages"
        @selection-change="handleSelectionChange"
        class="mini-td-padding td"
        :cols="tableCols"
      >
        <template #message="{ row }">
          <span v-if="row.messageType == 2">
             <m-img-viewer
            isRequired
            :url="row.message+`?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a`"
          />
          </span>
          <span v-html="row.message" v-if="row.messageType == 1 ||row.messageType == 3 ||row.messageType == 4">
            {{ row.message }}
          </span>
          <span  v-if="row.messageType == 5">
             <m-audio :value="`${ row.message }?token=${ $urls.token }`" />
          </span>
          <span  v-if="row.messageType == 6">
                 <video
                    controls
                    style="width: 192px; height: 108px;"
                  >
                    <source :src="row.message" type='video/mp4'>
                    <source :src="row.message" type='video/webm'>
                    <source :src="row.message" type='video/ogg'>
                    您的浏览器不支持Video标签。
                  </video>
          </span>
        </template>

        <template #state="{ row }">
          <span v-if="row.state === 0">未审核</span>
          <span v-if="row.state === 1">已发送</span>
          <span v-if="row.state === 2">已拒绝</span>
          <span v-if="row.state === 5">已取消</span>
          <span v-if="row.state === 6">已打印</span>
        </template>

        <template #isSensitive="{ row }">
          <span v-if="row.isSensitive === 0">无</span>
          <span v-if="row.isSensitive === 1">有</span>
        </template>

        <template #lastCoiumn="{ row }">
          <template>
            <template v-if="row.state === 0&&row.isCheck=='1'">
              <el-button  v-if="!$store.getters.isSuperAdmin"  size="mini" @click="handleAuthorization(row)"
                >审核</el-button
              >
            </template>

            <template v-else>
              <span
              
                style="color: #409eff; cursor: pointer"
                @click="onDetail(row)"
                >详情</span
              >
            </template>
          </template>

          <template v-if="row.state === 1 && !row.isPrisonerSend&&row.messageType==1&&!$store.getters.isSuperAdmin">
            <span
              style="color: #409eff; cursor: pointer; margin-left: 15px"
              @click="messageDetail(row)"
              >打印</span
            >
          </template>

          <template v-if="row.state === 6 && !row.isPrisonerSend&&row.messageType==1&&!$store.getters.isSuperAdmin">
            <span
              style="color: #409eff; cursor: pointer; margin-left: 15px"
              @click="messageDetail(row)"
              >已打印</span
            >
          </template>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="tabledate.totalElements"
      @onPageChange="getDatas"
    />

    <el-dialog
      :visible.sync="show.authorize"
      class="authorize-dialog"
      @close="closeAuthorize"
      title="审核"
      width="780px"
    >
      <div
        class="infinite-list"
        style="margin-left: 10px; min-height: 200px; width: 100%"
      >
        <p>请审核短信内容：</p>

        <div
          style="
            padding: 8px 10px;
            margin-top: 10px;
            min-height: 160px;
            width: 95%;
            border: 1px solid;
          "
        >
          <template >
          <span v-if="toAuthorize.messageType == 2">
             <m-img-viewer
            isRequired
            :url="toAuthorize.message+`?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a`"
          />
          </span>
          <span v-html="toAuthorize.message" v-if="toAuthorize.messageType == 1 ||toAuthorize.messageType == 3 ||toAuthorize.messageType == 4">
            {{ toAuthorize.message }}
          </span>
          <span  v-if="toAuthorize.messageType == 5">
             <m-audio :value="`${ toAuthorize.message }?token=${ $urls.token }`" />
          </span>
          <span  v-if="toAuthorize.messageType == 6">
                 <video
                    controls
                    style="width: 192px; height: 108px;"
                  >
                    <source :src="toAuthorize.message" type='video/mp4'>
                    <source :src="toAuthorize.message" type='video/webm'>
                    <source :src="toAuthorize.message" type='video/ogg'>
                    您的浏览器不支持Video标签。
                  </video>
          </span>
        </template>
        </div>
      </div>
<span slot="footer" class="dialog-footer">
      <template v-if="!show.agree && !show.disagree">
        <div style="margin-top: 10px" class="button-box">
          <el-button plain @click="onAgreeAuthorize(toAuthorize)">同意</el-button>

          <el-button plain @click="show.disagree = true">不同意</el-button>

          <el-button type="danger" plain @click="show.authorize = false"
            >关闭</el-button
          >
        </div>
      </template>

      <template v-if="show.agree">
         <template v-if="!show.process"> 
        <div style="margin-top: 10px" class="button-box">
          <el-button plain @click="onAuthorization('1')"
            >确定申请通过？</el-button
          >

          <el-button plain @click="show.agree = false">返回</el-button>

          <el-button type="danger" plain @click="show.authorize = false"
            >关闭</el-button
          >
        </div>
         </template>
            <!--    判断是否是最后一岗位 如果不是最后一岗位 在判断是否有通过结束权限 -->
            <template v-if="show.process">
              <el-form ref="form" :model="authApplePhone" label-width="20px">
                 <el-form-item  style="text-align:left;font-size:16px">
                 <el-link :underline="false" style="text-align:left;font-size:15px">审核意见</el-link>
                </el-form-item>
                <el-form-item>
                   <el-input type="textarea" v-model="authApplePhone.remarks"></el-input>
                </el-form-item>
      
              </el-form>
               <label style="display: inline-block;float: left; padding-left: 20px;">
                  <span style="padding-right: 12px;">选择流程节点:</span>
                    <el-select v-model="authApplePhone.nextCheckCode" @change="selectTask" placeholder="请选择流程节点">
                    <el-option
                      v-for="item in selectProcessOption"
                      :key="item.taskCode"
                      :label="item.taskName"
                      :value="item.taskCode">
                    </el-option>
                  </el-select>
                </label>
                  <el-button
                    size="mini"
                    plain
                    @click="submitNext()">提交审核？</el-button>
                  <el-button
                    size="mini"
                    plain
                    @click="goBackAuth()">返回</el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    plain
                    @click="show.authorize = false">关闭</el-button>
          </template>
      </template>
</span>
      <!-- 不同意的情况 -->
      <template v-if="show.disagree">
        <div class="button-box logMgCls">
          <div style="margin-top: 10px; margin-bottom: 10px; text-align: left">
            请选择驳回原因
          </div>

          <div style="display: flex">
            <el-select
              v-model="disArgeeRemarks"
              :multiple="true"
              :multiple-limit="5"
              collapse-tags
              @change="refuseFormChange"
              style="width: 70%; margin-right: 10px"
            >
              <template v-for="(remark, index) in content">
                <el-option
                  class="select_edit"
                  :value="remark"
                  :label="index + 1 + '、' + remark"
                  :key="index"
                />
              </template>
            </el-select>

            <el-button
              type="primary"
              :loading="btnDisable"
              @click="onRejectshow('PASSED')"
              >编辑驳回原因</el-button
            >
          </div>

          <el-form
            :model="refuseForm"
            :rules="withdrawRule"
            ref="refuseForm"
            class="withdraw-box"
          >
            <el-form-item prop="anotherRemarks">
              <el-input
                :autosize="{ minRows: 6, maxRows: 8 }"
                type="textarea"
                show-word-limit
                maxlength="1000"
                placeholder="请输入驳回原因..."
                v-model="refuseForm.anotherRemarks"
              />
            </el-form-item>
          </el-form>

          <el-button plain :loading="btnDisable" @click="onAuthorization('2')"
            >提交</el-button
          >

          <el-button plain @click="show.disagree = false">返回</el-button>

          <el-button type="danger" plain @click="closeAuthorize"
            >关闭</el-button
          >
        </div>
      </template>
    </el-dialog>

    <el-dialog
      :visible.sync="show.message"
      class="authorize-dialog"
      title="短信内容"
    >
      <hr class="messageNone" />

      <div class="flex-dialog" ref="print">
        <div class="wapText">
          <p class="textContentTime">{{ messageContent.receiveName }}</p>

          <p class="textContent">
            编号：<span class="phone">{{ messageContent.criminalNumber }}</span>
          </p>

          <p class="textContent">
            家属：<span class="familyname">{{ messageContent.sendName }}</span>
          </p>

          <p class="textContent">
            电话：<span class="phone">{{ messageContent.familyPhone }}</span>
          </p>

          <p class="textContent">
            时间：<span class="phone">{{ messageContent.createTime }}</span>
          </p>
        </div>

        <p class="textcontent">信息：</p>

        <div class="infinite-list messageText">
           <template >
          <span v-if="messageContent.messageType == 2">
             <m-img-viewer
            isRequired
            :url="messageContent.message+`?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a`"
          />
          </span>
          <span v-html="messageContent.message" v-if="messageContent.messageType == 1 ||messageContent.messageType == 3 ||messageContent.messageType == 4">
            {{ messageContent.message }}
          </span>
          <span  v-if="messageContent.messageType == 5">
             <m-audio :value="`${ messageContent.message }?token=${ $urls.token }`" />
          </span>
          <span  v-if="messageContent.messageType == 6">
                 <video
                    controls
                    style="width: 192px; height: 108px;"
                  >
                    <source :src="messageContent.message" type='video/mp4'>
                    <source :src="messageContent.message" type='video/webm'>
                    <source :src="messageContent.message" type='video/ogg'>
                    您的浏览器不支持Video标签。
                  </video>
          </span>
        </template>
           
        </div>

        <p />

        <div>&nbsp;&nbsp;</div>

        <div>&nbsp;&nbsp;</div>

        <hr class="messageNone" />
      </div>

      <el-row :gutter="0">
        <!-- v-if="messageContent.state == '1' && !messageContent.isPrisonerSend" -->
        <template
          v-if="
            (messageContent.state === 1  || messageContent.state === 6) &&
            !messageContent.isPrisonerSend &&messageContent.messageType == 1
          "
        >
          <el-button
            type="primary"
            class="button-add"
            @click="print"
            size="mini"
            >打印</el-button
          >
        </template>
      </el-row>
    </el-dialog>

    <el-dialog
      :visible.sync="show.rejectEdit"
      title="编辑"
      width="530px"
      @close="changeClose"
      class="authorize-dialog"
    >
      <template v-if="show.editRebut">
        <div class="flex-dialog">
          <ul
            class="infinite-list"
            style="
              padding: 0 20px;
              min-height: 400px;
              width: 100%;
              text-align: justify;
            "
          >
            <template v-for="(item, index) in content">
              <li
                :key="index"
                class="infinite-list-item"
                style="line-height: 32px"
              >
                {{ index + 1 }}.{{ item }}
              </li>
            </template>
          </ul>

          <p style="margin-left: 20px">编辑用户: {{ updateer }}</p>
        </div>
      </template>

      <template v-else>
        <div class="infinite-list" style="margin-left: 20px; min-height: 400px">
          <template v-for="(item, index) in content">
            <span :key="index">
              <el-input
                style="margin-bottom: 10px"
                maxlength="200"
                v-model="content[index]"
                placeholder="请输入内容"
                clearable
              >
                <template #append>
                  <el-button
                    icon="el-icon-close"
                    @click="removeReject(index)"
                  />
                </template>
              </el-input>
            </span>
          </template>
        </div>
      </template>

      <el-row :gutter="0">
        <template v-if="show.editRebut">
          <el-button
            type="primary"
            class="button-add"
            size="mini"
            @click="onRejectEditshow"
            >编辑</el-button
          >
        </template>

        <span v-else>
          <template v-if="content.length > 0">
            <el-button
              type="primary"
              class="button-add"
              size="mini"
              @click="onSubmitReject"
              >保存</el-button
            >
          </template>

          <template v-if="content.length < 10">
            <el-button
              type="primary"
              class="button-add"
              size="mini"
              @click="addReject"
              >新增</el-button
            >
          </template>
        </span>
      </el-row>
    </el-dialog>

    <el-dialog
      :visible.sync="show.dialog"
      title="详情"
      width="780px"
      class="authorize-dialog"
      lock-scroll
    >
      <div style="max-height: 380px; overflow: auto">
        <div style="display: flex; border: 1px solid #e4e7ed">
          <div class="family-detail">基本信息</div>

          <div class="detail-message">
            <p class="detail-message-family">
              <span class="family-name">发送人姓名</span>
              <span class="family-nameDetail">{{ toShow.sendName }}</span>
            </p>

            <p class="detail-message-family" style="border: none">
              <span class="family-name">接收人姓名</span>

              <span class="family-nameDetail">{{ toShow.receiveName }}</span>
            </p>
          </div>

          <div class="detail-content">
            <p class="detail-message-family">
              <span class="family-name">与罪犯关系</span>

              <span class="family-nameDetail">{{ toShow.relationship }}</span>
            </p>

            <p class="detail-message-family" style="border: none">
              <span class="family-name">是否有敏感词</span>

              <span class="family-nameDetail">{{
                toShow.isSensitive ? "有" : "无"
              }}</span>
            </p>
          </div>
        </div>
         <template v-if="toShow.logs">
          <div
            v-for="(item, index) in toShow.logs"
            :key="index"
            style="display: flex; border: 1px solid #e4e7ed; border-top: none"
          >
            <div class="family-detail">{{ index + 1 }}</div>
            <div class="detail-message">
              <p class="detail-message-family">
                <span class="family-name">审核人员账号</span>
                <span class="family-nameDetail">{{ item.operateAccount }}</span>
              </p>
              <p class="detail-message-family" >
                <span class="family-name">审核时间</span>
                <span class="family-nameDetail">{{ item.operateTime }}</span>
              </p>
              <p class="detail-message-family" style="border: none" v-if="item.remark">
                <span class="family-name">备注原因</span>
                <span class="family-nameDetail">{{ item.remark }}</span>
              </p>
            </div>

            <div class="detail-content">
              <p class="detail-message-family">
                <span class="family-name">审核人姓名</span>
                <span class="family-nameDetail">{{ item.operateName }}</span>
              </p>

              <p class="detail-message-family">
                <span class="family-name">申请状态</span>
                <span class="family-nameDetail">
                  <span v-if="item.status==1">审核通过</span>
                  <span v-if="item.status==2">已拒绝</span>
                </span>
              </p>
            </div>
          </div>
        </template>
        <template v-if="toShow.printLogs">
          <div
            v-for="(item, index) in toShow.printLogs"
            :key="item.operateTime"
            style="display: flex; border: 1px solid #e4e7ed; border-top: none"
          >
          <template v-if="toShow.logs&&toShow.logs.length>0"  >
            <div class="family-detail" >{{ (toShow.logs.length+1) + index }}</div>
          </template>
            <div class="detail-message">
              <p class="detail-message-family">
                <span class="family-name">打印账号</span>
                <span class="family-nameDetail">{{ item.printAccount }}</span>
              </p>
              <p class="detail-message-family" style="border: none">
                <span class="family-name">打印时间</span>
                <span class="family-nameDetail">{{ item.printTime }}</span>
              </p>
            </div>

            <div class="detail-content">
              <p class="detail-message-family">
                <span class="family-name">打印姓名</span>
                <span class="family-nameDetail">{{ item.printName }}</span>
              </p>

              <p class="detail-message-family">
                <span class="family-name">申请状态</span>
                <span class="family-nameDetail">
                  <span>已打印</span>
                </span>
              </p>
            </div>
          </div>
        </template>
      </div>

      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="show.messageConfirm"
      width="420px">
       <div><span class="el-message-box__status el-icon-warning"></span><span style="padding-left:40px;display:inline-block;margin-top: 6px;"> 确认打印机是否正常工作, 正常出票?</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show.messageConfirm = false">取 消</el-button>
        <el-button type="primary" @click="_mixinsInitMethods()">确 定</el-button>
      </span>
    </el-dialog>
    <span ref="printList" class="messageNone">
      <hr />
      <div
        class="flex-dialog"
        v-for="(item, index) in messagePrintList"
        :key="index"
      >
        <div class="wapText">
          <p class="textContentTime">{{ item.receiveName }}</p>
          <p class="textContent">
            编号：<span class="phone">{{ item.criminalNumber }}</span>
          </p>
          <p class="textContent">
            家属：<span class="familyname">{{ item.sendName }}</span>
          </p>
          <p class="textContent">
            电话：<span class="phone">{{ item.familyPhone }}</span>
          </p>
          <p class="textContent">
            时间：<span class="phone">{{ item.createTime }}</span>
          </p>
        </div>
        <p class="textcontent">信息：</p>
        <div v-html="item.message" class="infinite-list messageText">
          {{ item.message }}
        </div>
        <div>&nbsp;&nbsp;</div>
        <div>&nbsp;&nbsp;</div>
        <hr />
      </div>
    </span>
  </el-row>
</template>

<script>
import { mapActions, mapState } from "vuex";
import prisonFilterCreator from "@/mixins/prison-filter-creator";
import http from "@/service";
import { DateFormat } from "@/utils/helper";
import { tokenExcel } from "@/utils/token-excel";
export default {
  mixins: [prisonFilterCreator],
  props: {
    //默认获取家属短信列表
    isPrisonerSend: {
      type: Number,
      default: 0,
    },
  },
  data() {
    const _isAdmin = this.$store.state.global.user.role === '0'
    const stateAll = [
      {
        label: "未审核",
        value: "0",
      },
      {
        label: "已发送",
        value: "1",
      },
      {
        label: "已打印",
        value: "6",
      },
      {
        label: "已拒绝",
        value: "2",
      },
      {
        label: "已取消",
        value: "5",
      },
    ];
    const printState = [
      {
        label: "已打印",
        value: "6",
      },
      {
        label: "已发送",
        value: "1",
      },
    ];
    const state = [
      {
        label: "已拒绝",
        value: "2",
      },
      {
        label: "已取消",
        value: "5",
      },
    ];
    const tabPanes = [
      {
        label: "全量",
        name: "0",
      },
      {
        label: "已发送",
        name: "1",
      },
      {
        label: "已拒绝",
        name: "2",
      },
      {
        label: "未审核",
        name: "3",
      },
    ];
     const authApplePhoneInfo={
        applyId:"",
        processInstanceId:"",
        checkState:"",
        remarks:"同意！呈上审批。",
        nextCheckRole:"",
        nextCheckCode:'',
      };
    return {
      authApplePhoneInfo,
      authApplePhone:{
        applyId:"",
        processInstanceId:"",
        checkState:"",
        remarks:"同意！呈上审批。",
        nextCheckRole:"",
        nextCheckCode:''
      },
      printPlugin: null,
      prisonerSend:this.isPrisonerSend,
      tabs: "3",
      _isAdmin,
      stateAll,
      printState,
      state,
      toShow: {},
      messageContent: {},
      messagePrintList: [],
      isSearchLimit: true,
      searchItems: {
        familyName: {
          type: "input",
          label: "家属姓名",
        },
        criminalNumber: {
          type: "input",
          label: "罪犯编号",
        },
        applicationDate: {
          type: "dateRange",
          unlinkPanels: true,
          canNotClear: false,
          miss: true,
          start: "startTime",
          end: "endTime",
          startPlaceholder: "申请开始时间",
          endPlaceholder: "申请结束时间",
          value: [this.$_oneMonthAgo, this.$_dateNow],
        },
        criminalName: {
          type: "input",
          label: "罪犯姓名",
        },
        state: {
          type: "select",
          label: "申请状态",
          options: this.stateAll,
          miss: true,
          value: "",
        },
        auditTime: {
          type: "date",
          label: "审核时间",
          miss: true,
          value: "",
          clearable:true
        },
        isPrisonerSend: {
          type: 'select',
          label: '短信发送人',
          options: [{label:"家属",value:"0"},{label:"罪犯",value:"1"}],
          miss: true,
        },
        isSensitive: {
          type: "select",
          label: "是否有敏感词",
          options: [
            { label: "否", value: "0" },
            { label: "是", value: "1" },
          ],
        },
        msgContent: {
          type: "input",
          label: "短信关键字",
        },
      },
      show: {
        dialog: false,
        authorize: false,
        agree: false,
        disagree: false,
        rejectEdit: false,
        editRebut: true,
        process:false,
        message: false,
        isMessageList: false,
        withdraw: false,
        messageConfirm:false
      },
      toAuthorize: {},
      btnDisable: false, // 按钮禁用与启用
      content: [],
      updateer: "",
      contentId: "",
      withdrawForm: {
        selectRemark: "",
        lengthRemark: 1000,
        withdrawReason: "",
      },
      refuseForm: {
        selectRemark: "",
        lengthRemark: 1000,
        anotherRemarks: "",
      },
      withdrawRule: {
        anotherRemarks: [
          {
            validator: (rule, value, callback) => {
              if (this.refuseForm.anotherRemarks) {
                callback();
              } else {
                callback(new Error("请填写驳回原因"));
              }
            },
          },
        ],
      },
      remarks: [],
      disArgeeRemarks: "",
      tabPanes,
      mediaQueryList: null,
      tabledate: {}
    };
  },
  computed: {
    ...mapState({
      visits: (state) => state.visits,
      frontRemarks: (state) => [
        ...state.frontRemarks.slice(0, state.frontRemarks.length - 1),
        "当月会见次数已达上限，请下月再申请",
        "其他",
      ],
    }),
    tableCols() {
      const basicCols = [
        {
          label: "监区",
          prop: "prisonAreaName",
          showOverflowTooltip: true,
        },
        {
          label: "罪犯编号",
          prop: "criminalNumber",
          width: 110,
          // ...$likePrisonerNumber
        },
        {
          label: "发送人姓名",
          prop: "sendName",
          // ...$likeName
        },
        {
          label: "申请时间",
          prop: "createTime",
          width: 140,
        },
        {
          label: "接收人姓名",
          prop: "receiveName",
          // ...$likeName
        },
        {
          label: "家属电话",
          prop: "familyPhone",
          width: 140,
          // ...$likePhone
        },
        {
          label: "关系",
          prop: "relationship",
          width: 100,
        },
        {
          label: "短信内容",
          slotName: "message",
          width: 220,
        },
        {
          label: "是否有敏感词",
          slotName: "isSensitive",
          width: 136,
        },
        {
          label: "申请状态",
          slotName: "state",
          className: "orange",
        },
        {
          label: "操作",
          minWidth: 150,
          slotName: "lastCoiumn",
          showOverflowTooltip: true,
        },
      ]
        if (this.$store.getters.isSuperAdmin) {
          return [
            {
              type: "selection",
              selectable: this.handleControlSelect,
            },
            {
              label: '省份',
              prop: 'provinceName'
            },
              {
              label: '监狱',
              prop: 'jailName'
            },
            ...basicCols
          ]
        }
        else {
          return  [
            {
              type: "selection",
              selectable: this.handleControlSelect,
            },
            ...basicCols
          ]
        }
    },
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
      this.prisonerSend=this.isPrisonerSend
      this.filter = Object.assign( {},this._isAdmin?{tab: "3",provincesId: "1"}:{tab: "3"} );
       Object.keys(this.searchItems).forEach((item) => {
          if (item == "provincesId") {
            this.searchItems[item].value = "1";
          } else if (item == "applicationDate") {
            this.searchItems[item].value = [this.$_oneMonthAgo, this.$_dateNow];
          } else {
            this.$set(this.searchItems[item],"value", "")
          }
        });
      if (this.tabs == "3") {
          this.onSearch();
        } else {
          this.tabs = "3";
        }
      },
      // 深度观察监听
      deep: true,
    },
    tabs(val) {
      // 修改 searchItems search组件会重新渲染 再执search组件的 onSearch 方法
        this.isSearchLimit && this.$set(this.searchItems.applicationDate, 'miss', val == '3')
        let _res = this.$refs.search.onSearch('tabs')
      delete this.filter.state;
      this.searchItems.auditTime.miss = false;
      this.searchItems.isPrisonerSend.miss=true
      this.prisonerSend=this.isPrisonerSend
      if (val == "3") {
        this.searchItems.state.miss = true;
        this.searchItems.auditTime.miss = true;
      } else if (val == "1") {
        this.searchItems.state.miss = false;
        this.searchItems.state.value = "";
        this.searchItems.state.options = this.printState;
      } else if (val == "0") {
        this.searchItems.state.miss = false;
        this.searchItems.state.value = "";
        this.searchItems.state.options = this.stateAll;
        delete this.prisonerSend
        this.searchItems.isPrisonerSend.miss=false
      } else {
        this.searchItems.state.miss = false;
        this.searchItems.state.value = "";
        this.searchItems.state.options = this.state;
      }
       // tab切换时如果搜索条件均为空 则添加上默认时间
        if (!_res) {
          this.searchItems.applicationDate.value = [this.$_oneMonthAgo, this.$_dateNow]
          this.$set(this.filter, 'startTime',this.$_oneMonthAgo )
          this.$set(this.filter, 'endTime', this.$_dateNow)
        }
      this.onSearch();
    },
    remarks(val) {
      if (val !== "其他" && this.refuseForm.refuseRemark)
        this.$refs["refuseForm"].resetFields();
    },

  },
 mounted() {
     window.addEventListener("message", async e => {
      if(!e.data.type){
        this.show.messageConfirm=true
      }
     })
    },
  methods: {
    ...mapActions([
      "getVisits",
      "getCanceledVisit",
      "authorizeVisit",
      "withdrawVisit",
    ]),
      //覆盖mixin 授权对话框的同意操作
      onAgreeAuthorize(row) {
        this.show.agree = true
        this.getSubtask(row)
        this.buttonLoading = false
      },
      goBackAuth(){
      this.show.agree = false
      this.show.disagree = false
      this.remarks=''
      this.authApplePhone=Object.assign( {} ,this.authApplePhone,  this.authApplePhoneInfo)
       this.refuseForm.anotherRemarks=""
       this.refuseForm.selectRemark=""
       },
        selectTask(select){
        let obj= this.selectProcessOption.filter(item=>item.taskCode==select)
        this.authApplePhone.nextCheckRole=obj[0].taskName
      },
       async getSubtask ( e ) {
       this.toShow = e
        let res= await http.getSubtaskPhone({processInstanceId: e.processInstanceId})
          if (!res) return
          this.selectProcessOption = res
          if (this.selectProcessOption.length) {
            this.show.process = true
            this.authApplePhone.nextCheckCode = this.selectProcessOption[0].taskCode
            this.authApplePhone.nextCheckRole = this.selectProcessOption[0].taskCode
          } else {
             this.show.process=false
          }
      },
    // 选择要打印的批量数据
    handleSelectionChange(val) {
      this.messagePrintList = val;
    },
    printList() {
      if (this.messagePrintList.length == 0) {
        this.$message({
          message: "请选择需要打印的记录！",
          type: "error",
        });
        return false;
      } else {
        this.show.isMessageList = true;
        this.$print(this.$refs.printList, { isUseTemplate: true });
      }
    },
    // 筛选不可打印的数据
    handleControlSelect(row) {
      return (row.state == 1 || row.state == 6) && !row.isPrisonerSend && row.messageType==1
        ? true
        : false;
    },
    print() {
      this.show.isMessageList = false;
      this.$print(this.$refs.print, { isUseTemplate: true });
    },
   async onDetail(row) {
      this.toShow = row;
      let res = await http.getIntragetMsgDetail({
        uid:row.uid
      });
      if(res.logs.length>0){
        this.toShow.logs=res.logs
      }
      this.show.dialog = true;
    },
    messageDetail(row) {
      this.messageContent = row;
      this.show.message = true;
    },
    refuseFormChange(e) {
      let str = "";
      if (!this.refuseForm.anotherRemarks) {
        this.refuseForm.anotherRemarks = "";
      }
      e.forEach((item, index) => {
        if (!this.refuseForm.anotherRemarks.includes(item)) {
          str += `${item}。\n`;
        }
      });
      this.refuseForm.anotherRemarks += str;
    },
    // 获取当前驳回原因列表
    async onRejectshow(str, isform) {
      let params = {};
      params.jailId = JSON.parse(localStorage.getItem("user")).jailId;
      params.type = 4;
      let res = await http.getIntraRejectEdit(params);
      if (res.content) {
        this.content = res.content;
        this.contentId = res.id;
        this.updateer = res.updateEr;
      } else {
        this.content = [];
      }
      if (str == "PASSED") {
        this.show.rejectEdit = true;
      } else {
        this.show.rejectEdit = false;
      }
    },
    addReject() {
      this.content.push("");
    },
    removeReject(index) {
      this.content.splice(index, 1);
    },
    onRejectEditshow() {
      this.show.editRebut = false;
    },
    changeClose() {
      this.remarks = [];
      this.onRejectshow(false, this.isform);
      this.show.editRebut = true;
    },
    async onSubmitReject() {
      this.content = this.content.filter((res) => res && res.trim());
      if (this.content.length < 1) {
        this.$message({
          message: "新增编辑内容不能为空",
          type: "error",
        });
        return false;
      } else {
        let params = {
          id: this.contentId,
          type: 4,
          content: this.content,
          updateer: JSON.parse(localStorage.getItem("user")).realName,
          jailId: JSON.parse(localStorage.getItem("user")).jailId,
        };
        let res = await http.setIntraRejectEdit(params);
        if (res) {
          let params = {};
          params.jailId = JSON.parse(localStorage.getItem("user")).jailId;
          params.type = 4;
          let res = await http.getIntraRejectEdit(params);
          if (res.content) {
            this.content = res.content;
            this.contentId = res.id;
            this.updateer = res.updateEr;
          } else {
            this.content = [];
          }
        }
        this.show.editRebut = true;
      }
    },
    async onDownloadExcel() {
      this.downloading = true;

      const times = DateFormat(Date.now(), "YYYYMMDDHHmmss"),
        tabItem = this.tabPanes.filter((tabItem) => tabItem.name === this.tabs),
        TABName = tabItem[0]["label"],
        actionName = "familyPhone/exportFamilyPhone",
        params = {
          url: "/export/exportSmsManage",
          methods: "get",
          params: {isPrisonerSend:this.prisonerSend, ...this.filter, tab: this.tabs},
          isPrisonInternetGetUrlWay: "getHyUrl",
        };
      await tokenExcel({
        params,
        actionName,
        menuName: `${this.isPrisonerSend==1?"服刑人员发送短信申请列表":"家属发送短信申请列表"}-${TABName}-${times}`,
      });

      setTimeout(() => {
        this.downloading = false;
      }, 300);
    },
    async getDatas() {
      this.filter.tab = this.tabs;
      let res = await http.getIntraMessagelist({
        isPrisonerSend:this.prisonerSend,
        ...this.filter,
        ...this.pagination,
      });
      this.tabledate = res;
    },
    async _mixinsInitMethods(showList=this.show.isMessageList,uid=this.messageContent.uid, PrintList = this.messagePrintList) {
              let gkMessageIdList = [];
              //判断是单独打印还是批量打印
              if (showList)
               PrintList.forEach((item) =>
                  gkMessageIdList.push(item.uid)
                )
              else {
                if(this.messageContent.uid){
                  gkMessageIdList.push(uid)
                }else{
                return false
                }
                }

              let res = await http.messagePrint({
                gkMessageIdList: gkMessageIdList,
              });

              if (res) {
                this.show.messageConfirm = false;
                this.show.message = false;
                this.messageContent = {};
                await this.getDatas();
              }
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1);
    },
    handleAuthorization(e) {
      this.toAuthorize = e;
      this.show.agree = false;
      this.show.disagree = false;
      this.show.authorize = true;
      this.disArgeeRemarks = "";
      this.refuseForm.anotherRemarks = "";
      this.onRejectshow(false, false);
      this.isform = false;
    },
    handleWithdraw(e) {
      this.toAuthorize = e;
      this.withdraw = {};
      this.onRejectshow(false, true);
      this.isform = true;
      this.show.withdraw = true;
    },
    onAuthorization(e) {
      let params = { uid: this.toAuthorize.uid.toString(), state: parseInt(e) };
      if (e === "2") {
        this.$refs.refuseForm.validate((valid) => {
          if (valid)
            params.remarks = this.refuseForm.anotherRemarks.replace(/\s*/g, "");
        });
        if (params.remarks) this.handleSubmit(params);
      } else this.handleSubmit(params);
    },
    submitNext(){
        if(this.authApplePhone.nextCheckCode =='visit.approve.end'){
            this.authApplePhone.checkState=1
        }else{
           if(this.show.process){
             this.authApplePhone.checkState=3
              if(!this.authApplePhone.nextCheckCode){
                  this.$message({
                    showClose: true,
                    message: '请选择流程节点',
                    duration: 2000,
                    type: 'error'
                  })
                return false
                }
            }else{
                 this.authApplePhone.checkState=1
            }
        }
        let params ={uid:this.toAuthorize.uid.toString(), state: 1, remarks: this.authApplePhone.remarks }
       this.handleSubmit(params)
    },
    async handleSubmit(params) {
      let res = await http.dealIntraMessage(params);
      if (res) {
        this.closeAuthorize();
        this.toAuthorize = {};
        this.getDatas();
      } else {
        return false;
      }
    },
    closeAuthorize(e) {
      if (e === "back") this.show.disagree = false;
      else this.show.authorize = false;
      this.remarks = [];
      this.$refs["refuseForm"] && this.$refs["refuseForm"].resetFields();
    },
  },
};
</script>
<style lang="stylus">
.borderNone .el-form-item__content {
  display: flex;
  flex-direction: column;
}

.borderNone .el-textarea__inner {
  border: 1px solid #DCDFE6;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
}

.bordertop .el-textarea__inner {
  border: 1px solid #DCDFE6;
  border-top: none;
  border-radius: 0px 0px 4px 4px;
}
</style>

<style type="text/stylus" lang="stylus" scoped>
.messageNone {
  display: none;
}

.flex-dialog {
  .wapText {
    line-height: 30px;
    margin-bottom: 20px;
  }

  .messageText {
    padding: 0 20px;
    min-height: 200px;
    width: 100%;
    text-align: justify;
  }
}

.family-detail {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #E4E7ED;
}

.detail-message {
  width: 380px;
}

.detail-message-family {
  display: flex;
  line-height: 40px;
  font-size: 12px;
  border-bottom: 1px solid #E4E7ED;

  .family-name {
    width: 120px;
    background: #F5F7FA;
    text-align: right;
    padding-right: 10px;
    border-right: 1px solid #E4E7ED;
  }

  .family-nameDetail {
    flex: 1;
    padding-left: 10px;
    border-right: 1px solid #E4E7ED;
  }
}

.detail-content {
  flex: 1;
  line-height: 30px;
  font-size: 12px;

  .family-name {
    width: 120px;
    background: #F5F7FA;
    padding-right: 10px;
    text-align: right;
    border-right: 1px solid #E4E7ED;
  }
}

.cell img {
  width: 126.8px;
  cursor: pointer;
}

.withdraw-box {
  margin-bottom: 20px;
}

.el-table.mini-td-padding td {
  padding: 8px 0;
}
</style>
<style lang="stylus">
.logMgCls {
  text-align: left;
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

.el-select-dropdown {
  max-width: 243px;
}

.select_edit.el-select-dropdown__item {
  display: inline-block;
}

.select_edit.el-select-dropdown__item span {
  min-width: 400px;
  display: inline-block;
}
</style>
