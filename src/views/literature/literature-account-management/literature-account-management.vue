<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      clearable
      @search="onSearch">
      <template
        slot="append"
        v-if=" ['5', '-1'].includes(user.role) ">
        <el-button
          type="primary"
          @click="() => {
                operationType = 1
                visible = true
              }">
          新增
        </el-button>
        <m-excel-download
          path="/download/downloadfile"
          :params="{ filepath: 'author_police_template.xls' }"
          text="模板" />
        <m-excel-upload
          :get-results="handleGetUploadResults"
          url="/authorPolice/upload"/>
      </template>
      <template
        slot="append"
        v-if=" user.role === '6' ">
        <el-button
          type="primary"
          :loading="downloading"
          @click="handleExport">
          导出
        </el-button>
      </template>
    </m-search> 
    <el-col :span="24">
      <m-table-new
        stripe
        :data="authors"
        :cols="roleContents['cols']"
        class="mini-td-padding">
        <template
          v-if="['5', '-1'].includes(user.role)"
          #pseudonym="{ row }" >
          <span>{{ row.pseudonym ? row.jailName + '-' + row.pseudonym : '' }}</span>
        </template>
        <template #jailName="{ row }">
          <span>{{ row.jailName === '平台' ? '' : row.jailName }}</span>
        </template>
        <template #provinceName="{ row }">
          <span>{{ row.jailName === '平台' ? '' : row.provinceName }}</span>
        </template>
        <template #operate="{ row }">
            <el-button
              @click="() => {
                row.isEnabled ? operationType = 2 : operationType = 3
                visible = true
                currentAccount = row
              }"
              type="primary"
              size="small"
              plain>{{ row.isEnabled ? '禁用' : '启用'}}</el-button>
          </template>
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="totalPage"
      @onPageChange="getDatas" />
    <el-dialog
      :visible.sync="visible"
      :title="dialogConent['title']"
      class="authorize-dialog"
      :close-on-press-escape="false"
      width="530px"
      @close="handleCloseDialog">
      <el-row v-if=" operationType === 4 ">
        <el-col style="line-height: 30px">
          <i
            class="el-icon-success green"
            style="font-size: 20px;margin-right: 10px;" />{{!uploadResults.error_total ? `成功导入${uploadResults.success_total}条` : `成功：${uploadResults.success_total}条`}}<br>
          <template v-if="!!uploadResults.error_total">
            <i
            class="el-icon-error red"
            style="font-size: 20px; margin-right: 10px;" />失败：{{uploadResults.error_total}}条
            <p style="padding-left: 30px">
              原因：上传的Excel文件内容格式有误，请检查文件内容，仔细对照下载的模版数据
            </p>
          </template>
        </el-col>
        <el-col class="button-box">
          <el-button
            size="small"
            @click="onExcelSure"
            type="primary">
            确定
          </el-button>
        </el-col>
      </el-row>
      <template v-else>
        <el-row
          v-if=" operationType === 3 "
          style="margin-bottom: 5px">
          <el-col>确定启用该用户吗？</el-col>
          <el-col>禁用的原因：</el-col>
        </el-row>
        <m-form
          :items="dialogConent['items']"
          @submit="handleSubmit"
          ref="dialogForm"
          @cancel="visible = false"/>
        </template>
    </el-dialog>  
  </el-row>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { helper } from '@/utils'
import {
  $likeName,
  $likePrisonerNumber,
  $likePhone
} from '@/common/constants/const'
export default {
  data () {
    return {
      searchItems: {},
      totalPage: 0,
      visible: false,
      uploadResults: {},
      currentAccount: {},
      downloading: false,
      operationType: 0 // 0：无操作 1：新增账户 2：禁用 3：启用 4：账户导入
    }
  },
  computed: {
    ...mapState('literature', ['authors']),
    ...mapState({
      user: state => state.global.user
    }),
    dialogConent() {
      let title
      let items = {}
      const formButton = { buttons: [{ add: 'add', text: '确认' }, 'cancel'] }
      const options = [{ label: '男', value: '男' }, { label: '女', value: '女' }]
      const props = { label: 'label', value: 'value' }
      switch(this.operationType) {
        case 1:
          title = '新增账户'
          items = {...{
            formConfigs: { labelWidth: '90px' },
            accountName: {
              type: 'input',
              label: '账户(手机号)',
              rules: [
                'required',
                'phone'
              ],
              clearable: true,
              placeholder: '请输入手机号码'
            },
            policeNumber: {
              type: 'input',
              label: '狱警号',
              rules: [
                'required',
                'tempNumber'
              ],
              clearable: true,
              placeholder: '请输入狱警号(格式为10位以内数字)'
            },
            realName: {
              type: 'input',
              label: '真实姓名',
              rules: ['required'],
              clearable: true
            },
            sex: {
              type: 'select',
              label: '性别',
              rules: ['required'],
              clearable: true,
              options,
              props,
              value: '男'
            }
          }, ...{
            buttons: [
              'add',
              'cancel'
            ]
          }}
          break
        case 2:
          title = '禁用用户'
          items = {...{
            disabledReason: {
              type: 'textarea',
              noLabel: true,
              placeholder: '请输入该用户被禁用的原因',
              label: '该用户被禁用的原因',
              autosize: { minRows: 5 },
              rules: [
                'required',
                'lengthRange-20'
              ]
            }
          }, ...formButton}
          break
        case 3:
          title = '启用用户'
          items = {...{
            showReason: {
              type: 'textarea',
              noLabel: true,
              disabled: true,
              label: '用户被禁用时的原因',
              autosize: { minRows: 5 },
              value: this.currentAccount['disabledReason']
            }
          }, ...formButton}
          break
        case 4:
          title = '账户导入'
          items = {}
          break
        default:
          break
      }
      return { items, title }
    },
    roleContents() {
      let cols, role
      if (['5', '-1'].includes(this.user.role)) role = '0'
      if (this.user.role === '6') role = '6'
      switch(role) {
        case '0':
          cols = [
            {
              label: '序号',
              type: 'index',
              index: this.handleGetIndex
            },
            {
              label: '账户',
              prop: 'accountName',
              ...$likePhone
            },
            {
              label: '真实姓名',
              prop: 'realName',
              ...$likeName
            },
            {
              label: '笔名',
              slotName: 'pseudonym',
            },
            {
              label: '狱警号',
              prop: 'policeNumber',
              ...$likePrisonerNumber
            },
            {
              label: '性别',
              prop: 'sex'
            },
            {
              label: '监狱名称',
              prop: 'jailName',
              slotName: 'jailName'
            },
            {
              label: '省',
              prop: 'provinceName',
              slotName: 'provinceName'
            },
            {
              label: '操作',
              slotName: 'operate',
              align: "center"
            }
          ]
          break
        case '6':
          cols = [
            {
              label: '序号',
              type: 'index',
              index: this.handleGetIndex
            },
            {
              label: '账户',
              prop: 'accountName',
              ...$likePhone
            },
            {
              label: '笔名',
              prop: 'pseudonym'
            },
            {
              label: '操作',
              slotName: 'operate',
              align: "center"
            }
          ]
          break
        default:
          break
      }
      return { cols }
    }
  },
  async mounted() {
    let searchItems
    const options = [
      {
        userLable: '全部',
        userStatus: ''
      },
      {
        userLable: '启用',
        userStatus: 1
      },
      {
        userLable: '禁用',
        userStatus: 0
      }
    ]
    const belong = {
      value: 'userStatus',
      label: 'userLable'
    }
    const commonItems = {
      accountName: {
        type: 'input',
        label: '账户'
      },
      isEnabled: {
        type: 'select',
        label: '用户状态',
        options,
        belong,
        value: ''
      }
    }
    if (['5', '-1'].includes(this.user.role)) {
      this.searchItems = {
        ...commonItems,
        ...{
          policeNumber: {
            type: 'input',
            label: '狱警号'
          },
          realName: {
            type: 'input',
            label: '真实姓名'
          },
        }
      }
    }
    if (this.user.role === '6') this.searchItems = { ...commonItems }
    await this.getDatas()
  },
  methods: {
    ...mapActions('literature', [
      'exportAuthorFamily',
      'addAuthorPolice',
      'getAuthors',
      'enableAuthor'
      ]
    ),
    async getDatas() {
      let url
      const params = { ...this.filter, ...this.pagination }
      if (this.user.role === '6') url = '/authorFamily/page'
      if (['5', '-1'].includes(this.user.role)) url = '/authorPolice/page'
      const res = await this.getAuthors({url, params})
      this.totalPage = res.data.authorsSize
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    handleGetIndex(index) {
      return this.pagination.rows * (this.pagination.page - 1) + index + 1
    },
    async handleSubmit(params) {
      let res
      if(this.operationType === 2 || this.operationType === 3) {
      const { id } = this.currentAccount
      let disabledReason = '', isEnabled, url
      if (this.operationType === 2) {
        disabledReason = params['disabledReason']
        isEnabled = 0
      }
      if (this.operationType === 3) isEnabled = 1
      if(this.user.role === '6') url = '/authorFamily/enabled'
      if(['5', '-1'].includes(this.user.role)) url = '/authorPolice/enabled'
        res = await this.enableAuthor({ url, params: { id, disabledReason, isEnabled } })
      }
      if (this.operationType === 1) {
        const { jailId } = this.user
        const isEnabled = 1
        params = { jailId, ...params, isEnabled }
        res = await this.addAuthorPolice(params)
      }
      this.handleCloseDialog()
      if (res) this.getDatas()
    },
    handleCloseDialog() {
      this.$refs.dialogForm && this.$refs.dialogForm.onCancel()
      this.currentAccount = {}
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
          this.operationType = 4
          this.visible = true
          this.uploadResults = response.data
        }, 1000)
      }
    },
    async handleExport() {
      this.downloading = true
      let link = document.createElement('a'),
        res = await this.exportAuthorFamily(),
        url = helper.createObjectURL(res)
      link.href = url
      link.id = 'linkId'
      link.setAttribute('download', '账户管理记录.xls')
      document.body.appendChild(link)
      document.getElementById('linkId').click()
      document.body.removeChild(document.getElementById('linkId'))
      setTimeout(() => {
        this.downloading = false
      }, 300)
    },
    onExcelSure() {
      this.visible = false
      if(this.uploadResults.success_total) this.onSearch()
    }
  }
}
</script>

<style scoped lang="scss">
.button-box {
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
