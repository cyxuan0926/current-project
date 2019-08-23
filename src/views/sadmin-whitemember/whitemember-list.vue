<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-button
      size="small"
      type="primary"
      plain
      class="button-add"
      @click="onAdd">添加白名单</el-button>
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-table
        :data="whitemembers.contents"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="phone"
          label="手机号" />
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="mini" @click="onEdit(scope.row)">编辑</el-button> -->
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
      :total="whitemembers.total"
      @onPageChange="getDatas" />
    <el-dialog
      width="530px"
      title="新增白名单"
      class="authorize-dialog"
      :visible.sync="isAdd">
      <el-form
        :model="whitemember"
        :rules="rules"
        ref="form">
        <el-form-item
          label="手机号"
          prop="phone">
          <el-input
            v-model="whitemember.phone"
            placeholder="请填写手机号">
            <el-button
              slot="append"
              :disabled="isChecked"
              @click="onCheck">检验</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          size="mini"
          @click="isAdd = false">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          :disabled="whitemember.phone !== phone"
          @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
// import helper from '@/utils'

export default {
  data() {
    return {
      searchItems: {
        phone: { type: 'input', label: '手机号' }
      },
      rules: {
        // phone: [{ required: true, message: '请填写手机号' }, { validator: helper.phone }]
        phone: [{ required: true, message: '请填写手机号' }]
      },
      whitemember: {},
      phone: '',
      isChecked: true,
      isAdd: false
    }
  },
  computed: {
    ...mapState(['whitemembers'])
  },
  watch: {
    'whitemember.phone'(val) {
      if (this.phone === val) {
        this.isChecked = true
      }
      else {
        var reg = /^1\d{10}$/
        if (val && (reg.test(val))) {
          this.isChecked = false
        }
        else {
          this.isChecked = true
        }
      }
    }
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions(['getWhitemembers', 'deleteWhitemember', 'checkPhoneWhitemember', 'addWhitemember', 'updateWhitemember']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.getWhitemembers({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.addWhitemember(this.whitemember).then(res => {
            if (!res) return
            this.getDatas()
            this.isAdd = false
          })
        }
      })
    },
    onCheck() {
      this.$refs.form.validateField('phone', valid => {
        if (valid) return
        this.checkPhoneWhitemember(this.whitemember.phone).then(res => {
          if (!res) return
          this.phone = this.whitemember.phone
          this.isChecked = true
        })
      })
    },
    // onEdit(e) {
    //   this.whitemember = e
    //   this.phone = e.phone
    //   this.isAdd = true
    // },
    onDelete(e) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteWhitemember({ id: e }).then(res => {
          if (!res) return
          this.getDatas()
        })
      }).catch(() => {})
    },
    onAdd() {
      this.whitemember = {}
      if (this.$refs.form) this.$refs.form.resetFields()
      this.isAdd = true
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>
