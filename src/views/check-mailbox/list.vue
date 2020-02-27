<template>
  <el-row
    class="row-container"
    :gutter="0">
    <!-- <m-excel-export
      v-if="hasOnlyAllPrisonQueryAuth"
      :jsonData="mailboxes.contents"
      :header="wardenMailboxExcelConfig.header"
      :filterFields="wardenMailboxExcelConfig.filterFields"
      :filename="wardenMailboxExcelConfig.filename" /> -->
    <m-excel-download
      v-if="hasOnlyAllPrisonQueryAuth"
      path="/download/exportMailboxes"
      :params="filter" />
    <m-search
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch" />
    <el-col
      :span="24"
      class="el-col__no-tabs__margin">
      <m-table
        class="has-img"
        :data="mailboxes.contents"
        :cols="tableCols" >
        <template
          slot="imageUrls"
          slot-scope="scope"
          v-if="scope.row.imageUrls.length">
          <m-img-viewer
            v-if="!hasOnlyAllPrisonQueryAuth"
            :publicUrl="scope.row.imageUrls[0]" />
          <m-img-viewer
            v-else
            v-for=" (url,index) of scope.row.imageUrls"
            :class="!index ? '' : 'img-viewer__hidden'"
            :key="url"
            :toolbar=" hasOnlyAllPrisonQueryAuth && scope.row.imageUrls.length > 1 ? toolbar : {} "
            :publicUrl="url" />
        </template>
        <template
          slot="isReply"
          slot-scope="scope">
          {{ scope.row.isReply | isTrue }}
        </template>
        <template
          slot="operate"
          slot-scope="scope">
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
          <el-button
            size="mini"
            class="button-column"
            @click="onDelete(scope.row.id)"
            type="danger">
            删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            style="width: 20%;"
            @click="getDetail(scope.row)">
            详细内容
          </el-button>
        </template>
      </m-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="mailboxes.total"
      @onPageChange="getDatas" />
    <el-dialog
      :visible.sync="visible"
      width="600px"
      class="authorize-dialog">
      <span
        slot="title"
        class="tips-title">详细内容</span>
      <div class="dialog-container">
        <div class="detail-item"><label>用户</label><span>{{ mailbox.familyName || mailbox.name }}</span></div>
        <div class="detail-item"><label>发件时间</label><span>{{ mailbox.createdAt }}</span></div>
        <div class="detail-item"><label>信件类别</label><span>{{ mailbox.typeName }}</span></div>
        <div class="detail-item"><label>信件内容</label><span>{{ mailbox.contents }}</span></div>
        <div
          class="detail-item"
          v-if="mailbox.imageUrls && mailbox.imageUrls.length">
          <label>图片</label>
          <div class="img-box">
            <template v-for="(img, index) in mailbox.imageUrls">
              <m-img-viewer
                :key="index"
                v-if="img"
                :publicUrl="img" />
            </template>
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
import prisonFilterCreator from '@/mixins/prison-filter-creator'
// import { wardenMailboxExcelConfig } from '@/common/excel-config'
export default {
  mixins: [prisonFilterCreator],
  data() {
    const isReplyOptions = [
      {
        value: 1,
        label: '是'
      },
      {
        value: 0,
        label: '否'
      }
    ]
    return {
      searchItems: {
        time: {
          type: 'datetimerange',
          start: 'startTime',
          end: 'endTime'
        },
        type: {
          type: 'select',
          label: '信件类别',
          options: [],
          getting: true,
          belong: {
            value: 'id',
            label: 'name'
          }
        },
        isReply: {
          type: 'select',
          label: '是否回复',
          options: isReplyOptions
        },
        name: {
          type: 'input',
          label: '用户名'
        }
      },
      visible: false,
      replying: false,
      mailbox: {},
      answer: '',
      // wardenMailboxExcelConfig,
      toolbar: {
        prev: 1,
        next: 1
      }
    }
  },
  computed: {
    ...mapState([
      'mailboxes',
      'mailboxTypes'
    ]),
    tableCols() {
      const commonCols = [
        {
          label: '用户',
          prop: 'name'
        },
        {
          label: '信件类别',
          prop: 'typeName'
        },
        {
          label: '信件内容',
          prop: 'contents',
          showOverflowTooltip: true
        },
        {
          label: '图片',
          slotName: 'imageUrls'
        },
        {
          label: '发件时间',
          prop: 'createdAt',
          minWidth: '95px'
        },
        {
          label: '是否答复',
          slotName: 'isReply'
        }
      ]
      const onlyHasAllPrisonQueryAuthHeadersCols = [
        {
          label: '监狱名称',
          prop: 'jailName'
        },
        {
          label: '监区',
          prop: 'prisonArea'
        }
      ]
      const onlyHasAllPrisonQueryAuthEndCols = [
        {
          label: '答复内容',
          prop: 'reply',
          showOverflowTooltip: true
        }
      ]
      const onlyWardenEndCols = [
        {
          label: '操作',
          slotName: 'operate',
          width: '240px'
        }
      ]
      let cols = [
        ...commonCols,
        ...onlyWardenEndCols
      ]
      if (this.hasOnlyAllPrisonQueryAuth || this.hasProvinceQueryAuth) cols = [
        {
          label: '省份',
          prop: 'provinceName',
          minWidth: 70
        },
        ...onlyHasAllPrisonQueryAuthHeadersCols,
        ...commonCols,
        ...onlyHasAllPrisonQueryAuthEndCols
      ]
      return cols
    },
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
    ...mapActions([
      'getMailboxes',
      'getMailboxTypes',
      'deleteMailbox',
      'replyMailbox',
      'getMailboxDetail'
    ]),
    getDatas() {
      this.getMailboxes({
        ...this.filter,
        ...this.pagination
      })
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
      const params = {
        contents: this.answer.replace(/^\s*(.*?)\s*$/, '$1'),
        id: e
      }
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
          if (this.mailboxes.contents.length === 1) this.$refs.pagination.handleCurrentChange(this.pagination.page - 1 || 1)
          else this.getDatas()
        })
      }).catch(() => {})
    },
    getDetail(e) {
      const { id } = e
      this.getMailboxDetail({ id }).then(res => {
        if (!res) return
        this.mailbox = res
        this.answer = ''
        this.visible = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.button-column{
  width: 30%;
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
