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
        class="mini-td-padding"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="家属姓名" />
        <el-table-column label="身份证信息">
          <template slot-scope="scope">
            <m-img-viewer
              v-if="scope.row.idCardFront"
              :url="scope.row.idCardFront"
              title="身份证正面照"/>
            <m-img-viewer
              v-if="scope.row.idCardBack"
              :url="scope.row.idCardBack"
              title="身份证背面照"/>
          </template>
        </el-table-column>
        <!-- <el-table-column label="身份证背面">
          <template slot-scope="scope">
            <m-img-viewer
              v-if="scope.row.idCardBack"
              :url="scope.row.idCardBack"
              title="身份证背面照"/>
          </template>
        </el-table-column> -->
        <el-table-column
          label="黑名单原因"
          prop="reason"
          show-overflow-tooltip>
          <!-- <template slot-scope="scope">
            <el-tooltip placement="top" :content="scope.row.reason" v-if="scope.row.reason">
              <div :class="scope.row.reason.length>27? 'more-content-column': ''">{{scope.row.reason}}</div>
            </el-tooltip>
          </template> -->
        </el-table-column>
        <el-table-column label="对应罪犯">
          <template slot-scope="scope">
            <el-button
              v-for="prisoner in scope.row.prisonerList"
              :key="prisoner.prisonerId"
              type="text"
              size="small"
              @click="showPrisonerDetail(prisoner)">
              {{ prisoner.name }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="getFamilyDetail(scope.row.id)">
              账号信息
            </el-button>
            <el-button
              type="text"
              size="small"
              v-if="!scope.row.isBlacklist"
              @click="showBlackList(scope.row, scope.$index)">
              加入黑名单
            </el-button>
            <el-button
              type="text"
              size="small"
              v-else
              @click="removeBlackList(scope.row, scope.$index)">
              移出黑名单
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
          <label for="">罪犯编号：</label>
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
          <span>{{ prisoner.gender | gender }}</span>
        </el-col>
        <el-col :span="12">
          <label for="">关系：</label>
          <span>{{ prisoner.relationship }}</span>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      :visible.sync="blackTableShow"
      @close="closeBlackTable"
      class="authorize-dialog"
      title="加入黑名单"
      width="530px">
      <el-form
        :model="blackTable"
        ref="blackTableForm"
        :rules="rule">
        <el-form-item prop="blackListReason">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5 }"
            placeholder="请输入加入黑名单理由"
            v-model="blackTable.blackListReason"/>
        </el-form-item>
      </el-form>
      <el-row :gutter="0">
        <el-button
          class="button-add"
          size="mini"
          type="danger"
          @click="blackTableShow = false && closeBlackTable()">取消</el-button>
        <el-button
          class="button-add"
          size="mini"
          @click="handleBlackListReason">确定</el-button>
      </el-row>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import validator from '@/utils'
export default {
  data() {
    return {
      searchItems: {
        name: { type: 'input', label: '家属姓名' },
        prisonArea: { type: 'select', label: '监区', options: (JSON.parse(localStorage.getItem('user')).prisonConfigList || []), belong: { value: 'prisonConfigName', label: 'prisonConfigName' } },
        isBlacklist: { type: 'select', label: '黑名单', options: [{ label: '是', value: 1 }, { label: '否', value: 0 }] }
      },
      dialogTableVisible: false,
      prisoner: {},
      blackTableShow: false,
      blackTable: {
        blackListReason: ''
      },
      rule: {
        blackListReason: [{ required: true, message: '请填写加入黑名单的原因' }, { validator: validator.lengthRange, max: 200 }]
      },
      family: {},
      index: ''
    }
  },
  computed: {
    ...mapState(['families'])
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions(['getFamilies', 'addFamilyBlacklist', 'removeFamilyBlacklist']),
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
    getFamilyDetail(e) {
      this.$router.push({ path: `/family/detail/${ e }` })
    },
    showPrisonerDetail(prisoner) {
      this.prisoner = prisoner
      this.dialogTableVisible = true
    },
    showBlackList(e, index) {
      this.family = Object.assign({}, e)
      this.blackTableShow = true
      this.index = index
    },
    closeBlackTable() {
      this.$refs.blackTableForm.resetFields()
    },
    handleBlackListReason() {
      this.$refs['blackTableForm'].validate(valid => {
        if (valid) {
          let params = new FormData()
          params.append('familyId', this.family.id)
          params.append('reason', this.blackTable.blackListReason)
          this.addFamilyBlacklist(params).then(res => {
            if (!res) return
            this.families.contents[this.index].reason = this.blackTable.blackListReason
            this.families.contents[this.index].isBlacklist = 1
            this.blackTableShow = false
          })
        }
      })
    },
    removeBlackList(e, index) {
      this.$confirm(`是否将${ e.name }移出黑名单？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new FormData()
        params.append('familyId', e.id)
        this.removeFamilyBlacklist(params).then(res => {
          if (!res) return
          this.families.contents[index].reason = ''
          this.families.contents[index].isBlacklist = 0
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.cell img{
  width: 126.8px;
  cursor: pointer;
}
.cell {
  button{
    margin-right: 6px;
    &+button{
      margin: 5px 6px 0 0;
    }
  }
}
</style>
