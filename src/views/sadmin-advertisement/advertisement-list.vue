<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-button
      size="small"
      type="primary"
      plain
      class="button-add button-shift-down"
      @click="onAdd">添加广告</el-button>
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-table
        :data="advertisements.contents"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="广告名称" />
        <el-table-column
          prop="typeName"
          label="广告类型" />
        <el-table-column label="广告图片">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl + '?token=' + $urls.token">
          </template>
        </el-table-column>
        <el-table-column
          label="广告有效时间"
          width="280px">
          <template slot-scope="scope">
            {{ scope.row.startDate | Date }} - {{ scope.row.endDate | Date }}
          </template>
        </el-table-column>
        <el-table-column
          prop="provinceName"
          label="省份"
          width="80px" />
        <el-table-column
          label="是否上架"
          min-width="100px">
          <template slot-scope="scope">
            {{ scope.row.status | isTrue }}
            <el-button
              type="text"
              size="mini"
              style="margin-left: 10px;"
              @click="onUpdateStatus(scope.row.id, scope.row.status, scope.row)"> 点击{{ scope.row.status === 1 ? "下架" : "上架" }} </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="146px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="onEdit(scope.row.id)">编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="onDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="advertisements.total"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      searchItems: {
        provinceId: { type: 'select', label: '省份', getting: true, belong: { value: 'id', label: 'name' }, filterable: true },
        typeId: { type: 'select', label: '广告类型', getting: true, belong: { value: 'id', label: 'name' } },
        name: { type: 'input', label: '广告名称' }
      }
    }
  },
  computed: {
    ...mapState(['advertisements', 'provincesAll', 'advertisementTypes'])
  },
  mounted() {
    this.getDatas()
    this.getProvincesAll().then(() => {
      this.searchItems.provinceId.options = this.provincesAll
      this.searchItems.provinceId.getting = false
    })
    this.getAdvertisementTypes().then(() => {
      this.searchItems.typeId.options = this.advertisementTypes
      this.searchItems.typeId.getting = false
    })
  },
  methods: {
    ...mapActions(['getAdvertisements', 'updateAdvertisementStatus', 'deleteAdvertisement', 'getProvincesAll', 'getAdvertisementTypes']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.getAdvertisements({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    onAdd() {
      this.$router.push('/advertisement/add')
    },
    onUpdateStatus(id, status, row) {
      this.updateAdvertisementStatus({ id: id, status: Number(!status) }).then(res => {
        if (!res) return
        row.status = Number(!status)
      })
    },
    onEdit(e) {
      this.$router.push(`/advertisement/edit/${ e }`)
    },
    onDelete(e) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAdvertisement({ id: e }).then(res => {
          if (!res) return
          this.getDatas()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>
