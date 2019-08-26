<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-row type="flex" justify="end">
      <m-excel-export
        v-if="hasAllPrisonQueryAuth && dataToExportExcel.length > 0"
        :filename="prisonerExcelConfig.filename"
        :jsonData="dataToExportExcel"
        :header="prisonerExcelConfig.header"
        :filterFields="prisonerExcelConfig.filterFields"
      />
      <m-excel-download
        v-if="hasAllPrisonQueryAuth && dataToExportExcel.length === 0"
        path="/download/exportPrisoners"
        :params="filter"
      />
      <el-col
        :span="4"
        style="text-align:right">
        <el-button
          type="primary"
          size="medium"
          @click="showAddPrisoner"
          style="width:65%">新 增</el-button>
      </el-col>
      <el-col
        :span="4"
        style="text-align:right">
        <el-button
          type="primary"
          size="medium"
          @click="showDelPrionser"
          style="width:60%">删 除</el-button>
      </el-col>
    </el-row>
    <el-col
      :span="24"
      class="el-col__no-tabs__margin">
      <el-table
        :data="prisoners.contents"
        border
        @selection-change="handleSelectionChange"
        class="mini-td-padding"
        style="width: 100%">
        <!-- EL自身的 -->
        <el-table-column
          type="selection"
          :selectable="handleControlSelect"/>
        <!-- 自己手写的 不要删了-->
        <!-- <el-table-column>
          <template
            slot="header"
            slot-scope="scope">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="allSelectionvalue"
              :key="scope.$index"
              @change="handleCheckAllChange"/>
          </template>
          <template slot-scope="scope">
              <el-checkbox 
                v-model="multipleSelection[scope.$index]"
                @change="handleCheckedChange($event, scope)"/>
          </template>
        </el-table-column> -->
        <el-table-column
          v-if="hasAllPrisonQueryAuth"
          prop="jailName" 
          label="监狱名称"
        />
        <el-table-column
          prop="name"
          label="罪犯姓名" />
        <el-table-column
          prop="prisonerNumber"
          label="罪犯编号" />
        <el-table-column
          prop="prisonArea"
          label="监区" />
        <el-table-column
          prop="crimes"
          show-overflow-tooltip
          label="罪名" />
        <el-table-column
          width="92px"
          label="会见次数/月">
          <template slot-scope="scope">
            <div>
              {{ scope.row.accessTime }}
              <el-button
                v-if="!hasAllPrisonQueryAuth"
                :disabled="!scope.row.sysFlag"
                size="small"
                type="text"
                style="margin-left: 5px;"
                @click="handleAccessTime(scope.row)">修改</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="刑期起止" width="146px">
          <template slot-scope="scope">
            <span class="separate">{{ scope.row.prisonTermStartedAt | dateFormate }}</span>
            <span class="separate">{{ scope.row.prisonTermEndedAt | dateFormate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="服刑人员状态">
          <template slot-scope="scope">
            <span v-if="!scope.row.sysFlag">删除原因：{{ scope.row.deleteReason }}</span>
            <span v-else-if="scope.row.isBlacklist">黑名单原因：{{ scope.row.reason }}</span>
          </template>
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
        <el-table-column
          v-if="!hasAllPrisonQueryAuth"
          label="家属会见告知书"
          min-width="110px"
        >
          <template slot-scope="scope">
            <span
              :class="[
                'bold',
                { 'red' : !scope.row.notifyId },
                { 'green' : scope.row.notifyId }
            ]">{{ scope.row.notifyId ? '已签订' : '未签订' }}</span>
            <el-button
              type="text"
              size="small"
              :disabled="!scope.row.sysFlag"
              @click="handleSign(scope.row.notifyId, scope.row)">{{ scope.row.notifyId ? '点击查看' : '点击签约' }}</el-button>
          </template>
        </el-table-column>
        <el-table-column 
          v-if="!hasAllPrisonQueryAuth" 
          label="操作" 
          width="140px"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              :disabled="!scope.row.sysFlag"
              v-if="!scope.row.isBlacklist"
              @click="showBlackList(scope.row)">
              加入黑名单
            </el-button>
            <el-button
              type="text"
              size="small"
              :disabled="!scope.row.sysFlag"
              v-else
              @click="removeBlackList(scope.row)">
              移出黑名单
            </el-button>
            <el-button
              type="text"
              size="small"
              :disabled="!scope.row.sysFlag"
              @click="showPrisonConfig(scope.row)">
              更换监区
            </el-button>
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
            @change="onAccessTimeChange"/>
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
      <el-row
        class="row-flex"
        :gutter="20"
        justify="space-between"
        type="flex">
        <el-col
          :span="12"
          class="img-idCard">
          <label for="">身份证正面：</label>
          <m-img-viewer
            v-if="family.familyIdCardFront"
            :url="family.familyIdCardFront"
            title="身份证正面"/>
        </el-col>
        <el-col
          :span="12"
          class="img-idCard">
          <label for="">身份证背面：</label>
          <m-img-viewer
            v-if="family.familyIdCardBack"
            :url="family.familyIdCardBack"
            title="身份证背面" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <label for="">照片：</label>
          <m-img-viewer
            v-if="family.familyAvatarUrl"
            :url="family.familyAvatarUrl"
            title="照片"
            class="avatar" />
        </el-col>
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
          <div
            class="el-form-item__content"
            style="width: 100%;">
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

      <m-form
        v-if="notificationShow"
        ref="notification"
        :items="formItems"
        @submit="onSubmit"
        :values="notificationForm" />
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
    <el-dialog
      @close="handleCloseDialog"
      :visible.sync="visible"    
      ref="allDialog"
      :title="dialogContent['title']"
      class="authorize-dialog all-dialog__style"
      width="530px">
      <m-form
        v-if=" !(operationType === 2 && prisonConfigs.length < 1)"
        :items="dialogContent['items']"
        @submit="handleSubmit"
        ref="dialogForm"
        @cancel="visible = false" />
      <div
        v-else
        style="text-align: center;color: red;font-size: 16px">没有可更换的监区</div>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import validator from '@/utils'
import { prisonerExcelConfig } from '@/common/excel-config'
import prisonFilterCreator from '@/mixins/prison-filter-creator'

export default {
  mixins: [prisonFilterCreator],
  data() {
    const prisonerStatus = [{ label: '正常状态', value: 1 }, { label: '黑名单', value: 2 }, { label: '已删除', value: 3 }]
    return {
      searchItems: {
        prisonerNumber: { type: 'input', label: '罪犯编号' },
        prisonArea: { type: 'select', label: '监区', options: (JSON.parse(localStorage.getItem('user')).prisonConfigList || []), belong: { value: 'prisonConfigName', label: 'prisonConfigName' } },
        name: { type: 'input', label: '罪犯姓名' },
        status: { type: 'select', label: '服刑人员状态', options: prisonerStatus, value: 1 },
        isNotify: { type: 'select', label: '会见告知书', noPlaceholder: true, options: [{ label: '已签订', value: 1 }, { label: '未签订', value: 0 }] },
        familyName: { type: 'input', label: '家属姓名' }
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
      notificationShow: false,
      notificationPrisoner: {},
      notificationForm: {},
      notificationFamily: {},
      selectLoading: true,
      submitting: false,
      prisonConfigData: [], // 可更换的监区数据
      visible: false, // 对话框的显示
      showReasonValue: '刑满释放', // 删除框的value
      // allSelectionvalue: false, 删除罪犯全选的控制 不要删掉
      deletePrisoners: [], // 删除的罪犯数据
      // isIndeterminate: false, // 单选框的样式控制 不要删掉
      // multipleSelection: [], // 多选数据 不要删掉
      operationType: 0 // 默认是0就是不操作 1为加入黑名单 2为更换监区 3 为新增服刑人员 4为删除服刑人员
    }
  },
  computed: {
    ...mapState(['prisoners', 'notification', 'notificationFamilies', 'prisonConfigs']),
    dataToExportExcel() {
      // TODO：选中的数据才导出
      return this.prisoners.contents
    },
    dialogContent() {
      let title,
        delReason = [{ label: '刑满释放', value: '刑满释放' }, { label: '已被执行', value: '已被执行' }, { label: '其他', value: '其他' }],
        items = {}, formButton = { buttons: [] },
        otherDelReasonDetail = { contents: { type: 'input', label: '删除原因', noLabel: true, placeholder: '请输入删除原因', rules: ['required'] }}
      switch(this.operationType) {
        case 1:
          title = '加入黑名单'
          formButton.buttons = [ { add: 'add', text: '确认' }, { cancel: 'cancel', type: 'danger' } ]
          items = Object.assign({},{
            reason: { type: 'textarea', noLabel: true, placeholder: '请输入加入黑名单理由', autosize: { minRows: 5 }, rules: ['required', 'lengthRange-200'], label: '加入黑名单的原因', showWordLimit: true }
          }, formButton)
          break
        case 2:
          title = '更换监区'
          formButton.buttons = []
          items = Object.assign({}, {
            prisonAreaId: { type: 'select', noLabel: true, placeholder: '请选择监区', options: this.prisonConfigData, label: '监区', props: { label: 'name', value: 'id' }, func: this.handleChangePrisonConfig }
          }, formButton)
          break
        case 3:
          title = '新增服刑人员'
          formButton.buttons = [ 'add', 'cancel' ]
          items = Object.assign({}, {
            formConfigs: { labelWidth: '120px' },
            name: { type: 'input', label: '服刑人员姓名', rules: ['required'], clearable: true },
            prisonerNumber: { type: 'input', label: '服刑人员编号', rules: ['required'], clearable: true },
            prisonConfigId: { type: 'select', label: '监区', rules: !JSON.parse(localStorage.getItem('user')).branch_prison ? [] : ['required'], disabled: !JSON.parse(localStorage.getItem('user')).branch_prison, options: JSON.parse(localStorage.getItem('user')).prisonConfigList, props: { label: 'prisonConfigName', value: 'prisonConfigId' }, customClass: !JSON.parse(localStorage.getItem('user')).branch_prison ? 'input_required__show' : '' },
            gender: { type: 'select', label: '性别', rules: ['required'], options: [{ label: '男', value: 'm' }, { label: '女', value: 'f' }], props: { label: 'label', value: 'value' }, value:'m'  },
            crimes: { type: 'input', label: '犯罪事实', clearable: true },
            additionalPunishment: { type: 'input', label: '附加刑', clearable: true },
            prisonTermStartedAt: { type: 'date', label: '刑期起日', clearable: true, pickerOptions: {
              disabledDate: { prop: 'prisonTermEndedAt', name: 'start' }
            } },
            prisonTermEndedAt: { type: 'date', label: '刑期止日', clearable: true, pickerOptions: {
               disabledDate: { prop: 'prisonTermStartedAt', name: 'end' }
            } },
            originalSentence: { type: 'input', label: '原判刑期', clearable: true }
          }, formButton)
          break
        case 4:
          title = '请选择删除原因'
          formButton.buttons = [ { add: 'add', text: '确认' }, 'cancel' ]
          items = Object.assign({}, {
            formConfigs: { labelWidth: '110px' },
            deleteReason: { type: 'select', options: delReason, label: '原因', props: { label: 'label', value: 'label' }, value: this.showReasonValue, func: this.handleChangeDelReason }
          }, formButton)
          if(this.showReasonValue === '其他') items = Object.assign({}, items, otherDelReasonDetail)
          else Reflect.deleteProperty(items, 'content')
          break
        default:
          break
      }
      return { title, items }
    }
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
    },
  },
  async mounted() {
    await this.getPrisonConfigs({ jailId: JSON.parse(localStorage.getItem('user')).jailId })
    this.filter = Object.assign({}, this.filter, {
      status: 1
    })
    await this.getDatas()
  },
  methods: {
    ...mapActions(['getPrisoners', 'getPrisonersAll', 'updateAccessTime', 'addPrisonerBlacklist', 'getNotification', 'updateNotification', 'addNotification', 'getNotificationFamilies', 'getPrisonConfigs', 'changePrisonArea', 'removePrisonerBlacklist', 'deletePrisonerData', 'addPrionser']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    async getDatas() {
      // this.allSelectionvalue = false // 不要删除
      // await this.getPrisoners({ ...this.filter, ...this.pagination })
      // this.multipleSelection = new Array(this.prisoners.contents.length).fill(false) // 不要删除
      // this.isIndeterminate = false 不要删除

      const params = { ...this.filter, ...this.pagination }

      if (this.hasAllPrisonQueryAuth) {
        this.getPrisonersAll(params)
      } else {
        this.getPrisoners(params)
      }
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
    // 展示黑名单对话框
    showBlackList(e) {
      this.prisoner = Object.assign({}, e)
      this.operationType = 1
      this.visible = true
    },
    removeBlackList(e) {
      this.$confirm(`是否将${ e.name }移出黑名单？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new FormData()
        params.append('prisonerId', e.id)
        this.removePrisonerBlacklist(params).then(res => {
          if (!res) return
          this.onSearch()
        })
      }).catch(() => {})
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
    },
    // 展示更换监区对话框
    showPrisonConfig(e) {
      this.prisoner = Object.assign({}, e)
      this.operationType = 2
      this.visible = true
      this.prisonConfigData = this.prisonConfigs.filter(val => {
        return e.prisonArea !== val.name
      })
    },
    // 展示删除罪犯对话框
    showDelPrionser() {
      if(!this.deletePrisoners.length) {
        this.$message({
          showClose: true,
          message: '请选择需要删除的数据！',
          type: 'warning'
        })
      }
      else {
        this.operationType = 4
        this.visible = true
      }
    },
    // 展示新增罪犯对话框
    showAddPrisoner() {
      this.operationType = 3
      this.visible = true
    },
    // 关闭对话框
    handleCloseDialog() {
     if(this.showReasonValue !== '刑满释放') this.showReasonValue = '刑满释放'
     this.$refs.dialogForm && this.$refs.dialogForm.onCancel()
    },
    // 加入黑名单 新增罪犯 删除罪犯的确认操作
    handleSubmit(val) {
      // 加入黑名单
      if(this.operationType === 1) {
          let params = new FormData()
          params.append('prisonerId', this.prisoner.id)
          params.append('reason', val.reason)
          this.addPrisonerBlacklist(params).then(res => {
            if (!res) return
            this.onSearch()
            this.handleCloseDialog()
          })
      }
      // 删除罪犯
      if(this.operationType === 4) {
        let deleteReason = val.contents || val.deleteReason, prisonerId = (this.deletePrisoners.map(val => val.id)).join(',')
        this.deletePrisonerData({deleteReason, prisonerId}).then(res => {
          if(!res) return
          this.onSearch()
          this.handleCloseDialog()
        })
      }
      // 新增罪犯
      if(this.operationType === 3) {
        let prisonArea, jailId = JSON.parse(localStorage.getItem('user')).jailId, temp = { jailId }
        if(JSON.parse(localStorage.getItem('user')).branch_prison) {
          prisonArea = (JSON.parse(localStorage.getItem('user')).prisonConfigList.filter(value => value.prisonConfigId === val.prisonConfigId))[0].prisonConfigName
          temp = { jailId, prisonArea }
        }
        val = Object.assign({}, val, temp)
        this.addPrionser(val).then(res => {
          if(!res) return
          this.onSearch()
          this.handleCloseDialog()
        })
      }
    },
    // 更换监区
    handleChangePrisonConfig(e, prop) {
      if (e) {
        this.$confirm('若预约日期无法在新监区当日分配时间段，系统将自动取消相关会见申请，并以短信形式通知相关家属，请确认是否继续操作？', '提示：修改服刑人员监区后，将重新分配相关待会见时间段，调整后会以短信形式通知相关家属', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'prisonConfigMessage'
        }).then(() => {
          let params = {
            prisonerId: this.prisoner.id,
            jailId: this.prisoner.jailId,
            prisonAreaId: e
          }
          this.changePrisonArea(params).then(res => {
            if (res.code !== 200) return
            setTimeout(() => {
              this.handleCloseDialog()
              this.onSearch()
            }, 500)
          })
        }).catch(() => {
          this.$refs.dialogForm && this.$refs.dialogForm.handleResetField()
        })
      }
    },
    // 更换删除原因
    handleChangeDelReason(e) {
      this.showReasonValue = e
    },
    // 筛选已经删除的罪犯不可选择
    handleControlSelect(row, index) {
      return row.sysFlag
    },
    // 选择删除的罪犯
    handleSelectionChange(val) {
      this.deletePrisoners = val
    }
    // 自定义的全选操作 不要删除
    // handleCheckAllChange(val) {
    //   if(!val) {
    //     this.deletePrisoners = []
    //     this.multipleSelection = new Array(this.prisoners.contents.length).fill(false)
    //   }
    //   else {
    //     this.multipleSelection = new Array(this.prisoners.contents.length).fill(true)
    //     this.deletePrisoners = this.prisoners.contents
    //   }
    //   this.isIndeterminate = false
    // },
    // 自定义的单选操作 不要删除
    // handleCheckedChange(value, scope) {
    //   const { $index, row } = scope
    //   this.$set(this.multipleSelection, $index, value)
    //   if(value) this.deletePrisoners.push(row)
    //   else this.deletePrisoners.splice(this.deletePrisoners.indexOf(row), 1)
    //   if([...new Set(this.multipleSelection)].length === 1 && [...new Set(this.multipleSelection)][0]) this.allSelectionvalue = true
    //   else this.allSelectionvalue = false
    //   this.isIndeterminate = this.deletePrisoners.length > 0 && this.deletePrisoners.length < this.prisoners.contents.length
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
.el-button
  &+.el-button
    margin-left 0px !important
.only-select
  width 100%
.el-dialog__body
  padding-bottom: 20px !important
</style>
