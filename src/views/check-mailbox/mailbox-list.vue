<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      buttonText="刷新"
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
          label="标题"
          show-overflow-tooltip
          min-width="180">
          <template slot-scope="scope">
            <el-button @click="goDetail(scope.row.id)" type="text" size="small">
              {{scope.row.title}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="contents"
          label="内容"
          show-overflow-tooltip
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="发件人">
        </el-table-column>
        <el-table-column
          label="发送日期">
          <template slot-scope="scope">
            {{scope.row.createdAt}}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="mailboxes.total"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['mailboxes'])
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions(['getMailboxes']),
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
    goDetail(e) {
      this.$router.push(`/mailbox/detail/${ e }`)
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>
