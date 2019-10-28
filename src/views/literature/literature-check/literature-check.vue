<template>
  <el-row class="row-container page literature-check">
    <div v-show="activeTabName === 'publish'" class="check-batch">
      <el-button type="primary"
        @click="onPass(selectedLiteraturesId)"
      >
        批量通过
      </el-button>
      <el-button type="primary" @click="onRejectBatch">
        批量不通过
      </el-button>
    </div>
    <m-search ref="search" :items="searchItems" @search="onSearch" clearable />

    <el-tabs v-model="activeTabName" type="card">
      <el-tab-pane name="pass" label="审核通过"/>
      <el-tab-pane name="reject" label="审核不通过"/>
      <el-tab-pane name="publish" label="待审核"/>
    </el-tabs>

    <m-table 
      :data="literatures"
      :cols="tableCols"
      :selection-change="onLiteratureSelectionChange"
    >
      <span
        class="title-cell"
        slot="title"
        slot-scope="scope"
        @click="onPreview(scope.row)"
      >
        {{ scope.row.title }}
      </span>

      <template
        v-if="scope.row.status === 'publish'"
        slot="operate"
        slot-scope="scope"
      >
        <el-button
          type="text"
          size="mini"
          @click="onPass(scope.row.id)"
        >
          通过
        </el-button>
        <el-button
          type="text"
          size="mini"
          @click="onReject(scope.row)"
        >
          不通过
        </el-button>
      </template>
    </m-table>

    <m-pagination
      ref="pagination"
      :total="total"
      @onPageChange="onPageChange"
    />

    <!-- 不通过原因弹窗 -->
    <el-dialog
      :visible.sync="rejectDialogVisible"
      title="不通过审核"
      width="530px"
      @close="onCloseRejectDialog"
    >
      <el-form ref="rejectForm" :model="rejectForm" :rules="rules">
        <el-form-item prop="rejectReason">
          <el-input
            v-model="rejectForm.rejectReason"
            :autosize="{ minRows: 6 }"
            type="textarea"
            placeholder="请填写不通过原因"
          />
        </el-form-item>
        <el-form-item class="operate">
          <el-button @click="hideRejectDialog">取消</el-button>
          <el-button type="danger" @click="onConfirmReject">
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
  name: 'LiteratureCheck',
  mixins: [literatureSearchMixin],
  data() {
    return {
      rejectDialogVisible: false,
      activeTabName: 'publish',
      rejectForm: { rejectReason: '' },
      rules: {
        rejectReason: [
          { required: true, message: '请填写不通过原因', trigger: 'change' },
          {
            max: 20,
            message: '不通过原因不能超过 20 个字符',
            trigger: 'change'
          }
        ]
      },
      // 当前选中的文章列表
      selectedLiteratures: []
    }
  },
  computed: {
    ...mapState('literature', ['literatures']),
    tableCols() {
      const cols = {
        selectCols: [{ type: 'selection' }],
        baseCols: [
          { slotName: 'title', label: '作品标题', showOverflowTooltip: true },
          { prop: 'articleTypeName', label: '作品类型' },
          { prop: 'penName', label: '作者笔名', showOverflowTooltip: true },
          { prop: 'publishAt', label: '发布时间' }
        ],
        passCols: [
          { prop: 'auditAt', label: '审核时间' }
        ],
        rejectCols: [
          { prop: 'auditAt', label: '审核时间' },
          {
            prop: 'rejectReason',
            label: '不通过原因',
            showOverflowTooltip: true
          }
        ],
        publishCols: [
          { prop: 'publishTypeName', label: '待审核作品状态' },
          { slotName: 'operate', label: '审核' }
        ]
      }
      const tableCols = cols.baseCols.concat(
        cols[this.activeTabName + 'Cols'] || []
      )

      if (this.activeTabName === 'publish') {
        tableCols.unshift(...cols.selectCols)
      }

      return tableCols
    },
    selectedLiteraturesId() {
      return this.selectedLiteratures.map(literature => literature.id).join(',')
    }
  },
  methods: {
    ...mapActions('literature', ['getFamilyLiteratures', 'getPoliceLiteratures', 'passLiterature', 'rejectLiterature']),
    onPreview(literature) {
      this.$router.push({
        path: `/literature-check/literature-preview/${literature.id}`,
        query: { status: this.literatureStatus }
      })
    },
    // 通过审核
    async onPass(literaturesId) {
      if (!literaturesId) {
        this.$message.error('请选择需要审批的作品')
        return
      }

      try {
        await this.$confirm("确认通过审核吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });

        const isSuccess = await this.passLiterature({ id: literaturesId })
        isSuccess && this.getTableData()
      } catch (err) {
        console.log(err);
      }
    },
    // 不通过审核
    onReject(literature) {
      this.showRejectDialog()
      this.selectedLiteratures = [literature]
    },
    // 批量不通过审核
    onRejectBatch() {
      if (!this.selectedLiteraturesId) {
        this.$message.error('请选择需要审批的作品')
        return
      }

      this.showRejectDialog()
    },
    onConfirmReject() {
      this.$refs.rejectForm.validate(async valid => {
        if (valid) {
          const isSuccess = await this.rejectLiterature({
            id: this.selectedLiteraturesId,
            rejectReason: this.rejectForm.rejectReason
          })

          if(isSuccess) {
            this.getTableData()
            this.hideRejectDialog()
            this.$refs.rejectForm.resetFields()
          }
        }
      })
    },
    onCloseRejectDialog() {
      this.selectedLiteratures = []
      this.$refs.rejectForm.resetFields()
    },
    onLiteratureSelectionChange(selectedLiteratures) {
      this.selectedLiteratures = selectedLiteratures
    },
    showRejectDialog() {
      this.rejectDialogVisible = true
    },
    hideRejectDialog() {
      this.rejectDialogVisible = false
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

.check-batch {
  float: right;
}

.title-cell {
  color: #409eff;
  cursor: pointer;
}
</style>