<template>
  <el-row class="row-container page literature-management">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
      clearable />

    <el-tabs
      v-model="activeTabName"
      type="card">
      <el-tab-pane
        name="pass"
        label="作品管理"/>
      <el-tab-pane
        name="shelf"
        label="已下架作品"/>
      <el-tab-pane
        name="tipOff"
        label="举报管理"/>
    </el-tabs>

    <m-table-new
      stripe
      :data="literatures"
      :cols="tableCols">
      
      <template #title="{ row }">
        <span
          class="title-cell"
          @click="onPreview(row)">
          {{row.title }}
        </span>
      </template>

      <template
        v-if="activeTabName !== 'shelf'"
        #operate="{ row }">
        <el-row>
          <el-button
            type="danger"
            size="mini"
            plain
            @click="onOffline(row)"
          >
          下架
          </el-button>
        </el-row>
        <el-row>
          <el-button
            v-if="row.reportStatus || activeTabName === 'tipOff'"
            size="mini"
            class="button--neglect"
            @click="onNeglect(row)">
          忽略
          </el-button>
        </el-row>
      </template>

      <template #pass="{ row }">
        <el-button
          v-if="row.status === 'shelf'"
          :id="'onlineButton' + row.id"
          type="primary"
          size="mini"
          plain
          @click="onOnline(row)">
          上架
        </el-button>
      </template>

      <template #tipOffDetails="{ row }">
        <span
          v-if="row.reportStatus"
          class="tip__off-detail"
          @click="onReportDetail(row)">
          详情
        </span>
      </template>

    </m-table-new>

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
    <el-dialog
      title="举报详情"
      class="authorize-dialog dialog--tip_off"
      :visible.sync="tipOffDialogVisible">
      <m-table-new
        :data="tipOffDialogTableData"
        :cols="tipOffDialogTableCols"/>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          @click=" tipOffDialogVisible = false ">关闭</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import lodash from 'lodash'
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
            {
              articleType: 1,
              articleTypeName: '互动文章'
            },
            {
              articleType: 2,
              articleTypeName: '连载小说'
            }
          ],
          belong: {
            value: 'articleType',
            label: 'articleTypeName'
          },
          miss: false
        },
        reportStatus: {
          type: 'select',
          label: '是否被举报',
          noPlaceholder: true,
          options: [
            {
              type: 1,
              typeName: '是'
            },
            {
              type: 0,
              typeName: '否'
            }
          ],
          belong: {
            value: 'type',
            label: 'typeName'
          },
          miss: false
        },
        reportReason: {
          type: 'select',
          label: '举报内容',
          options: [
            {
              tipOffContent: '色情污秽',
              tipOffName: '色情污秽'
            },
            {
              tipOffContent: '垃圾营销',
              tipOffName: '垃圾营销'
            },
            {
              tipOffContent: '谣言',
              tipOffName: '谣言'
            },
            {
              tipOffContent: '政治敏感',
              tipOffName: '政治敏感'
            },
            {
              tipOffContent: '违法信息',
              tipOffName: '违法信息'
            },
            {
              tipOffContent: '侵权(肖像、诽谤等)',
              tipOffName: '侵权(肖像、诽谤等)'
            },
            {
              tipOffContent: '售假举报',
              tipOffName: '售假举报'
            },
            {
              tipOffContent: '其他',
              tipOffName: '其他'
            }
          ],
          belong: {
            value: 'tipOffContent',
            label: 'tipOffName'
          },
          miss: true
        },
        reportTime: {
          type: 'datetimerange',
          startPlaceholder: '被举报开始时间',
          endPlaceholder: '被举报结束时间',
          start: 'reportStartDate',
          end: 'reportEndDate',
          miss: true
        },
        time: {
          type: 'datetimerange',
          startPlaceholder: '发布开始时间',
          endPlaceholder: '发布结束时间',
          start: 'publishStartDate',
          end: 'publishEndDate',
          miss: false
        },
        title: {
          type: 'input',
          label: '作品标题',
          miss: false
        },
        penName: {
          type: 'input',
          label: '笔名',
          miss: false
        }
      },
      offlineForm: { offlineReason: '' },
      rules: {
        offlineReason: [
          {
            required: true,
            message: '请填写下架原因',
            trigger: 'change'
          },
          {
            max: 20,
            message: '下架原因不能超过 20 个字符',
            trigger: 'change'
          }
        ]
      },
      // 当前点击下架的文章
      selectedLiterature: {},
      // 举报对话框显示控制
      tipOffDialogVisible: false,
      // 举报对话框表格的列字段
      tipOffDialogTableCols: [
        {
          prop: 'reportName',
          label: '举报人',
          minWidth: '40%'
        },
        {
          prop: 'createdAt',
          label: '举报时间',
          minWidth: '23%'
        },
        {
          prop: 'reportReason',
          label: '举报内容',
          minWidth: '37%'
        }
      ],
      tipOffDialogTableData: []
    }
  },
  computed: {
    ...mapState('literature', ['literatures']),
    tableCols() {
      const noTipOffCols = [
        {
          prop: 'clientNum',
          label: '点击数量',
          minWidth: '70px'
        },
        {
          prop: 'praiseNum',
          label: '点赞数量',
          minWidth: '70px'
        },
        {
          prop: 'collectNum',
          label: '收藏数量',
          minWidth: '70px'
        },
        {
          prop: 'finishName',
          label: '是否完结',
          minWidth: '70px'
        }
      ]
      const operateCol = [{
        slotName: 'operate',
        label: '操作'
      }]
      const cols = {
        baseCols: [
          {
            type: 'index',
            label: '序号'
          },
          {
            slotName: 'title',
            label: '作品标题',
            showOverflowTooltip: true
          },
          {
            prop: 'articleTypeName',
            label: '作品类型',
            minWidth: '76px'
          },
          {
            prop: 'penName',
            label: '作者笔名',
            showOverflowTooltip: true,
            minWidth: '100px'
          },
          {
            prop: 'publishAt',
            label: '发布时间',
            minWidth: '124px'
          }
          // {
          //   prop: '',
          //   label: '打赏金额（元）'
          // },
          // {
          //   prop: '',
          //   label: '是否置顶'
          // },
        ],
        passCols: [
          ...noTipOffCols,
          {
            prop: 'auditAt',
            label: '审核时间',
            minWidth: '124px'
          },
          {
            slotName: 'tipOffDetails',
            label: '举报详情',
            minWidth: '75px'
          },
          ...operateCol
        ],
        shelfCols: [
          ...noTipOffCols,
          {
            prop: 'shelfAt',
            label: '下架时间',
            minWidth: '124px'
          },
          {
            prop: 'shelfReason',
            label: '下架原因',
            showOverflowTooltip: true
          },
          {
            slotName: 'pass',
            label: '操作',
            minWidth: '70px'
          }
        ],
        tipOffCols: [
          {
            prop: 'reportName',
            label: '举报人',
            showOverflowTooltip: true
          },
          {
            prop: 'createdAt',
            label: '被举报时间',
            minWidth: '124px'
          },
          {
            prop: 'reportReason',
            label: '举报内容',
            showOverflowTooltip: true
          },
          ...operateCol
        ]
      }
      return cols.baseCols.concat(cols[this.activeTabName + 'Cols'] || [])
    }
  },
  methods: {
    ...mapActions('literature', [
      'getFamilyLiteratures',
      'getPoliceLiteratures',
      'offlineLiterature',
      'onlineLiterature',
      'getReportLiteratures',
      'ignoreReportArticles']),
    onPreview(literature) {
      const articleId = this.activeTabName === 'tipOff' ? literature.articleId : literature.id
      this.$router.push(
        `/literature-management/literature-preview/${ articleId }`
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
          const articleId = this.activeTabName === 'tipOff' ? this.selectedLiterature.articleId : this.selectedLiterature.id
          const isSuccess = await this.offlineLiterature({
            id: articleId,
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
    },
    // 忽略举报
    onNeglect(literature) {
      this.$confirm('你确认忽略该举报吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let url
          const { id } = literature
          const params = { id }
          if (this.activeTabName === 'pass') url = '/article/ignoreReportArticle'
          if (this.activeTabName === 'tipOff') url = '/article/ignoreOneReportArticle'
          const res = await this.ignoreReportArticles({ url, params })
          res && this.getTableData()
        }).catch(err => {
          throw err
        })
    },
    // 举报内容详情
    async onReportDetail(literature) {
      let url
      const { id } = literature
      const params = { page: 1, rows: 10000, articleId: id }
      try {
        if (this.isFamilyLiteratureChecker)  url = '/article/findReportPage'
        if (this.isPoliceLiteratureChecker) {
          params.jailId = this.$store.state.global.user.jailId
          url = '/article/findPoliceReportPage'
        }
        this.tipOffDialogTableData = await this.getReportLiteratures({ url, params, type: true })
        this.tipOffDialogVisible = true
      }
      catch (err) {
        throw err
      }
    },
    // 重置搜索框miss状态
    resetSearchMissStatus() {
      Object.keys(this.searchItems).map(item => {
        this.$set(this.searchItems[item], 'miss', false)
      })
    },
    // 重置搜索组件的filter
    resetSearchFilters(filters = []) {
      filters.map(filter => {
        delete this.filter[filter]
      })
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

.title-cell, .tip__off-detail {
  color: #409eff;
  cursor: pointer;
}
.button--neglect {
  margin-left:  0px;
  margin-top: 10px;
}
.dialog--tip_off {
  .el-dialog {
    .dialog-footer {
      button {
        padding: 10px 24px;
      }
    }
  }
}
</style>