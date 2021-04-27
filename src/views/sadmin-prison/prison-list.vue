<template>
  <m-table-new
    stripe
    :data="prisons.contents"
    style="width: 100%"
    :cols="tableCols">
    <template #imageUrl="{ row }">
      <el-image
        v-if="row.imageUrl"
        :src="row.imageUrl + '?token=' + $urls.token"
        alt="监狱图片"
        lazy />
    </template>
    <template #location="{ row }">
      <span
        class="separate"
        v-if="row.provincesName">{{ row.provincesName }}</span>
      <span
        class="separate"
        v-if="row.citysName">{{ row.citysName }}</span>
      <span
        class="separate"
        v-if="row.street">{{ row.street }}</span>
    </template>
    <template #operation="{ row }" align="center">
      <el-button
        type="primary"
        size="mini"
        @click="onEdit(row.id)">编辑</el-button>
      <el-button
        type="text"
        size="mini"
        @click="onVisit(row.id, 'remote')">可视电话配置</el-button>
      <el-button
        type="text"
        size="mini"
        @click="onVisit(row.id, 'visit')">现场探视预约配置</el-button>
        <el-button
        type="text"
        size="mini"
        @click="onVisit(row.zipcode, 'process')">审批流程配置</el-button>
    </template>
  </m-table-new>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      tableCols: [
        {
          label: '省份',
          prop: 'provincesName',
        },
        {
          label: '监狱名称',
          prop: 'title',
          showOverflowTooltip: true
        },
        {
          label: '监狱图片',
          slotName: 'imageUrl'
        },
        {
          label: '监狱编号',
          prop: 'zipcode',
          showOverflowTooltip: true
        },
        {
          label: '所在地区',
          slotName: 'location',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          label: '操作',
          slotName: 'operation',
          align: 'center',
          minWidth: 260
        }
      ]
    }
  },
  computed: {
    ...mapState(['prisons'])
  },
  methods: {
    onEdit(e) {
      this.$router.push(`/prison/edit/${ e }`)
    },
    onVisit(e, type) {
      let _path
      if (type === 'visit') {
        _path = `/prison/visit/${ e }?tag=usual`
      } else if (type === 'process') {
        _path = `/prison/process/${ e || '4411' }`
      } else {
        _path = `/remote/edit/${ e }?tag=usual`
      }
      this.$router.push({path: _path})
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
// .row-container .cell img
//   width: 91px;
//   height: 91px;
</style>
