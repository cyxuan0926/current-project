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
          label="监狱长信箱"
          name="first" />
      </el-tabs>
      <el-table
        :data="mailboxes.contents"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="用户" />
        <el-table-column
          prop="typeName"
          label="信件类别" />
        <el-table-column
          prop="contents"
          show-overflow-tooltip
          label="信件内容" />
        <el-table-column
          label="图片">
          <template slot-scope="scope">
            <m-img-viewer
              v-if="scope.row.imageUrls.length"
              :src="scope.row.imageUrls[0] + '?token=' + $urls.token" />
          </template>
        </el-table-column>
        <el-table-column
          label="发件时间">
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
              v-if="!scope.row.isReply"
              size="mini"
              class="button-column"
              @click="handleReply(scope.row)"
              type="primary">
              答复
            </el-button>
            <el-button
              v-else
              size="mini"
              class="button-column"
              disabled
              type="primary">
              已答复
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
      :total="mailboxes.total"
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
        <div class="detail-item"><label>用户</label><span>{{ mailbox.familyName || mailbox.name }}</span></div>
        <div class="detail-item"><label>发件时间</label><span>{{ mailbox.createdAt | Date }}</span></div>
        <div class="detail-item"><label>信件类别</label><span>{{ mailbox.typeName }}</span></div>
        <div class="detail-item"><label>信件内容</label><span>{{ mailbox.contents }}</span></div>
        <div
          class="detail-item"
          v-if="mailbox.imageUrls.length">
          <label>图片</label>
          <div class="img-box">
            <m-img-viewer
              v-for="(img, index) in mailbox.imageUrls"
              :key="index"
              v-if="img"
              :src="img + '?token=' + $urls.token" />
          </div>
        </div>
        <div
          class="detail-item"
          v-if="mailbox.isReply">
          <label>回复内容</label>
          <span>{{ mailbox.reply }}</span>
        </div>
        <div
          v-else
          id="answer"
          class="detail-item"><label>回复内容</label>
          <span>
            <el-input
              v-model="answer"
              type="textarea"
              placeholder="请输入内容"
              resize="none" />
            <p
              v-if="tips"
              class="tips">最多输入300个字符</p></span>
        </div>
        <div class="detail-item">
          <el-button
            v-if="!mailbox.isReply"
            type="primary"
            size="mini"
            :loading="replying"
            :disabled="disabled"
            @click="onReply(mailbox.id)">答复</el-button>
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
        type: { type: 'select', label: '信件类别', options: [], getting: true, belong: { value: 'id', label: 'name' } },
        isReply: { type: 'select', label: '是否回复', options: [{ value: 1, label: '是' }, { value: 0, label: '否' }] },
        name: { type: 'input', label: '用户名' }
      },
      visible: false,
      replying: false,
      mailbox: {},
      answer: ''
    }
  },
  computed: {
    ...mapState(['mailboxes', 'mailboxTypes']),
    disabled() {
      let pattern = /^\s*(.*?)\s*$/
      return this.answer.replace(pattern, '$1').length > 300 || this.answer.replace(pattern, '$1').length === 0
    },
    tips() {
      let pattern = /^\s*(.*?)\s*$/
      return this.answer.replace(pattern, '$1').length > 300
    }
  },
  mounted() {
    this.getDatas()
    this.getMailboxTypes().then(res => {
      if (!res) return
      this.searchItems.type.options = this.mailboxTypes
      this.searchItems.type.getting = false
    })
  },
  methods: {
    ...mapActions(['getMailboxes', 'getMailboxTypes', 'deleteMailbox', 'replyMailbox', 'getMailboxDetail']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.getMailboxes({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    handleReply(e) {
      this.mailbox = e
      this.answer = ''
      this.visible = true
      setTimeout(() => {
        document.querySelector('#answer textarea').focus()
      }, 300)
    },
    onReply(e) {
      let params = { contents: this.answer.replace(/^\s*(.*?)\s*$/, '$1'), id: e }
      this.replying = true
      this.replyMailbox(params).then(res => {
        this.replying = false
        if (!res) return
        this.getDatas()
        this.visible = false
        this.mailbox = {}
        this.answer = ''
      })
    },
    onDelete(id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteMailbox({ id: id }).then(res => {
          if (!res) return
          if (this.mailboxes.contents.length === 1) {
            this.$refs.pagination.handleCurrentChange(this.pagination.page - 1 || 1)
          }
          else this.getDatas()
        })
      }).catch(() => {})
    },
    getDetail(e) {
      if ((e.isReply && e.reply) || !e.isReply) {
        this.mailbox = e
        this.answer = ''
        this.visible = true
      }
      else {
        this.getMailboxDetail({ id: e.id }).then(res => {
          if (!res) return
          this.mailbox = res
          this.answer = ''
          this.visible = true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.button-column{
  margin-bottom: 4px;
  width: 68px;
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
    .img-box{
      width: 400px;
      img{
        width: 195px;
        margin-top: 5px;
        margin-bottom: 5px;
      }
    }
    button{
      width: 100%;
    }
  }
}
</style>
