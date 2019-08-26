<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
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
    <m-excel-download path="/download/exportJails" :params="filter"/>
    <router-view />
    <m-pagination
      ref="pagination"
      :total="total"
      @onPageChange="getDatas" />
  </el-row>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      tabMapOptions: [
        { label: '监狱', key: 'prison' },
        { label: '租户', key: 'tenant' }
      ],
      activeName: this.$route.path.slice(this.$route.path.indexOf('/')+1, this.$route.path.lastIndexOf('/')),
      searchItems: {
        title: { type: 'input', label: '监狱名称', miss: false },
        name: { type: 'input', label: '租户名称', miss: true }
      },
      total: 0,
      filter: {}
    }
  },
  mounted() {
    this.getSearchItem()
  },
  watch: {
    '$route' (val) {
      this.getSearchItem('clearFilter')
    }
  },
  methods: {
    ...mapActions(['getTenants', 'getPrisons']),
    handleClick() {
      this.$router.push(`/${this.activeName}/list`)
    },
    getDatas() {
      let tabName = this.activeName.toLowerCase(), api = this.activeName.toLowerCase().replace(/^\S/, function(s) { return s.toUpperCase() })
      if(tabName==='tenant') {
        let { page } = this.pagination
        this.$set(this.pagination, 'page', page-1)
      }
      this[`get${api}s`]({ ...this.filter, ...this.pagination }).then(res => {
        if(!res) return
        this.total = this.$store.state[`${tabName}s`]['total']
      })
    },
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas('sizeChange')
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    getSearchItem(e) {
      let tabName = this.activeName.toLowerCase()
      if (tabName === 'tenant') {
        this.searchItems.title.miss = true
        this.searchItems.name.miss = false
      }
      if (tabName === 'prison') {
        this.searchItems.title.miss = false
        this.searchItems.name.miss = true
      }
      if (e === 'clearFilter') {
        this.filter = {}
        this.$refs.pagination.handleCurrentChange(1)
      }
      else {
        this.getDatas()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
