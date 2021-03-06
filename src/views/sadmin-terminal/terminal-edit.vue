<template>
  <el-row class="page-edit">
    <el-col
      :span="10"
      :offset="7">
      <el-form
        :model="formData"
        ref="terminal"
        :rules="rule"
        label-position="left"
        label-width="100px">
        <el-form-item
          label="终端号"
          prop="terminalNumber">
          <el-input
            v-model="formData.terminalNumber"
            placeholder="请填写终端号" />
        </el-form-item>
        <el-form-item
          label="终端别名"
          prop="terminalName">
          <el-input
            v-model="formData.terminalName"
            maxlength="10"
            placeholder="请填写终端别名" />
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
        <el-form-item label="会议室号" prop="roomNumber">
          <el-input
            v-model.number="formData.roomNumber"
            placeholder="请填写会议室号" />
        </el-form-item>
        <el-form-item
          label="所属监狱"
          prop="jailId">
          <el-select
            v-model="formData.jailId"
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

        <!-- <el-form-item
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
        </el-form-item> -->
        <el-form-item
          label="主持人密码"
          prop="hostPassword">
          <el-input
            v-model="formData.hostPassword"
            placeholder="请填写主持人密码" />
        </el-form-item>
        <el-form-item
          label="参会密码"
          prop="mettingPassword">
          <el-input
            v-model="formData.mettingPassword"
            placeholder="请填写参会密码" />
        </el-form-item>
        <el-form-item
          label="狱警通话开关"
          prop="meetingEnabled">
          <el-switch
            v-model="formData.meetingEnabled"
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
        @click="onSubmit">更新</el-button>
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
          message: '请选择监区',
          trigger: 'blur'
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

      gettingPrisonArea: true,
      gettingPrison: true,

      terminalTypes: switches.terminalTypes,

      formData: {},

      level: 1
    }
  },
  computed: {
    ...mapState([
      'prisonAllWithBranchPrison',
      'terminal',
      'jailPrisonAreas',
      'detailManyConfigs'
    ])
  },

  mounted() {
    this.getPrisonAllWithBranchPrison().then(() => {
      this.gettingPrison = false

      this.getTerminalDetail({ id: this.$route.params.id }).then(res => {
        if (!res) return

        this.formData = Object.assign({}, this.terminal)

        this.onPrisonChange(this.terminal.jailId, true)
      })
    })
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

    async onPrisonChange(e, init) {
      if (!init) {
        this.clearSubPrisonArea('prisonArea', this.formData)
        this.prisonConfigIdKey = 'jailId'
      } else this.prisonConfigIdKey = ''

      let prison = this.prisonAllWithBranchPrison.find(item => item.id === e)

      if (prison.branchPrison === 1) {
        this.$set(this.localPrisonAreaLevelObject['prisonArea'], 'gettingData', true)

        const res = await this.getJailPrisonAreas({ jailId: e })

        this.$set(this.localPrisonAreaLevelObject['prisonArea'], 'gettingData', false)

        if (!res) return

        if (this.jailPrisonAreas.length === 0) {
            this.$message.warning('请先导入罪犯数据')
        }

        this.$set(this.localPrisonAreaLevelObject['prisonArea'], 'options', this.jailPrisonAreas)

        if (init) {
          const { prisonConfigId } = this.terminal

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

          let values = {}

          if (level > 1) {
            constLevelObject[level].formDataKeys.forEach(key => {
              values = {
                ...values,
                [key]: this.detailManyConfigs[key]
              }
            })

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
          }

          this.formData = Object.assign({}, this.terminal, { areaId, ...values })
        }
      }
    },

    onGoBack() {
      this.$router.back()
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>
