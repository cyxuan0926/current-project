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
        v-if=" role === '5' ">
        <el-button
          type="primary"
          @click="() => {
                operationType = 1
                visible = true
              }">
          新增
        </el-button>
        <m-excel-download
          path="/"
          :params="{ filepath: '' }"
          text="模板" />
        <m-excel-upload
          :get-results="handleGetUploadResults"
          url=""/>
      </template>
      <template
        slot="append"
        v-if=" role === '6' ">
        <el-button type="primary" :loading="downloading" @click="handleExport">
          导出
        </el-button>
      </template>
    </m-search> 
    <el-col :span="24">
      <m-table
        :data="roleContents['tableData']"
        :cols="roleContents['cols']"
        class="mini-td-padding">
        <template
          slot-scope="scope"
          slot="operate">
            <el-button
              @click="() => {
                scope.row.isEnabled ? operationType = 2 : operationType = 3
                visible = true
                currentAccount = scope.row
              }"
              type="primary"
              plain>{{ scope.row.isEnabled ? '禁用' : '启用'}}</el-button>
          </template>
      </m-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="totalPage"
      @onPageChange="getDatas" />
    <el-dialog
      :visible.sync="visible"
      :title="dialogConent['title']"
      class="authorize-dialog"
      width="530px"
      @close="handleCloseDialog">
      <el-row v-if=" operationType === 4 ">
        <el-col style="line-height: 30px">
          <i
            class="el-icon-success green"
            style="font-size: 20px;margin-right: 10px;" />成功：条<br>
          <i
            class="el-icon-error red"
            style="font-size: 20px; margin-right: 10px;" />失败：条
          <p style="padding-left: 30px">
            原因：上传的Excel文件内容格式有误，请检查文件内容，仔细对照下载的模版数据
          </p>
        </el-col>
        <el-col class="button-box">
          <el-button
            size="small"
            @click="visible = false"
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
export default {
  data () {
    let searchItems, options = [ {userLable: '全部', userStatus: '' }, {userLable: '启用', userStatus: 1 }, {userLable: '禁用', userStatus: 0 } ],
    commonItems = {
      accountName: { type: 'input', label: '账户' },
      isEnabled: {
        type: 'select',
        label: '用户状态',
        options,
        belong: { value: 'userStatus', label: 'userLable' },
        value: ''}}
    if ( this.role === '5') {
      searchItems = {
        ...commonItems,
        ...{
          policeNumber: { type: 'input', label: '狱警号' },
          realName: { type: 'input', label: '真实姓名' },
        }
      }
    }
    if (this.role === '6') searchItems = { ...commonItems }
    return {
      searchItems,
      totalPage: 0,
      visible: false,
      uploadResults: {},
      currentAccount: {},
      downloading: false,
      operationType: 0 // 0：无操作 1：新增账户 2：禁用 3：启用 4：账户导入
    }
  },
  mounted() {
    this.getDatas()
  },
  props: {
    role: String,
    jailId: Number
  },
  computed: {
    ...mapState('literature', ['authorFamiles']),
    dialogConent() {
      let title, items = {}, formButton = { buttons: [{ add: 'add', text: '确认' }, 'cancel'] }
      switch(this.operationType) {
        case 1:
          title = '新增账户'
          items = {...{
            formConfigs: { labelWidth: '90px' },
            accountName: { type: 'input', label: '账户', rules: ['required'], clearable: true, placeholder: '请输入手机号码' },
            policeNumber: { type: 'input', label: '狱警号', rules: ['required'], clearable: true },
            realName: { type: 'input', label: '真实姓名', rules: ['required'], clearable: true },
            sex: { type: 'select', label: '性别', rules: ['required'], clearable: true, options: [{ label: '男', value: 'm' }, { label: '女', value: 'f' }], props: { label: 'label', value: 'value' }, value: 'm' }
          }, ...{
            buttons: ['add', 'cancel']
          }}
          break
        case 2:
          title = '禁用用户'
          items = {...{
            disabledReason: { type: 'textarea', noLabel: true, placeholder: '请输入该用户被禁用的原因', label: '该用户被禁用的原因', autosize: { minRows: 5 }, rules: ['required', 'lengthRange-100'] }
          }, ...formButton}
          break
        case 3:
          title = '启用用户'
          items = {...{
            showReason: { type: 'textarea', noLabel: true, disabled: true, label: '用户被禁用时的原因', autosize: { minRows: 5 }, value: this.currentAccount['disabledReason'] }
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
      let cols, tableData
      switch(this.role) {
        case '5':
          cols = [
            {
              label: '序号',
              type: 'index',
              index: this.handleGetIndex
            },
            {
              label: '账户'

            },
            {
              label: '真实姓名'
            },
            {
              label: '笔名'
            },
            {
              label: '狱警号'
            },
            {
              label: '性别'
            },
            {
              label: '监狱名称'
            },
            {
              label: '省'
            },
            {
              label: '头像'
            },
            {
              label: '操作'
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
              prop: 'accountName'
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
          tableData = this.authorFamiles
          break
        default:
          break
      }
      return { cols, tableData }
    }
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions('literature', ['getAuthorFamily', 'enableAuthorFamily', 'exportAuthorFamily']),
    async getDatas() {
      let res
      const params = { ...this.filter, ...this.pagination }
      if (this.role === '6') {
        res = await this.getAuthorFamily(params)
        this.totalPage = res.data.authorsSize
      }
      if (this.role === '5') res = 2
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    handleGetIndex(index) {
      return this.pagination.rows * (this.pagination.page - 1) + index + 1
    },
    async handleSubmit(params) {
      const { id } = this.currentAccount
      if(this.operationType === 2 || this.operationType === 3) {
        let disabledReason, isEnabled
        if (this.operationType === 2) {
          disabledReason = params['disabledReason']
          isEnabled = 0
        }
        if (this.operationType === 3) {
          disabledReason = ''
          isEnabled = 1
        }
        await this.enableAuthorFamily({ id, disabledReason, isEnabled })
        this.handleCloseDialog()
        this.getDatas()
      }
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
