<template>
  <el-row class="row-container page literature-my">
    <div class="header">
      <h3>作品列表</h3>
      <span>共 {{ total }} 部作品</span>
      <el-button type="primary" @click="onCreateArticle">发表作品</el-button>
    </div>

    <m-table :data="literatures" :cols="tableCols">
      <div class="literature-info-cell" slot="title" slot-scope="scope">
        <div class="cover">
          <img v-if="scope.cover" src="">
          <span v-else>{{ scope.row.title }}</span>
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
      </div>

      <span slot="finish" slot-scope="scope">
        {{ scope.row.finish | literatureStatus }}
      </span>

      <template slot="operate" slot-scope="scope">
        <el-button
          v-if="parseInt(scope.row.articleType) === 1"
          type="primary"
          size="small"
          @click="onUpdateArticle(scope.row.id)"
        >
          文章管理
        </el-button>
        <!-- <el-button type="primary" size="small" plain>
          修改作品
        </el-button> -->
      </template>
    </m-table>

    <m-pagination
      ref="pagination"
      :total="total"
      @onPageChange="getTableData"
    />
  </el-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store'

export default {
  data() {
    return {
      tableCols: [
        { slotName: 'title', label: '作品名称' },
        { prop: 'articleTypeName', label: '作品类型' },
        { prop: '', label: '最新发布章节' },
        { slotName: 'finish', label: '作品状态' },
        { prop: 'publishAt', label: '发布时间' },
        { slotName: 'operate', label: '操作', align: 'center' }
      ],
      total: 0,
      pagination: { page: 1, rows: 10 }
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
  async beforeRouteEnter(to, from, next) {
    const res = await store.dispatch(
      'literature/getMyLiteratures',
      { page: 1, rows: 10 }
    )

    next(vm => vm.total = res.data.total)
  },
  methods: {
    ...mapActions('literature', ['getMyLiteratures']),
    onCreateArticle() {
      this.$router.push('/literature-my/literature-create')
    },
    onUpdateArticle(id) {
      this.$router.push(`/literature-my/literature-update/${id}`)
    },
    async getTableData() {
      const res = await this.getMyLiteratures(this.pagination)

      this.total = res.data.total
    }
  }
}
</script>

<style lang="scss" scoped>
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
    width: 62px;
    max-height: 100%;
  }

  .literature-info {
    margin-left: 10px;

    h3 {
      overflow: hidden;
      width: 100px;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-bottom: 8px;
    }
    
    dl {
      display: flex;
      align-items: center;
      margin: 0;
      line-height: 18px;
    }
  }
}
</style>