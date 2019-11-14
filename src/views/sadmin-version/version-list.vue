<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @search="onSearch" />
    <!--监狱版本-->
    <template v-for="(type, index) in versions">
      <el-col
        :span="24"
        :key="type.id">
        <p>{{ type.title }}</p>
      </el-col>
      <el-col
        :span="24"
        :key="index + type.title"
        style="margin-bottom: 10px;">
        <el-table
          :data="[versions[index]]"
          stripe
          style="width: 100%;">
          <el-table-column label="版本名">
            <template slot-scope="scope">
              <el-input
                type="text"
                v-model="scope.row.versionCode"
                :disabled="!scope.row.isCheck" />
            </template>
          </el-table-column>
          <el-table-column label="版本号">
            <template slot-scope="scope">
              <el-input
                type="text"
                v-model="scope.row.versionNumber"
                :disabled="!scope.row.isCheck" />
            </template>
          </el-table-column>
          <el-table-column label="是否强制更新">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.isForce"
                placeholder="请选择"
                :disabled="!scope.row.isCheck">
                <el-option
                  v-for="(item,$key) in {'是':1,'否':0}"
                  :key="item"
                  :label="$key"
                  :value="item" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="描述" >
            <template slot-scope="scope">
              <el-input
                type="text"
                v-model="scope.row.description"
                :disabled="!scope.row.isCheck" />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.isCheck"
                type="primary"
                size="mini"
                @click="$set(scope.row, 'isCheck', true)">修改</el-button>
              <el-button
                v-else
                type="primary"
                size="mini"
                @click="modifyOrSave(scope.row)">保存</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </template>
    <m-pagination
      ref="pagination"
      :total="versionsTotal"
      @onPageChange="getDatas" />
    <el-dialog
      title="狱务通版本管理"
      :visible.sync="dialogVisible">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules2"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item
          label-width="0"
          prop="username">
          <el-input
            type="text"
            v-model="ruleForm.username"
            auto-complete="off"
            placeholder="用户名"
            prefix-icon="iconfont icon-account"/>
        </el-form-item>
        <el-form-item
          label-width="0"
          prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            auto-complete="off"
            placeholder="密码"
            prefix-icon="iconfont icon-password"/>
        </el-form-item>
        <el-form-item
          label-width="0"
          class="btn-box">
          <!-- `checked` 为 true 或 false -->
          <el-button @click="submitForm('ruleForm')">登录</el-button>
          <el-button
            type="danger"
            @click="dialogVisible = !dialogVisible">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        }
        else if (value !== 'yuwutong') {
          callback(new Error('密码不正确'))
        }
        else {
          callback()
        }
      },
      validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'))
        }
        else if (value !== 'yuwutong') {
          callback(new Error('用户名不正确'))
        }
        else {
          callback()
        }
      }
    return {
      searchItems: {
        versionNumber: { type: 'input', label: '版本号' } // 版本号
      },
      dialogVisible: false,
      ruleForm: {
        pass: '',
        username: ''
      },
      rules2: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState(['versionsTotal', 'versions'])
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions(['getVersions', 'updateVersion']),
    getDatas() {
      this.getVersions({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    // 修改或者保存版本信息
    modifyOrSave(row) {
      if (!row.versionCode) {
        this.$message.warning('请输入版本名称')
        return false
      }
      if (!row.versionNumber) {
        this.$message.warning('请输入版本号')
        return false
      }
      if (!row.description) {
        this.$message.warning('请输入描述')
        return false
      }
      let params = {
        id: row.id,
        code: row.versionCode,
        number: row.versionNumber,
        isForce: row.isForce,
        description: row.description
      }
      this.updateVersion(params).then(res => {
        if (!res) return
        this.$set(row, 'isCheck', false)
      })
    }
    // 点击登录按钮执行的方法
    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       this.dialogVisible = false
    //       this.modificationRow.click = false
    //       this.modificationRow.buttonText = '保存'
    //       // 每次登录成功以后 输入框内容清空
    //       for (let key in this.ruleForm) {
    //         this.ruleForm[key] = ''
    //       }
    //     }
    //     else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // }
  }
}
</script>

<style type="text/stylus" lang="stylus">
</style>
