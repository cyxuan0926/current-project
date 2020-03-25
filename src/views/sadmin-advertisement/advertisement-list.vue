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
      @search="onSearch" />
    <el-col :span="24">
      <m-table-new
        stripe
        :data="advertisements.contents"
        :cols="tableCols">
        <template #imageUrl="{ row }">
          <img :src="row.imageUrl + '?token=' + $urls.token">
        </template>
        <template #isDate="{ row }">{{ row.startDate | Date }} - {{ row.endDate | Date }}</template>
        <template #status="{ row }">
          {{ row.status | isTrue }}
          <el-button
            type="text"
            size="mini"
            style="margin-left: 10px;"
            @click="onUpdateStatus(row)">
            点击{{ row.status === 1 ? "下架" : "上架" }}
          </el-button>
        </template>
        <template #operation="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="onEdit(row.id)">编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="onDelete(row.id)">删除</el-button>
        </template>
      </m-table-new>
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
    const belong = {
      value: 'id',
      label: 'name'
    }
    return {
      searchItems: {
        provinceId: { type: 'select', label: '省份', getting: true, belong, filterable: true },
        typeId: { type: 'select', label: '广告类型', getting: true, belong },
        name: { type: 'input', label: '广告名称' }
      },
      tableCols: [
        {
          label: '广告名称',
          prop: 'name'
        },
        {
          label: '广告类型',
          prop: 'typeName'
        },
        {
          label: '广告图片',
          slotName: 'imageUrl'
        },
        {
          label: '广告有效时间',
          slotName: 'isDate',
          width: 280
        },
        {
          label: '省份',
          prop: 'provinceName',
          width: 80
        },
        {
          label: '是否上架',
          slotName: 'status',
           minWidth: 100
        },
        {
          label: '操作',
          slotName: 'operation',
          minWidth: 146
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'advertisements',
      'provincesAll',
      'advertisementTypes'
    ])
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
    ...mapActions([
      'getAdvertisements',
      'updateAdvertisementStatus',
      'deleteAdvertisement',
      'getProvincesAll',
      'getAdvertisementTypes'
    ]),
    getDatas() {
      this.getAdvertisements({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    onAdd() {
      this.$router.push('/advertisement/add')
    },
    onUpdateStatus(advertisement) {
      let { id, status } = advertisement
      this.updateAdvertisementStatus({ id, status: Number(!status) }).then(res => {
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
