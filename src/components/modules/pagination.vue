<template>
  <el-col
    :span="24"
    class="m-pagination showTotal-pagination">
    <span>共{{ total }}条记录</span>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      prev-text="上一页"
      next-text="下一页"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  </el-col>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10
    }
  },
  mounted() {
    this.$parent.$parent.pagination = {
      rows: this.pageSize,
      page: this.currentPage
    }
  },
  methods: {
    handleSizeChange(e) {
      this.pageSize = e
      this.currentPage = 1
      this.$parent.$parent.pagination = {
        rows: e,
        page: 1
      }
    },
    handleCurrentChange(e) {
      this.$parent.$parent.pagination.page = e
      this.$emit('onPageChange')
      this.currentPage = e
    }
  }
}
</script>

<style lang="css" scoped>
</style>
