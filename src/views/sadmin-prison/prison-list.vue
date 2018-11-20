<template>
  <el-row class="row-container" :gutter="0">
    <el-button
      size="small"
      type="primary"
      plain
      class="button-add"
      @click="onAdd">添加监狱</el-button>
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-tabs
        value="first"
        type="card">
        <el-tab-pane
          label="监狱"
          name="first" />
      </el-tabs>
      <el-table
        :data="prisons.contents"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="title"
          label="监狱名称" />
        <el-table-column label="监狱图片">
          <template slot-scope="scope">
            <img
              v-if="scope.row.imageUrl"
              :src="scope.row.imageUrl + '?token=' + $urls.token"
              alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="zipcode"
          label="监狱编号" />
        <el-table-column label="所在地区">
          <template slot-scope="scope">
            <span
              class="separate"
              v-if="scope.row.provincesName">{{scope.row.provincesName}}</span>
            <span
              class="separate"
              v-if="scope.row.citysName">{{scope.row.citysName}}</span>
            <span
              class="separate"
              v-if="scope.row.street">{{scope.row.street}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="onEdit(scope.row.id)">编辑</el-button><br>
            <el-button
              type="text"
              size="mini"
              style="margin-top: 7px;"
              @click="onVisit(scope.row.id, 'remote')">远程会见配置</el-button>
            <el-button
              type="text"
              size="mini"
              style="margin-left: 0;"
              @click="onVisit(scope.row.id, 'visit')">实地会见配置</el-button><br>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="prisons.total"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      searchItems: {
        title: { type: 'input', label: '监狱名称' }
      }
    }
  },
  computed: {
    ...mapState(['prisons'])
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions(['getPrisons']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.getPrisons({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    onAdd() {
      this.$router.push('/prison/add')
    },
    onEdit(e) {
      this.$router.push(`/prison/edit/${ e }`)
    },
    onVisit(e, type) {
      if (type === 'visit') {
        this.$router.push(`/prison/visit/${ e }`)
      }
      else {
        this.$router.push(`/prison/meeting-remote/${ e }`)
      }
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
.row-container .cell img
  width: 91px;
  height: 91px;
</style>
