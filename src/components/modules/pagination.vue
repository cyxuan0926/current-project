<template>
  <div v-if="total" class="m-pagination showTotal-pagination">
    <span>共{{ total }}条记录</span>

    <el-pagination
      background
      layout="sizes, prev, pager, next, jumper, slot"
      :total="total"
      :page-size="pageSize"
      :page-sizes = 'pageSizes'
      :current-page.sync="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <el-button class="button_go" @click="handleGo">
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
    },

    size: {
      type: Boolean,
      default: false
    },

    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40, 50]
    }
  },

  data() {
    return {
      currentPage: 1,
      pageSize: 10
    }
  },

  mounted() {
    if (this.size) {
      this.currentPage = 0

      this.$parent.$parent.pagination = {
        size: this.pageSize,
        page: this.currentPage
      }
    } else {
      this.$parent.$parent.pagination = {
        rows: this.pageSize,
        page: this.currentPage
      }
    }
  },

  methods: {
    handleSizeChange(e) {
      this.pageSize = e
      this.currentPage = 1

      if (this.size) {
        this.$parent.$parent.pagination = {
          size: e,
          page: 0
        }
      } else {
        this.$parent.$parent.pagination = {
          rows: e,
          page: 1
        }
      }

      this.$emit('onPageChange', 1, e)
    },

    handleCurrentChange(e) {
      let m = e

      if (this.size) m = e-1

      this.$parent.$parent.pagination.page = m
      this.$emit('onPageChange', e)
      this.currentPage = e
    },

    handleGo() {
      this.handleCurrentChange(this.currentPage)
    },

    updateCurrentPage(page) {
      this.currentPage = page
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
