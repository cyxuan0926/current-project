<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      append-btn="下载"
      @appendHandler="handleDownload"
      @search="onSearch"
    >
      <el-button
        slot="append"
        type="primary"
        :loading="downloading"
        @click="handleDownload"
      >下载</el-button>
    </m-search>

    <el-col :span="24" class="el-col__no-tabs__margin">
      <m-table-new
        stripe
        :data="feedbacks.contents"
        style="width: 100%"
        :cols="tableCols"
      >
        <!-- isCo:0 狱警(图片需要去拼接) 1：家属(http格式的) -->
        <template #imageUrls="{ row }">
          <template v-if="row.imageUrls && row.imageUrls.length">
            <m-img-viewer
              v-if="row.isCo"
              :url="row.imageUrls[0]"
              isRequired
            />
            <m-img-viewer
              v-else
              :publicUrl="row.imageUrls[0]"
              isRequired
            /> 
          </template>
        </template>

        <template #createdAt="{ row }">{{ row.createdAt | Date }}</template>

        <template #isReply="{ row }">{{ row.isReply | isTrue }}</template>

        <template #operation="{ row }">
          <el-button
            v-if="!row.isReply"
            size="mini"
            class="button-column"
            @click="handleReply(row)"
            type="primary"
          >答复</el-button>

          <el-button
            v-else
            size="mini"
            class="button-column"
            disabled
            type="primary"
          >已答复</el-button>

          <el-button
            size="mini"
            class="button-column"
            @click="onDelete(row.id)"
            type="danger"
          >删除</el-button>

          <el-button
            size="mini"
            type="text"
            style="width: 56px;"
            @click="getDetail(row)"
          >详细内容</el-button>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="feedbacks.total"
      @onPageChange="getDatas"
    />

    <el-dialog
      :visible.sync="visible"
      v-if="visible"
      width="600px"
      class="authorize-dialog"
    >
      <span slot="title" class="tips-title">详细内容</span>

      <div class="dialog-container">
        <div class="detail-item"><label>用户</label><span>{{ feedback.name }}</span></div>

        <div class="detail-item"><label>反馈时间</label><span>{{ feedback.createdAt | Date }}</span></div>

        <div class="detail-item"><label>反馈类别</label><span>{{ feedback.typeName }}</span></div>

        <div class="detail-item"><label>反馈内容</label><span>{{ feedback.content }}</span></div>

        <div v-if="feedback.imageUrls.length" class="detail-item">
          <label>反馈图片</label>

          <div class="img-box">
            <template v-if="feedback.isCo">
              <m-img-viewer
                v-for="(img, index) in feedback.imageUrls"
                :key="index"
                :url="img"
                isRequired
              />
            </template>

            <template v-else>
              <m-img-viewer
                v-for="(img, index) in feedback.imageUrls"
                :key="index"
                :publicUrl="img"
                isRequired
              />
            </template>
          </div>
        </div>

        <div v-if="feedback.isReply" class="detail-item">
          <label>回复内容</label>

          <span>{{ feedback.reply }}</span>
        </div>

        <div
          v-else
          id="answer"
          class="detail-item"
        >
          <label>回复内容</label>

          <span>
            <el-input
              v-model="answer"
              type="textarea"
              placeholder="请输入内容"
              resize="none"
            />
          </span>
        </div>

        <div class="detail-item">
          <el-button
            v-if="!feedback.isReply"
            type="primary"
            size="mini"
            :loading="replying"
            :disabled="disabled"
            @click="onReply(feedback.id)"
          >答复</el-button>
        </div>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import { helper } from '@/utils'

import { $likeName } from '@/common/constants/const'
export default {
  data() {
    return {
      searchItems: {
        time: { type: 'datetimerange', start: 'startTime', end: 'endTime'},
        type: { type: 'select', label: '反馈类别', options: [], getting: true, belong: { value: 'id', label: 'name' } },
        isReply: { type: 'select', label: '是否回复', options: [{ value: 1, label: '是' }, { value: 0, label: '否' }] },
        name: { type: 'input', label: '家属姓名' }
      },
      visible: false,
      replying: false,
      downloading: false,
      feedback: {},
      answer: '',
      tableCols: [
        {
          label: '用户',
          prop: 'name',
          ...$likeName
        },
        {
          label: '反馈类别',
          prop: 'typeName'
        },
        {
          label: '反馈内容',
          prop: 'content',
          showOverflowTooltip: true
        },
        {
          label: '反馈图片',
          slotName: 'imageUrls'
        },
        {
          label: '反馈时间',
          slotName: 'createdAt'
        },
        {
          label: '是否答复',
          slotName: 'isReply'
        },
        {
          label: '操作',
          slotName: 'operation',
          width: 250
        }
      ]
    }
  },
  computed: {
    ...mapState(['feedbacks', 'feedbackTypes']),
    disabled() {
      let pattern = /^\s*(.*?)\s*$/
      return !this.answer.replace(pattern, '$1')
    }
  },

  mounted() {
    this.$set(this.searchItems['time'], 'value', [this.$_timeOneWeekAgo, this.$_timeNow])

    this.$refs.search.onGetFilter()

    this.getDatas()

    this.getFeedbackTypes().then(res => {
      if (!res) return
      this.searchItems.type.options = this.feedbackTypes
      this.searchItems.type.getting = false
    })
  },
  methods: {
    ...mapActions(['getFeedbacks', 'getFeedbackTypes', 'deleteFeedback', 'replyFeedback', 'getFeedbackDetail', 'downloadFeedbacks']),
    getDatas() {
      this.getFeedbacks({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    async handleDownload(e) {
      this.downloading = true
      // 带token的下载Excel
      let link = document.createElement('a'), params = Object.assign({}, this.filter),
        res = await this.downloadFeedbacks(params),
        url = helper.createObjectURL(res),
        dateNow = helper.DateFormat(Date.now(), 'YYYYMMDDHHmmss'),
        fileName = `家属反馈意见${dateNow}`
      link.href = url
      link.id = 'linkId'
      link.setAttribute('download', `${fileName}.xls`)
      document.body.appendChild(link)
      document.getElementById('linkId').click()
      document.body.removeChild(document.getElementById('linkId'))
      setTimeout(() => {
        this.downloading = false
      }, 300)
      // 直接a标签的写法 家属反馈意见20190828225650
      // Object.keys(this.filter).forEach((key, index) => {
      //   params = `${ params }${ index === 0 ? '?' : '&' }${ key }=${ this.filter[key] }`
      // })
      // link.href = `${ this.$urls.apiHost }${ this.$urls.apiPath }/feedbacks/download${ params }`
    },
    handleReply(e) {
      this.feedback = e
      this.answer = ''
      this.visible = true
      setTimeout(() => {
        document.querySelector('#answer textarea').focus()
      }, 300)
    },
    onReply(e) {
      let params = { reply: this.answer.replace(/^\s*(.*?)\s*$/, '$1'), id: e }
      this.replying = true
      this.replyFeedback(params).then(res => {
        this.replying = false
        if (!res) return
        this.getDatas()
        this.visible = false
        this.feedback = {}
        this.answer = ''
      })
    },
    onDelete(id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteFeedback({ id: id }).then(res => {
          if (!res) return
          if (this.feedbacks.contents.length === 1) {
            this.$refs.pagination.handleCurrentChange(this.pagination.page - 1 || 1)
          }
          else this.getDatas()
        })
      }).catch(() => {})
    },
    getDetail(e) {
      if ((e.isReply && e.reply) || !e.isReply) {
        this.feedback = e
        this.answer = ''
        this.visible = true
      }
      else {
        this.getFeedbackDetail({ id: e.id }).then(res => {
          if (!res) return
          this.feedback = res
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
      /deep/ .el-image{
        width: 195px;
        /deep/ img {
          width: 100%;
        }
      }
    }
    button{
      width: 100%;
    }
  }
}
</style>
