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
          label="服刑人员信息"
          name="first" />
      </el-tabs>
      <el-table
        :data="prisoners.contents"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="姓名" />
        <el-table-column
          prop="prisonerNumber"
          label="囚号" />
        <el-table-column
          prop="prisonArea"
          label="监区" />
        <el-table-column
          prop="crimes"
          label="罪名" />
        <el-table-column
          width="96px"
          label="会见次数/月">
          <template slot-scope="scope">
            <div>
              {{ scope.row.accessTime }}
              <el-button
                size="small"
                type="text"
                style="margin-left: 5px;"
                @click="handleAccessTime(scope.row)">修改</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="刑期起止">
          <template slot-scope="scope">
            <span class="separate">{{scope.row.prisonTermStartedAt | dateFormate}}</span>
            <span class="separate">{{scope.row.prisonTermEndedAt | dateFormate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="对应家属">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-for="family in scope.row.families"
              :key="family.id"
              style="margin-left: 0px; margin-right: 8px;"
              @click="showFamilyDetail(family)">{{ family.familyName }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="prisoners.total"
      @onPageChange="getDatas" />
    <el-dialog
      title="修改会见次数"
      :visible.sync="isEditAccessTime"
      width="600px">
      <el-form
        class="inline-form"
        ref="form"
        :model="prisoner">
        <el-form-item label="罪犯">{{ prisoner.name }}</el-form-item>
        <el-form-item
          label="会见次数"
          :rules="[{ required: true, message: '请输入会见次数' }]"
          prop="accessTime">
          <el-input-number
            :min="0"
            v-model="prisoner.accessTime"
            controls-position="right"
            @change="onAccessTimeChange"></el-input-number>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button
          class="button-add"
          size="mini"
          type="danger"
          @click="isEditAccessTime = false">取消</el-button>
        <el-button
          class="button-add"
          size="mini"
          @click="onAccessTime">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog
      title="家属信息"
      :visible.sync="dialogTableVisible">
      <el-row :gutter="0">
        <el-col :span="12">
          <el-col :span="24">
            <label for="">姓名：</label>
            <span>{{ family.familyName }}</span>
          </el-col>
          <el-col :span="24">
            <label for="">关系：</label>
            <span>{{ family.relationship }}</span>
          </el-col>
        </el-col>
      </el-row>
      <el-row class="row-flex" :gutter="20" justify="space-between" type="flex">
        <el-col :span="12" class="img-idCard">
          <label for="">身份证正面：</label>
          <m-img-viewer :url="family.familyIdCardFront + '?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a'" />
        </el-col>
        <el-col :span="12" class="img-idCard">
          <label for="">身份证背面：</label>
          <m-img-viewer :url="family.familyIdCardBack + '?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a'" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <label for="">照片：</label>
          <m-img-viewer :url="family.familyAvatarUrl + '?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a'" class="avatar" />
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
        prisonerNumber: { type: 'input', label: '囚号' },
        prisonArea: { type: 'select', label: '监区', options: JSON.parse(localStorage.getItem('user')).prisonConfigList, belong: { value: 'prisonConfigName', label: 'prisonConfigName' } },
        name: { type: 'input', label: '姓名' }
      },
      dialogTableVisible: false,
      family: {},
      isEditAccessTime: false,
      prisoner: {},
      thePrisoner: {}
    }
  },
  computed: {
    ...mapState(['prisoners'])
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions(['getPrisoners', 'updateAccessTime']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.getPrisoners({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    handleAccessTime(e) {
      this.prisoner = Object.assign({}, e)
      this.thePrisoner = e
      this.isEditAccessTime = true
    },
    onAccessTimeChange(e) {
      if (!e) this.prisoner.accessTime = 0
    },
    onAccessTime() {
      if (this.prisoner.accessTime === this.thePrisoner.accessTime) {
        this.isEditAccessTime = false
        return
      }
      this.$refs.form.validate(valid => {
        if (!valid) return
        let params = { id: this.prisoner.id, accessTime: this.prisoner.accessTime }
        this.updateAccessTime(params).then(res => {
          if (!res) return
          this.thePrisoner.accessTime = params.accessTime
          this.isEditAccessTime = false
        })
      })
    },
    showFamilyDetail(family) {
      this.family = family
      this.dialogTableVisible = true
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
.row-container
  .el-dialog__body
    img
      display: block;
    img.avatar
      width: 200px
      height: 200px
.img-idCard
  min-width: 350px;
.row-flex
  flex-wrap: wrap;
</style>
