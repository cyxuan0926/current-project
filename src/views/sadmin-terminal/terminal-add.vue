<template>
  <el-row class="page-edit">
    <el-col :span="10" :offset="7">
      <el-form
        :model="terminal"
        ref="terminal"
        :rules="rule"
        label-position="left"
        label-width="115px"
        class="el-form__terminal"
      >
        <el-form-item label="终端号" prop="terminalNumber">
          <el-input v-model="terminal.terminalNumber" placeholder="请填写终端号" />
        </el-form-item>

        <el-form-item label="终端别名" prop="terminalName">
          <el-input
            v-model="terminal.terminalName"
            maxlength="10"
            placeholder="请填写终端别名"
          />
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

        <el-form-item label="所属监狱" prop="jailId">
          <el-select
            v-model="terminal.jailId"
            filterable
            :loading="gettingPrison"
            placeholder="请选择监狱"
            @change="onPrisonChange"
          >
            <el-option
              v-for="prison in prisonAllWithBranchPrison"
              :key="prison.id"
              :label="prison.title"
              :value="prison.id"
            />
          </el-select>
        </el-form-item>

        <template v-for="(localPrisonAreaLevel, key) in localPrisonAreaLevelObject">
          <el-form-item
            v-if="localPrisonAreaLevel.options.length"
            :key="localPrisonAreaLevel.prop"
            :label="localPrisonAreaLevel.label"
            :prop="localPrisonAreaLevel.prop"
            :class="[ { 'el-form-item__areaId': key === 'prisonArea' } ]"
          >
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

        <el-form-item label="对应权限的用户名" prop="username">
          <el-select
            v-model="terminal.username"
            placeholder="请选择对应权限的用户名"
            clearable
          >
            <template v-for="user in terminalUserListsByPrisonConfigId">
              <el-option
                :key="user.prisonConfigId + user.username"
                :label="user.username"
                :value="user.username"
              />
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="所属业务" prop="businessType">
          <el-select v-model="terminal.businessType" placeholder="请选择所属业务">
            <template v-for="item of terminalBusinessTypeOptions">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="狱警通话开关" prop="meetingEnabled">
          <el-switch
            v-model="terminal.meetingEnabled"
            active-color="#13ce66"
            inactive-color="#dddddd"
            :active-value="1"
            :inactive-value="0"
            :width="60"
          />
        </el-form-item>
      </el-form>

      <el-button
        class="submit"
        type="primary"
        size="small"
        @click="onSubmit"
      >新增</el-button>

      <el-button
        class="submit"
        plain
        size="small"
        @click="onGoBack"
      >返回</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import validate from '@/utils'

import prisonAreaLevel from '@/mixins/prison-area-level'
export default {
  mixins: [prisonAreaLevel],

  data() {
    return {
      terminal: {
        businessType: 0
      }
    }
  },

  computed: {
    ...mapState([
      'prisonAllWithBranchPrison',
      'jailPrisonAreas',
      'terminalBusinessTypeOptions'
    ])
  },

  async mounted() {
    await this.getPrisonAllWithBranchPrison()

    this.gettingPrison = false
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
            meetingEnabled,
            username,
            businessType
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
            meetingEnabled,
            username,
            businessType
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

    async onPrisonChange(jailId) {
      this.prisonConfigIdKey = ''

      this.clearSubPrisonArea('prisonArea', this.terminal)

      this.$set(this.localPrisonAreaLevelObject['prisonArea'], 'gettingData', true)

      const response = await Promise.all([this.getJailPrisonAreas({ url: '/prison_config/getTerminalsPrisonConfigs', params: { jailId } }), this.onGetPrisonAreaUsersData({ jailId })])

      this.$set(this.localPrisonAreaLevelObject['prisonArea'], 'gettingData', false)

      this.$set(this.localPrisonAreaLevelObject['prisonArea'], 'options', this.jailPrisonAreas)
    },

    onGoBack() {
      this.$router.back()
    }
  }
}
</script>
