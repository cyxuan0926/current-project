<template>
  <el-row class="page-edit">
    <el-col :span="10" :offset="7">
      <el-form
        :model="formData"
        ref="terminal"
        :rules="rule"
        label-position="left"
        label-width="115px"
      >
        <el-form-item label="终端号" prop="terminalNumber">
          <el-input v-model="formData.terminalNumber" placeholder="请填写终端号" />
        </el-form-item>

        <el-form-item label="终端别名" prop="terminalName">
          <el-input
            v-model="formData.terminalName"
            maxlength="10"
            placeholder="请填写终端别名"
          />
        </el-form-item>

        <el-form-item label="终端类型" prop="terminalType">
          <el-select v-model="formData.terminalType" placeholder="请选择终端类型">
            <el-option
              v-for="terminalType in terminalTypes"
              :key="terminalType.value"
              :label="terminalType.label"
              :value="terminalType.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="终端唯一标识" prop="terminalSn">
          <el-input v-model="formData.terminalSn" placeholder="请填写终端唯一标识" />
        </el-form-item>

        <el-form-item label="所属监狱" prop="jailId">
          <el-select
            v-model="formData.jailId"
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
            :class="[ { 'el-form-iten__areaId': key === 'prisonArea' } ]"
          >
            <el-select
              v-model="formData[localPrisonAreaLevel.prop]"
              filterable
              :loading="localPrisonAreaLevel.gettingData"
              :placeholder="'请选择' + localPrisonAreaLevel.label"
              @change="onPrisonAreaLevelDataChange({ key, parentId: formData[localPrisonAreaLevel.prop], budingObject: formData })"
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
          <el-select v-model="formData.username" placeholder="请选择对应权限的用户名">
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
          <el-select v-model="formData.businessType" placeholder="请选择所属业务">
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
            v-model="formData.meetingEnabled"
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
      >更新</el-button>

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
    const checkAreaId = (rule, value, callback) => {
      if (!value && value !== null) {
        callback(new Error('请选择监区'))
      } else callback()
    }

    return {
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

        areaId: [{ validator: checkAreaId }],

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

        terminalType: [
          {
            required: true,
            message: '请选择终端类型'
          }
        ]
      },

      gettingPrisonArea: true,

      gettingPrison: true,

      terminalTypes: this.$store.state.terminalTypes,

      formData: {},

      level: 1
    }
  },
  computed: {
    ...mapState([
      'prisonAllWithBranchPrison',
      'terminal',
      'jailPrisonAreas',
      'detailManyConfigs',
      'terminalBusinessTypeOptions'
    ])
  },

  async mounted() {
    const response = await Promise.all([this.getPrisonAllWithBranchPrison(), this.getTerminalDetail({ id: this.$route.params.id })])

    this.gettingPrison = false

    if (!response[1]) return

    this.formData = Object.assign({}, this.terminal)

    await this.onPrisonChange(this.terminal.jailId, true)
  },

  methods: {
    ...mapActions([
      'getTerminalDetail',
      'getJailPrisonAreas',
      'updateTerminal',
      'getPrisonAllWithBranchPrison',
      'getDetailMany'
    ]),

    onSubmit() {
      this.$refs.terminal.validate(valid => {
        if (valid) {
          let params = {
            ...this.formData
          }

          if (this.prisonConfigIdKey && this.prisonConfigIdKey !== 'jailId') {
            const prop = this.localPrisonAreaLevelObject[this.prisonConfigIdKey]['prop']

            params = {
              ...params,
              prisonConfigId: this.formData[prop]
            }
          }

          if (this.prisonConfigIdKey === 'jailId') {
            params = {
              ...params,
              prisonConfigId: null
            }
          }

          let prisonConfigs = ['areaId', 'branchId', 'buildingId', 'layerId']

          prisonConfigs.forEach(item => {
            delete params[item]
          })

          this.updateTerminal(params).then(res => {
            if (!res) return

            this.$router.push('/terminal/list')
          })
        }
      })
    },

    async onPrisonChange(jailId, init) {
      const { prisonConfigId } = this.terminal

      if (!init) {
        this.clearSubPrisonArea('prisonArea', this.formData)

        this.prisonConfigIdKey = 'jailId'
      } else this.prisonConfigIdKey = ''

      this.$set(this.localPrisonAreaLevelObject['prisonArea'], 'gettingData', true)

      const res = await Promise.all([this.getJailPrisonAreas({ url: '/prison_config/getTerminalsPrisonConfigs', params: { jailId } }), this.onGetPrisonAreaUsersData({ jailId, prisonConfigId }, this.formData)])

      this.$set(this.localPrisonAreaLevelObject['prisonArea'], 'gettingData', false)

      if (!res[0]) return

      this.$set(this.localPrisonAreaLevelObject['prisonArea'], 'options', this.jailPrisonAreas)

      if (init) {
        // 会见楼
        if (prisonConfigId === -1) this.formData = Object.assign({}, this.terminal, { areaId: -1 })

        // 其余正常情况
        else if (prisonConfigId) {
          await this.getDetailMany({ id: prisonConfigId })

          const { level, areaId } = this.detailManyConfigs

          const constLevelObject = {
            [2]: {
              keys: ['prisonArea'],

              formDataKeys: ['branchId']
            },

            [3]: {
              keys: ['prisonArea', 'prisonBranch'],

              formDataKeys: ['branchId', 'buildingId']
            },

            [4]: {
              keys: ['prisonArea', 'prisonBranch', 'prisonBuilding'],

              formDataKeys: ['branchId', 'buildingId', 'layerId']
            }
          }

          if (level > 1) {
            const values = constLevelObject[level].formDataKeys.reduce((accumulator, key) => {
              return {
                ...accumulator,
                [key]: this.detailManyConfigs[key]
              }
            }, {})

            const temp = constLevelObject[level].keys.map(key => {
              if(this.localPrisonAreaLevelObject[key].childNode) {
                const formDataKey = this.localPrisonAreaLevelObject[key]['prop']

                return this.$store.dispatch('getChildPrisonConfigs', { parentId: this.detailManyConfigs[formDataKey] })
              }
            })

            const result = await Promise.all(temp)

            constLevelObject[level].keys.forEach((key, index) => {
              if(this.localPrisonAreaLevelObject[key].childNode) {
                const childNode = this.localPrisonAreaLevelObject[key].childNode

                this.$set(this.localPrisonAreaLevelObject[childNode], 'options', result[index])
              }
            })

            this.formData = Object.assign({}, this.terminal, { areaId, ...values })
          } else this.formData = Object.assign({}, this.terminal, { areaId })

        } else this.formData = Object.assign({}, this.terminal, { areaId: null }) //  null 是非会见楼 强制刷成null
      }
    },

    onGoBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  /deep/ .el-form-iten__areaId {
    .el-form-item__label {
      &::before {
        content: '*';
        color: #F56C6C;
         margin-right: 4px;
      }
    }
  }
}
</style>
