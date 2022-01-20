<template>
  <el-row class="row-container" :gutter="0">
    <m-excel-download
      v-if="activeName === 'prison'"
      path="/download/exportJails" 
      :params="filter"
    />

    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
      @searchSelectChange="searchSelectChange"
    />

    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
    >
      <template v-for="item in tabMapOptions">
        <el-tab-pane
          :label="item.label"
          :key='item.key'
          :name="item.key"
        />
      </template>
    </el-tabs>

    <router-view />

    <m-pagination
      v-if="paginationShow"
      ref="pagination"
      :total="total"
      @onPageChange="onGetDatas"
    />
  </el-row>
</template>
<script>
import { mapActions } from 'vuex'

import prisonFilterCreator from '@/mixins/prison-filter-creator'
export default {
  name: 'PrisonTab',
  mixins: [prisonFilterCreator],
  data () {
    const listTabs = ['prison', 'tenant']

    return {
      tabMapOptions: [
        {
          label: '监狱',
          key: 'prison'
        },
        {
          label: '租户',
          key: 'tenant'
        },
        {
          label: '人脸识别配置',
          key: 'face-recognition'
        }
      ],
      activeName: this.$route.path.slice(this.$route.path.indexOf('/')+1, this.$route.path.lastIndexOf('/')),

      searchItems: {},
      total: 0,
      filter: {},
      pagination: {
        page: 1,
        rows: 10
      },
      paginationShow: false,
      loading: false,
      listTabs
    }
  },

  watch: {
    activeName(val) {
      this.getDatas()
    }
  },

  methods: {
    ...mapActions([
      'getTenants',
      'getPrisons',
      'getFaceRecognitionConfigs'
    ]),

    // 点击tab页面
    handleClick() {
      // 标签页面对应的是列表页
      if (this.listTabs.includes(this.activeName)) {
        this.$router.replace(`/${this.activeName}/list`)

        // 租户列表是公共服务的接口 默认page参数是从0开始的
        const page = this.activeName !== 'tenant' ? 1 : 0

        this.$set(this.pagination, 'page', page)

        this.$refs.pagination && this.$refs.pagination.updateCurrentPage(page)
      }
      // 人脸识别配置标签页
      else this.$router.replace('/face-recognition/configs')
    },

    // 获取数据
    onGetDatas() {
      this.paginationShow = false

      const tabName = this.activeName.toLowerCase()

      if (this.listTabs.includes(tabName)) {
        const api = this.activeName.toLowerCase().replace(/^\S/, function(s) { return s.toUpperCase() })

        if (tabName === 'tenant') {
          const { page } = this.pagination

          const currentPage = page <= 0 ? 0 : page - 1

          this.$set(this.pagination, 'page', currentPage)
        }

        this[`get${api}s`]({ ...this.filter, ...this.pagination }).then(res => {
          if (!res) return

          this.total = this.$store.state[`${tabName}s`]['total']
        })

        this.paginationShow = true
      }
      // 人脸识别配置
      else {
        (async () => {
          await this.getFaceRecognitionConfigs()
        })()
      }
    },

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    async getDatas(e) {
      if (this.loading) return

      const tabsSearchItemsObject = {
        tenant: {
          // title: true,
          // name: false,
          provincesId: false,
          jailId: false
        },

        prison: {
          // title: false,
          // name: true,
          provincesId: false,
          jailId: false
        },

        'face-recognition': {
          // title: true,
          // name: true,
          provincesId: true,
          jailId: true
        }
      }

      this.loading = true

      const tabName = this.activeName.toLowerCase()

      for(let [key, val] of Object.entries(tabsSearchItemsObject[tabName])) this.$set(this.searchItems[key], 'miss', val)

      if (e === 'clearFilter') this.$refs.search.onClear()

      await this.onGetDatas()

      this.loading = false
    }
  }
}
</script>
