<template>
  <div class="prison-charge-config">
    <!-- 基础配置 -->
    <m-form
      class="prison-charge-config_basic-form"
      ref="prison-charge-config_basic-form"
      :items="basicFormItems"
      :values="basicFormValues"
      @response="onBasicFormSyncData"
    >
      <template #elTableSlot>
        <m-table-new :cols="tableCols" :data="tableData">
          <template #selectElement="{ row }">
            <el-radio-group v-model="radio" @change="onShowChargeConfigsItems">
              <template v-for="duration in meetingChargeConfigDurations">
                <el-radio
                  v-if="duration === row.duration"
                  :key="duration"
                  :label="duration">&nbsp;</el-radio>
              </template>            
            </el-radio-group>
          </template>
        </m-table-new>
      </template>
      
      <template #basicConfigs>
        <el-col :span="11">
          <el-form-item prop="startMinutes" :rules="basicFormRules.startMinutes">
            <el-input
              v-model.trim.number="basicFormData.startMinutes"
              placeholder="请输入基础时间"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="startMoney" :rules="basicFormRules.startMoney">
            <el-input
              v-model.trim="basicFormData.startMoney"
              placeholder="请输入基础费用"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>

      <template #fixedMoney>
        <el-col :span="11">
          <el-form-item prop="fixedMoney" :rules="basicFormRules.fixedMoney">
            <el-input
              v-model.trim="basicFormData.fixedMoney"
              placeholder="请输入基础时长后每分钟费用"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>

      <template #totalCost>
        <el-col :span="11">
          <el-form-item prop="typeTotalCost">
            <el-input
              v-model="typeTotalCost"
              placeholder="请输入申请会见总费用"
              disabled
            >
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>
    </m-form>

    <!-- 预保存 -->
    <el-row v-if="radio" class="prison-charge-config-button_box">
      <el-button
        size="small"
        type="primary"
        @click="onPreSaveBasicForm">保存</el-button>
  
      <el-button
        size="small"
        @click="onHideChargeConfigsItems">取消</el-button>
    </el-row>

    <!-- 外交领事官员/短信/亲情电话收费配置 -->
    <m-form
      class="prison-charge-config_diplomaticConsulOfficial-form"
      ref="prison-charge-config_diplomaticConsulOfficial-form"
      :items="diplomaticConsulOfficialFormItems"
      :values="diplomaticConsulOfficialFormValues"
      @submit="onUpdate"
      @response="onDiplomaticConsulOfficialFormSyncData"
    >
      <template #diplomaticConsulOfficialBasicConfigs>
        <el-col :span="11">
          <el-form-item prop="startMinutes" :rules="diplomaticConsulOfficialRules.startMinutes">
            <el-input
              v-model.trim.number="diplomaticConsulOfficialFormData.startMinutes"
              placeholder="请输入基础时间"
              :disabled="$route.meta.role === '3'"
            >

              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="startMoney" :rules="diplomaticConsulOfficialRules.startMoney">
            <el-input
              v-model.trim="diplomaticConsulOfficialFormData.startMoney"
              placeholder="请输入基础费用"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>

      <template #diplomaticConsulOfficialFixedMoney>
        <el-col :span="11">
          <el-form-item prop="fixedMoney" :rules="diplomaticConsulOfficialRules.fixedMoney">
            <el-input
              v-model.trim="diplomaticConsulOfficialFormData.fixedMoney"
              placeholder="请输入基础时长后每分钟费用"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>

      <template #familyPhoneBasicConfigs>
        <el-col :span="11">
          <el-form-item prop="familyPhoneStartMinutes" :rules="diplomaticConsulOfficialRules.familyPhoneStartMinutes">
            <el-input
              v-model.trim.number="diplomaticConsulOfficialFormData.familyPhoneStartMinutes"
              placeholder="请输入基础时间"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="familyPhoneStartMoney" :rules="diplomaticConsulOfficialRules.familyPhoneStartMoney">
            <el-input
              v-model.trim="diplomaticConsulOfficialFormData.familyPhoneStartMoney"
              placeholder="请输入基础费用"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>

      <template #familyPhoneFixedMoney>
        <el-col :span="11">
          <el-form-item prop="familyPhoneFixedMoney" :rules="diplomaticConsulOfficialRules.familyPhoneFixedMoney">
            <el-input
              v-model.trim="diplomaticConsulOfficialFormData.familyPhoneFixedMoney"
              placeholder="请输入基础时长后每分钟费用"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>

      <template #familyPhoneTotalCost>
        <el-col :span="11">
          <el-form-item prop="familyPhoneTotalCost">
            <el-input
              v-model="familyPhoneTotalCost"
              placeholder="请输入亲情电话总费用"
              disabled
            >
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>
    </m-form>

    <!-- 操作 -->
    <el-row class="prison-charge-config-button_box">
      <el-button
        :disabled="!!radio"
        size="small"
        type="primary"
        @click="onPrediplomaticConsulOfficialFormCheck">更新</el-button>

      <el-button
        size="small"
        @click="onGoBack">返回</el-button>
    </el-row>
  </div>
</template>

<script>

import { meetingChargeConfigDurations } from '@/common/constants/const'

import roles from '@/common/constants/roles'

import { mapActions, mapState } from 'vuex'

import cloneDeep from 'lodash/cloneDeep'

import Moment from 'moment'

import BigNumber from 'bignumber.js'

import { Message } from 'element-ui'

import { hasValue } from '@/utils/helper'

export default {
  data() {
    const id = this.$route.params.id

    const disabled = this.$route.meta.role === '3'

    const formConfigs = { labelWidth: '180px' }

    const waysOptions = [
      {
        value: '按次收费',
        label: 1
      },
      {
        value: '按分钟收费',
        label: 2
      }
    ]

    const validateMoney = (rule, value, callback) => {
      const { field, inputParams } = rule

      const feeReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/

      if (inputParams[field] === '') callback(new Error('请输入基础费用'))

      else if (!feeReg.test(inputParams[field])) callback(new Error('请输入大于0的数字,且最多保留两位小数'))

      else callback()
    }

    const validateMinutes = (rule, value, callback) => {
      const { field, inputParams, max } = rule

      const integerNumbers = Number.isInteger(inputParams[field])

      if (inputParams[field] === '') callback(new Error('请输入基础时间'))

      else if (!integerNumbers || inputParams[field] < 0) callback(new Error(`请输入正整数`))

      else if (max && inputParams[field] > max) callback(new Error(`请输入正整数, 并且最大不超过${ max }`))

      else callback()
    }

    const validateFixedMoney = (rule, value, callback) => {
      const { field, inputParams } = rule

      const feeReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/

      if (inputParams[field] === '') callback(new Error('请输入基础时长后每分钟费用'))

      else if (!feeReg.test(inputParams[field])) callback(new Error('请输入大于0的数字,且最多保留两位小数'))

      else callback()
    }

    const fields = [
      'startMinutes',
      'startMoney',
      'fixedMoney'
    ]

    const familyPhoneFields = [
      'familyPhoneStartMinutes',
      'familyPhoneStartMoney',
      'familyPhoneFixedMoney'
    ]

    const cols = [
      {
        label: '选中项',
        slotName: 'selectElement',
        width: 60
      },
      {
        label: '通话时长(分钟)',
        prop: 'duration'
      }
    ]

    const basicFormChargeObject = {
      [1]: {
        tableCols: [
          ...cols,

          {
            label: '单次费用',
            prop: 'onceMoney'
          }
        ],

        tableData: [],

        formItemconfigs: {
          value: 1,

          itemConfigs: {
            basicConfigs: 0,
            fixedMoney: 0,
            totalCost: 0
          }
        },

        fields: []
      },

      [2]: {
        tableCols: [
          ...cols,

          {
            label: '基础通话时长(分钟)',
            prop: 'startMinutes',
            minWidth: 100
          },

          {
            label: '基础通话收费(分钟)',
            prop: 'startMoney',
            minWidth: 100
          },

          {
            label: '基础时长后每分钟费用(元)',
            prop: 'fixedMoney',
            minWidth: 120
          },

          {
            label: '申请可视电话总费用(元)',
            prop: 'onceMoney',
            minWidth: 110
          }
        ],

        tableData: [],

        formItemconfigs: {
          value: 2,

          itemConfigs: {
            onceMoney: 0
          }
        },

        fields
      }
    }

    const diplomatistChargeObject = {
      [0]: {
        itemConfigs: { diplomaticConsulOfficialBasicConfigs: 0, diplomaticConsulOfficialFixedMoney: 0 },

        dissMissConfigs: [ 'diplomaticConsulOfficialBasicConfigs', 'diplomaticConsulOfficialFixedMoney' ],

        fields: []
      },

      [1]: {
        itemConfigs: {},

        dissMissConfigs: [],

        fields
      }
    }

    const familyPhoneChargeObject = {
      [0]: {
        itemConfigs: {
          familyPhoneDuration: 10,
          familyPhoneBasicConfigs: 0,
          familyPhoneFixedMoney: 0,
          familyPhoneTotalCost: 0
        },

        dissMissConfigs: [
          'familyPhoneDuration',
          'familyPhoneBasicConfigs',
          'familyPhoneFixedMoney',
          'familyPhoneTotalCost'
        ],

        fields: []
      },

      [1]: {
        itemConfigs: {},

        dissMissConfigs: [],

        fields: familyPhoneFields
      }
    }

    const basicFormAllDissMissCofigs = [
      'basicConfigs',
      'fixedMoney',
      'totalCost',
      'onceMoney',
      'duration'
    ]

    const basicStartMinutes = { validator: validateMinutes, trigger: 'blur' }

    const basicStartMoney = { validator: validateMoney, trigger: 'blur' }

    const basicFixedMoney = { validator: validateFixedMoney, trigger: 'blur' }
    return {
      id,

      basicStartMinutes,

      basicStartMoney,

      basicFixedMoney,

      basicFormAllDissMissCofigs,

      diplomatistChargeObject,

      familyPhoneChargeObject,

      localChargeType: '',

      diplomaticConsulOfficialFormValues: {},

      basicFormValues: {},

      radio: null,

      meetingChargeConfigDurations,

      basicFormChargeObject,

      tableCols: [],

      tableData: [],

      basicFormData: {
        startMinutes: 5,

        startMoney: 15,

        fixedMoney: 2.2
      },

      diplomaticConsulOfficialFormItems: {
        formConfigs,

        diplomatistCharge: {
          type: 'switch',

          label: '外交领事官员可视电话收费设置',

          disabled,

          func: this.onDiplomatistOrFamilyPhoneChargeChange,

          value: 0,

          relativeProps: ['familyPhoneCharge'],

          configs: [
            // 关闭外交领事官员可视电话收费设置
            {
              value: 0,

              itemConfigs: cloneDeep(diplomatistChargeObject[0]['itemConfigs'])
            },

            // 打开外交领事官员可视电话收费设置
            {
              value: 1,

              itemConfigs: cloneDeep(diplomatistChargeObject[1]['itemConfigs'])
            }
          ]
        },

        diplomaticConsulOfficialBasicConfigs: {
          slotName: 'diplomaticConsulOfficialBasicConfigs',

          attrs: {
            label: '基础费用',

            required: true
          },

          func: this.onReset
        },

        diplomaticConsulOfficialFixedMoney: {
          slotName: 'diplomaticConsulOfficialFixedMoney',

          attrs: {
            label: '基础时长后每分钟费用',

            required: true
          }
        },

        messageCost: {
          type: 'input',

          label: '短信收费设置',

          placeholder: '请输入短信收费',

          rules: ['isFee'],

          disabled,

          append: '元/条',

          customClass: ['el-form-item__message-set'],

          value: 0
        },

        // 亲情电话收费设置
        familyPhoneCharge: {
          type: 'switch',

          label: '亲情电话收费设置',

          disabled,

          func: this.onDiplomatistOrFamilyPhoneChargeChange,

          value: 0,

          relativeProps: ['diplomatistCharge'],

          configs: [
            // 关闭亲情电话收费设置
            {
              value: 0,

              itemConfigs: cloneDeep(familyPhoneChargeObject[0]['itemConfigs'])
            },

            // 打开亲情电话收费设置
            {
              value: 1,

              itemConfigs: cloneDeep(familyPhoneChargeObject[1]['itemConfigs'])
            }
          ]
        },

        familyPhoneDuration: {
          type: 'input',

          label: '通话时长',

          disabled: true,

          rules: ['required'],

          append: '分钟',

          customClass: ['el-form-item_once-monney'],

          value: 10
        },

        familyPhoneBasicConfigs: {
          slotName: 'familyPhoneBasicConfigs',

          attrs: {
            label: '基础费用',
            required: true
          },

          func: this.onReset
        },

        familyPhoneFixedMoney: {
          slotName: 'familyPhoneFixedMoney',

          attrs: {
            label: '基础时长后每分钟费用',
            required: true
          }
        },

        familyPhoneTotalCost: {
          slotName: 'familyPhoneTotalCost',

          attrs: {
            label: '亲情电话总费用'
          }
        },
      },

      diplomaticConsulOfficialFormData: {
        startMinutes: 5,

        startMoney: 12,

        fixedMoney: 1.8,

        familyPhoneStartMinutes: 0,

        familyPhoneStartMoney: 0,

        familyPhoneFixedMoney: 0
      },

      basicFormItems: {
        formConfigs,

        chargeType: {
          type: 'radio',

          label: '收费方式',

          disabled,

          rules: ['required'],

          props: {
            label: 'label',
            value: 'value'
          },

          options: waysOptions,

          customClass: ['el-form-item_charge-type'],

          configs: [
            // 按次付费
            cloneDeep(basicFormChargeObject[1]['formItemconfigs']),

            // 按分钟收费
            cloneDeep(basicFormChargeObject[2]['formItemconfigs'])
          ],

          func: this.onFormTableDataChange
        },

        elTableSlot: {
          relativeProps: ['chargeType']
        },

        duration: {
          type: 'input',

          label: '通话时长',

          disabled: true,

          rules: ['required'],

          append: '分钟',

          customClass: ['el-form-item_once-monney'],

          value: 5
        },

        basicConfigs: {
          slotName: 'basicConfigs',

          attrs: {
            label: '基础费用',
            required: true
          }
        },

        fixedMoney: {
          slotName: 'fixedMoney',

          attrs: {
            label: '基础时长后每分钟费用',
            required: true
          }
        },

        totalCost: {
          slotName: 'totalCost',

          attrs: {
            label: '申请可视电话总费用'
          }
        },

        onceMoney: {
          type: 'input',

          label: '单次费用',

          disabled,

          rules: [
            'required',
            'isFee'
          ],

          append: '/元',

          customClass: ['el-form-item_once-monney'],

          value: 0
        }
      },

      basicFormSyncData: {},

      diplomaticConsulOfficialFormSyncData: {}
    }
  },

  computed: {
    ...mapState(['prisonChargeConfigs']),

    basicFormRules() {
      const inputParams = this.basicFormData

      return ({
        startMinutes: [
          { ...cloneDeep(this.basicStartMinutes), inputParams, max: this.radio }
        ],

        startMoney: [
          { ...cloneDeep(this.basicStartMoney), inputParams }
        ],

        fixedMoney: [
          { ...cloneDeep(this.basicFixedMoney), inputParams }
        ]
      })
    },

    diplomaticConsulOfficialRules() {
      const inputParams =  this.diplomaticConsulOfficialFormData

      const minutes = { ...cloneDeep(this.basicStartMinutes), inputParams }

      const money = { ...cloneDeep(this.basicStartMoney), inputParams }

      const fixedMoney = { ...cloneDeep(this.basicFixedMoney), inputParams }

      return ({
        startMinutes: [minutes],

        startMoney: [money],

        fixedMoney: [fixedMoney],

        familyPhoneStartMinutes: [{ ...minutes, max: 10 }],

        familyPhoneStartMoney: [money],

        familyPhoneFixedMoney: [fixedMoney]
      })
    },

    typeTotalCost() {
      const {
        startMoney,
        startMinutes,
        fixedMoney
      } = this.basicFormData

      if (
        !hasValue(this.radio) ||
        !hasValue(startMoney) ||
        !hasValue(startMinutes) ||
        !hasValue(fixedMoney) ||
        this.localChargeType === 1 ||
        +this.radio < +startMinutes
      ) return 0

      else {
        const cost = new BigNumber(startMoney).plus(new BigNumber(this.radio - startMinutes).times(fixedMoney)).toNumber()

        return cost
      }
    },

    currentChargeTypeConfigs() {
      return this.basicFormChargeObject[this.localChargeType]
    },

    familyPhoneTotalCost() {
      const {
        familyPhoneStartMinutes,
        familyPhoneStartMoney,
        familyPhoneFixedMoney
      } = this.diplomaticConsulOfficialFormData, { familyPhoneDuration } = this.diplomaticConsulOfficialFormSyncData

      if (
        !hasValue(familyPhoneDuration) ||
        !hasValue(familyPhoneStartMinutes) ||
        !hasValue(familyPhoneStartMoney) ||
        !hasValue(familyPhoneFixedMoney)
      ) return 0

      else {
        const cost = new BigNumber(familyPhoneStartMoney).plus(new BigNumber(familyPhoneDuration - familyPhoneStartMinutes).times(familyPhoneFixedMoney)).toNumber()

        return cost
      }
    }
  },

  methods: {
    ...mapActions(['getMeetingChargeTemplate', 'setMeetingChargeTemplate']),

    // 返回
    onGoBack() {
      if (this.$store.getters.role === roles.SUPER_ADMIN) this.$router.push({ path: '/prison/list' })

      else this.$router.push({ path: '/jails/detail' })
    },

    // 外交领事官员 初始化数据
    onReset(e, prop) {
      const { diplomatistMct, familyPhoneMct = {} } = this.prisonChargeConfigs

      let {
        startMoney = 15,
        startMinutes = 5,
        fixedMoney = 2.2
      } = diplomatistMct, {
        duration = 10,
        familyPhoneStartMinutes = 0,
        familyPhoneStartMoney = 0,
        familyPhoneFixedMoney = 0
      } = familyPhoneMct

      startMoney = hasValue(startMoney) ? startMoney : 15

      startMinutes = hasValue(startMinutes) ? startMinutes : 5

      fixedMoney = hasValue(fixedMoney) ? fixedMoney : 2.2

      familyPhoneStartMinutes = hasValue(familyPhoneStartMinutes) ? familyPhoneStartMinutes : 0

      familyPhoneStartMoney = hasValue(familyPhoneStartMoney) ? familyPhoneStartMoney : 0

      familyPhoneFixedMoney = hasValue(familyPhoneFixedMoney) ? familyPhoneFixedMoney : 0

      const _temp = {
        diplomatistCharge: [
          {
            key: 'startMinutes',
            value: startMinutes
          },
          {
            key: 'startMinutes',
            value: startMinutes
          },
          {
            key: 'fixedMoney',
            value: fixedMoney
          }
        ],

        familyPhoneCharge: [
          {
            key: 'familyPhoneStartMinutes',
            value: familyPhoneStartMinutes
          },
          {
            key: 'familyPhoneStartMoney',
            value: familyPhoneStartMoney
          },
          {
            key: 'familyPhoneFixedMoney',
            value: familyPhoneFixedMoney
          }
        ]
      }

      _temp[prop].forEach(item => {
        this.$set(this.diplomaticConsulOfficialFormData, item['key'], item['value'])
      })
    },

    // 外交领事官员开关/亲情电话收费开关切换
    onDiplomatistOrFamilyPhoneChargeChange(e, prop, item) {
      this.$refs['prison-charge-config_diplomaticConsulOfficial-form'].radioChangeEvent(e, prop, item)
    },

    // 初始化数据
    // familyPhoneMct：亲情电话收费配置
    // familyPhoneCharge: 亲情电话收费开关
    async onInitData() {
      await this.getMeetingChargeTemplate({ id: this.id })

      const clonePrisonChargeConfigs = cloneDeep(this.prisonChargeConfigs)

      const {
        chargeType,
        diplomatistCharge,
        prisonMctList,
        diplomatistMct,
        familyPhoneMct = {
          duration: 10,
          familyPhoneStartMinutes: 0,
          familyPhoneStartMoney: 0,
          familyPhoneFixedMoney: 0
        },
        familyPhoneCharge = 0,
        messageCost = 0
      } = clonePrisonChargeConfigs


      this.localChargeType = chargeType

      this.basicFormValues = Object.assign({}, { chargeType })

      // 基础数据类型不对
      this.diplomaticConsulOfficialFormValues = Object.assign({}, {
        diplomatistCharge,
        familyPhoneCharge,
        familyPhoneDuration: hasValue(familyPhoneMct['duration']) ? familyPhoneMct['duration'] : 10,
        messageCost
      })

      for (let key of Object.keys(this.basicFormChargeObject)) {
        const temp = prisonMctList.filter(meetingDurationConfigs => meetingDurationConfigs.type === +key)

        this.$set(this.basicFormChargeObject[key], 'tableData', temp)
      }

      const _temp = [
        {
          key: 'diplomatistCharge',
          values: this.diplomatistChargeObject[diplomatistCharge],
          type: diplomatistCharge,
          params: diplomatistMct
        },
        {
          key: 'familyPhoneCharge',
          values: this.familyPhoneChargeObject[familyPhoneCharge],
          type: familyPhoneCharge,
          params: familyPhoneMct,
          currentKeys: [
            'startMinutes',
            'startMoney',
            'fixedMoney'
          ]
        }
      ]

      _temp.forEach((item, index) => {
        const {
          itemConfigs,
          dissMissConfigs,
          fields
        } = cloneDeep(item.values), { key, type, params, currentKeys } = item

        this.$set(this.diplomaticConsulOfficialFormItems[key]['configs'][type], 'itemConfigs', itemConfigs)

        if (index !== 0) this.$set(this.diplomaticConsulOfficialFormItems, 'dissMissConfigs', [...this.diplomaticConsulOfficialFormItems['dissMissConfigs'], ...dissMissConfigs])

        else this.$set(this.diplomaticConsulOfficialFormItems, 'dissMissConfigs', dissMissConfigs)

        fields.forEach((field, index) => {
          let values

          if (currentKeys && Array.isArray(currentKeys) && currentKeys.length) values = params[currentKeys[index]]

          else values = params[field]

          hasValue(values) && this.$set(this.diplomaticConsulOfficialFormData, field, values)
        })
      })

      this.$set(this.basicFormItems, 'dissMissConfigs', this.basicFormAllDissMissCofigs)

      const { tableCols, tableData } = this.currentChargeTypeConfigs

      this.tableCols = tableCols

      this.tableData = tableData

      if (this.radio) this.onHideChargeConfigsItems()
    },

    // 收费方式选项切换
    onFormTableDataChange(value, prop, currentItemCofigs) {
      this.localChargeType = value

      const { tableCols, tableData } = this.currentChargeTypeConfigs

      this.tableCols = tableCols

      this.tableData = tableData

      this.onHideChargeConfigsItems()
    },

    // 显示form组件收费配置items 并且初始数据
    onShowChargeConfigsItems(duration) {
      const prop = 'elTableSlot'

      const chargeTypeProp = 'chargeType'

      const item = this.basicFormItems[prop]

      const { formItemconfigs } = this.currentChargeTypeConfigs

      this.$set(this.basicFormItems[chargeTypeProp]['configs'], [this.localChargeType - 1], cloneDeep(formItemconfigs))

      this.$refs['prison-charge-config_basic-form'].radioChangeEvent(this.localChargeType, prop, item)

      const { tableData, fields } = this.currentChargeTypeConfigs

      const data = tableData.filter(item => item.duration === this.radio)

      const [ values ] = data

      this.basicFormValues = Object.assign({}, this.basicFormValues, { ...values, chargeType: this.localChargeType })

      fields.forEach(field => {
        const value = values[field]

        this.$set(this.basicFormData, field, value)
      })

      this.$refs['prison-charge-config_basic-form'] && this.$refs['prison-charge-config_basic-form'].onClearValidate()
    },

    // 隐藏form组件收费配置items
    onHideChargeConfigsItems() {
      const temp = {
        duration: 5,
        basicConfigs: 0,
        fixedMoney: 0,
        totalCost: 0,
        onceMoney: 0
      }

      const prop = 'elTableSlot'

      const item = this.basicFormItems[prop]

      const chargeTypeProp = 'chargeType'

      this.radio = null

      Object.keys(this.basicFormChargeObject).forEach((item, index) => {
        this.$set(this.basicFormItems[chargeTypeProp]['configs'][index], 'itemConfigs', temp)
      })

      this.$refs['prison-charge-config_basic-form'].radioChangeEvent(this.localChargeType, prop, item)
    },

    // form组件响应的数据
    onBasicFormSyncData(values) {
      this.basicFormSyncData = Object.assign({}, values)
    },

    onDiplomaticConsulOfficialFormSyncData(values) {
      this.diplomaticConsulOfficialFormSyncData = Object.assign({}, values)
    },

    // 预先保存收费配置
    async onPreSaveBasicForm() {
      const isChecked = await this.$refs['prison-charge-config_basic-form'].onCheck()

      if (isChecked) {
        const { tableData } = this.currentChargeTypeConfigs

        const $index = tableData.findIndex(item => item.duration === this.radio)

        const temp = this.localChargeType === 1 ? this.basicFormSyncData : { ...this.basicFormData, onceMoney: this.typeTotalCost }

        const values = { ...tableData[$index], ...temp }

        this.$set(tableData, $index, values)

        this.onHideChargeConfigsItems()

        Message.closeAll()

        Message({
          showClose: true,
          message: '预保存收费配置成功',
          duration: 2000,
          type: 'success'
        })
      }
    },

    // 更新配置
    async onUpdate(values) {
      const copy = cloneDeep(this.prisonChargeConfigs)

      const {
        diplomatistCharge,
        messageCost,
        familyPhoneCharge,
        familyPhoneDuration
      } = values

      const { jailId } = copy

      const { tableData } = this.currentChargeTypeConfigs

      const prisonMctList = tableData

      let params = {
        diplomatistCharge,
        jailId,
        prisonMctList,
        chargeType: this.localChargeType,
        messageCost: +messageCost,
        familyPhoneCharge
      }

      if (diplomatistCharge) {
        let { diplomatistMct } = copy

        diplomatistMct = { ...diplomatistMct, ...this.diplomaticConsulOfficialFormData }

        params = {
          ...params,
          diplomatistMct
        }
      }

      if (familyPhoneCharge) {
        const _temp = [
          {
            key: 'familyPhoneFixedMoney',
            defineKey: 'fixedMoney'
          },
          {
            key: 'familyPhoneStartMinutes',
            defineKey: 'startMinutes'
          },
          {
            key: 'familyPhoneStartMoney',
            defineKey: 'startMoney'
          }
        ]

        let { familyPhoneMct } = copy

        _temp.reduce((accumulator, currentItem) => {
          const { key, defineKey } = currentItem

          accumulator[defineKey] = +this.diplomaticConsulOfficialFormData[key]

          return accumulator
        }, familyPhoneMct)

        familyPhoneMct = {
          ...familyPhoneMct,
          duration: familyPhoneDuration,
          onceMoney: this.familyPhoneTotalCost,
          version: 2
        }

        params = {
          ...params,
          familyPhoneMct
        }
      }

      const isSuccess = await this.setMeetingChargeTemplate(params)

      setTimeout(() => {
        this.onInitData()
      }, 500)
    },

    // 更新按钮预处理判断
    onPrediplomaticConsulOfficialFormCheck(values) {
      this.$refs['prison-charge-config_diplomaticConsulOfficial-form'].onSubmit()
    }
  },

  async activated() {
    await this.onInitData()
  }
}

</script>

<style lang="scss" scoped>
.prison-charge-config {
  &-button_box {
    text-align: right;

    padding-bottom: 10px;
    /deep/ .el-button {
      padding: 8px 24px !important;
    }
  }

  &_basic-form {
    /deep/ .el-form-item {
      &.el-form-item_once-monney {
        .el-input {
          width: 45.83333%;
        }
      }

      &.el-form-item_charge-type {
        label {
          width: auto !important;
        }

        .el-form-item__content {
          margin-left: 0px !important;
        }
      }
    }

    /deep/ .el-table {
      margin-bottom: 22px !important;
    }
  }

  &_diplomaticConsulOfficial-form {
    /deep/ .el-form-item {
      &__message-set {
        .el-form-item__content {
          width: 36.5%;
        }
      }

      &_once-monney {
        .el-input {
          width: 45.83333%;
        }
      }
    }
  }
}
</style>