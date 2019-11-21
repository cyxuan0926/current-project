<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-button
      class="button-add button-shift-down"
      size="small"
      type="primary"
      plain
      @click="onAdd">添加{{ routeName }}</el-button>
    <m-search
      :items="searchItems"
      @search="onSearch" />
    <el-col :span="24">
      <el-table
        :data="newsList.contents"
        stripe
        class="mini-td-padding"
        style="width: 100%">
        <el-table-column
          prop="title"
          show-overflow-tooltip
          label="新闻标题"/>
        <el-table-column
          label="新闻内容"
          :resizable="false">
          <template slot-scope="scope">
            <p :class="['summary', { 'three-line': scope.row.ellipsis }]">{{ scope.row.summary }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="新闻视频"
          width="222px">
          <template
            slot-scope="scope"
            v-if="showTable && scope.row.videoPath">
            <video
              controls
              poster="/static/images/video-background.png"
              style="width: 198px; height: 112px;">
              <source
                :src="scope.row.videoPath + '?token=' + $urls.token"
                type='video/mp4'>
              <source
                :src="scope.row.videoPath + '?token=' + $urls.token"
                type='video/webm'>
              <source
                :src="scope.row.videoPath + '?token=' + $urls.token"
                type='video/ogg'>您的浏览器不支持Video标签。
            </video>
          </template>
        </el-table-column>
        <el-table-column
          label="新闻图片"
          width="86px">
          <template
            slot-scope="scope"
            v-if="scope.row.imageUrl">
            <img
              :src="scope.row.imageUrl + '?token=' + $urls.token"
              alt="">
          </template>
        </el-table-column>
        <el-table-column
          label="新闻音频"
          width="212px">
          <template
            slot-scope="scope"
            v-if="showTable && scope.row.audioPath">
            <m-audio :value="scope.row.audioPath + '?token=' + $urls.token" />
          </template>
        </el-table-column>
        <el-table-column label="焦点" width="62px">
          <template slot-scope="scope">
            {{ scope.row.isFocus ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="button-column"
              @click="onEdit(scope.row.id)"
              type="primary">
              编辑
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
      :total="newsList.total"
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
        <div class="detail-item"><label>新闻标题</label><span>{{ news.title }}</span></div>
        <div class="detail-item"><label>发布时间</label><span>{{ news.updatedAt || news.createdAt | Date }}</span></div>
        <div class="detail-item special"><label>新闻内容</label><span v-html="news.contents" /></div>
        <div
          class="detail-item"
          v-if="news.videoPath">
          <label>新闻视频</label>
          <video
            controls
            poster="/static/images/video-background.png">
            <source
              :src="news.videoPath + '?token=' + $urls.token"
              type='video/mp4'>
            <source
              :src="news.videoPath + '?token=' + $urls.token"
              type='video/webm'>
            <source
              :src="news.videoPath + '?token=' + $urls.token"
              type='video/ogg'>您的浏览器不支持Video标签。
          </video>
        </div>
        <div
          class="detail-item"
          v-if="news.imageUrl"><label>新闻图片</label><img :src="news.imageUrl + '?token=' + $urls.token"></div>
        <div
          class="detail-item"
          v-if="news.audioPath">
          <label>新闻音频</label>
          <m-audio
            :value="news.audioPath + '?token=' + $urls.token"
            width="400px" />
        </div>
        <div class="detail-item"><label>焦点新闻</label><span>{{ news.isFocus ? '是' : '否' }}</span></div>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      searchItemInit: {
        title: { type: 'input', label: '新闻标题' }
      },
      searchItems: Object.assign({}, this.searchItemInit),
      visible: false,
      news: {},
      showTable: false,
      types: [
        {
          name: 'prison-affairs-public',
          typeId: 1
        },
        {
          name: 'working-dynamics',
          typeId: 2
        },
        {
          name: 'complaints-suggestions',
          typeId: 3
        },
        {
          name: 'prison-affairs-public/4',
          typeId: 4
        },
        {
          name: 'prison-affairs-public/5',
          typeId: 5
        },
        {
          name: 'prison-affairs-public/6',
          typeId: 6
        }
      ]
    }
  },
  computed: {
    ...mapState(['newsList']),
    routeName() {
      return this.$route.meta.breadcrumbName
    }
  },
  watch: {
    $route(val) {
      this.render()
    }
  },
  mounted() {
    this.render()
  },
  methods: {
    ...mapActions(['getNewsList', 'deleteNews']),
    render() {
      this.searchItems = Object.assign({}, this.searchItemInit)
      Object.keys(this.searchItems).forEach(key => {
        delete this.searchItems[key].value
        if (this.filter) delete this.filter[key]
      })
      this.getDatas()
    },
    getDatas() {
      this.showTable = false
      this.getNewsList({ ...this.filter, ...this.pagination, type: this.$route.meta.typeId }).then(res => {
        this.showTable = true
        if (!res) return
        setTimeout(() => {
          let sum = document.querySelectorAll('.summary'), index
          for (index = 0; index < sum.length; index++) {
            if (sum[index].offsetHeight > 69) {
              this.newsList.contents[index].ellipsis = true
            }
            else {
              this.newsList.contents[index].ellipsis = false
            }
          }
        }, 50)
      })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    getDetail(e) {
      this.news = { ...e }
      this.visible = true
    },
    onDelete(id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteNews({ id: id }).then(res => {
          if (res) this.getDatas()
        })
      }).catch(() => {})
    },
    onEdit(id) {
      let type = this.types.find(t => t.typeId === this.$route.meta.typeId)
      if (!type) {
        this.$message.error('不识别的类型')
      }
      else {
        this.$router.push(`/prison-affairs-public/${ type.name }/edit/${ id }`)
      }
    },
    onAdd() {
      let type = this.types.find(t => t.typeId === this.$route.meta.typeId)
      if (!type) {
        this.$message.error('不识别的类型')
      }
      else {
        this.$router.push(`/prison-affairs-public/${ type.name }/add`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.three-line{
  height: 69px;
  overflow: hidden;
  position: relative;
  text-align: justify;
  &::after{
    content: '...';
    position: absolute;
    right: 0;
    bottom: 0;
    background: #fff;
    padding-left: 5px;
  }
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
    }
  }
}
</style>

