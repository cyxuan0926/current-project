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
          label="实地探监"
          name="first" />
        <!-- <el-tab-pane
          label="未授权"
          name="PENDING" /> -->
        <el-tab-pane
          label="已取消"
          name="CANCELED" />
      </el-tabs>
      <el-table
        :data="visits.contents"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="姓名" />
        <el-table-column
          min-width="138px"
          label="身份证正面">
          <template slot-scope="scope">
            <m-img-viewer
              v-if="scope.row.idCardFront"
              :url="scope.row.idCardFront"
              title="身份证正面"/>
          </template>
        </el-table-column>
        <el-table-column
          min-width="138px"
          label="身份证背面">
          <template slot-scope="scope">
            <m-img-viewer
              v-if="scope.row.idCardBack"
              :url="scope.row.idCardBack"
              title="身份证背面"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="prisonerNumber"
          label="囚号" />
        <el-table-column
          prop="prisonArea"
          label="监区" />
        <el-table-column
          prop="relationship"
          label="关系" />
        <el-table-column
          label="申请时间"
          prop="applicationDate" />
        <el-table-column label="批次(窗口号)">
          <template slot-scope="scope">
            <span v-if="scope.row.window">{{ scope.row.batch }}({{ scope.row.window }}窗口)</span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="orange"
          label="申请状态">
          <template slot-scope="scope">
            <span v-if="!scope.row.remarks">{{ scope.row.status | applyStatus }}</span>
            <el-tooltip
              v-else
              :content="scope.row.remarks"
              placement="top">
              <span>{{ scope.row.status | applyStatus }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="tabs === 'CANCELED' ? '取消原因' : '操作'">
          <template slot-scope="scope">
            <span v-if="tabs === 'CANCELED'">{{ scope.row.cause }}</span>
            <template v-else>
              <el-button
                v-if="scope.row.status == 'PENDING'"
                size="mini"
                @click="handleAuthorization(scope.row)">授权</el-button>
              <el-button
                v-else-if="scope.row.status === 'PASSED' && scope.row.isWithdrawFlag === 1"
                size="mini"
                @click="handleWithdraw(scope.row)">撤回</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="visits.total"
      @onPageChange="getDatas" />
    <el-dialog
      :visible.sync="show.authorize"
      class="authorize-dialog"
      @close="closeAuthorize"
      title="授权"
      width="530px">
      <div
        v-if="!show.agree && !show.disagree"
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
            v-for="(remark,index) in frontRemarks"
            :value="remark"
            :label="remark"
            :key="index" />
        </el-select>
        <el-form
          v-if="remarks === '其他'"
          :model="refuseForm"
          :rules="rule"
          ref="refuseForm"
          class="withdraw-box">
          <el-form-item prop="refuseRemark">
            <el-input
              type="textarea"
              placeholder="请输入驳回原因..."
              :autosize="{ minRows: 5 }"
              v-model="refuseForm.refuseRemark" />
          </el-form-item>
        </el-form>
        <el-button
          plain
          @click="onAuthorization('DENIED')">提交</el-button>
        <el-button
          plain
          @click="closeAuthorize('back')">返回</el-button>
        <el-button
          type="danger"
          plain
          @click="show.authorize = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="show.withdraw"
      class="authorize-dialog"
      title="撤回"
      width="530px">
      <el-form
        :model="withdraw"
        :rules="rule"
        @close="closeWithdraw"
        ref="withdrawForm">
        <el-form-item prop="remarks">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6 }"
            placeholder="请输入撤回理由"
            v-model="withdraw.remarks" />
        </el-form-item>
      </el-form>
      <el-row :gutter="0">
        <el-button
          class="button-add"
          size="mini"
          type="danger"
          @click="show.withdraw = false">取消</el-button>
        <el-button
          class="button-add"
          size="mini"
          @click="onWithdraw">确定</el-button>
      </el-row>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import validator from '@/utils'
export default {
  data() {
    return {
      tabs: 'first',
      searchItems: {
        // prisonerNumber: { type: 'input', label: '囚号' },
        name: { type: 'input', label: '家属姓名' },
        prisonArea: { type: 'select', label: '监区', options: JSON.parse(localStorage.getItem('user')).prisonConfigList, belong: { value: 'prisonConfigName', label: 'prisonConfigName' } }
      },
      show: {
        authorize: false,
        agree: false,
        disagree: false,
        withdraw: false
      },
      toAuthorize: {},
      withdraw: {},
      remarks: '您的身份信息错误',
      rule: {
        remarks: [{ required: true, message: '请填写撤回理由', trigger: 'blur' }],
        refuseRemark: [{ required: true, message: '请填写驳回原因' }, { validator: validator.lengthRange, max: 200 }]
      },
      refuseForm: {}
    }
  },
  computed: {
    ...mapState({
      visits: state => state.visits,
      frontRemarks: state => [...state.frontRemarks.slice(0, state.frontRemarks.length - 1), '当月会见次数已达上限，请下月再申请', '其他']
    })
  },
  watch: {
    tabs(val) {
      // if (val === 'first' || val === 'CANCELED') {
      //   delete this.filter.status
      // }
      // else {
      //   this.filter.status = val
      // }
      this.onSearch()
    },
    remarks(val) {
      if (val !== '其他' && this.refuseForm.refuseRemark) this.$refs['refuseForm'].resetFields()
    }
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions(['getVisits', 'getCanceledVisit', 'authorizeVisit', 'withdrawVisit']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      if (this.tabs === 'CANCELED') this.getCanceledVisit({ ...this.filter, ...this.pagination })
      else if (this.tabs !== 'CANCELED') this.getVisits({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    handleAuthorization(e) {
      this.toAuthorize = e
      this.show.agree = false
      this.show.disagree = false
      this.show.authorize = true
    },
    handleWithdraw(e) {
      this.toAuthorize = e
      this.withdraw = {}
      this.show.withdraw = true
    },
    onAuthorization(e) {
      let params = { id: this.toAuthorize.id, status: e }
      if (e === 'DENIED') {
        if (this.remarks === '其他') {
          this.$refs['refuseForm'].validate(valid => {
            if (valid) {
              params.remarks = this.refuseForm.refuseRemark
            }
          })
        }
        else {
          params.remarks = this.remarks
        }
        if (params.remarks) this.handleSubmit(params)
      }
      else {
        this.handleSubmit(params)
      }
    },
    handleSubmit(params) {
      this.authorizeVisit(params).then(res => {
        if (!res) return
        this.closeAuthorize()
        this.toAuthorize = {}
        this.getDatas()
      })
    },
    onWithdraw() {
      this.$refs['withdrawForm'].validate(valid => {
        if (valid) {
          let params = { id: this.toAuthorize.id, status: 'DENIED', remarks: this.withdraw.remarks }
          this.withdrawVisit(params).then(res => {
            if (!res) return
            this.closeWithdraw()
            this.toAuthorize = {}
            this.getDatas()
          })
        }
      })
    },
    closeAuthorize(e) {
      if (e === 'back') this.show.disagree = false
      else this.show.authorize = false
      this.remarks = '您的身份信息错误'
      this.$refs['refuseForm'] && this.$refs['refuseForm'].resetFields()
    },
    closeWithdraw() {
      this.show.withdraw = false
      this.$refs['withdrawForm'].resetFields()
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
.cell img
  width: 126.8px;
  cursor: pointer;
.withdraw-box
  margin-bottom 20px;
</style>
