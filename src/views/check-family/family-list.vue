<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
      @searchSelectChange="searchSelectChange"
    >
      <template v-if="tabs === tabOptions.JAILER_FAMILY" slot="append">
        <m-excel-download
          path="/download/downloadfile"
          :params="{ filepath: 'police_template.xlsx' }"
          text="模板"
        />

        <m-excel-upload :get-results="handleGetUploadResults" url="/police/upload" />
      </template>
    </m-search>

    <el-col :span="24">
      <el-tabs v-model="tabs" type="card">
        <el-tab-pane label="家属信息管理" name="families" />

        <template v-if="!$store.getters.isSuperAdmin">
          <el-tab-pane label="警员家属信息管理" name="jailerFamilies" />
        </template>
      </el-tabs>

      <m-table-new
        stripe
        :data="families.contents"
        :cols="tableCols"
        class="mini-td-padding"
      >
        <template #prisoners="{ item }">
          <el-button   
            type="text"
            size="small"
            @click="showPrisonerDetail(item)"
          >{{ item.name | asteriskDisplay('asterisk_name') }}</el-button>
        </template>

        <template #isMsg="{ row }">{{ row.isMsg | isTrue }}</template>

        <template #operate="{ row }">
          <el-button
            type="text"
            size="small"
            @click="onShowFamilyDetail(row)"
          >账号信息</el-button>

          <template v-if="!$store.getters.isSuperAdmin">
            <el-button
              v-if="!row.isBlacklist"
              type="text"
              size="small"
              @click="showBlackList(row)"
            >加入黑名单</el-button>

            <el-button
              v-else
              type="text"
              size="small"          
              @click="removeBlackList(row)"
            >移出黑名单
            </el-button>
          </template>
        </template>

        <template #operation="{ row }">
          <el-button
            type="text"
            size="small"
            @click="onDelete(row.phone)"
          >删除</el-button>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="families.total"
      @onPageChange="getDatas"
    />

    <el-dialog
      :title="dialogContent['title']"
      class="authorize-dialog"
      :width=" operationType === dialogTypes.BLACKLIST ? '530px' : '' "
      :visible.sync="visible"
      @close="handleCloseDialog"
    >
      <el-row v-if="operationType === dialogTypes.UPLOADING">
        <el-col style="line-height: 30px">
          <i class="el-icon-success green" style="font-size: 20px;margin-right: 10px;" />{{!uploadResults.error_total ? `成功导入${uploadResults.success_total}条` : `成功：${uploadResults.success_total}条`}}<br>

          <template v-if="!!uploadResults.error_total">
            <i class="el-icon-error red" style="font-size: 20px; margin-right: 10px;" />失败：{{uploadResults.error_total}}条

            <p style="padding-left: 30px">原因：{{ excelReason }}</p>
          </template>
        </el-col>

        <el-col class="button-box">
          <el-button
            size="small"
            @click="onExcelSure"
            type="primary"
          >确定</el-button>
        </el-col>
      </el-row>

      <template v-if="operationType === dialogTypes.DETAIL">
        <template v-for="(item, index) in prisonerDetailRows">
          <el-row :key="`id-dialog-${ index }`">
            <template v-for="(children, i) in item">
              <el-col :span="12" :key="`id-dialog-child-${ i }`">
                <label>{{ children.label }}：</label>

                <template v-if="children['prop'] === 'gender'">
                  <span>{{ prisoner.gender | gender }}</span>
                </template>

                <template v-else>
                  <span>{{ prisoner[children['prop']] }}</span>
                </template>
                
              </el-col>
            </template>
          </el-row>
        </template>
      </template>

      <m-form
        v-else
        ref="blackListForm"
        :items="dialogContent['items']"
        @submit="handleBlackListReason"
        @cancel="visible = false"
      />
    </el-dialog>

    <el-dialog
      title="账号信息"
      class="authorize-dialog"
      :visible.sync="informationVisible"
      @close="onCloseInformation"
    >
      <div class="detail-container">
        <template v-for="(item, index) in detailItems">
          <div class="detail-item" :key="`id-family-detail-item-${ index }`">
            <label>{{ item.label }}：</label>

            <span>{{ familyInformationDetails[item['prop']] }}</span>
          </div>
        </template>

        <div class="detail-item" style="margin-bottom: 10px;font-weight: bold;">请核对家属信息:</div>

        <div class="img-box">
          <m-img-viewer
            isRequired
            :class="[{ 'el-image__no-box_shadow': !familyInformationDetails.idCardFront }]"
            :url="familyInformationDetails.idCardFront"
            :toolbar="{ prev: 1, next: 1 }"
            title="身份证正面照"
          />

          <m-img-viewer
            isRequired
            :class="[{ 'el-image__no-box_shadow': !familyInformationDetails.idCardBack }]"
            :url="familyInformationDetails.idCardBack"
            :toolbar="{ prev: 1, next: 1 }"
            title="身份证背面照"
          />
        </div>

        <div class="button-box">
          <el-button
            type="primary"
            size="small"
            @click="onCloseInformation"
          >关闭</el-button>
        </div>
    </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import validator from '@/utils'
import prisons from '@/common/constants/prisons'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
// $likePhone $likePrisonerNumber
import { $likeName } from '@/common/constants/const'
import { batchDownloadPublicImageURL } from '@/utils/helper'

const prisonerDetailRows = [
  [
    {
      label: '姓名',
      prop: 'name'
    },
    {
      label: '罪名',
      prop: 'crimes'
    }
  ],
  [
    {
      label: '罪犯编号',
      prop: 'prisonerNumber'
    },
    {
      label: '监区',
      prop: 'prisonArea'
    }
  ],
  [
    {
      label: '性别',
      prop: 'gender'
    },
    {
      label: '关系',
      prop: 'relationship'
    }
  ]
]

const dialogTypes = {
  // 罪犯详情
  DETAIL: 'detail',
  // 黑名单
  BLACKLIST: 'blacklist',

  UPLOADING: 'uploading'
}

const tabOptions = {
  JAILER_FAMILY: 'jailerFamilies',
  FAMILY: 'families'
}

const detailItems = [
  {
    label: '姓名',
    prop: 'name'
  },
  {
    label: '邮编',
    prop: 'postalCode'
  },
  {
    label: '家庭地址',
    prop: 'homeAddress'
  }
]
export default {
  mixins: [prisonFilterCreator],

  data() {
    const isBlacklistOptions = [
      {
        label: '是',
        value: 1
      },
      {
        label: '否',
        value: 0
      }
    ]

    return {
      prisoner: {},
      family: {},
      // 罪犯详情信息行
      prisonerDetailRows,
      operationType: '',
      visible: false,
      dialogTypes,
      tabs: tabOptions.FAMILY,
      tabOptions,
      uploadResults: {},
      searchItems: {
        // 罪犯姓名
        prisonerName: {
          type: 'input',
          label: '罪犯姓名',
          miss: false
        },

        // 家属姓名
        name: {
          type: 'input',
          label: '家属姓名',
          miss: false
        },

        isBlacklist: {
          type: 'select',
          label: '黑名单',
          options: isBlacklistOptions,
          belong: {
            value: 'value',
            label: 'label'
          },
          miss: false
        },

        familyName: {
          type: 'input',
          label: '家属姓名',
          miss: true
        },

        policeName: {
          type: 'input',
          label: '警员姓名',
          miss: true
        },

        // 短信服务是否开通
        isMsg: {
          type: 'select',
          noPlaceholder: true,
          label: '短信服务是否开通',
          options: isBlacklistOptions,
          belong: {
            value: 'value',
            label: 'label'
          },
          miss: false
        }
      },
      filter: {},
      excelReason: '',
      informationVisible: false,
      detailItems
    }
  },

  computed: {
    ...mapState(['families', 'familyInformationDetails']),

    dialogContent() {
      let title
      let items = {}
      let formButton = { buttons: [] }

      switch(this.operationType) {
        case 'detail':
          title = '囚犯信息'
          break
        case 'blacklist':
          title = '加入黑名单'
          formButton.buttons = [
            {
              add: 'add',
              text: '确认'
            },
            {
              cancel: 'cancel',
              type: 'danger'
            }
          ]
          items = Object.assign({},{
            blackListReason: {
              type: 'textarea',
              maxlength: 200,
              noLabel: true,
              placeholder: '请输入加入黑名单理由',
              autosize: { minRows: 5 },
              rules: ['required', 'lengthRange-200'],
              label: '加入黑名单的原因'
            }
          }, formButton)
          break
        case 'uploading':
          title = '警员家属信息导入'
          break
        default:
          break
      }

      return { title, items }
    },

    tableCols() {
      const superAdminFamilyTableCols = [
        {
          label: '省份',
          prop: 'provinceName',
          showOverflowtooltip: true
        },

        {
          label: '监狱名称',
          prop: 'jailName',
          showOverflowtooltip: true
        }
      ]

      const familyTableCols = [
        {
          label: '家属姓名',
          prop: 'name'
          // ...$likeName
        },

        {
          label: '对应罪犯',
          minWidth: '140px',
          prop: 'prisonerList',
          ...$likeName,
          className: '',
          desensitizationColsConfigs: {
            keyWord: 'prisonerId',
            prop: 'name',
            desensitizationColSlotName: 'prisoners'
          }
        },

        {
          label: '黑名单原因',
          prop: 'reason',
          minWidth: '100px',
          showOverflowtooltip: true
        },

        {
          label: '短信服务是否开通',
          slotName: 'isMsg'
        },

        {
          label: '短信服务开通时间',
          minWidth: '100px',
          prop: 'startTime'
        },

        {
          label: '操作',
          slotName: 'operate'
        }
      ]

      const jailerFamiliesTableCols = [
        {
          label: '警员姓名',
          prop: 'policeName'
          // ...$likeName
        },

        {
          label: '警员编号',
          prop: 'policeNumber'
          // ...$likePrisonerNumber
        },

        {
          label: '家属姓名',
          prop: 'familyName'
          // ...$likeName
        },

        {
          label: '家属手机号码',
          prop: 'phone'
          // ...$likePhone
        },

        {
          label: '操作',
          slotName: 'operation'
        }
      ]

      if (this.tabs === this.tabOptions.FAMILY) {
        if (this.$store.getters.isSuperAdmin) return [...superAdminFamilyTableCols ,...familyTableCols]

        else return familyTableCols
      }

      else return jailerFamiliesTableCols
    }
  },

  watch: {
    tabs(val) {
      if (val === this.tabOptions.FAMILY) {
        this.resetSearchFilters(['familyName', 'policeName'])
        this.$set(this.searchItems.name, 'miss', false)
        this.$set(this.searchItems.isBlacklist, 'miss', false)
        this.$set(this.searchItems.prisonerName, 'miss', false)
        this.$set(this.searchItems.isMsg, 'miss', false)
        this.$set(this.searchItems.familyName, 'miss', true)
        this.$set(this.searchItems.policeName, 'miss', true)
      } else {
        this.resetSearchFilters([
          'name',
          'isBlacklist',
          'prisonerName',
          'isMsg'
        ])

        this.$set(this.searchItems.name, 'miss', true)
        this.$set(this.searchItems.isBlacklist, 'miss', true)
        this.$set(this.searchItems.prisonerName, 'miss', true)
        this.$set(this.searchItems.isMsg, 'miss', true)
        this.$set(this.searchItems.familyName, 'miss', false)
        this.$set(this.searchItems.policeName, 'miss', false)
      }

      this.$refs.search.onGetFilter()
      this.onSearch()
    }
  },
  methods: {
    ...mapActions([
      'getFamilies',
      'addFamilyBlacklist',
      'removeFamilyBlacklist',
      'getPoliceFamilies',
      'deletePoliceFamily',
      'getFamilyDetail'
    ]),

    async getDatas() {
      if (this.tabs === this.tabOptions.FAMILY) {
        const inputs = {
          params: {
            ...this.filter,
            ...this.pagination
          },

          url: this.$store.getters.isSuperAdmin ? '/families/page/admin' : '/families/page'
        }

        await this.getFamilies(inputs)
      }

      else {
        await this.getPoliceFamilies({
          ...this.filter,
          ...this.pagination
        })
      }
    },
  
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    async onShowFamilyDetail(row) {
      const { id, idCardBack, idCardFront } = row
      const URLS = { idCardBack, idCardFront }, _key = `familyId_${ id }`
      const result = await Promise.all([this.getFamilyDetail({ id }), batchDownloadPublicImageURL(URLS, _key)])
      const families = {
        ...this.familyInformationDetails,
        ...result[1]
      }

      this.$store.commit('getFamilyDetail', { families })
      this.informationVisible = true
    },

    showPrisonerDetail(prisoner) {
      this.prisoner = prisoner
      this.visible = true
      this.operationType = this.dialogTypes.DETAIL
    },

    showBlackList(e) {
      this.family = Object.assign({}, e)
      this.visible = true
      this.operationType = this.dialogTypes.BLACKLIST
    },

    handleBlackListReason(val) {
      let params = new FormData()
      params.append('familyId', this.family.id)
      params.append('reason', val.blackListReason)
      this.addFamilyBlacklist(params).then(res => {
        if (!res) {
          return
        }

        this.onSearch()
        this.handleCloseDialog()
      })
    },

    removeBlackList(e) {
      this.$confirm(`是否将${ e.name }移出黑名单？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new FormData()
        params.append('familyId', e.id)

        this.removeFamilyBlacklist(params).then(res => {
          if (!res) {
            return
          }

          this.onSearch()
        })
      })
    },

    handleCloseDialog() {
      this.$refs.blackListForm && this.$refs.blackListForm.onCancel()
    },

    handleGetUploadResults(response) {
      this.$message({
        showClose: true,
        message: response.msg,
        duration: 3000,
        type: response.code === 200 ? 'success' : 'error'
      })

      if (response.code === 200) {
        setTimeout(() => {
          this.visible = true
          this.operationType = this.dialogTypes.UPLOADING
          this.uploadResults = response.data

          if (Array.isArray(this.uploadResults['errors_prisoner']) && this.uploadResults['errors_prisoner'].length) {
            const phoneList = this.uploadResults['errors_prisoner'].map(errorPrisoner => {
              return errorPrisoner.phone
            })

            if (phoneList.length > 3) {
              const phoneString = phoneList.slice(0, 3).join('、')
              this.excelReason = `${phoneString}等电话号码与服刑人员家属电话号码相同，请更换其他号码；`
            } else {
              const phoneString = phoneList.join('、')
              this.excelReason = `${phoneString}与服刑人员家属电话号码相同，请更换其他号码；`
            }

            if (Array.isArray(this.uploadResults['errors']) && this.uploadResults['errors'].length) {
              this.excelReason = `${this.excelReason}所有信息均为必填项，请检查文件内容，仔细对照下载的模版数据；`
            }
          } else {
            this.excelReason = '所有信息均为必填项，请检查文件内容，仔细对照下载的模版数据；'
          }
        }, 1000)
      }
    },

    onExcelSure() {
      this.visible = false

      if (this.uploadResults.success_total) {
        this.onSearch()
      }
    },

    // 重置搜索组件的filter
    resetSearchFilters(filters = []) {
      filters.map(filter => {
        this.$set(this.searchItems[filter], 'value', '')
        delete this.filter[filter]
      })
    },

    // 删除
    onDelete(phone) {
      this.$confirm('删除后不可拨打可视电话，你确认删除吗？', '提醒', {
        type: 'warning',
        closeOnClickModal: false,
        callback: async () => {
          const result = await this.deletePoliceFamily(phone)

          if (result) {
            await this.getDatas()
          }
        }
      })
    },

    // 关闭账号信息弹框
    onCloseInformation() {
      this.informationVisible = false
      this.$store.commit('getFamilyDetail', {})
    }
  }
}
</script>

<style lang="scss" scoped>
.cell img{
  width: 126.8px;
  cursor: pointer;
}
.cell {
  button{
    margin-right: 6px;
    &+button{
      margin: 5px 6px 0 0;
    }
  }
}
.button-box {
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.send-message_save {
  display: flex;

  .el-select {
    flex-basis: 60%;
    flex-grow: 0;
  }

  .el-button {
    flex-grow: 1;
  }
}

.detail-container{
  width: 90%;
  margin: auto;
}
.detail-container .detail-item{
  line-height: 24px;
  overflow: hidden;

}
.detail-container .detail-item label{
  width: 100px;
  font-weight: bold;
  float: left;
}
.detail-container .detail-item span{
  width: calc(#{$absolutely-measure} - 100px);
  float: right;
}

.authorize-dialog {
  /deep/ .img-box {
    .el-image {
      width: 40%;
      height: 110px;
      margin-bottom: 5px;
        img {
          width: $absolutely-measure;
          height: $absolutely-measure;
          cursor: pointer;
        }
    }
  }
}
</style>
