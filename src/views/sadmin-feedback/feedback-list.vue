<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-tabs
        value="first"
        type="card">
        <el-tab-pane
          label="意见反馈"
          name="first" />
      </el-tabs>
      <el-table
        :data="feedbacks.contents"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="用户" />
        <el-table-column
          prop="typeName"
          label="反馈类别" />
        <el-table-column
          prop="content"
          show-overflow-tooltip
          label="反馈内容" />
        <el-table-column
          label="反馈图片">
          <template slot-scope="scope">
            {{ scope.row.createdAt | Date }}
          </template>
        </el-table-column>
        <el-table-column
          label="反馈时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | Date }}
          </template>
        </el-table-column>
        <el-table-column
          label="是否答复">
          <template slot-scope="scope">
            {{ scope.row.isReply | isTrue }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="button-column"
              @click="handleReply(scope.row.id)"
              type="primary">
              答复
            </el-button>
            <br>
            <el-button
              size="mini"
              class="button-column"
              @click="onDelete(scope.row.id)"
              type="danger">
              删除
            </el-button>
            <br>
            <el-button
              size="mini"
              type="text"
              style="width: 56px;"
              @click="getDetail(scope.row)">
              详细内容
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="feedbacks.total"
      @onPageChange="getDatas" />
    <el-dialog
      :visible.sync="visible"
      v-if="visible"
      width="600px"
      class="authorize-dialog">
      <span
        slot="title"
        class="tips-title">详细内容</span>
      <div class="dialog-container">
        <div class="detail-item"><label>用户</label><span>{{ feedback.name }}</span></div>
        <div class="detail-item"><label>反馈时间</label><span>{{ feedback.createdAt | Date }}</span></div>
        <div class="detail-item"><label>反馈类别</label><span>{{ feedback.typeName }}</span></div>
        <div class="detail-item"><label>反馈内容</label><span>{{ feedback.content }}</span></div>
        <div
          class="detail-item"
          v-if="feedback.imageUrls.length">
          <label>反馈图片</label>
          <img
            v-for="(img, index) in feedback.imageUrls"
            :key="index"
            :src="img + '?token=' + $urls.token">
        </div>
        <div
          class="detail-item"
          v-if="feedback.answer">
          <label>回复内容</label>
          <span>{{ feedback.answer }}</span>
        </div>
        <div
          id="aaa"
          class="detail-item"><label>回复内容</label>
          <span>
            <el-input
              v-model="answer"
              type="textarea"
              placeholder="请输入内容"
              resize="none" /></span>
        </div>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      searchItems: {
        time: { type: 'datetimerange', start: 'startTime', end: 'endTime' },
        type: { type: 'select', label: '反馈类别', options: [], getting: true, belong: { value: 'id', label: 'name' } },
        isReply: { type: 'select', label: '是否回复', options: [{ value: 1, label: '是' }, { value: 0, label: '否' }] },
        name: { type: 'input', label: '家属姓名' }
      },
      visible: false,
      feedback: {},
      answer: ''
    }
  },
  computed: {
    ...mapState(['feedbacks', 'feedbackTypes'])
  },
  mounted() {
    this.getDatas()
    this.getFeedbackTypes().then(res => {
      if (!res) return
      this.searchItems.type.options = this.feedbackTypes
      this.searchItems.type.getting = false
    })
  },
  methods: {
    ...mapActions(['getFeedbacks', 'getFeedbackTypes', 'deleteFeedback']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.getFeedbacks({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    handleReply(e) {
      console.log(e)
    },
    onDelete(id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteFeedback({ id: id }).then(res => {
          if (res) this.getDatas()
        })
      }).catch(() => {})
    },
    getDetail(e) {
      console.log(e)
      this.feedback = e
      this.visible = true
      setTimeout(() => {
        document.querySelector('#aaa textarea').focus()
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.button-column{
  margin-bottom: 4px;
}
.tips-title{
  display: block;
  text-align: center;
  font-weight: bold;
}
.authorize-dialog{
  .dialog-container{
    max-height: 500px;
    overflow-y: auto;
  }
  label{
    width: 100px;
    text-align: right;
    float: left;
    box-sizing: border-box;
    padding-right: 10px;
    margin-bottom: 0;
  }
  img, video{
    max-width: 400px;
    display: block;
  }
  .detail-item{
    overflow: hidden;
    margin-bottom: 10px;
    span{
      text-align: justify;
      float: left;
      width: 400px;
      word-break: break-all;
    }
  }
}
</style>
