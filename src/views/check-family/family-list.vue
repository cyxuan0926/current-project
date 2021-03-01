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
      <el-tabs
        v-if="!isSuperAdmin"
        v-model="tabs"
        type="card"
      >
        <el-tab-pane label="家属信息管理" name="families" />

        <el-tab-pane label="警员家属信息管理" name="jailerFamilies" />
      </el-tabs>

      <m-table-new
        stripe
        :data="families.contents"
        :cols="tableCols"
        class="mini-td-padding"
      >
        <template #idCard="{ row }">
          <m-img-viewer
            :url="row.idCardFront"
            title="身份证正面照"
            isRequired
          />

          <m-img-viewer
            :url="row.idCardBack"
            title="身份证背面照"
            isRequired
          />
        </template>

        <template #prisoners="{ row }">
          <template v-for="prisoner in row.prisonerList">
            <el-button   
              :key="prisoner.prisonerId"
              type="text"
              size="small"
              @click="showPrisonerDetail(prisoner)"
            >{{ prisoner.name }}</el-button>
          </template>
        </template>

        <template #operate="{ row }">
          <el-button
            type="text"
            size="small"
            @click="getFamilyDetail(row.id)"
          >账号信息</el-button>

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

        <template #isSendMessage>
          <!-- 修改 -->
          <!-- <template>
            <span>是/否</span>

            <el-button type="text">修改</el-button>
          </template> -->
          <!-- 保存 -->
          <div class="send-message_save">
            <el-select size="small">
              <el-option />
            </el-select>

            <el-button type="text">保存</el-button>
          </div>
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
          >确定
          </el-button>
        </el-col>
      </el-row>

      <template v-if="operationType === dialogTypes.DETAIL">
        <template v-for="(item, index) in prisonerDetailRows">
          <el-row :key="`id-dialog-${ index }`">
            <template v-for="(children, i) in item">
              <el-col :span="12" :key="`id-dialog-child-${ i }`">
                <label>{{ children.label }}：</label>

                <span v-if="children['prop'] === 'gender'">{{ prisoner.gender | gender }}</span>

                <span v-else>{{ prisoner[children['prop']] }}</span>
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
  </el-row>
</template>

<script>
import {
  mapActions,
  mapState,
  mapGetters
} from 'vuex'

import validator from '@/utils'

import prisons from '@/common/constants/prisons'

import prisonFilterCreator from '@/mixins/prison-filter-creator'

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
        // 罪犯姓名
        prisonerName: {
          type: 'input',
          label: '罪犯姓名',
          miss: false
        },
        // 是否超3位家属
        isMoreThanThree: {
          type: 'select',
          noPlaceholder: true,
          label: '是否超过3位家属',
          options: isBlacklistOptions,
          belong: {
            value: 'value',
            label: 'label'
          },
          miss: false
        },
        // 是否发送短信
        isSendMessage: {
          type: 'select',
          noPlaceholder: true,
          label: '是否发送短信',
          options: isBlacklistOptions,
          belong: {
            value: 'value',
            label: 'label'
          },
          miss: false
        }
      },
      filter: {},
      excelReason: ''
    }
  },

  computed: {
    ...mapState(['families']),

    ...mapGetters(['isSuperAdmin']),

    dialogContent() {
      let title,
        items = {},
        formButton = { buttons: [] }
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
      return {
        title,
        items
      }
    },

    tableCols() {
      const isSuperAdminTableCols = [
        {
          label: '省份',
          prop: ''
        },
        {
          label: '监狱名称',
          prop: ''
        }
      ]

      const familyTableCols = [
        {
          label: '家属姓名',
          prop: 'name'
        },
        {
          label: '身份证信息',
          width: '148px',
          slotName: 'idCard'
        },
        {
          label: '黑名单原因',
          prop: 'reason',
          minWidth: '160px',
          showOverflowtooltip: true
        },
        {
          label: '对应罪犯',
          minWidth: '180px',
          slotName: 'prisoners'
        },
        {
          label: '操作',
          slotName: 'operate'
        },
        {
          label: '是否发送短信',
          slotName: 'isSendMessage',
          minWidth: '100px'
        }
      ]

      const jailerFamiliesTableCols = [
        {
          label: '警员姓名',
          prop: 'policeName'
        },
        {
          label: '警员编号',
          prop: 'policeNumber'
        },
        {
          label: '家属姓名',
          prop: 'familyName'
        },
        {
          label: '家属手机号码',
          prop: 'phone'
        }
      ]

      if (this.isSuperAdmin) return [...isSuperAdminTableCols, ...familyTableCols]

      if (this.tabs === this.tabOptions.FAMILY) return familyTableCols

      else return jailerFamiliesTableCols
    }
  },

  watch: {
    tabs(val) {
      if (val === this.tabOptions.FAMILY) {
        this.resetSearchFilters(['familyName', 'policeName'])
        this.$set(this.searchItems.name, 'miss', false)
        this.$set(this.searchItems.prisonArea, 'miss', false)
        this.$set(this.searchItems.isBlacklist, 'miss', false)
        this.$set(this.searchItems.prisonerName, 'miss', false)
        this.$set(this.searchItems.isMoreThanThree, 'miss', false)
        this.$set(this.searchItems.isSendMessage, 'miss', false)
        this.$set(this.searchItems.familyName, 'miss', true)
        this.$set(this.searchItems.policeName, 'miss', true)
      }
      else {
        this.resetSearchFilters(['name', 'prisonArea', 'isBlacklist', 'prisonerName', 'isMoreThanThree', 'isSendMessage'])
        this.$set(this.searchItems.name, 'miss', true)
        this.$set(this.searchItems.prisonArea, 'miss', true)
        this.$set(this.searchItems.isBlacklist, 'miss', true)
        this.$set(this.searchItems.prisonerName, 'miss', true)
        this.$set(this.searchItems.isMoreThanThree, 'miss', true)
        this.$set(this.searchItems.isSendMessage, 'miss', true)
        this.$set(this.searchItems.familyName, 'miss', false)
        this.$set(this.searchItems.policeName, 'miss', false)
      }
      this.onSearch()
    }
  },

  async mounted() {
    if (this.isSuperAdmin) this.$refs.search.onGetFilter()

    await this.getDatas()
  },

  methods: {
    ...mapActions([
      'getFamilies',
      'addFamilyBlacklist',
      'removeFamilyBlacklist',
      'getPoliceFamilies'
    ]),

    getDatas() {
      if (this.tabs === this.tabOptions.FAMILY) {
        this.getFamilies({
          ...this.filter,
          ...this.pagination
        })
      }

      else {
        this.getPoliceFamilies({
          ...this.filter,
          ...this.pagination
        })
      }
    },

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    getFamilyDetail(e) {
      this.$router.push({
        path: `/family/detail/${ e }`
      })
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
        if (!res) return
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
          if (!res) return
          this.onSearch()
        })
      }).catch(() => {})
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
      if(this.uploadResults.success_total) this.onSearch()
    },

    // 重置搜索组件的filter
    resetSearchFilters(filters = []) {
      filters.map(filter => {
        this.$set(this.searchItems[filter], 'value', '')
        delete this.filter[filter]
      })
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
</style>
