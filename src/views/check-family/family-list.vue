<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-tabs
        value="first"
        type="card">
        <el-tab-pane
          label="家属信息"
          name="first" />
      </el-tabs>
      <el-table
        :data="families.contents"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="姓名" />
        <el-table-column
          prop="uuid"
          label="身份证号" />
        <el-table-column
          prop="phone"
          label="电话" />
        <el-table-column label="对应罪犯">
          <template slot-scope="scope">
            <el-button
              v-for="prisoner in scope.row.prisonerList"
              :key="prisoner.prisonerId"
              type="text"
              size="small"
              @click="showPrisonerDetail(prisoner)">
              {{prisoner.name}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="families.total"
      @onPageChange="getDatas" />
    <el-dialog
      title="囚犯信息"
      :visible.sync="dialogTableVisible">
      <el-row :gutter="0">
        <el-col :span="12">
          <label for="">姓名：</label>
          <span>{{ prisoner.name }}</span>
        </el-col>
        <el-col :span="12">
          <label for="">罪名：</label>
          <span>{{ prisoner.crimes }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <label for="">囚号：</label>
          <span>{{ prisoner.prisonerNumber }}</span>
        </el-col>
        <el-col :span="12">
          <label for="">监区：</label>
          <span>{{ prisoner.prisonArea }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <label for="">性别：</label>
          <span>{{prisoner.gender | gender}}</span>
        </el-col>
        <el-col :span="12">
          <label for="">关系：</label>
          <span>{{prisoner.relationship}}</span>
        </el-col>
      </el-row>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      searchItems: {
        uuid: { type: 'input', label: '身份证号' },
        name: { type: 'input', label: '家属姓名' }
      },
      dialogTableVisible: false,
      prisoner: {}
    }
  },
  computed: {
    ...mapState(['families'])
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions(['getFamilies']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.getFamilies({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    showPrisonerDetail(prisoner) {
      this.prisoner = prisoner
      this.dialogTableVisible = true
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
  .row-container
    .el-dialog__body
      img
          float: left
          width: 150px
          height: 150px
</style>