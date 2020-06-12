<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-excel-download
      v-if="hasAllPrisonQueryAuth"
      path="/download/exportRegistrations"
      :params="filter" />
    <m-search
      :items="searchItems"
      ref="search"
      @searchSelectChange="searchSelectChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-tabs
        v-model="tabs"
        type="card">
        <el-tab-pane
          label="家属注册"
          name="first" />
        <el-tab-pane
          label="未授权"
          name="PENDING" />
      </el-tabs>
      <el-table
        :data="registrations.contents"
        stripe
        class="mini-td-padding"
        style="width: 100%">
        <el-table-column
          v-if="hasProvinceQueryAuth"
          label="省份"
          min-width="60"
          prop="provinceName"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="hasAllPrisonQueryAuth"
          label="监狱名称"
          prop="jailName"
          min-width="50"
          show-overflow-tooltip
        />
        <el-table-column
          prop="name"
          show-overflow-tooltip
          label="家属姓名"
          min-width="50"
        />
        <el-table-column
          min-width="148px"
          label="身份证件信息">
          <template slot-scope="scope">
            <m-img-viewer
              v-if="scope.row.idCardFront"
              class="img-viewer__overflow-unset"
              :url="scope.row.idCardFront"
              :toolbar="{ prev: 1, next: 1 }"
              title="身份证正面照"
            />
            <m-img-viewer
              v-if="scope.row.idCardBack"
              class="img-viewer__overflow-unset"
              :url="scope.row.idCardBack"
              :toolbar="{ prev: 1, next: 1 }"
              title="身份证背面照"
            />
            <m-img-viewer
              v-if="scope.row.avatarUrl"
              class="img-viewer__hidden img-viewer__overflow-unset"
              :url="scope.row.avatarUrl"
              :toolbar="{ prev: 1, next: 1 }"
              title="头像"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="身份证件有效期至"
          prop="validDates"
        />
        <el-table-column
          label="家属类型"
          prop="domicileName"
          show-overflow-tooltip
          min-width="80"
        />
        <el-table-column
          label="申请时间"
          min-width="120"
        >
          <template slot-scope="scope"> {{ scope.row.createdAt | Date }} </template>
        </el-table-column>
        <el-table-column
          prop="prisonerNumber"
          show-overflow-tooltip
          label="罪犯编号"
          min-width="55"
        />
        <el-table-column
          prop="prisonArea"
          show-overflow-tooltip
          label="监区"
          min-width="50"
        />
        <el-table-column
          prop="relationship"
          label="关系"
          min-width="50"
          show-overflow-tooltip 
        />
        <el-table-column label="家属会见告知书" min-width="65">
          <template slot-scope="scope">
            <span
              :class="[
                'bold',
                { 'red' : scope.row.notifyId === null },
                { 'green' : scope.row.notifyId !== null }
            ]">{{ scope.row.notifyId !== null ? '已签订' : '未签订' }}</span>
            <el-button
              v-if="scope.row.notifyId !== null"
              type="text"
              size="small"
              @click="showSign(scope.row)">点击查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="申请状态"
          min-width="60"
          class-name="orange"
        >
          <template slot-scope="scope"> {{ scope.row.status | registStatus }} </template>
        </el-table-column>
        <el-table-column
          prop="auditRealName"
          label="审核信息"
          min-width="50"
          show-overflow-tooltip
        >
          <template
            v-if="scope.row.auditAt"
            slot-scope="scope">
            {{ scope.row.auditRealName }} ({{ scope.row.auditUserName }})<br >
            {{ scope.row.auditAt | Date }}</template>
        </el-table-column>
        <el-table-column
          label="操作" 
          min-width="65"
        >
          <template slot-scope="scope">
            <el-button
              v-if="!hasAllPrisonQueryAuth && scope.row.status == 'PENDING'"
              size="mini"
              @click="handleAuthorization(scope.row)">授权
            </el-button>
            <el-button
              v-if="!hasAllPrisonQueryAuth && scope.row.status == 'PASSED'"
              size="mini"
              @click="handleCallback(scope.row)">撤回
            </el-button>
            <el-button
              v-if="hasProvinceQueryAuth"
              size="mini"
              @click="onView(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="registrations.total"
      @onPageChange="getDatas" />
    <el-dialog
      :visible.sync="show.authorize"
      class="authorize-dialog"
      :title="dialogTitle"
      @close="closeWithdraw"
      width="530px">
      <div style="margin-bottom: 10px;">请核对申请人信息:</div>
      <div class="img-box">
        <m-img-viewer
          v-if="toAuthorize.idCardFront"
          :url="toAuthorize.idCardFront"
          :toolbar="{ prev: 1, next: 1 }"
          title="身份证正面照"
        />
        <m-img-viewer
          v-if="toAuthorize.idCardBack"
          :url="toAuthorize.idCardBack"
          :toolbar="{ prev: 1, next: 1 }"
          title="身份证背面照"
        />
        <m-img-viewer
          v-if="toAuthorize.avatarUrl"
          :url="toAuthorize.avatarUrl"
          :toolbar="{ prev: 1, next: 1 }"
          title="头像"
        />
      </div>
      <template>
        <div style="margin-bottom: 10px;">请核对关系证明:</div>
        <div class="img-box">
          <template v-for="url in toAuthorize.relationalProofUrls" >
            <m-img-viewer
              v-if="url"
              :style="{ width: relationalWidth }"
              :key="url"
              :url="url"
              :toolbar="toAuthorize.relationalProofUrls.length === 1 ? {} : { prev: 1, next: 1 }"
              title="关系证明图"
            />
          </template>
        </div>
      </template>
      <template>
        <div style="margin-bottom: 10px;">会见通知单:</div>
        <div class="img-box">
          <m-img-viewer
            v-if="toAuthorize.meetNoticeUrl"
            :url="toAuthorize.meetNoticeUrl"
            title="会见通知单"
          />
        </div>
      </template>
      <template v-if="!hasAllPrisonQueryAuth">
        <div
          v-if="!show.agree && !show.disagree && !show.callback"
          class="button-box">
          <el-button
            plain
            @click="show.agree = true">同意</el-button>
          <el-button
            plain
            @click="show.disagree = true">不同意</el-button>
          <el-button
            type="danger"
            plain
            @click="show.authorize = false">关闭</el-button>
        </div>
        <!-- 同意 -->
        <div
          v-if="show.agree"
          class="button-box">
          <el-button
            plain
            :loading="btnDisable"
            @click="onAuthorization('PASSED')">确定申请通过？</el-button>
          <el-button
            plain
            @click="show.agree=false">返回</el-button>
          <el-button
            type="danger"
            plain
            @click="show.authorize = false">关闭</el-button>
        </div>
        <!-- 不同意 -->
        <div
          v-if="show.disagree"
          class="button-box">
          <div style="margin-bottom: 10px;">请选择驳回原因</div>
          <el-select v-model="remarks">
            <el-option
              v-for="(remark,index) in registRemarks"
              :value="remark"
              :label="remark"
              :key="index"/>
          </el-select>
          <el-form
            v-if="remarks === '其他'"
            :model="refuseForm"
            :rules="withdrawRule"
            ref="refuseForm"
            class="withdraw-box">
            <el-form-item prop="anotherRemarks">
              <el-input
                type="textarea"
                show-word-limit
                maxlength="15"
                placeholder="请输入驳回原因..."
                v-model.trim="refuseForm.anotherRemarks" />
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
        <!-- 撤回 -->
        <div
          v-if="show.callback"
          class="button-box">
          <div style="margin-bottom: 10px;">请选择撤回原因</div>
          <el-select v-model="remarks">
            <el-option
              v-for="(remark,index) in registRemarks"
              :value="remark"
              :label="remark"
              :key="index"/>
          </el-select>
          <!-- <el-form
            v-if="remarks === '其他'"
            :model="refuseForm"
            :rules="withdrawRule"
            ref="refuseForm"
            class="withdraw-box">
            <el-form-item prop="anotherRemarks">
              <el-input
                type="textarea"
                show-word-limit
                maxlength="15"
                placeholder="请选择撤回原因..."
                v-model.trim="refuseForm.anotherRemarks" />
            </el-form-item>
          </el-form> -->
          <el-form
            :model="withdrawForm"
            :rules="withdrawRule"
            ref="withdrawForm"
            class="withdraw-box">
            <el-form-item prop="withdrawReason">
              <el-input
                type="textarea"
                show-word-limit
                maxlength="15"
                placeholder="请输入撤回理由..."
                v-model.trim="withdrawForm.withdrawReason" />
            </el-form-item>
          </el-form>
          <el-button
            plain
            :loading="btnDisable"
            @click="onAuthorization('WITHDRAW')">提交</el-button>
          <el-button
            type="danger"
            plain
            @click="closeWithdraw('withdrawForm')">关闭</el-button>
        </div>
      </template>
      <template v-if="hasAllPrisonQueryAuth">
        <div class="button-box view-box">
          <el-button
            type="danger"
            plain
            @click="show.authorize = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      :visible.sync="notificationShow"
      title="会见告知书"
      width="530px"
      class="authorize-dialog">
      <div class="flex-dialog">
        <div style="width: 100%;"><label>家属姓名：</label><span>{{ notification.familyName }}</span></div>
        <div style="width: 100%;"><label>家属身份证号：</label><span>{{ notification.familyUuid }}</span></div>
        <div style="width: 100%;"><label>与服刑人员关系：</label><span>{{ notification.familyRelationship }}</span></div>
        <div style="width: 100%;"><label>协议编号：</label><span>{{ notification.protoNum }}</span></div>
        <div style="width: 100%;"><label>签署日期：</label><span>{{ notification.signDate }}</span></div>
      </div>
      <el-row :gutter="0">
        <el-button
          class="button-add"
          size="mini"
          type="danger"
          @click="notificationShow = false">关闭</el-button>
      </el-row>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import prisons from '@/common/constants/prisons'
import switches from '@/filters/modules/switches'

export default {
  mixins: [prisonFilterCreator],
  data() {
    const { belong } = prisons.PRISONAREA
    const { options } = this.$store.getters.prisonAreaOptions
    return {
      searchItems: {
        name: {
          type: 'input',
          label: '家属姓名'
        },
        prisonerNumber: {
          type: 'input',
          label: '罪犯编号'
        },
        prisonArea: {
          type: 'select',
          label: '监区',
          options,
          belong,
          value: ''
        },
        auditName: {
          type: 'input',
          label: '审核人',
          miss: true
        },
        status: {
          type: 'select',
          label: '审核状态',
          options: this.$store.state.registStatus,
          miss: true,
          no: ['DENIED'],
          value: ''
        },
        auditAt: {
          type: 'date',
          label: '审核时间',
          miss: true
        },
        nationality: {
          type: 'select',
          label: '家属类型',
          options: switches['nationality'],
          value: ''
        }
      },
      toAuthorize: {},
      show: {
        authorize: false,
        agree: false,
        disagree: false,
        callback: false
      },
      withdrawForm: {
        withdrawReason: ''
      },
      refuseForm: {
        anotherRemarks: ''
      },
      withdrawRule: {
        anotherRemarks: [
          {
            required: true,
            message: '请填写驳回原因'
          }
        ],
        withdrawReason: [
          {
            required: true,
            message: '请填写撤回理由'
          }
        ]
      },
      remarks: '身份信息错误',
      btnDisable: false, // 按钮禁用与启用
      tabs: 'PENDING',
      notificationShow: false,
      dialogTitle: ''
    }
  },
  watch: {
    tabs(val) {
      this.$refs.search.onSearch('tabs')
      if (val !== 'first') {
        this.searchItems.status.miss = true
        this.searchItems.auditName.miss = true
        this.searchItems.auditAt.miss = true
        delete this.filter.auditName
        delete this.filter.auditAt
        this.searchItems.auditName.value = ''
        this.searchItems.auditAt.value = ''
        this.searchItems.status.value = ''
      }
      else {
        delete this.filter.status
        this.searchItems.status.miss = false
        this.searchItems.auditName.miss = false
        this.searchItems.auditAt.miss = false
      }
      this.onSearch()
    }
  },
  mounted() {
    this.getDatas()
  },
  computed: {
    ...mapState([
      'registrations',
      'registRemarks',
      'notification']),

      relationalWidth() {
        const widthConstent = {
          0: '0%',
          1: '32%',
          2: '48%',
          3: '32%',
          4: '24%'
        }
        return widthConstent[this.toAuthorize.relationalProofUrls.length]
      }
  },
  methods: {
    ...mapActions([
      'getRegistrations',
      'getRegistrationsAll',
      'authorizeRegistrations',
      'getNotification',
      'getRegistrationNotificationDetail'
    ]),
    getDatas() {
      if (this.tabs !== 'first') this.filter.status = this.tabs

      const params = { ...this.filter, ...this.pagination }

      if (this.hasAllPrisonQueryAuth) this.getRegistrationsAll(params)
      else this.getRegistrations(params)
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    handleAuthorization(e) {
      this.toAuthorize = e
      this.show.agree = false
      this.show.disagree = false
      this.show.callback = false
      this.remarks = '身份信息错误'
      this.show.authorize = true
      this.dialogTitle = '授权'
    },
    onAuthorization(e) {
      this.btnDisable = true
      let params = { id: this.toAuthorize.id, status: e }
      if ((e === 'DENIED' || e === 'WITHDRAW')) {
        if (this.remarks === '其他' && e !== 'WITHDRAW') {
          this.$refs.refuseForm.validate(valid => {
            if (valid) params.remarks = this.refuseForm.anotherRemarks
            else this.btnDisable = false
          })
        }
        else params.remarks = this.remarks
        if (e === 'WITHDRAW') {
          this.$refs.withdrawForm.validate(valid => {
            if (valid) params.withdrawReason = this.withdrawForm.withdrawReason
            else this.btnDisable = false
          })
        }
        if (this.btnDisable) this.handleSubmit(params)
      }
      else this.handleSubmit(params)
    },
    handleSubmit(params) {
      this.authorizeRegistrations(params).then(res => {
        this.btnDisable = false
        if (res) {
          this.closeWithdraw()
          this.toAuthorize = {}
          this.getDatas()
        }
      })
    },
    handleCallback(e) {
      this.toAuthorize = e
      this.show.authorize = true
      this.show.agree = false
      this.show.disagree = false
      this.show.callback = true
      this.dialogTitle = '撤回'
      if (this.$refs.withdrawForm) this.$refs.withdrawForm.clearValidate()
    },
    closeWithdraw() {
      this.show.authorize = false
      this.remarks = '身份信息错误'
      this.withdrawForm.withdrawReason = ''
      this.refuseForm.anotherRemarks = ''
      if (this.$refs.refuseForm) this.$refs.refuseForm.clearValidate()
      if (this.$refs.withdrawForm) this.$refs.withdrawForm.clearValidate()
    },
    showSign(row) {
      const { status } = row
      if (status === 'PENDING') {
        const { id } = row
        this.getRegistrationNotificationDetail({ id }).then(res => {
          if (!res) return
          this.notificationShow = true
        })
      }
      else {
        const { notifyId } = row
        this.getNotification({ id: notifyId }).then(res => {
          if (!res) return
          this.notificationShow = true
        })
      }
    },
    onView(e) {
      this.toAuthorize = e
      this.dialogTitle = '查看'
      this.show.authorize = true
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
.cell img
  width 126.8px
  cursor pointer
.withdraw-box
  margin-bottom 8px
.flex-dialog
  display: flex;
  flex-wrap: wrap;
  line-height: 32px;
  label
    display: inline-block;
    width: 120px;
    text-align: right;
.authorize-dialog
  .img-box
    .el-image
      width: 32%;
      height: 110px;
      margin-bottom: 5px;
      box-shadow: 0 0 5px #ddd;
      >>> img
           width: 100%;
           height: 100%;
           cursor: pointer;
.button-box 
  .el-button
    &:first-of-type
      margin-left: 0px !important;
.view-box
  display: flex;
  flex-direction: row-reverse;
</style>
