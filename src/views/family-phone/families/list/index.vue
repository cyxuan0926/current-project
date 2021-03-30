<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
    >
      <!-- v-if="!isSuperAdmin" -->
      <template>
        <template slot="append">
          <el-button type="primary" @click="onNewFamily">新增</el-button>

          <m-excel-download
            path="/download/downloadfile"
            :params="{ filepath: 'family_phone_manage_template.xls' }"
            text="模板"
          />

          <m-excel-upload ref="mExcelUpload" :configs="excelUploadConfigs" />
        </template>

        <template slot="append">
          <el-button
            type="primary"
            :loading="downloading"
            @click="onDownloadExcel"
          >导出 Excel</el-button>
        </template>
      </template>
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

      <m-table-new
        stripe
        :cols="tableCols"
        :data="familiesPaged.content"
      >
        <template #familyName="{ row }">
          <el-button
            v-if="!!row.status"
            type="text"
            @click="onViewAuthorizeFamily(row)"
          >{{ row.familyName }}</el-button>

          <span v-else>{{ row.familyName }}</span>
        </template>

        <template #status="{ row }">
          <span :class="[{ 'own-primary': !!row.status }]">{{ row.status | familyPhoneAuthenticationType }}</span>
        </template>

        <template #familyType="{ row }">
          <span v-if="!!row.status">{{ row.familyType | familyTypeOptions }}</span>
        </template>

        <template #aduitDetail="{ row }">{{ row.aduitDetail | familyPhoneCheckType }}</template>

        <template #isPhoneSms="{ row }">{{ row.isPhoneSms | isTrue }}</template>

        <template #operation>
          <!-- 待审核/亲情电话标签页 && 审批流过程中的时候 -->
          <template>
            <!-- 审批流程的最后一级已通过的标签还能再编辑一次 -->
            <el-button type="text" @click="onEdit">编辑</el-button>

            <el-button type="text">审核</el-button>
          </template>

          <el-button type="text">详情</el-button>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="familiesPaged.totalCount"
      @onPageChange="getDatas"
    />

    <el-dialog
      class="authorize-dialog"
      ref="familyInformationDialog"
      :visible.sync="familyInformationVisible"
      :close-on-click-modal="false"
      title="亲情电话家属信息"
      width="40%"
      @close="onCloseFamilyInformationDialog"
      @open="onOpenFamilyInformationDialog"
    >
      <m-form
        ref="familyInformationDialogForm"
        :items="familyInformationDialogFormItems"
        :values="familyInformationDialogFormValues"
        @cancel="familyInformationVisible = false"
        @submit="onFamilyInformationDialogFormSubmit"
      />
    </el-dialog>

     <el-dialog
      title="家属信息"
      class="authorize-dialog"
      :visible.sync="authorizeDialogVisible"
    >
      <el-row :gutter="0">
        <el-col :span="12">
          <el-col :span="24">
            <label>姓名：</label>
            <span>{{ authorizeFamilyDetail.familyName }}</span>
          </el-col>
          <el-col :span="24">
            <label>关系：</label>
            <span>{{ authorizeFamilyDetail.relationship }}</span>
          </el-col>
        </el-col>
      </el-row>

      <div style="margin-bottom: 10px;">家属信息:</div>

      <div class="img-box">
        <m-img-viewer
          isRequired
          :url="authorizeFamilyDetail.idCardFront"
          :toolbar="{ prev: 1, next: 1 }"
          title="身份证正面照"
        />

        <m-img-viewer
          isRequired
          :url="authorizeFamilyDetail.idCardBack"
          :toolbar="{ prev: 1, next: 1 }"
          title="身份证背面照"
        />

        <m-img-viewer
          isRequired
          :url="authorizeFamilyDetail.avatarUrl"
          :toolbar="{ prev: 1, next: 1 }"
          title="头像"
        />
      </div>

      <template v-if="
        authorizeFamilyDetail.relationalProofUrl ||
        authorizeFamilyDetail.relationalProofUrl2 ||
        authorizeFamilyDetail.relationalProofUrl3 ||
        authorizeFamilyDetail.relationalProofUrl4"
      >
        <div style="margin-bottom: 10px;">关系证明:</div>

        <div class="img-box">
          <m-img-viewer
            v-if="authorizeFamilyDetail.relationalProofUrl"
            class="relation_img"
            :url="authorizeFamilyDetail.relationalProofUrl"
            title="关系证明图"
          />

          <m-img-viewer
            v-if="authorizeFamilyDetail.relationalProofUrl2"
            class="relation_img"
            :url="authorizeFamilyDetail.relationalProofUrl2"
            title="关系证明图"
          />

          <m-img-viewer
            v-if="authorizeFamilyDetail.relationalProofUrl3"
            class="relation_img"
            :url="authorizeFamilyDetail.relationalProofUrl3"
            title="关系证明图"
          />

          <m-img-viewer
            v-if="authorizeFamilyDetail.relationalProofUrl4"
            class="relation_img"
            :url="authorizeFamilyDetail.relationalProofUrl4"
            title="关系证明图"
          />
        </div>
      </template>

      <template v-if="authorizeFamilyDetail.meetNoticeUrl">
        <div style="margin-bottom: 10px;">可视电话通知单:</div>

        <div class="img-box">
          <m-img-viewer :url="authorizeFamilyDetail.meetNoticeUrl" title="可视电话通知单" />
        </div>
      </template>
    </el-dialog>

    <el-dialog
      class="authorize-dialog upload-dialog"
      ref="uploadDialog"
      title="亲情电话家属信息导入"
      :visible.sync="uploadDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @open="onOpenUploadDialog"
    >
      <el-row>
        <el-col :span="20" :offset="2">
          <el-steps
            :active="status"
            finish-status="success"
            style="margin: 20px 0px"
          >
            <el-step
              v-for="(tag, index) in tabMapOptions"
              :key="index"
              :title="tag.label"
            />
          </el-steps>
        </el-col>

        <el-col class="process-col_tips">
          <span>准备导入数据总计：{{ validateFamiliesResult.total }}条</span>

          <span>已用时：{{ spendTime }}秒</span>

          <span>进度：{{ percent }}%</span>
        </el-col>

        <el-col class="process-col_waiting">请稍后...</el-col>
      </el-row>

      <el-dialog
        class="authorize-dialog"
        append-to-body
        ref="uploadInnerDialog"
        title="导入结果提示"
        :visible.sync="uploadInnerDialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="onUploadInnerDialogClose"
      >
        <div style="line-height: 30px; margin-top: 10px;">
          <i class="el-icon-success green" style="font-size: 20px;margin-right: 10px;"></i>成功：{{ validateFamiliesResult.add_total }}条<br>

          <template v-if="!!validateFamiliesResult.error_total">
            <i class="el-icon-error red" style="font-size: 20px; margin-right: 10px;"></i>失败：{{ validateFamiliesResult.error_total }}条

            <p style="padding-left: 30px">原因：上传的Excel文件内容格式有误，请检查文件内容，仔细对照下载的模版数据。</p>

            <p style="padding-left: 30px">导入失败数据：
              <m-excel-download
                path="/download/downloadfile"
                :params="{ filepath: validateFamiliesResult.filePath }"
                :buttonsProps="excelExportButtonProps"
                text="导入失败的数据.xls"
              />
            </p>
          </template>
        </div>

        <div slot="footer">
          <el-button type="primary" @click="uploadInnerDialogVisible = false">确 定</el-button>
        </div>        
      </el-dialog>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  mapGetters,
  mapActions,
  mapState
} from 'vuex'

import prisonFilterCreator from '@/mixins/prison-filter-creator'

import isEqual from 'lodash/isEqual'

import cloneDeep from 'lodash/cloneDeep'

import validator from '@/utils'

import http from '@/service'

import { tokenExcel } from '@/utils/token-excel'

import { DateFormat } from '@/utils/helper'
export default {
  name: 'FamilyPhone_Families_List',

  mixins: [prisonFilterCreator],

  data() {
    const tabsItems = [
      {
        label: '亲情电话',
        name: 'first'
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
        name: '0'
      }
    ]

    const clearable = true
    return {
      tabsItems,

      tabs: '0',

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

        status: {
          type: 'select',
          label: '认证情况',
          options: this.$store.state.familyPhoneAuthenticationType
        },

        auditDetail: {
          type: 'select',
          label: '审核状态',
          options: this.$store.state.familyPhoneCheckType,
          miss: false
        },

        isPhoneSms: {
          type: 'select',
          label: '可否接听亲情电话',
          noPlaceholder: true,
          options: this.$store.state.isTrue,
          miss: false
        },

        isMore: {
          type: 'select',
          label: '是否超3位家属',
          noPlaceholder: true,
          options: this.$store.state.isTrue,
          miss: false
        }
      },

      familyInformationVisible: false,

      familyInformationDialogFormItems: {
        buttons: ['add', 'cancel'],

        formConfigs: {
          labelWidth: '120px'
        },

        familyName: {
          type: 'input',
          label: '家属姓名',
          rules: ['required'],
          clearable
        },

        familyPhone: {
          type: 'input',
          label: '家属电话',
          rules: ['required'],
          clearable
        },

        criminalName: {
          type: 'input',
          label: '罪犯姓名',
          rules: ['required'],
          clearable
        },

        criminalNumber: {
          type: 'input',
          label: '罪犯编号',
          rules: ['required'],
          clearable
        },

        relationship: {
          type: 'input',
          label: '关系',
          rules: ['required'],
          clearable
        },

        isReplace: {
          type: 'select',
          label: '是否替换已有家属',
          rules: ['required'],
          options: this.$store.state.isTrue,
          value: 1,
          controlTheOther: true,
          controlProps: ['replaceName'],
          func: this.onReplaceFamilyChange
        },

        replaceName: {
          type: 'input',
          label: '被替换家属姓名',
          dependingRelation: false,
          disableDependingProp: 'isReplace',
          changeRules: [{
            message: '请输入被替换家属姓名',
            validator: validator.required,
            required: true
          }],
          clearable
        }
      },

      authorizeDialogVisible: false,

      excelUploadConfigs: {
        attrs: {
          autoUpload: false,
          limit: 1,
          beforeUpload: this.beforeUpload,
          onChange: this.onChange
        }
      },

      uploadDialogVisible: false,

      status: 0,

      spendTime: 0,

      percent: 0,

      tabMapOptions: [
        { label: '读取excel' },
        { label: '解析excel' },
        { label: '初始化数据' },
        { label: '校验数据' },
        { label: '导入数据' },
        { label: '导入完成' }
      ],

      uploadInnerDialogVisible: false,

      excelExportButtonProps: {
        attrs: {
          type: 'text'
        }
      },

      familyInformationDialogFormValues: {},

      familyInformationDialogOperationType: 0, // 0: 新增 1: 编辑

      authorizeFamilyDetail: {},

      downloading: false
    }
  },

  computed: {
    ...mapGetters(['isSuperAdmin']),

    ...mapState({
      uploadResult: state => state.global.uploadResult
    }),

    ...mapState('familyPhone', [
      'familiesPaged',
      'originalFamilyInformationDialogFormValues',
      'validateFamiliesResult'
    ]),

    tableCols() {
      const cols = [
        {
          label: '家属姓名',
          slotName: 'familyName'
        },
        {
          label: '家属电话',
          prop: 'familyPhone'
        },
        {
          label: '罪犯姓名',
          prop: 'criminalName'
        },
        {
          label: '罪犯编号',
          prop: 'criminalNumber'
        },
        {
          label: '监区',
          prop: 'prisonArea'
        },
        {
          label: '关系',
          prop: 'relationship'
        },
        {
          label: '新增或编辑时间',
          minWidth: 120,
          prop: 'updateTime'
        },
        {
          label: '认证情况',
          slotName: 'status'
        },
        {
          label: '家属类型',
          slotName: 'familyType'
        },
        {
          label: '审核状态',
          slotName: 'aduitDetail'
        },
        {
          label: '是否接听电话和发送短信',
          slotName: 'isPhoneSms'
        },
        {
          label: '操作',
          slotName: 'operation'
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
    },

    apiUrls() {
      const urls = {
        pagedUrl: this.isSuperAdmin ? '/familyPhoneManage/page' : '/familyPhoneManage/page',

        exportUrl: this.isSuperAdmin ? '/parse/familyphone/exportFamilyPhone' : '/parse/familyphone/exportFamilyPhone',

        newOrEditUrl: this.familyInformationDialogOperationType ? '/familyPhoneManage/edit' : '/familyPhoneManage/save'
      }

      return urls
    }
  },

  watch: {
    tabs(tab) {
      const temp = ['1', '0'], hiddenItems = [
        'auditDetail',
        'isPhoneSms',
        'isMore'
      ]

      if (temp.includes(tab)) {
        hiddenItems.forEach(key => {
          this.$set(this.searchItems[key], 'miss', true)

          delete this.searchItems[key].value

          delete this.filter[key]
        })
      } else if (tab === '2') {
        hiddenItems.forEach(key => {
          this.$set(this.searchItems[key], 'miss', false)
        })

        this.$set(this.searchItems['isMore'], 'miss', true)

        this.$set(this.searchItems['auditDetail'], 'options', this.$store.state.familyPhoneCheckType.slice(-2))

        delete this.filter['isMore']

        delete this.searchItems['isMore'].value
      } else if (tab === 'first') {
        hiddenItems.forEach(key => {
          this.$set(this.searchItems[key], 'miss', false)
        })

        this.$set(this.searchItems['auditDetail'], 'options', this.$store.state.familyPhoneCheckType)
      }

      this.$refs.search.onGetFilter()

      this.onSearch()
    }
  },

  methods: {
    ...mapActions(['uploadFile', 'resetState']),

    ...mapActions('familyPhone', [
      'getFamiliesPaged',
      'operateFamilyPhoneFamilies',
      'validateUploadFamilies'
    ]),

    async getDatas() {
      if (this.tabs !== 'first' && !this.filter.auditDetail) this.filter.auditDetail = +this.tabs

      const params = {
        ...this.filter,
        ...this.pagination
      }, url = this.apiUrls['pagedUrl']

      await this.getFamiliesPaged({ params, url })
    },

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    onEdit() {
      this.familyInformationDialogOperationType = 1

      this.familyInformationVisible = true
    },

    onNewFamily() {
      this.familyInformationDialogOperationType = 0

      this.familyInformationVisible = true
    },

    onOpenUploadDialog() {
      this.$nextTick(() => {
        this.$refs.mExcelUpload.onManualUpload()
      })
    },

    beforeUpload(file) {
      this.resetState({validateUploadFamilies: {
        add_total: 0,
        error_total: 0,
        filePath: '',
        total: 0
      }})

      let count = 0, index = 0

      // 上次文件的定时器
      const uploadInterver = setInterval(async () => {
        this.status += 1

        this.percent += 15

        this.spendTime += .5

        if (this.status === 4) {
          clearInterval(uploadInterver)

          // 上次文件到服务器
          const isSuccess = await this.uploadFile(file)

          if (!isSuccess) {
            this.onResetAndcloseUploadDialog()

            return
          }

          // 验证excel的定时器
          const validateInterver = setInterval(async () => {
            count ++

            if (count === 1) {
              this.spendTime += 1

              // 验证excel
              const isSuccess = await this.validateUploadFamilies(this.uploadResult.path)

              clearInterval(validateInterver)

              if (!isSuccess) {
                this.onResetAndcloseUploadDialog()

                return
              }

              // 模拟完成最后两步
              const processInterver = setInterval(() => {
                index ++

                if (index === 1) {
                  this.percent += 20

                  this.spendTime += 1

                  this.status = this.status + 1

                  clearInterval(processInterver)

                  this.spendTime += 1

                  this.status += 1

                  this.percent = 100

                  setTimeout(() => {
                    this.uploadInnerDialogVisible = true
                  }, 1000)
                } else this.spendTime += 1
              }, 1000)
            } else this.spendTime += 1
          }, 1000)
        } else this.spendTime += 1
      }, 500)

      return false
    },

    onChange(file) {
      if (this.uploadDialogVisible) return

      if (file) {
        this.uploadDialogVisible = true
      }
    },

    // 是否替换已有家属 change事件触发
    onReplaceFamilyChange(e, prop, item) {
      this.$set(this.familyInformationDialogFormItems['replaceName'],  'disabled', !e)

      this.$refs.familyInformationDialogForm.resetFieldValue(e, prop, item)
    },

    // 关闭对话框
    onCloseFamilyInformationDialog() {
      this.$refs.familyInformationDialogForm && this.$refs.familyInformationDialogForm.onCancel()
    },

    // 重制上传的参数关闭对话框
    onResetAndcloseUploadDialog() {
      this.spendTime = 0

      this.percent = 0

      this.status = 0

      this.uploadDialogVisible = false
    },

    // 内层提示对话框关闭的回调方法
    onUploadInnerDialogClose() {
      setTimeout(() => {
        this.onResetAndcloseUploadDialog()
      }, 1000)
    },

    // 提交
    onFamilyInformationDialogFormSubmit(params) {
      const hasNoChange = isEqual(this.originalFamilyInformationDialogFormValues, this.familyInformationDialogFormValues)

      if (hasNoChange) {
        this.$message({
          showClose: true,
          message: '未编辑信息，无须提交审批！',
          duration: 2000,
          type: 'error'
        })
      } else {
        (async () => {
          const url = this.apiUrls['newOrEditUrl']

          await this.operateFamilyPhoneFamilies({ url, params })
        })()
      }

      setTimeout(() =>{
        this.onCloseFamilyInformationDialog()
      }, 1000)
    },

    onOpenFamilyInformationDialog() {
      this.$nextTick(() => {
        const disabledItemKeys = [
          'familyName',
          'criminalName',
          'criminalNumber',
          'replaceName'
        ]

        if (this.familyInformationDialogOperationType) {
          // 编辑
          this.familyInformationDialogFormValues = cloneDeep(this.originalFamilyInformationDialogFormValues)

          this.$set(this.familyInformationDialogFormItems, 'buttons', [{
            add: true,
            text: '提交审批'
          }, 'cancel'])

          this.familyInformationDialogFormItems =Object.assign({}, this.familyInformationDialogFormItems, {
            isPhoneSms: {
              type: 'select',
              label: '是否接听亲情电话',
              options: this.$store.state.isTrue,
              value: 1
            }
          })
        } else {
          // 新增
          this.familyInformationDialogFormValues = {
            isReplace: 1
          }

          this.$set(this.familyInformationDialogFormItems, 'buttons', ['add', 'cancel'])

          delete this.familyInformationDialogFormItems['isPhoneSms']
        }

        disabledItemKeys.forEach(key => {
          if (['replaceName'].includes(key))
            this.$set(
              this.familyInformationDialogFormItems[key],
              'disabled',
              !!this.familyInformationDialogOperationType && !this.familyInformationDialogFormValues['isReplace']
            )

          else this.$set(this.familyInformationDialogFormItems[key], 'disabled', !!this.familyInformationDialogOperationType)
        })
      })
    },

    // 查看已认证家属的信息
    async onViewAuthorizeFamily(familyInformation) {
      const {
        registrationsId,
        familyName,
        relationship
      } = familyInformation

      const data = await http.getRegistrationsDetail({ id: registrationsId })

      this.authorizeFamilyDetail = Object.assign({}, data, { familyName, relationship })

      this.authorizeDialogVisible = true
    },

    // 导出excel
    async onDownloadExcel() {
      this.downloading = true

      const times = DateFormat(Date.now(),'YYYYMMDDHHmmss'),
        tabItem = this.tabsItems.filter(tabItem => tabItem.name === this.tabs),
        TABName = tabItem[0]['label']

      await tokenExcel({
        params: { url: this.apiUrls['exportUrl'], params: { ...this.filter, tab: this.tabs } },
        actionName: 'familyPhone/exportFamilyPhone',
        menuName: `亲情电话家属管理-${ TABName }-${ times }`,
      })

      setTimeout(() => {
        this.downloading = false
      }, 300)
    }
  },

  async mounted() {
    await this.getDatas()
  }
}
</script>

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

.m-excel-download {
  float: none;
}

.authorize-dialog {
  /deep/ .el-dialog__footer {
    padding: 0px 20px 20px 0px;
  }
}
</style>
