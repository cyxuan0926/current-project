<template>
  <el-row class="page-edit">
    <el-col
      :span="10"
      :offset="7">
      <el-form
        :model="terminal"
        ref="terminal"
        :rules="rule"
        label-position="left"
        label-width="100px">
        <el-form-item
          label="终端号"
          prop="terminalNumber">
          <el-input
            v-model="terminal.terminalNumber"
            placeholder="请填写终端号" />
        </el-form-item>
        <el-form-item
          label="会议室号"
          prop="roomNumber">
          <el-input
            v-model.number="terminal.roomNumber"
            placeholder="请填写会议室号" />
        </el-form-item>
        <el-form-item
          label="所属监狱"
          prop="jailId">
          <el-select
            v-model="terminal.jailId"
            filterable
            placeholder="请选择监狱"
            @change="onPrisonChange">
            <el-option
              v-for="prison in prisonAllWithBranchPrison"
              :key="prison.id"
              :label="prison.title"
              :value="prison.id"/>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isPrisonArea"
          label="监区"
          prop="prisonConfigId">
          <el-select
            v-model="terminal.prisonConfigId"
            filterable
            :disabled="!hasPrisonArea"
            :loading="gettingPrisonArea"
            placeholder="请选择监区">
            <el-option
              v-for="prisonArea in jailPrisonAreas"
              :key="prisonArea.id"
              :label="prisonArea.name"
              :value="prisonArea.id"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="主持人密码"
          prop="hostPassword">
          <el-input
            v-model="terminal.hostPassword"
            placeholder="请填写主持人密码" />
        </el-form-item>
        <el-form-item
          label="参会密码"
          prop="mettingPassword">
          <el-input
            v-model="terminal.mettingPassword"
            placeholder="请填写参会密码" />
        </el-form-item>
      </el-form>
      <el-button
        class="submit"
        type="primary"
        size="small"
        @click="onSubmit">新增</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import validate from '@/utils'

export default {
  data() {
    return {
      terminal: {},
      rule: {
        terminalNumber: [{
          required: true,
          message: '请填写终端号',
          trigger: 'blur'
        }],
        jailId: [{
          required: true,
          message: '请选择监狱'
        }],
        prisonConfigId: [{
          required: true,
          message: '请填写分监区'
        }],
        hostPassword: [{
          required: true,
          message: '请填写主持人密码',
          trigger: 'blur'
        }],
        mettingPassword: [{
          required: true,
          message: '请填写参会密码',
          trigger: 'blur'
        }],
        roomNumber: [{
          validator: validate.isPositiveIntegers,
          required: true,
          ownMessage: '请填写会议室号',
          trigger: 'blur'
        }]
      },
      hasPrisonArea: false,
      gettingPrison: true,
      gettingPrisonArea: true,
      isPrisonArea: false
    }
  },
  computed: {
    ...mapState(['prisonAllWithBranchPrison', 'jailPrisonAreas'])
  },
  mounted() {
    this.getPrisonAllWithBranchPrison().then(() => {
      this.gettingPrison = false
    })
  },
  methods: {
    ...mapActions(['addTerminal', 'getJailPrisonAreas', 'getPrisonAllWithBranchPrison']),
    onSubmit() {
      this.$refs.terminal.validate(valid => {
        if (valid) {
          this.addTerminal(this.terminal).then(res => {
            if (!res) return
            this.$router.push('/terminal/list')
          })
        }
      })
    },
    onPrisonChange(e) {
      delete this.terminal.prisonConfigId
      this.isPrisonArea = false
      this.gettingPrisonArea = true
      let prison = this.prisonAllWithBranchPrison.find(item => item.id === e)
      if (prison.branchPrison === 1) {
        this.isPrisonArea = true
        this.getJailPrisonAreas({ jailId: e }).then(res => {
          if (!res) return
          if (this.jailPrisonAreas.length === 0) {
            this.$message.warning('请先导入罪犯数据')
            this.hasPrisonArea = false
          }
          else {
            this.hasPrisonArea = true
          }
          this.gettingPrisonArea = false
        })
      }
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>
