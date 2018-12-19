<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-button
      class="button-add"
      size="small"
      type="primary"
      plain
      @click="onAdd">添加{{ routeName }}</el-button>
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-table
        :data="newsList.contents"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="title"
          show-overflow-tooltip
          label="新闻标题"/>
        <el-table-column
          label="新闻内容"
          width="160px"
          :resizable="false">
          <template slot-scope="scope">
            <p :class="['summary', { 'three-line': scope.row.ellipsis }]">{{ scope.row.summary }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="新闻视频"
          width="212px">
          <template
            slot-scope="scope"
            v-if="scope.row.videoPath">
            <video
              controls
              poster="/static/images/video-background.png"
              style="width: 192px; height: 108px;">
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
          min-width="100px">
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
            v-if="scope.row.audioPath">
            <m-audio :value="scope.row.audioPath + '?token=' + $urls.token" />
          </template>
        </el-table-column>
        <el-table-column label="焦点">
          <template slot-scope="scope">
            {{ scope.row.isFocus ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="button-column"
              @click="onEdit(scope.row.id)"
              type="primary">
              编辑
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
      searchItems: {
        title: { type: 'input', label: '新闻标题' }
      },
      visible: false,
      news: {}
    }
  },
  computed: {
    ...mapState(['newsList']),
    routeName() {
      return this.$route.name
    }
  },
  watch: {
    $route(val) {
      this.getDatas()
    }
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions(['getNewsList', 'deleteNews']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.getNewsList({ ...this.filter, ...this.pagination, type: this.$route.meta.typeId }).then(res => {
        if (!res) return
        document.querySelectorAll('.summary').forEach((row, index) => {
          if (row.offsetHeight > 69) {
            this.newsList.contents[index].ellipsis = true
          }
          else {
            this.newsList.contents[index].ellipsis = false
          }
        })
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
      switch (this.$route.meta.typeId) {
        case 1:
          this.$router.push(`/prison-affairs-public/prison-affairs-public/edit/${ id }`)
          break
        case 2:
          this.$router.push(`/prison-affairs-public/working-dynamics/edit/${ id }`)
          break
        case 3:
          this.$router.push(`/prison-affairs-public/complaints-suggestions/edit/${ id }`)
          break
        default:
          this.$message.error('不识别的类型')
      }
    },
    onAdd() {
      switch (this.$route.meta.typeId) {
        case 1:
          this.$router.push('/prison-affairs-public/prison-affairs-public/add')
          break
        case 2:
          this.$router.push('/prison-affairs-public/working-dynamics/add')
          break
        case 3:
          this.$router.push('/prison-affairs-public/complaints-suggestions/add')
          break
        default:
          this.$message.error('不识别的类型')
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
    }
  }
}
</style>

