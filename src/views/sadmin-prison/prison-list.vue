<template>
  <el-table
    :data="prisons.contents"
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
          v-if="scope.row.provincesName">{{ scope.row.provincesName }}</span>
        <span
          class="separate"
          v-if="scope.row.citysName">{{ scope.row.citysName }}</span>
        <span
          class="separate"
          v-if="scope.row.street">{{ scope.row.street }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="260px">
      <template slot-scope="scope">
        <el-button
          type="primary"
          size="mini"
          @click="onEdit(scope.row.id)">编辑</el-button>
        <el-button
          type="text"
          size="mini"
          @click="onVisit(scope.row.id, 'remote')">远程会见配置</el-button>
        <el-button
          type="text"
          size="mini"
          @click="onVisit(scope.row.id, 'visit')">实地会见配置</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['prisons'])
  },
  methods: {
    onEdit(e) {
      this.$router.push(`/prison/edit/${ e }`)
    },
    onVisit(e, type) {
      console.log(e, type)
      if (type === 'visit') this.$router.push(`/prison/visit/${ e }`)
      else this.$router.push(`/remote/edit/${ e }`)
    }
  },
  activated() {
    console.log('prison-list activated')
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
// .row-container .cell img
//   width: 91px;
//   height: 91px;
</style>
