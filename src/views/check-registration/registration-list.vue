<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
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
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="姓名" />
        <el-table-column
          width="148px"
          label="身份证正面">
          <template slot-scope="scope">
            <img
              v-if="scope.row.idCardFront"
              :src="scope.row.idCardFront + '?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a'"
              @click="amplifyImage(scope.row.idCardFront, 'id')">
          </template>
        </el-table-column>
        <el-table-column
          width="148px"
          label="身份证背面">
          <template slot-scope="scope">
            <img
              v-if="scope.row.idCardBack"
              :src="scope.row.idCardBack + '?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a'"
              @click="amplifyImage(scope.row.idCardBack, 'id')">
          </template>
        </el-table-column>
        <el-table-column
          min-width="86px"
          label="申请时间">
          <template slot-scope="scope"> {{scope.row.createdAt | Date}} </template>
        </el-table-column>
        <el-table-column
          prop="prisonerNumber"
          min-width="92px"
          label="囚号" />
        <el-table-column
          prop="prisonArea"
          min-width="88px"
          label="监区" />
        <el-table-column
          prop="relationship"
          min-width="64px"
          label="关系" />
        <el-table-column
          label="申请状态"
          min-width="74px"
          class-name="orange">
          <template slot-scope="scope"> {{scope.row.status | applyStatus}} </template>
        </el-table-column>
        <el-table-column
          prop="auditRealName"
          min-width="150px"
          label="审核信息">
          <template v-if="scope.row.auditRealName" slot-scope="scope">{{ scope.row.auditRealName }}<br />{{ scope.row.auditUserName }}<br />({{ scope.row.auditAt | Date }})</template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 'PENDING'"
              size="mini"
              @click="handleAuthorization(scope.row)">授权
            </el-button>
            <el-button
              v-if="scope.row.status == 'PASSED'"
              size="mini"
              @click="handleCallback(scope.row)">撤回
            </el-button>
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
      :title="show.callback ? '撤回' : '授权'"
      width="530px">
      <div style="margin-bottom: 10px;">请核对申请人照片:</div>
      <div class="img-box">
        <img
          v-if="toAuthorize.idCardFront"
          :src="toAuthorize.idCardFront + '?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a'"
          @click="amplifyImage(toAuthorize.idCardFront, 'id')"
          alt="身份证正面照">
        <img
          v-if="toAuthorize.idCardBack"
          :src="toAuthorize.idCardBack + '?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a'"
          @click="amplifyImage(toAuthorize.idCardBack, 'id')"
          alt="身份证背面照">
        <img
          v-if="toAuthorize.avatarUrl"
          :src="toAuthorize.avatarUrl + '?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a'"
          @click="amplifyImage(toAuthorize.avatarUrl)"
          alt="头像">
        <img
          v-if="toAuthorize.relationalProofUrl"
          :src="toAuthorize.relationalProofUrl + '?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a'"
          @click="amplifyImage(toAuthorize.relationalProofUrl)"
          alt="关系证明图">
      </div>
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
      <div
        v-if="show.agree"
        class="button-box">
        <el-button
          plain
          :disabled="btnDisable"
          @click="onAuthorization('PASSED')">确定申请通过？</el-button>
        <el-button
          plain
          @click="show.agree=false">返回</el-button>
        <el-button
          type="danger"
          plain
          @click="show.authorize = false">关闭</el-button>
      </div>
      <div
        v-if="show.disagree"
        class="button-box">
        <div style="margin-bottom: 10px;">请选择驳回原因</div>
        <el-select v-model="remarks">
          <el-option
            v-for="(remark,index) in registRemarks"
            :value="remark"
            :label="remark"
            :key="index">
          </el-option>
        </el-select>
        <el-button
          plain
          :disabled="btnDisable"
          @click="onAuthorization('DENIED')">提交</el-button>
        <el-button
          plain
          @click="show.disagree = false">返回</el-button>
        <el-button
          type="danger"
          plain
          @click="show.authorize = false">关闭</el-button>
      </div>
      <div
        v-if="show.callback"
        class="button-box">
        <div style="margin-bottom: 10px;">请选择驳回原因</div>
        <el-select v-model="remarks">
          <el-option
            v-for="(remark,index) in registRemarks"
            :value="remark"
            :label="remark"
            :key="index">
          </el-option>
        </el-select>
        <el-form :model="withdrawForm" :rules="withdrawRule" ref="withdrawForm" class="withdraw-box">
          <el-form-item prop="withdrawReason">
            <el-input type="textarea" placeholder="请输入撤回理由..." v-model="withdrawForm.withdrawReason"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          plain
          @click="onAuthorization('WITHDRAW')"
          >提交</el-button>
        <el-button
          type="danger"
          plain
          @click="closeWithdraw">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="show.imgplus"
      class="img-dialog"
      :class="{ 'img-idCard' : isIdcard }"
      :width="isIdcard ? '382.4px' : '440px'">
      <img :src="imgSrc">
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      searchItems: {
        name: { type: 'input', label: '家属姓名' },
        prisonerNumber: { type: 'input', label: '囚号' },
        prisonArea: { type: 'select', label: '监区', options: JSON.parse(localStorage.getItem('user')).prisonConfigList, belong: { value: 'prisonConfigName', label: 'prisonConfigName' } },
        auditName: { type: 'input', label: '审核人' },
        status: { type: 'select', label: '审核状态', options: this.$store.state.registStatus, miss: true },
        auditAt: { type: 'date', label: '审核时间' }
      },
      toAuthorize: {},
      show: {
        authorize: false,
        agree: false,
        disagree: false,
        callback: false,
        imgplus: false
      },
      withdrawForm: {
        withdrawReason: ''
      },
      withdrawRule: {
        withdrawReason: [{ required: true, message: '请填写撤回理由', trigger: 'blur' }]
      },
      remarks: '您的身份信息错误',
      imgSrc: '',
      isIdcard: false,
      btnDisable: false, // 按钮禁用与启用
      tabs: 'PENDING'
    }
  },
  watch: {
    tabs(val) {
      if (val !== 'first') {
        this.searchItems.status.miss = true
      }
      else {
        delete this.filter.status
        this.searchItems.status.miss = false
      }
      this.getDatas()
    }
  },
  mounted() {
    this.getDatas()
  },
  computed: {
    ...mapState(['registrations', 'registRemarks'])
  },
  methods: {
    ...mapActions(['getRegistrations', 'authorizeRegistrations']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      if (this.tabs !== 'first') this.filter.status = this.tabs
      this.getRegistrations({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    handleAuthorization(e) {
      this.toAuthorize = e
      this.show.agree = false
      this.show.disagree = false
      this.show.callback = false
      this.remarks = '您的身份信息错误'
      this.show.authorize = true
    },
    onAuthorization(e) {
      this.btnDisable = true
      let params = { id: this.toAuthorize.id, status: e }
      if (e === 'DENIED' || e === 'PASSED') {
        e === 'DENIED' && (params.remarks = this.remarks)
        this.authorizeRegistrations(params).then(res => {
          if (res) {
            this.show.authorize = false
            this.btnDisable = false
            this.toAuthorize = {}
            this.getDatas()
          }
        })
      }
      else if (e === 'WITHDRAW') {
        this.$refs.withdrawForm.validate(valid => {
          if (valid) {
            params.remarks = this.remarks
            params.withdrawReason = this.withdrawForm.withdrawReason
            this.authorizeRegistrations(params).then(res => {
              if (res) {
                this.show.authorize = false
                this.btnDisable = false
                this.toAuthorize = {}
                this.getDatas()
              }
            })
          }
        })
      }
    },
    handleCallback(e) {
      this.toAuthorize = e
      this.show.authorize = true
      this.show.agree = false
      this.show.disagree = false
      this.show.callback = true
    },
    amplifyImage(imgSrc, isIdcard) {
      if (isIdcard) this.isIdcard = true
      else this.isIdcard = false
      this.imgSrc = `${ imgSrc }?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a`
      this.show.imgplus = true
    },
    closeWithdraw() {
      this.show.authorize = false
      this.withdrawForm.withdrawReason = ''
      this.$refs.withdrawForm.clearValidate()
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
</style>
