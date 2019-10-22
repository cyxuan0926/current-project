<template>
  <el-row class="row-container page literature-my">
    <div class="header">
      <h3>作品列表</h3>
      <span>共 {{ total }} 部作品</span>
      <el-button type="primary" @click="onCreateArticle">发表作品</el-button>
    </div>

    <el-tabs v-model="activeTabName" type="card">
      <el-tab-pane name="pass" label="我的作品"/>
      <el-tab-pane name="shelf" label="已下架作品"/>
    </el-tabs>

    <m-table :data="literatures" :cols="tableCols">
      <!-- <div class="literature-info-cell" slot="title" slot-scope="scope">
        <div class="cover">
          <img src="/static/images/book-cover.jpg">
        </div>
        <div class="literature-info">
          <el-tooltip :content="scope.row.title" placement="top">
            <h3>{{ scope.row.title }}</h3>
          </el-tooltip>
          <dl>
            <dt>点击数：</dt>
            <dd>{{ scope.row.clientNum }}</dd>
          </dl>
          <dl>
            <dt>点赞数：</dt>
            <dd>{{ scope.row.praiseNum }}</dd>
          </dl>
          <dl>
            <dt>收藏数：</dt>
            <dd>{{ scope.row.collectNum }}</dd>
          </dl>
        </div>
      </div> -->

      <span slot="finish" slot-scope="scope">
        {{ scope.row.finish | literatureStatus }}
      </span>

      <template slot="operate" slot-scope="scope">
        <el-button
          v-if="parseInt(scope.row.articleType) === 1"
          type="primary"
          size="small"
          plain
          @click="onUpdate(scope.row.id)"
        >
          文章管理
        </el-button>
  
        <el-button
          v-if="scope.row.status === 'pass'"
          type="danger"
          size="small"
          plain
          @click="onOffline(scope.row)"
        >
          下架
        </el-button>
        <el-button
          v-else
          :id="'onlineButton' + scope.row.id"
          type="primary"
          size="small"
          plain
          @click="onOnline(scope.row)"
        >
          上架
        </el-button>
        <!-- <el-button type="primary" size="small" plain>
          修改作品
        </el-button> -->
      </template>
    </m-table>

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

    <m-pagination
      ref="pagination"
      :total="total"
      @onPageChange="getTableData"
    />
  </el-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import literatureSearchMixin from '../common/mixins/literature-search'

export default {
  name: 'LiteratureMy',
  mixins: [literatureSearchMixin],
  data() {
    return {
      offlineDialogVisible: false,
      activeTabName: 'pass',
      tableCols: [
        // { slotName: 'title', label: '作品名称', width: '292px' },
        { prop: 'title', label: '作品标题', showOverflowTooltip: true,  minWidth: '130px' },
        { prop: '', label: '封面图', minWidth: '80px' },
        { prop: 'articleTypeName', label: '作品类型', minWidth: '76px' },
        { prop: '', label: '最新发布章节', minWidth: '120px' },
        { slotName: 'finish', label: '作品状态', minWidth: '76px' },
        { prop: 'clientNum', label: '点击数量', minWidth: '70px' },
        { prop: 'praiseNum', label: '点赞数量', minWidth: '70px' },
        { prop: 'collectNum', label: '收藏数量', minWidth: '70px' },
        { prop: 'auditAt', label: '发布时间', minWidth: '124px' },
        { slotName: 'operate', label: '操作', minWidth: '150px' }
      ],
      offlineForm: { offlineReason: '' },
      rules: {
        offlineReason: [
          { required: true, message: '请填写下架原因', trigger: 'change' },
          { max: 20, message: '下架原因不能超过 20 个字符', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState('literature', ['literatures'])
  },
  filters: {
    literatureStatus(finish) {
      return parseInt(finish) === 1 ? '已完结' : ''
    }
  },
  methods: {
    ...mapActions('literature', ['getMyLiteratures', 'offlineLiterature', 'onlineLiterature']),
    onCreateArticle() {
      this.$router.push('/literature-my/literature-create')
    },
    onUpdate(id) {
      this.$router.push(`/literature-my/literature-update/${id}`)
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

h3 {
  margin: 0;
  font-size: 14px;
  font-weight: normal;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  line-height: 36px;

  > span {
    flex: 1;
    margin: 0 20px;
  }
}

.literature-info-cell {
  display: flex;

  .cover {
    display: flex;
    align-items: center;
    width: 70px;
    max-height: 100%;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .literature-info {
    width: 150px;
    margin-left: 20px;
    padding-bottom: 3px;

    h3 {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-bottom: 8px;
    }
    
    dl {
      display: flex;
      align-items: center;
      // justify-content: space-between;
      margin: 0;
      line-height: 18px;
    }
  }
}
</style>