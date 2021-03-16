<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
    >
      <template slot="append">
        <el-button type="primary" @click="onNewFamily">新增</el-button>

        <m-excel-download
          path="/"
          :params="{}"
          text="模板"
        />

        <m-excel-upload ref="mExcelUpload" :configs="excelUploadConfigs" />
      </template>

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

      <m-table-new stripe :cols="tableCols">
        <template #name>
          <el-button type="text">文字按钮</el-button>
        </template>

        <template #operation>
          <el-button type="text" @click="onEdit">编辑</el-button>

          <el-button type="text">详情</el-button>

          <el-button type="text">审核</el-button>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="1"
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
            <span></span>
          </el-col>
          <el-col :span="24">
            <label>关系：</label>
            <span></span>
          </el-col>
        </el-col>
      </el-row>

      <div style="margin-bottom: 10px;">家属信息:</div>

      <div class="img-box">
        <m-img-viewer
          isRequired
          :url="''"
          :toolbar="{ prev: 1, next: 1 }"
          title="身份证正面照"
        />

        <m-img-viewer
          isRequired
          :url="''"
          :toolbar="{ prev: 1, next: 1 }"
          title="身份证背面照"
        />

        <m-img-viewer
          isRequired
          :url="''"
          :toolbar="{ prev: 1, next: 1 }"
          title="头像"
        />
      </div>

      <template>
        <div style="margin-bottom: 10px;">关系证明:</div>

        <div class="img-box">
          <m-img-viewer
            class="relation_img"
            :url="''"
            title="关系证明图"
          />

          <m-img-viewer
            class="relation_img"
            :url="''"
            title="关系证明图"
          />

          <m-img-viewer
            class="relation_img"
            :url="''"
            title="关系证明图"
          />

          <m-img-viewer
            class="relation_img"
            :url="''"
            title="关系证明图"
          />
        </div>
      </template>

      <template>
        <div style="margin-bottom: 10px;">可视电话通知单:</div>

        <div class="img-box">
          <m-img-viewer :url="''" title="可视电话通知单" />
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
          <span>准备导入数据总计：条</span>
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
          <i class="el-icon-success green" style="font-size: 20px;margin-right: 10px;"></i>成功：条<br>

          <i class="el-icon-error red" style="font-size: 20px; margin-right: 10px;"></i>失败：条

          <p style="padding-left: 30px">原因：上传的Excel文件内容格式有误，请检查文件内容，仔细对照下载的模版数据。</p>

          <p style="padding-left: 30px">导入失败数据：
            <m-excel-export
              :filename="familyPhoneFamiliesDataImportExcelConfig.filename"
              :jsonData="[]"
              :header="familyPhoneFamiliesDataImportExcelConfig.header"
              :filterFields="familyPhoneFamiliesDataImportExcelConfig.filterFields"
              :buttonsProps="excelExportButtonProps"
            >导入失败的数据.xls</m-excel-export>
          </p>
        </div>

        <div slot="footer">
          <el-button type="primary" @click="uploadInnerDialogVisible = false">确 定</el-button>
        </div>        
      </el-dialog>
    </el-dialog>
  </el-row>
</template>

<script>
import prisonFilterCreator from '@/mixins/prison-filter-creator'

import { familyPhoneFamiliesDataImportExcelConfig } from '@/common/excel-config'

import { mapActions, mapState } from 'vuex'

import isEqual from 'lodash/isEqual'

import cloneDeep from 'lodash/cloneDeep'

import validator from '@/utils'
export default {
  name: 'FamilyPhone_Families',

  mixins: [prisonFilterCreator],

  data() {
    const tabsItems = [
      {
        label: '亲情电话',
        name: ''
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

      tabs: '0',

      tableCols: [
        {
          type: 'selection'
        },
        {
          label: '家属姓名',
          slotName: 'name'
        },
        {
          label: '家属电话'
        },
        {
          label: '罪犯姓名'
        },
        {
          label: '罪犯编号'
        },
        {
          label: '监区'
        },
        {
          label: '关系'
        },
        {
          label: '新增或编辑时间',
          minWidth: 120
        },
        {
          label: '认证情况'
        },
        {
          label: '家属类型'
        },
        {
          label: '审核状态'
        },
        {
          label: '是否接听电话和发送短信'
        },
        {
          label: '操作',
          slotName: 'operation'
        }
      ],

      searchItems: {
        name: {
          type: 'input',
          label: '家属姓名'
        },

        prisonerName: {
          type: 'input',
          label: '罪犯姓名'
        },

        prisonerNumber: {
          type: 'input',
          label: '罪犯编号'
        },

        status: {
          type: 'select',
          label: '认证情况',
          options: this.$store.state.familyPhoneAuthenticationType
        },

        shenheStatus: {
          type: 'select',
          label: '审核状态',
          options: this.$store.state.familyPhoneCheckType,
          miss: false
        },

        qinqingStatus: {
          type: 'select',
          label: '可否接听亲情电话',
          noPlaceholder: true,
          options: this.$store.state.isTrue,
          miss: false
        },

        jiashustatus: {
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

        name: {
          type: 'input',
          label: '家属姓名',
          rules: ['required'],
          clearable
        },

        phone: {
          type: 'input',
          label: '家属电话',
          rules: ['required'],
          clearable
        },

        fname: {
          type: 'input',
          label: '罪犯姓名',
          rules: ['required'],
          clearable
        },

        number: {
          type: 'input',
          label: '罪犯编号',
          rules: ['required'],
          clearable
        },

        rname: {
          type: 'input',
          label: '关系',
          rules: ['required'],
          clearable
        },

        aname: {
          type: 'select',
          label: '是否替换已有家属',
          rules: ['required'],
          options: this.$store.state.isTrue,
          value: 1,
          controlTheOther: true,
          controlProps: ['bname'],
          func: this.onReplaceFamilyChange
        },

        bname: {
          type: 'input',
          label: '被替换家属姓名',
          dependingRelation: false,
          disableDependingProp: 'aname',
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

      familyPhoneFamiliesDataImportExcelConfig,

      excelExportButtonProps: {
        attrs: {
          type: 'text'
        }
      },

      familyInformationDialogFormValues: {},

      familyInformationDialogOperationType: 0 // 0: 新增 1: 编辑
    }
  },

  computed: {
    ...mapState({
      uploadResult: state => state.global.uploadResult,
      originalFamilyInformationDialogFormValues: state => state.familyInformationDialogFormValues
    })
  },

  watch: {
    tabs(tab) {
      const temp = ['1', '3'], hiddenItems = [
        'shenheStatus',
        'qinqingStatus',
        'jiashustatus'
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

        this.$set(this.searchItems['jiashustatus'], 'miss', true)

        delete this.filter['jiashustatus']

        delete this.searchItems['jiashustatus'].value
      } else if (tab === '0') {
        hiddenItems.forEach(key => {
          this.$set(this.searchItems[key], 'miss', false)
        })
      }

      this.onSearch()
    }
  },

  methods: {
    ...mapActions(['uploadFile']),

    onSearch() {
      console.log(this.filter, this.pagination)
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
      // let count = 0, index = 0

      // // 上次文件的定时器
      // const uploadInterver = setInterval(async () => {
      //   this.status += 1

      //   this.percent += 15

      //   this.spendTime += .5

      //   if (this.status === 4) {
      //     clearInterval(uploadInterver)

      //     // 上次文件到服务器
      //     const isSuccess = await this.uploadFile(file)

      //     if (!isSuccess) {
      //       this.onResetAndcloseUploadDialog()

      //       return
      //     }

      //     // 验证excel的定时器
      //     const validateInterver = setInterval(async () => {
      //       count ++

      //       if (count === 1) {
      //         this.spendTime += 1

      //         // 验证excel
      //         const isSuccess = await this.validateData()

      //         clearInterval(validateInterver)

      //         if (!isSuccess) {
      //           this.onResetAndcloseUploadDialog()

      //           return
      //         }

      //         // 真正上传文件的定时器
      //         const processInterver = setInterval(async () => {
      //           index ++

      //           if (index === 1) {
      //             this.percent += 20

      //             this.spendTime += 1

      //             this.status = this.status + 1

      //             // 真正上传文件
      //             const isSuccess = await this.importData()

      //             clearInterval(processInterver)

      //             if (!isSuccess) {
      //               this.onResetAndcloseUploadDialog()

      //               return
      //             }

      //             this.spendTime += 1

      //             this.status += 1

      //             this.percent = 100

      //             setTimeout(() => {
      //               this.uploadInnerDialogVisible = true
      //             }, 1000)
      //           } else this.spendTime += 1
      //         }, 1000)
      //       } else this.spendTime += 1
      //     }, 1000)
      //   } else this.spendTime += 1
      // }, 500)

      return false
    },

    onChange(file) {
      if (this.familyInformationVisible) return

      if (file) {
        this.uploadDialogVisible = true
      }
    },

    // 是否替换已有家属 change事件触发
    onReplaceFamilyChange(e, prop, item) {
      this.$set(this.familyInformationDialogFormItems['bname'],  'disabled', !e)

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

      this.familyInformationVisible = false
    },

    // 内层提示对话框关闭的回调方法
    onUploadInnerDialogClose() {
      setTimeout(() => {
        this.onCloseFamilyInformationDialog()
      }, 1000)
    },

    onFamilyInformationDialogFormSubmit(model) {
      console.log(model)
      if (this.familyInformationDialogOperationType) {
        const hasNoChange = isEqual(this.originalFamilyInformationDialogFormValues, this.familyInformationDialogFormValues)

        if (hasNoChange) {
          this.$message({
            showClose: true,
            message: '未编辑信息，无须提交审批！',
            duration: 2000,
            type: 'error'
          })

          setTimeout(() =>{
            this.onCloseFamilyInformationDialog()
          }, 1000)
        }
      }
    },

    onOpenFamilyInformationDialog() {
      this.$nextTick(() => {
        const disabledItemKeys = [
          'name',
          'fname',
          'number',
          'bname'
        ]

        disabledItemKeys.forEach(key => {
          if (['bname'].includes(key)) this.$set(this.familyInformationDialogFormItems[key], 'disabled', !!this.familyInformationDialogOperationType && !this.familyInformationDialogFormValues['aname'])

          else this.$set(this.familyInformationDialogFormItems[key], 'disabled', !!this.familyInformationDialogOperationType)
        })

        if (this.familyInformationDialogOperationType) {
          this.familyInformationDialogFormValues = cloneDeep({})

          this.$set(this.familyInformationDialogFormItems, 'buttons', [{
            add: true,
            text: '提交审批'
          }, 'cancel'])
        } else {
          this.familyInformationDialogFormValues = {
            aname: 1
          }

          this.$set(this.familyInformationDialogFormItems, 'buttons', ['add', 'cancel'])
        }
      })
    }
  },

  mounted() {}
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

.m-excel-export {
  float: none;
}

.authorize-dialog {
  /deep/ .el-dialog__footer {
    padding: 0px 20px 20px 0px;
  }
}
</style>
