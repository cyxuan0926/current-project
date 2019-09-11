<template>
  <el-row class="row-container page literature-management">
    <m-search ref="search" :items="searchItems" @search="onSearch" clearable />

    <el-tabs v-model="activeTabName" type="card">
      <el-tab-pane name="pass" label="作品管理"/>
      <el-tab-pane name="shelf" label="已下架作品"/>
    </el-tabs>

    <m-table :data="literatures" :cols="tableCols">
      <span
        class="title-cell"
        slot="title"
        slot-scope="scope"
        @click="onPreview(scope.row)"
      >
        {{ scope.row.title }}
      </span>

      <el-button
        v-if="scope.row.status === 'pass'"
        type="primary"
        size="mini"
        slot="operate"
        slot-scope="scope"
        @click="onOffline(scope.row)"
      >
        下架
      </el-button>
    </m-table>

    <m-pagination
      ref="pagination"
      :total="totalPage"
      @onPageChange="onPageChange"
    />

    <!-- 下架原因弹窗 -->
    <el-dialog
      :visible.sync="offlineDialogVisible"
      title="下架"
      width="530px"
      @close="onCloseDialog"
    >
      <el-form ref="offlineForm" :model="offlineForm" :rules="rules">
        <el-form-item prop="offlineReason">
          <el-input
            v-model="offlineForm.offlineReason"
            :autosize="{ minRows: 6 }"
            type="textarea"
            placeholder="请填写下架原因"
          />
        </el-form-item>
        <el-form-item class="operate">
          <el-button @click="onCancelOffline">取消</el-button>
          <el-button type="danger" @click="onConfirmOffline">
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import literatureSearchMixin from '../common/mixins/literature-search'

export default {
  name: 'LiteratureManagement',
  mixins: [literatureSearchMixin],
  data() {
    return {
      offlineDialogVisible: false,
      activeTabName: 'pass',
      searchItems: {
        articleType: {
          type: 'select',
          label: '作品类型',
          options: [
            { articleType: '', articleTypeName: '全部' },
            { articleType: 1, articleTypeName: '互动文章' },
            { articleType: 2, articleTypeName: '连载小说' }
          ],
          belong: { value: 'articleType', label: 'articleTypeName' },
          value: ''
        },
        time: {
          type: 'datetimerange',
          start: 'publishStartDate',
          end: 'publishEndDate'
        },
        title: { type: 'input', label: '作品标题' },
        penName: { type: 'input', label: '笔名' }
      },
      tableCols: [
        { type: 'index', label: '序号' },
        { slotName: 'title', label: '作品标题' },
        { prop: 'articleTypeName', label: '作品类型' },
        { prop: 'penName', label: '作者笔名' },
        { prop: 'publishAt', width: '126px', label: '发布时间' },
        { prop: 'clientNum', label: '点击数量' },
        { prop: 'praiseNum', label: '点赞数量' },
        { prop: 'collectNum', label: '收藏数量' },
        // {
        //   prop: '',
        //   label: '打赏金额（元）'
        // },
        // {
        //   prop: '',
        //   label: '是否置顶'
        // },
        { prop: 'finishName', label: '是否完结' },
        { slotName: 'operate', label: '操作', },
      ],
      offlineForm: { offlineReason: '' },
      rules: {
        offlineReason: [
          { required: true, message: '请填写下架原因', trigger: 'blur' }
        ]
      },
      // 当前点击下架的文章
      selectedLiterature: {}
    }
  },
  computed: {
    ...mapState('literature', ['literatures']),
    isFamilyLiteratureChecker() {
      return parseInt(this.role) === 6
    }
  },
  methods: {
    ...mapActions('literature', ['getFamilyLiteratures', 'offlineLiterature']),
    initSearchStatus() {
      // 家属作品审核人员，默认查看家属发布的已审核通过（上架状态）作品
      if (this.isFamilyLiteratureChecker) {
        this.literatureStatus = 'pass'
        this.publisher = 1
      }
    },
    onPreview(literature) {
      this.$router.push(
        `/family/literature-management/literature-preview/${literature.id}`
      )
    },
    onOffline(literature) {
      this.showOfflineDialog()
      this.selectedLiterature = literature
    },
    onConfirmOffline() {
      this.$refs.offlineForm.validate(async valid => {
        if (valid) {
          const isSuccess = await this.offlineLiterature({
            id: this.selectedLiterature.id,
            shelfReason: this.offlineForm.offlineReason
          })

          if(isSuccess) {
            this.getTableData()
            this.hideOfflineDialog()
            this.$refs.offlineForm.resetFields()
          }
        }
      })
    },
    onCancelOffline() {
      this.hideOfflineDialog()
      this.$refs.offlineForm.resetFields()
    },
    onCloseDialog() {
      this.hideOfflineDialog()
      this.$refs.offlineForm.resetFields()
    },
    showOfflineDialog() {
      this.offlineDialogVisible = true
    },
    hideOfflineDialog() {
      this.offlineDialogVisible = false
    },
    async getTableData () {
      const params = {
        // type: this.publisher,
        status: this.literatureStatus,
        ...this.filter,
        ...this.pagination
      }

      this.isGettingTableData = true

      if (this.isFamilyLiteratureChecker) {
        const res = await this.getFamilyLiteratures(params)
        console.log(params)
        this.totalPage = res.data.total
        this.isGettingTableData = false
      }

    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 10px 20px;
}

.operate {
  margin-top: -5px;
  margin-bottom: 15px;
  text-align: right;
}

.title-cell {
  display: block;
  overflow: hidden;
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #409eff;
  cursor: pointer;
}
</style>