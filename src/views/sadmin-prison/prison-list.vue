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
    <template #operation="{ row }">
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
          label: '监狱名称',
          prop: 'title'
        },
        {
          label: '监狱图片',
          slotName: 'imageUrl'
        },
        {
          label: '监狱编号',
          prop: 'zipcode'
        },
        {
          label: '所在地区',
          slotName: 'location',
          minWidth: 200
        },
        {
          label: '操作',
          slotName: 'operation',
          minWidth: 170
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
      if (type === 'visit') this.$router.push(`/prison/visit/${ e }`)
      else this.$router.push(`/remote/edit/${ e }?tag=usual`)
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
// .row-container .cell img
//   width: 91px;
//   height: 91px;
</style>
