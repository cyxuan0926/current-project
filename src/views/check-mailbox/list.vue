<template>
  <el-row class="row-container" :gutter="0">
    <!-- <m-excel-export
      v-if="hasOnlyAllPrisonQueryAuth"
      :jsonData="mailboxes.contents"
      :header="wardenMailboxExcelConfig.header"
      :filterFields="wardenMailboxExcelConfig.filterFields"
      :filename="wardenMailboxExcelConfig.filename" /> -->
    <m-excel-download
      v-if="hasOnlyAllPrisonQueryAuth"
      path="/download/exportMailboxes"
      :params="filter"
    />

    <m-search
      ref="search"
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    />

    <el-col :span="24" class="el-col__no-tabs__margin">
      <m-table-new
        class="has-img"
        :data="mailboxes.contents"
        :cols="tableCols"
      >
        <template #imageUrls="{ row }">
          <template v-if="row.imageUrls.length">
            <m-img-viewer
              v-if="!hasOnlyAllPrisonQueryAuth"
              :url="row.imageUrls[0]"
              isRequired
            />

            <m-img-viewer
              v-else
              v-for=" (url,index) of row.imageUrls"
              :class="!index ? '' : 'img-viewer__hidden'"
              :key="url"
              :toolbar=" hasOnlyAllPrisonQueryAuth && row.imageUrls.length > 1 ? toolbar : {} "
              :url="url"
              isRequired
            />
          </template>
        </template>

        <template #isReply="{ row }">
          {{ row.isReply | isTrue }}
        </template>

        <template #operate="{ row }">
          <el-button
            v-if="!row.isReply"
            size="mini"
            class="button-column"
            @click="handleReply(scope.row)"
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
            @click="onDelete(scope.row.id)"
            type="danger"
          >删除</el-button>

          <el-button
            size="mini"
            type="text"
            style="width: 20%;"
            @click="getDetail(scope.row)"
          >详细内容</el-button>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="mailboxes.total"
      @onPageChange="getDatas"
    />

    <el-dialog
      :visible.sync="visible"
      width="600px"
      class="authorize-dialog"
    >
      <span slot="title" class="tips-title">详细内容</span>

      <div class="dialog-container">
        <div class="detail-item">
          <label>用户</label><span>{{ mailbox.familyName || mailbox.name }}</span>
        </div>

        <div class="detail-item">
          <label>发件时间</label><span>{{ mailbox.createdAt }}</span>
        </div>

        <div class="detail-item">
          <label>信件类别</label><span>{{ mailbox.typeName }}</span>
        </div>

        <div class="detail-item">
          <label>信件内容</label><span>{{ mailbox.contents }}</span>
        </div>

        <div v-if="mailbox.imageUrls && mailbox.imageUrls.length" class="detail-item">
          <label>图片</label>

          <div class="img-box">
            <template v-for="(img, index) in mailbox.imageUrls">
              <m-img-viewer
                :key="index"
                isRequired
                :url="img"
              />
            </template>
          </div>
        </div>

        <div v-if="mailbox.isReply" class="detail-item">
          <label>回复内容</label>

          <span>{{ mailbox.reply }}</span>
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
            <p v-if="tips" class="tips">最多输入300个字符</p>
          </span>
        </div>

        <div class="detail-item">
          <el-button
            v-if="!mailbox.isReply"
            type="primary"
            size="mini"
            :loading="replying"
            :disabled="disabled"
            @click="onReply(mailbox.id)"
          >答复</el-button>
        </div>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import prisonFilterCreator from '@/mixins/prison-filter-creator'

// import { $likeName } from '@/common/constants/const'

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
          label: '信件类别',
          type: 'select',
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
    ...mapState(['mailboxes', 'mailboxTypes']),

    tableCols() {
      const commonCols = [
        {
          label: '用户',
          prop: 'name'
          // ...$likeName
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
    this.$set(this.searchItems['time'], 'value', [this.$_timeOneWeekAgo, this.$_timeNow])
    this.$refs.search.onGetFilter()
    this.getDatas()
    this.getMailboxTypes().then(res => {
      if (!res) {
        return
      }

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

        if (!res) {
          return
        }

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
          if (!res) {
            return
          }

          if (this.mailboxes.contents.length === 1) {
            this.$refs.pagination.handleCurrentChange(this.pagination.page - 1 || 1)
          } else {
            this.getDatas()
          }
        })
      })
    },

    getDetail(e) {
      const { id } = e

      this.getMailboxDetail({ id }).then(res => {
        if (!res) {
          return
        }

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
          width: $absolutely-measure;
        }
      }
    }

    button{
      width: $absolutely-measure;
    }
  }
}
</style>
