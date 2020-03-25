<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-excel-download
      v-if="activeName === 'prison'"
      path="/download/exportJails" 
      :params="filter" />
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch" />
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick">
      <template v-for="item in tabMapOptions">
        <el-tab-pane
          :label="item.label"
          :key='item.key'
          :name="item.key">
        </el-tab-pane>
      </template>
    </el-tabs>
    <router-view />
    <m-pagination
      v-if="paginationShow"
      ref="pagination"
      :total="total"
      @onPageChange="getDatas" />
  </el-row>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'PrisonTab',
  data () {
    return {
      tabMapOptions: [
        {
          label: '监狱',
          key: 'prison'
        },
        {
          label: '租户',
          key: 'tenant'
        }
      ],
      activeName: this.$route.path.slice(this.$route.path.indexOf('/')+1, this.$route.path.lastIndexOf('/')),
      searchItems: {
        title: {
          type: 'input',
          label: '监狱名称',
          miss: false
        },
        name: {
          type: 'input',
          label: '租户名称',
          miss: true
        }
      },
      total: 0,
      filter: {},
      pagination: {
        page: 1,
        rows: 10
      },
      paginationShow: false,
      loading: false
    }
  },
  watch: {
    activeName(val) {
      this.getSearchItem('clearFilter')
    }
  },
  created() {
    this.getSearchItem()
  },
  activated() {
    this.getSearchItem()
  },
  methods: {
    ...mapActions([
      'getTenants',
      'getPrisons'
    ]),
    handleClick() {
      this.$router.replace(`/${this.activeName}/list`)
      const page = this.activeName !== 'tenant' ? 1 : 0
      this.$set(this.pagination, 'page', page)
      this.$refs.pagination.updateCurrentPage(page)
    },
    getDatas() {
      this.paginationShow = false
      const tabName = this.activeName.toLowerCase()
      const api = this.activeName.toLowerCase().replace(/^\S/, function(s) { return s.toUpperCase() })
      if (tabName ==='tenant') {
        const { page } = this.pagination
        const currentPage = page <= 0 ? 0 : page - 1
        this.$set(this.pagination, 'page', currentPage)
      }
      this[`get${api}s`]({ ...this.filter, ...this.pagination }).then(res => {
        if (!res) return
        this.total = this.$store.state[`${tabName}s`]['total']
      })
      this.paginationShow = true
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    async getSearchItem(e) {
      if (this.loading) return
      this.loading = true
      const tabName = this.activeName.toLowerCase()
      if (tabName === 'tenant') {
        this.searchItems.title.miss = true
        this.searchItems.name.miss = false
      }
      if (tabName === 'prison') {
        this.searchItems.title.miss = false
        this.searchItems.name.miss = true
      }
      if (e === 'clearFilter') this.$refs.search.onClear()
      await this.getDatas()
      this.loading = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
