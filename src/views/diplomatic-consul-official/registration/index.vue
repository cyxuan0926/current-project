<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-excel-download
      v-if="hasOnlyAllPrisonQueryAuth"
      path="/download/exportDiplomatsRegistrations"
      :params="filter"
    />

    <m-search
      ref="search"
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    />

    <el-col :span="24">
      <el-tabs
        v-model="tabs"
        type="card">
        <el-tab-pane 
          v-for="tab in tabOptions"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        />
      </el-tabs>

      <m-table-new
        ref="m-table"
        :cols="tableCols"
        :data="pageData.content"
      >
        <template #createdAt="{ row }">{{ row.createdAt | Date }}</template>

        <!-- <template #idCards="{ row }">
          <template v-for="(item, index) in row.diplomaticConsulOfficialUrls">
            <m-img-viewer 
              :key="index"
              :url="item.url"
              isRequired
              :toolbar="{ prev: 1, next: 1 }"
              :title="item.title"
              :class="[
                { 'img-viewer__hidden': item.type >= 2 },
                'img-viewer__overflow-unset'
              ]"
            />
          </template>
        </template> -->

        <template #status="{ row }">{{ row.status | diplomaticConsulOfficialStatus }}</template>

        <template #auditInformation="{ row }">
          <template v-if="row.auditAt">
            {{ row.auditRealName }} ({{ row.auditUserName }})<br >

            {{ row.auditAt | Date }}
          </template>
        </template>

        <template #operation="{ row }">
          <el-button
            v-if="row.status === 'PENDING'"
            size="mini"
            @click="onShow(row)">授权</el-button>

          <el-button
            v-if="row.status === 'PASSED'"
            size="mini"
            @click="onShow(row, 'callback')">撤回</el-button>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="pageData.totalCount"
      @onPageChange="getDatas"
    />

    <el-dialog
      :visible.sync="show.visible"
      class="authorize-dialog"
      :title="show.callback ? '撤回' : '授权'"
      :close-on-click-modal="false"
      width="530px"
      @close="onCloseAuthorize"
    >
      <family-detail-information
        :elItems="registrationInformationItems"
        :detailData="registrant"
      >
        <template #familyInformation="{ scope }">
          <div class="img-items">
            <template v-for="(item, index) in scope.diplomaticConsulOfficialUrls">
              <m-img-viewer
                isRequired
                :class="[{'el-image__no-box_shadow': !item.url}]"
                :key="index"
                :url="item.url"
                :toolbar="{ prev: 1, next: 1 }"
                :title="item.title"
              />
            </template>
          </div>       
        </template>

        <template #familyMeetNoticeInformation="{ scope }">
          <div class="img-items">
            <m-img-viewer
              isRequired
              :class="[{'el-image__no-box_shadow': !scope.meetNoticeUrl}]"
              :url="scope.meetNoticeUrl"
              title="审批单"
            />
          </div>
        </template>
      </family-detail-information>

      <template>
        <div
          v-if="!show.agree && !show.disagree && !show.callback && !show.multistageExamine"
          class="button-box">
          <repetition-el-buttons :buttonItems="authorizeButtons" />
        </div>
      </template>

      <!-- <div v-if="show.multistageExamine" class="button-box more-button__box">
        <div style="margin-bottom: 10px;">初审意见：</div>

        <m-form
          class="multistage_examine-form"
          ref="diplomatic-multistage_examine-form"
          :items="firstLevelExamineFormItems"
          @submit="onMultistageExamineCheck"
        />

        <repetition-el-buttons :buttonItems="showMultistageExamineButtons" />
      </div> -->

      <template>
        <div
          v-if="show.agree"
          class="button-box">
          <repetition-el-buttons :buttonItems="showAgreeButtons" />
        </div>
      </template>

      <template v-if="show.disagree">
        <div class="button-box">
          <div style="margin-bottom: 10px;">请选择驳回原因</div>

          <el-select v-model="remarks">
            <el-option
              v-for="remark in defaultRemarks"
              :value="remark"
              :label="remark"
              :key="remark"
            />
          </el-select>

          <m-form
            v-if="remarks === '其他'"
            class="withdraw-box"
            ref="refuseForm"
            :items="authorizeFormItems"
            @submit="onAuthorization($event, 'DENIED')"
          />

          <repetition-el-buttons :buttonItems="showDisagreebuttons" />
        </div>
      </template>

      <template v-if="show.callback">
        <div class="button-box">
          <div style="margin-bottom: 10px;">请选择撤回原因</div>

          <el-select v-model="remarks">
            <el-option
              v-for="remark in defaultRemarks"
              :value="remark"
              :label="remark"
              :key="remark"
            />
          </el-select>

          <m-form
            class="withdraw-box"
            ref="withdrawForm"
            :items="callbackFormItems"
            @submit="onAuthorization($event, 'WITHDRAW')"
          />

          <repetition-el-buttons :buttonItems="callbackButtons" />
        </div>
      </template>
    </el-dialog>
  </el-row>
</template>

<script>

import prisonFilterCreator from '@/mixins/prison-filter-creator'

import registrationDialogCreator from '@/mixins/registration-dialog-creator'

import { mapState, mapActions } from 'vuex'

import { $likeName, $likeIdCard } from '@/common/constants/const'
export default {
  mixins: [prisonFilterCreator, registrationDialogCreator],

  data() {
    const tabOptions = [
      {
        label: '外交领事官员注册',
        name: 'diplomaticConsulOfficial'
      },
      {
        label: '未授权',
        name: 'PENDING'
      }
    ]

    const searchItems = {
      name: {
        type: 'input',
        label: '姓名'
      },

      orgName: {
        type: 'select',
        label: '所在机构',
        filterable: true,
        getting: false
      },

      auditName: {
        type: 'input',
        label: '审核人',
        miss: true
      },

      status: {
        type: 'select',
        label: '审核状态',
        options: this.$store.state.diplomaticConsulOfficialStatus,
        miss: true
      },

      auditAt: {
        type: 'date',
        label: '审核时间',
        miss: true
      }
    }
    return {
      tabOptions,

      tabs: 'PENDING',

      searchItems,

      show: {
        visible: false,

        agree: false,

        disagree: false,

        callback: false,

        multistageExamine: false
      },

      registrationInformationItems: [
        {
          label: '请核对申请人信息',
          prop: 'familyInformation',
          definedClass: 'img-box'
        },
        {
          label: '审批单',
          prop: 'familyMeetNoticeInformation',
          definedClass: 'img-box'
        }
      ],

      registrant: {}
    }
  },

  watch: {
    tabs(tab) {
      this.$refs.search.onSearch('tabs')

      if (tab === 'PENDING') {
        this.$set(this.searchItems['auditName'], 'miss', true)

        this.$set(this.searchItems['status'], 'miss', true)

        this.$set(this.searchItems['auditAt'], 'miss', true)

        delete this.filter.auditName

        delete this.filter.status

        delete this.filter.auditAt

        this.$set(this.searchItems['auditName'], 'value', '')

        this.$set(this.searchItems['status'], 'value', '')

        this.$set(this.searchItems['auditAt'], 'value', '')
      } else {
        delete this.filter.status

        this.$set(this.searchItems['auditName'], 'miss', false)

        this.$set(this.searchItems['status'], 'miss', false)

        this.$set(this.searchItems['auditAt'], 'miss', false)
      }

      if (this.hasOnlyAllPrisonQueryAuth || this.hasProvinceQueryAuth) {
          this.$set(this.searchItems['orgName'], 'miss', true)

          delete this.filter.orgName

          this.$set(this.searchItems['orgName'], 'value', '')
      } else {
        this.$set(this.searchItems['orgName'], 'miss', false)
      }

      this.onSearch()
    }
  },

  computed: {
    ...mapState('diplomaticConsulOfficial', ['pageData', 'isSuccessDiplomaticFirstLevelAuthorize']),

    ...mapState([
      'registRemarks',
      'organizationNames'
    ]),

    defaultRemarks() {
      let copyRemarks = this.registRemarks.slice(0)

      copyRemarks.splice(1, 2)

      return copyRemarks
    },

    callbackFormItems() {
      const { refuseRemark } = this.authorizeFormItems

      return {
        withdrawReason: {
          ...refuseRemark,
          label: '撤回理由...'
        }
      }
    },

    callbackButtons() {
      const [ submitButton ] = this.showDisagreebuttons

      return [
        submitButton,
        this.closeButton
      ]
    },

    tableCols() {
      const allCols = [
        {
          label: '省份',
          prop: 'provinceName',
          minWidth: 100
        },
        {
          label: '监狱名称',
          prop: 'jailName',
          showOverflowTooltip: true
        },
        {
          label: '姓名',
          prop: 'name',
          ...$likeName
        },
        {
          label: '证件号',
          prop: 'uuid',
          ...$likeIdCard
        },
        {
          label: '身份证件有效期至',
          prop: 'idValidDate',
          minWidth: 120
        },
        {
          label: '申请时间',
          slotName: 'createdAt',
          minWidth: 130
        },
        {
          label: '所在机构/馆名',
          prop: 'orgName',
          minWidth: 110,
          showOverflowTooltip: true
        },
        {
          label: '职位',
          prop: 'positionName',
          minWidth: 100,
          showOverflowTooltip: true
        },
        {
          label: '申请状态',
          slotName: 'status'
        },
        {
          label: '审核信息',
          slotName: 'auditInformation',
          minWidth: 130,
          showOverflowTooltip: true
        },
        {
          label: '操作',
          slotName: 'operation',
          minWidth: 60
        }
      ]

      if (this.hasOnlyAllPrisonQueryAuth || this.hasProvinceQueryAuth) allCols.splice(-1, 1)

      else allCols.splice(0, 2)

      return allCols
    }
  },

  methods: {
    ...mapActions('diplomaticConsulOfficial', [
      'getPageData',
      'registrationAuthorize'
    ]),

    ...mapActions(['getOrgName', 'firstLevelAuthorize']),

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    async getDatas() {
      const url = '/diplomats/registrations/page'

      if (this.tabs !== 'diplomaticConsulOfficial') this.$set(this.filter, 'status', this.tabs)

      if (this.hasOnlyAllPrisonQueryAuth || this.hasProvinceQueryAuth) this.$set(this.filter, 'type', 1)

      else this.$set(this.filter, 'type', 2)

      const params = {
        ...this.filter,
        ...this.pagination
      }

      await this.getPageData({ url, params })
    },

    // 授权/撤回 操作显示对话框
    onShow(registrant, status) {
      this.registrant = registrant

      this.show.disagree = false

      this.show.agree = false

      this.show.callback = false

      if (status === 'callback') this.show.callback = true

      this.show.visible = true
    },

    //覆盖mixin 关闭对话框
    onCloseAuthorize() {
      this.show.visible = false

      this.remarks = '身份信息错误'

      if (this.$refs.refuseForm) this.$refs.refuseForm.onCancel()

      if (this.$refs.withdrawForm) this.$refs.withdrawForm.onCancel()
    },

    //覆盖mixin 授权情况下的不同意
    onDisagreeAuthorize() {
      this.show.disagree = true
    },

    //覆盖mixin 授权情况下的同意
    onAgreeAuthorize() {
      this.show.agree = true
    },

    //覆盖mixin 授权对话框同意情况下的确认操作
    async onPassedAuthorize() {
      const { id } = this.registrant

      const params = { id, status: 'PASSED' }

      this.buttonLoading = true

      await this.onAuthorization(params)
    },

    //覆盖mixin 授权对话框同意情况下的返回操作
    onAgreeAuthorizeGoBack() {
      this.show.agree = false
    },

    //覆盖mixin 授权不同意/撤回 情况下的提交操作
    onDeniedSubmit() {
      const { id } = this.registrant

      this.buttonLoading = true

      if (this.show.callback) {
        // 撤回
        this.$refs.withdrawForm.onSubmit()
      } else {
        // 不同意
        if (this.remarks === '其他') this.$refs.refuseForm.onSubmit()
        else this.onAuthorization({ id, remarks: this.remarks.replace(/\s*/g, '') }, 'DENIED')
      }
    },

    //覆盖mixin 授权对话框不同意情况下的返回操作
    onDisagreeAuthorizeGoBack() {
      this.show.disagree = false

      this.remarks = '身份信息错误'

      if (this.$refs.refuseForm) this.$refs.refuseForm.onCancel()
    },

    // 审批操作
    async onAuthorization(...args) {
      const [ filterParams, status ] = args

      let params

      if (!status) params = filterParams

      else {
        const { id } = this.registrant

        params = {
          id,
          status,
          remarks: this.remarks
        }

        if (status === 'DENIED' && this.remarks === '其他') {
          const { refuseRemark } = filterParams

          params = {
            ...params,
            remarks: refuseRemark.replace(/\s*/g, '')
          }
        }

        if (status === 'WITHDRAW') {
          let { withdrawReason } = filterParams

          withdrawReason = withdrawReason.replace(/\s*/g, '')

          params = {
            ...params,
            withdrawReason
          }
        }
      }

      const res = await this.registrationAuthorize(params)

      this.buttonLoading = false

      if (res) {
        this.onCloseAuthorize()

        this.getDatas()
      }
    },

    async onMultistageExamineCheck(params) {
      const { id } = this.registrant

        const { remarks } = params

        this.buttonLoading = true

        await this.firstLevelAuthorize({
          params: {
            id,
            remarks
          },

          url: '/diplomats/registrations/firstLevelAuthorize',

          mutationName: 'diplomaticConsulOfficial/setIsSuccessDiplomaticFirstLevelAuthorize'
        })

        this.buttonLoading = false

        if (this.isSuccessDiplomaticFirstLevelAuthorize) {
          this.onCloseAuthorize()

          this.getDatas()
        }
    },

    // 覆盖mixin 高级审批提交情况下的提交操作
      onMultistageExamineGoSubmit() {
        this.show.multistageExamine = true

        this.buttonLoading = false
      },

      // 覆盖mixin 高级审批提交情况下的返回操作
      onMultistageExamineGoBack() {
        this.show.multistageExamine = false

        this.$refs['diplomatic-multistage_examine-form'].handleResetField()
      },

      // 覆盖mixin 高级审批提交情况下的确认操作
      onMultistageExamineSubmit() {
        this.$refs['diplomatic-multistage_examine-form'].onSubmit()
      },
  },

  async mounted() {
    if (this.hasOnlyAllPrisonQueryAuth || this.hasProvinceQueryAuth) {
      this.$set(this.searchItems['orgName'], 'miss', true)
    } else {
      const { jailId } = this.$store.state.global.user

      this.$set(this.searchItems['orgName'], 'miss', false)

      this.$set(this.searchItems['orgName'], 'getting', true)

      await this.getOrgName({ jailId })

      this.$set(this.searchItems['orgName'], 'options', this.organizationNames)

      this.$set(this.searchItems['orgName'], 'getting', false)
    }

    await this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
/deep/ .img-box {
  flex-direction: column !important;
  .img-items {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    .el-image {
      width: 32%;
      height: 110px;
      margin-bottom: 5px;
      img {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
  }
}
.button-box {
  /deep/ .el-button {
    width: 23% !important;
    &:first-of-type {
      margin-left: 0px !important;
    }
  }
}
.more-button__box {
  /deep/ .el-button {
    &:first-of-type {
      width: 31% !important;
    }
  }
}
</style>
