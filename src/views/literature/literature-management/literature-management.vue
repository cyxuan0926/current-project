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
        type="danger"
        size="mini"
        slot="shelf"
        slot-scope="scope"
        plain
        @click="onOffline(scope.row)"
      >
        下架
      </el-button>
      <el-button
        v-if="scope.row.status === 'shelf'"
        :id="'onlineButton' + scope.row.id"
        type="primary"
        size="mini"
        slot="pass"
        slot-scope="scope"
        plain
        @click="onOnline(scope.row)"
      >
        上架
      </el-button>
    </m-table>

    <m-pagination
      ref="pagination"
      :total="total"
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
          <el-button @click="hideOfflineDialog">取消</el-button>
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
      offlineForm: { offlineReason: '' },
      rules: {
        offlineReason: [
          { required: true, message: '请填写下架原因', trigger: 'change' },
          { max: 20, message: '下架原因不能超过 20 个字符', trigger: 'change' }
        ]
      },
      // 当前点击下架的文章
      selectedLiterature: {}
    }
  },
  computed: {
    ...mapState('literature', ['literatures']),
    tableCols() {
      const cols = {
        baseCols: [
          { type: 'index', label: '序号' },
          { slotName: 'title', label: '作品标题', showOverflowTooltip: true },
          { prop: 'articleTypeName', label: '作品类型' },
          { prop: 'penName', label: '作者笔名' },
          { prop: 'publishAt', width: '124px', label: '发布时间' },
          { prop: 'clientNum', label: '点击数量', width: '80px' },
          { prop: 'praiseNum', label: '点赞数量', width: '80px' },
          { prop: 'collectNum', label: '收藏数量', width: '80px' },
          // {
          //   prop: '',
          //   label: '打赏金额（元）'
          // },
          // {
          //   prop: '',
          //   label: '是否置顶'
          // },
          { prop: 'finishName', label: '是否完结', width: '80px' }
        ],
        passCols: [
          { prop: 'auditAt', label: '审核时间' },
          { slotName: 'shelf', label: '操作' }
        ],
        shelfCols: [
          { prop: 'shelfAt', label: '下架时间', width: '124px' },
          { prop: 'shelfReason', label: '下架原因', showOverflowTooltip: true },
          { slotName: 'pass', label: '操作' }
        ]
      }

      return cols.baseCols.concat(cols[this.activeTabName + 'Cols'] || [])
    },
  },
  methods: {
    ...mapActions('literature', ['getFamilyLiteratures', 'getPoliceLiteratures', 'offlineLiterature', 'onlineLiterature']),
    onPreview(literature) {
      this.$router.push(
        `/literature-management/literature-preview/${literature.id}`
      )
    },
    onOffline(literature) {
      this.showOfflineDialog()
      this.selectedLiterature = literature
    },
    async onOnline(literature) {
      const content = `下架原因：${literature.shelfReason}`

      try {
        const pass = await this.$confirm(content, '该作品确定上架吗？')

        if (pass) {
          const isSuccess = await this.onlineLiterature({ id: literature.id })

          isSuccess && this.getTableData()
        }
      } catch (err) {
        console.log(err)
      }

      document.querySelector(`#onlineButton${literature.id}`).blur()
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
    onCloseDialog() {
      this.$refs.offlineForm.resetFields()
    },
    showOfflineDialog() {
      this.offlineDialogVisible = true
    },
    hideOfflineDialog() {
      this.offlineDialogVisible = false
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
  color: #409eff;
  cursor: pointer;
}
</style>