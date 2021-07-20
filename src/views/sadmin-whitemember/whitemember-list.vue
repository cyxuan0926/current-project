<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-button
      size="small"
      type="primary"
      plain
      class="button-add button-shift-down"
      @click="onAdd">新增白名单</el-button>

    <m-search
      :items="searchItems"
      @search="onSearch" />

    <el-col :span="24">
      <m-table-new
        stripe
        :data="whitemembers.contents"
        style="width: 100%"
        :cols="tableCols">
        <template #operation="{ row }">
          <!-- <el-button
            type="primary"
            size="mini"
            @click="onEdit(row)"
          >编辑</el-button> -->

          <el-button
            type="danger"
            size="mini"
            @click="onDelete(row.id)">删除</el-button>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="whitemembers.total"
      @onPageChange="getDatas"
    />

    <el-dialog
      width="530px"
      title="新增白名单"
      class="authorize-dialog"
      :visible.sync="isAdd"
      @close="cancel"
    >
      <el-form
        :model="whitemember"
        :rules="rules"
        label-width="70px"
        ref="form"
      >
        <el-form-item label="用户姓名" prop="familyName">
          <el-input
            v-model.trim="whitemember.familyName"
            placeholder="请输入用户姓名"
            clearable
            maxlength="10"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model.trim.number="whitemember.phone"
            placeholder="请输入手机号"
            clearable
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="whitemember.remark"
            placeholder="请输入备注"
            clearable
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="cancel">取 消</el-button>

        <el-button
          :loading="submiting"
          size="mini"
          type="primary"
          @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import { $likePhone, $likeName } from '@/common/constants/const'
// import helper from '@/utils'

export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      const reg = /^[0-9]*$/

      if (!value) callback(new Error('请输入手机号码'))

      else if (!reg.test(value)) callback(new Error('只能输入数字'))

      else callback()
    }

    return {
      searchItems: {
        phone: { type: 'input', label: '手机号' },

        familyName: { type: 'input', label: '用户姓名' }
      },

      rules: {
        familyName: [{ required: true, message: '请输入用户姓名' }],

        phone: [
          { validator: validatePhone, trigger: 'blur' },
          { required: true, message: '请输入手机号' }
        ],

        remark: [{ required: true, message: '请输入备注' }]
      },

      whitemember: {},

      isAdd: false,

      tableCols: [
        {
          label: '用户姓名',
          prop: 'familyName',
          ...$likeName
        },
        {
          label: '手机号',
          prop: 'phone',
          ...$likePhone
        },
        {
          label: '备注',
          prop: 'remark',
          showOverflowTooltip: true,
          minWidth: '340px'
        },
        {
          label: '操作',
          slotName: 'operation',
          width: '80px'
        }
      ],

      submiting: false
    }
  },

  computed: {
    ...mapState(['whitemembers'])
  },

  async mounted() {
    await this.getDatas()
  },

  methods: {
    ...mapActions([
      'getWhitemembers',
      'deleteWhitemember',
      'addWhitemember'
    ]),

    async getDatas() {
      await this.getWhitemembers({ ...this.filter, ...this.pagination })
    },

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.submiting = true

          const isSuccess = await this.addWhitemember(this.whitemember)

          this.submiting = false

          if (isSuccess) {
            this.cancel()

            this.getDatas()
          }
        }
      })
    },

    onDelete(id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const isSuccess = await this.deleteWhitemember({ id })

        if (isSuccess) this.getDatas()
      }).catch(err => {
        Promise.reject(err)
      })
    },

    onAdd() {
      this.isAdd = true
    },

    cancel() {
      this.isAdd = false

      this.whitemember = {}

      this.$refs['form'] && this.$refs['form'].resetFields()
    }
  }
}
</script>
