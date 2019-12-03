<template>
  <div class="m-pagination" v-if="total > 0">
    <span>共{{ total }}条记录</span>
    <el-pagination
      background
      layout="sizes, prev, pager, next, jumper, slot"
      :page-sizes = '[10, 20, 30, 40, 50]'
      :total="total"
      :page-size="pagination.rows"
      :current-page="pagination.page"
      @size-change="onSizeChange"
      @current-change="onPageChange"
    >
      <el-button class="button-jump">跳转</el-button>
    </el-pagination>   
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    },

    total: {
      type: Number,
      default: 0
    },

    onChange: {
      type: Function,
      default: function() {}
    }
  },

  data() {
    return {
      pagination: { page: 1, rows: 10 }
    }
  },

  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.pagination = Object.assign({}, this.pagination, val)
      }
    }
  },

  methods: {
    onSizeChange(pageSize) {
      this.pagination.page = 1
      this.pagination.rows = pageSize
      this.$emit('input', this.pagination)
      this.onChange(this.pagination)
    },

    onPageChange(currentPage) {
      this.pagination.page = currentPage
      this.$emit('input', this.pagination)
      this.onChange(this.pagination)
    }
  }
}
</script>

<style lang="css" scoped>
.button-jump {
  border: 1px solid #dcdfe6 !important;
  margin-left: 10px;
}
</style>
