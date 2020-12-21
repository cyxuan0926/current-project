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
          label="终端别名"
          prop="terminalName">
          <el-input
            v-model="terminal.terminalName"
            maxlength="10"
            placeholder="请填写终端别名" />
        </el-form-item>
        <el-form-item label="终端类型" prop="terminalType">
          <el-select v-model="terminal.terminalType" placeholder="请选择终端类型">
            <el-option
              v-for="terminalType in terminalTypes"
              :key="terminalType.value"
              :label="terminalType.label"
              :value="terminalType.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="终端唯一标识" prop="terminalSn">
          <el-input v-model="terminal.terminalSn" placeholder="请填写终端唯一标识" />
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
            :loading="gettingPrison"
            placeholder="请选择监狱"
            @change="onPrisonChange">
            <el-option
              v-for="prison in prisonAllWithBranchPrison"
              :key="prison.id"
              :label="prison.title"
              :value="prison.id"/>
          </el-select>
        </el-form-item>

        <template v-for="(localPrisonAreaLevel, key) in localPrisonAreaLevelObject">
          <el-form-item
            v-if="localPrisonAreaLevel.options.length"
            :key="localPrisonAreaLevel.prop"
            :label="localPrisonAreaLevel.label"
            :prop="localPrisonAreaLevel.prop">
            <el-select
              v-model="terminal[localPrisonAreaLevel.prop]"
              filterable
              :loading="localPrisonAreaLevel.gettingData"
              :placeholder="'请选择' + localPrisonAreaLevel.label"
              @change="onPrisonAreaLevelDataChange({ key, parentId: terminal[localPrisonAreaLevel.prop], budingObject: terminal })"
            >
              <el-option
                v-for="item in localPrisonAreaLevel.options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </template>

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
        <el-form-item
          label="狱警通话开关"
          prop="meetingEnabled">
          <el-switch
            v-model="terminal.meetingEnabled"
            active-color="#13ce66"
            inactive-color="#dddddd"
            :active-value="1"
            :inactive-value="0"
            :width="60" />
        </el-form-item>
      </el-form>
      <el-button
        class="submit"
        type="primary"
        size="small"
        @click="onSubmit">新增</el-button>
      <el-button
        class="submit"
        plain
        size="small"
        @click="onGoBack">返回</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import validate from '@/utils'

import switches from '@/filters/modules/switches'

import prisonAreaLevel from '@/mixins/prison-area-level'

export default {
  mixins: [prisonAreaLevel],

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
        areaId: [{
          required: true,
          message: '请选择监区'
        }],
        branchId: [{
          required: true,
          message: '请选择分监区'
        }],
        buildingId: [{
          required: true,
          message: '请选择楼栋'
        }],
        layerId: [{
          required: true,
          message: '请选择楼层'
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
        }],
        terminalType: [
          {
            required: true,
            message: '请选择终端类型'
          }
        ]
      },

      gettingPrison: true,

      terminalTypes: switches.terminalTypes
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
    ...mapActions([
      'addTerminal',
      'getJailPrisonAreas',
      'getPrisonAllWithBranchPrison'
    ]),

    onSubmit() {
      this.$refs.terminal.validate(valid => {
        if (valid) {
          const {
            terminalNumber,
            terminalName,
            terminalType,
            terminalSn,
            roomNumber,
            hostPassword,
            jailId,
            mettingPassword,
            meetingEnabled
          } = this.terminal

          let params = {
            terminalNumber,
            terminalName,
            terminalType,
            terminalSn,
            roomNumber,
            hostPassword,
            jailId,
            mettingPassword,
            meetingEnabled
          }

          const prisonConfigId = this.prisonConfigIdKey ? this.terminal[this.localPrisonAreaLevelObject[this.prisonConfigIdKey]['prop']] : null

          params = {
            ...params,
            prisonConfigId
          }

          this.addTerminal(params).then(res => {
            if (!res) return
            this.$router.push('/terminal/list')
          })
        }
      })
    },

    onPrisonChange(e) {
      this.prisonConfigIdKey = ''

      this.clearSubPrisonArea('prisonArea', this.terminal)

      this.$set(this.localPrisonAreaLevelObject['prisonArea'], 'gettingData', true)

      this.getJailPrisonAreas({ url: '/getTerminalsPrisonConfigs', params: { jailId: e } }).then(res => {
        this.$set(this.localPrisonAreaLevelObject['prisonArea'], 'gettingData', false)

        if (!res) return

        this.$set(this.localPrisonAreaLevelObject['prisonArea'], 'options', this.jailPrisonAreas)

        if (this.jailPrisonAreas.length === 0) this.$message.warning('请先导入罪犯数据')
      })
    },

    onGoBack() {
      this.$router.back()
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>
