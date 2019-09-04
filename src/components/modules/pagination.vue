<template>
  <div
    class="m-pagination showTotal-pagination"
    v-if="total">
    <span>共{{ total }}条记录</span>
    <el-pagination
      background
      layout="sizes, prev, pager, next, jumper, slot"
      :total="total"
      :page-size="pageSize"
      :page-sizes = '[10, 20, 30, 40, 50]'
      :current-page.sync="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
      <el-button
        class="button_go"
        @click="handleGo">
        <slot name="go">跳转</slot>
      </el-button>
    </el-pagination>   
  </div>
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
      this.$emit('onPageChange')
    },
    handleCurrentChange(e) {
      this.$parent.$parent.pagination.page = e
      this.$emit('onPageChange')
      this.currentPage = e
    },
    handleGo() {
      this.handleCurrentChange(this.currentPage)
    }
  }
}
</script>

<style lang="css" scoped>
.button_go {
  border: 1px solid #dcdfe6 !important;
  margin-left: 10px;
}
</style>
