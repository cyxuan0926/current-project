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
        value="first"
        type="card">
        <el-tab-pane
          label="服刑人员信息"
          name="first" />
      </el-tabs>
      <el-table
        :data="prisoners.contents"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="姓名" />
        <el-table-column
          prop="prisonerNumber"
          label="囚号" />
        <el-table-column
          prop="prisonArea"
          label="监区" />
        <el-table-column
          prop="crimes"
          label="罪名" />
        <el-table-column
          width="96px"
          label="会见次数/月">
          <template slot-scope="scope">
            <div>
              {{ scope.row.accessTime }}
              <el-button
                size="small"
                type="text"
                style="margin-left: 5px;"
                @click="handleAccessTime(scope.row)">修改</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="刑期起止">
          <template slot-scope="scope">
            <span class="separate">{{scope.row.prisonTermStartedAt | dateFormate}}</span>
            <span class="separate">{{scope.row.prisonTermEndedAt | dateFormate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="黑名单原因" prop="reason" show-overflow-tooltip>
          <!-- <template slot-scope="scope">
            <el-tooltip placement="top" :content="scope.row.reason" v-if="scope.row.reason">
              <div :class="scope.row.reason.length>27? 'more-content-column': ''">{{scope.row.reason}}</div>
            </el-tooltip>
          </template> -->
        </el-table-column>
        <el-table-column label="对应家属">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-for="family in scope.row.families"
              :key="family.id"
              style="margin-left: 0px; margin-right: 8px;"
              @click="showFamilyDetail(family)">{{ family.familyName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="家属会见告知书">
          <template slot-scope="scope">
            <span :class="[
              'bold',
              { 'red' : !scope.row.notifyId },
              { 'green' : scope.row.notifyId }
              ]">{{ scope.row.notifyId ? '已签订' : '未签订' }}</span>
            <el-button
              type="text"
              size="small"
              @click="handleSign(scope.row.notifyId, scope.row)">{{ scope.row.notifyId ? '点击查看' : '点击签约' }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-if="!scope.row.isBlacklist"
              @click="showBlackList(scope.row, scope.$index)">
              加入黑名单
            </el-button>
            <el-button
              type="text"
              size="small"
              v-else
              disabled>
              已加入黑名单
            </el-button>
            <!--<el-button-->
              <!--type="text"-->
              <!--size="small"-->
              <!--@click="showPrisonConfig">-->
              <!--更换监区-->
            <!--</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="prisoners.total"
      @onPageChange="getDatas" />
    <el-dialog
      title="修改会见次数"
      :visible.sync="isEditAccessTime"
      width="600px">
      <el-form
        class="inline-form"
        ref="form"
        :model="prisoner">
        <el-form-item label="罪犯">{{ prisoner.name }}</el-form-item>
        <el-form-item
          label="会见次数"
          :rules="[{ required: true, message: '请输入会见次数' }]"
          prop="accessTime">
          <el-input-number
            :min="0"
            v-model="prisoner.accessTime"
            controls-position="right"
            @change="onAccessTimeChange"></el-input-number>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button
          class="button-add"
          size="mini"
          type="danger"
          @click="isEditAccessTime = false">取消</el-button>
        <el-button
          class="button-add"
          size="mini"
          @click="onAccessTime">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog
      title="家属信息"
      :visible.sync="dialogTableVisible">
      <el-row :gutter="0">
        <el-col :span="12">
          <el-col :span="24">
            <label for="">姓名：</label>
            <span>{{ family.familyName }}</span>
          </el-col>
          <el-col :span="24">
            <label for="">关系：</label>
            <span>{{ family.relationship }}</span>
          </el-col>
        </el-col>
      </el-row>
      <el-row class="row-flex" :gutter="20" justify="space-between" type="flex">
        <el-col :span="12" class="img-idCard">
          <label for="">身份证正面：</label>
          <m-img-viewer v-if="family.familyIdCardFront" :url="family.familyIdCardFront" title="身份证正面"/>
        </el-col>
        <el-col :span="12" class="img-idCard">
          <label for="">身份证背面：</label>
          <m-img-viewer v-if="family.familyIdCardBack" :url="family.familyIdCardBack" title="身份证背面" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <label for="">照片：</label>
          <m-img-viewer v-if="family.familyAvatarUrl" :url="family.familyAvatarUrl" title="照片" class="avatar" />
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      :visible.sync="blackTableShow"
      @close="closeBlackTable"
      class="authorize-dialog"
      title="加入黑名单"
      width="530px">
      <el-form
        :model="blackTable"
        ref="blackTableForm"
        :rules="rule">
        <el-form-item prop="blackListReason">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5 }"
            placeholder="请输入加入黑名单理由"
            v-model="blackTable.blackListReason"/>
        </el-form-item>
      </el-form>
      <el-row :gutter="0">
        <el-button
          class="button-add"
          size="mini"
          type="danger"
          @click="blackTableShow = false">取消</el-button>
        <el-button
          class="button-add"
          size="mini" @click="handleBlackListReason">确定</el-button>
      </el-row>
    </el-dialog>
    <el-dialog
      :visible.sync="notificationShow"
      class="authorize-dialog notification-dialog"
      :title="'会见告知书-' + notificationPrisoner.name"
      width="530px">
      <div class="el-form el-form--inline">
        <div class="el-form-item">
          <label class="el-fotm-item__label">可选家属</label>
          <div class="el-form-item__content" style="width: 100%;">
            <el-select
              placeholder="可选家属"
              v-model="notificationFamily"
              filterable
              clearable
              value-key="familyId"
              :loading="selectLoading"
              @change="onSelectChange">
              <el-option
                v-for="item in notificationFamilies"
                :key="item.familyId"
                :label="item.familyName"
                :value="item"/>
            </el-select>
          </div>
        </div>
      </div>

      <m-form v-if="notificationShow" ref="notification" :items="formItems" @submit="onSubmit" :values="notificationForm"></m-form>
      <el-row :gutter="0">
        <el-button
          class="button-add"
          size="mini"
          type="danger"
          @click="notificationShow = false">取消</el-button>
        <el-button
          class="button-add"
          :loading="submitting"
          size="mini"
          @click="handleSureSign">确定</el-button>
      </el-row>
    </el-dialog>
    <!--<el-dialog-->
      <!--:visible.sync="changePrisonConfigName"-->
      <!--title="更换监区"-->
      <!--class="authorize-dialog"-->
      <!--width="530px">-->
      <!--<el-select class="only-select" v-model="PrisonConfigName">-->
        <!--<el-option value="一监区"></el-option>-->
        <!--<el-option value="二监区"></el-option>-->
      <!--</el-select>-->
    <!--</el-dialog>-->
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import validator from '@/utils'
export default {
  data() {
    return {
      searchItems: {
        prisonerNumber: { type: 'input', label: '囚号' },
        prisonArea: { type: 'select', label: '监区', options: JSON.parse(localStorage.getItem('user')).prisonConfigList, belong: { value: 'prisonConfigName', label: 'prisonConfigName' } },
        name: { type: 'input', label: '姓名' },
        isBlacklist: { type: 'select', label: '黑名单', options: [{ label: '是', value: 1 }, { label: '否', value: 0 }] },
        isNotify: { type: 'select', label: '会见告书', options: [{ label: '是', value: 1 }, { label: '否', value: 0 }] },
        famyilyName: { type: 'input', label: '家属姓名' }
      },
      formItems: {
        formConfigs: { inline: true, labelPosition: 'top' },
        familyName: { type: 'input', label: '家属姓名', disabled: false, rules: ['required'] },
        familyUuid: { type: 'input', label: '身份证号', disabled: false },
        familyRelationship: { type: 'input', label: '与服刑人员关系', disabled: false, rules: ['required'] },
        protoNum: { type: 'input', label: '协议编号', rules: ['required'] },
        signDate: {
          type: 'date',
          label: '签署日期',
          rules: ['required'],
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now()
            }
          } }
      },
      dialogTableVisible: false,
      family: {},
      isEditAccessTime: false,
      prisoner: {},
      thePrisoner: {},
      blackTableShow: false,
      index: '',
      blackTable: {
        blackListReason: ''
      },
      rule: {
        blackListReason: [ { required: true, message: '请填写加入黑名单的原因' }, { validator: validator.lengthRange, max: 200 } ]
      },
      notificationShow: false,
      notificationPrisoner: {},
      notificationForm: {},
      notificationFamily: {},
      selectLoading: true,
      submitting: false
      // changePrisonConfigName: false,
      // PrisonConfigName: '一监区'
    }
  },
  computed: {
    ...mapState(['prisoners', 'notification', 'notificationFamilies'])
  },
  watch: {
    notificationFamily: {
      handler: function(val) {
        if (val && val.familyId) {
          this.formItems.familyName.disabled = true
          this.formItems.familyRelationship.disabled = true
          this.formItems.familyUuid.disabled = true
        }
        else {
          this.formItems.familyName.disabled = false
          this.formItems.familyRelationship.disabled = false
          this.formItems.familyUuid.disabled = false
        }
      },
      deep: true
    }
    // PrisonConfigName(val) {
    //   console.log(11111)
    // }
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions(['getPrisoners', 'updateAccessTime', 'addPrisonerBlacklist', 'getNotification', 'updateNotification', 'addNotification', 'getNotificationFamilies']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.getPrisoners({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    handleAccessTime(e) {
      this.prisoner = Object.assign({}, e)
      this.thePrisoner = e
      this.isEditAccessTime = true
    },
    onAccessTimeChange(e) {
      if (!e) this.prisoner.accessTime = 0
    },
    onAccessTime() {
      if (this.prisoner.accessTime === this.thePrisoner.accessTime) {
        this.isEditAccessTime = false
        return
      }
      this.$refs.form.validate(valid => {
        if (!valid) return
        let params = { id: this.prisoner.id, accessTime: this.prisoner.accessTime }
        this.updateAccessTime(params).then(res => {
          if (!res) return
          this.thePrisoner.accessTime = params.accessTime
          this.isEditAccessTime = false
        })
      })
    },
    showFamilyDetail(family) {
      this.family = family
      this.dialogTableVisible = true
    },
    showBlackList(e, index) {
      this.prisoner = Object.assign({}, e)
      this.blackTableShow = true
      this.index = index
    },
    closeBlackTable() {
      this.$refs.blackTableForm.resetFields()
    },
    handleBlackListReason() {
      this.$refs['blackTableForm'].validate(valid => {
        if (valid) {
          let params = new FormData()
          params.append('prisonerId', this.prisoner.id)
          params.append('reason', this.blackTable.blackListReason)
          this.addPrisonerBlacklist(params).then(res => {
            if (res.code !== 200) return
            this.prisoners.contents[this.index].reason = res.data.prisoners.reason
            this.prisoners.contents[this.index].isBlacklist = res.data.prisoners.isBlacklist
            this.blackTableShow = false
          })
        }
      })
    },
    onSelectChange(e) {
      if (e && e.familyId) {
        this.notificationForm = Object.assign({}, e)
      }
      else {
        this.notificationForm.familyId = ''
        this.notificationForm.familyName = ''
        this.notificationForm.familyRelationship = ''
        this.notificationForm.familyUuid = ''
      }
    },
    handleSign(e, prisoner) {
      this.notificationPrisoner = prisoner
      this.notificationFamily = {}
      this.selectLoading = true
      this.getNotificationFamilies({ prisonerId: prisoner.id }).then(res => {
        this.selectLoading = false
      })
      if (e) {
        this.getNotification({ id: e }).then(res => {
          if (!res) return
          this.notificationForm = this.notification
          this.notificationFamily = this.notification
          this.notificationShow = true
        })
      }
      else {
        this.notificationForm = {}
        this.notificationShow = true
      }
    },
    handleSureSign() {
      this.$refs.notification.onSubmit()
    },
    onSubmit(e) {
      this.submitting = true
      if (e.id) {
        this.updateNotification(e).then(res => {
          this.submitting = false
          if (!res) return
          this.notificationShow = false
        })
      }
      else {
        let params = Object.assign({}, {
          prisonerId: this.notificationPrisoner.id
        }, e)
        this.addNotification(params).then(res => {
          this.submitting = false
          if (!res) return
          this.notificationPrisoner.notifyId = res.id
          this.notificationShow = false
        })
      }
    }
    // showPrisonConfig() {
    //   this.changePrisonConfigName = true
    // }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
.row-container
  .el-dialog__body
    img
      display: block;
    img.avatar
      width: 200px
      height: 200px
.img-idCard
  min-width: 350px;
.row-flex
  flex-wrap: wrap;
.more-content-column
  max-height: 66px;
  overflow: hidden;
  position: relative;
  &::after
    content: '...'
    position: absolute;
    bottom: -3px;
    right: 0px;
.el-button
  &+.el-button
    margin-left 0px !important
.only-select
  width 100%
</style>
