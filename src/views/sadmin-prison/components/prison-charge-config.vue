<template>
  <div class="prison-charge-config">
    <!-- 基础配置 -->
    <m-form
      class="prison-charge-config_basic-form"
      ref="prison-charge-config_basic-form"
      :items="basicFormItems"
      :values="basicFormValues"
    >
      <template #elTableSlot>
        <m-table-new :cols="tableCols" :data="tableData">
          <template #selectElement="{ row }">
            <el-checkbox-group v-model="radio">
              <template v-for="duration in meetingChargeConfigDurations">
                <el-checkbox
                  v-if="duration === row.duration"
                  :key="duration"
                  :label="duration">&nbsp;</el-checkbox>
              </template>            
            </el-checkbox-group>
          </template>
        </m-table-new>
      </template>
      
      <template #basicConfigs>
        <el-col :span="11">
          <el-form-item prop="startMinutes" :rules="rules.startMinutes">
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
          <el-form-item prop="startMoney" :rules="rules.startMoney">
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
          <el-form-item prop="fixedMoney" :rules="rules.fixedMoney">
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
        type="primary">保存</el-button>
    </el-row>

    <!-- 外交领事官员收费配置 -->
    <m-form
      class="prison-charge-config_diplomaticConsulOfficial-form"
      ref="prison-charge-config_diplomaticConsulOfficial-form"
      :items="diplomaticConsulOfficialFormItems"
      :values="diplomaticConsulOfficialFormValues"
    >
      <template #diplomaticConsulOfficialBasicConfigs>
        <el-col :span="11">
          <el-form-item prop="startMinutes" :rules="rules.startMinutes">
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
          <el-form-item prop="startMoney" :rules="rules.startMoney">
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
          <el-form-item prop="fixedMoney" :rules="rules.fixedMoney">
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
    </m-form>

    <!-- 操作 -->
    <el-row class="prison-charge-config-button_box">
      <el-button
        :disabled="radio"
        size="small"
        type="primary">更新</el-button>

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

export default {
  data() {
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
      const { field } = rule
      const feeReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (this.formData[field] === '') callback(new Error('请输入基础费用'))
      else if (!feeReg.test(this.formData[field])) callback(new Error('请输入大于0的数字,且最多保留两位小数'))
      else callback()
    }

    const validateMinutes = (rule, value, callback) => {
      const { field } = rule
      const integerNumbers = Number.isInteger(this.formData[field])
      if (this.formData[field] === '') callback(new Error('请输入基础时间'))
      else if (!integerNumbers || this.formData[field] < 0) callback(new Error('请输入整数'))
      else callback()
    }

    const validateFixedMoney = (rule, value, callback) => {
      const { field } = rule
      const feeReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (this.formData[field] === '') callback(new Error('请输入基础时长后每分钟费用'))
      else if (!feeReg.test(this.formData[field])) callback(new Error('请输入大于0的数字,且最多保留两位小数'))
      else callback()
    }

    const cols = [
      {
        label: '选中项',
        slot: 'selectElement'
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

        tableData: []
      },

      [2]: {
        tableCols: [
          ...cols,

          {
            label: '基础通话时长(分钟)',
            prop: 'startMinutes'
          },

          {
            label: '基础通话收费(分钟)',
            prop: 'startMoney'
          },

          {
            label: '基础时长后每分钟费用(元)',
            prop: 'fixedMoney'
          },

          {
            label: '申请可视电话总费用(元)',
            prop: 'onceMoney'
          }
        ],

        tableData: []
      }
    }

    const diplomatistChargeObject = {
      [0]: {
        itemConfigs: {},

        dissMissConfigs: [ 'diplomaticConsulOfficialBasicConfigs',  'diplomaticConsulOfficialFixedMoney' ],

        fields: []
      },

      [1]: {
        itemConfigs: { diplomaticConsulOfficialBasicConfigs: 0, diplomaticConsulOfficialFixedMoney: 0 },

        dissMissConfigs: [],

        fields: [ 'startMinutes', 'startMoney', 'fixedMoney' ]
      }
    }
    return {
      diplomatistChargeObject,

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

          func: this.onDiplomatistChargeChange,

          value: 0,

          configs: [
            // 关闭外交领事官员可视电话收费设置
            {
              value: 0,

              itemConfigs: {
                diplomaticConsulOfficialBasicConfigs: 0,

                diplomaticConsulOfficialFixedMoney: 0
              }
            },

            // 打开外交领事官员可视电话收费设置
            {
              value: 1,

              itemConfigs: {}
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
        }
      },

      diplomaticConsulOfficialFormData: {
        startMinutes: 5,

        startMoney: 12,

        fixedMoney: 1.8
      },

      rules: {
        startMinutes: [
          { validator: validateMinutes, trigger: 'blur' }
        ],

        startMoney: [
          { validator: validateMoney, trigger: 'blur' }
        ],

        fixedMoney: [
          { validator: validateFixedMoney, trigger: 'blur' }
        ]
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
            {
              value: 1,
              itemConfigs: {
                basicConfigs: 0,
                fixedMoney: 0,
                totalCost: 0
              }
            },

            // 按分钟收费
            {
              value: 2,
              itemConfigs: {
                onceMoney: 0
              }
            }
          ]
        },

        elTableSlot: {
          customClass: ['el-form-item_el-table'],

          relativeProps: ['chargeType']
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
      }
    }
  },

  computed: {
    ...mapState(['prisonChargeConfigs']),

    typeTotalCost() {
      return 48
    }
  },

  methods: {
    ...mapActions(['getMeetingChargeTemplate', 'setMeetingChargeTemplate']),

    onGoBack() {
      if (this.$store.getters.role === roles.SUPER_ADMIN) this.$router.push({ path: '/prison/list' })

      else this.$router.push({ path: '/jails/detail' })
    },

    onReset(e, prop) {
      let {
        startMoney = 15,
        startMinutes = 5,
        fixedMoney = 2.2
      } = {}

      startMoney = startMoney ? startMoney : 15

      startMinutes = startMinutes ? startMinutes : 5

      fixedMoney = fixedMoney ? fixedMoney : 2.2

      this.$set(this.diplomaticConsulOfficialFormData, 'startMinutes', startMinutes)

      this.$set(this.diplomaticConsulOfficialFormData, 'startMoney', startMoney)

      this.$set(this.diplomaticConsulOfficialFormData, 'fixedMoney', fixedMoney)
    },

    onDiplomatistChargeChange(e, prop, item) {
      this.$refs['prison-charge-config_diplomaticConsulOfficial-form'].radioChangeEvent(e, prop, item)
    },

    onInitData(data) {
      const {
        chargeType,
        diplomatistCharge,
        prisonMctList
      } = data

      this.localChargeType = chargeType

      this.basicFormValues = Object.assign({}, { chargeType })

      this.diplomaticConsulOfficialFormValues = Object.assign({}, { diplomatistCharge })

      for (let key of Object.keys(this.basicFormChargeObject)) {
        const temp = prisonMctList.filter(meetingDurationConfigs => meetingDurationConfigs.type === +key)

        this.$set(this.basicFormChargeObject[key], 'tableData', temp)
      }

      this.tableCols = this.basicFormChargeObject[chargeType]['tableCols']

      this.tableData = this.basicFormChargeObject[chargeType]['tableData']
    }
  },

  async activated() {
    const id = this.$route.params.id

    await this.getMeetingChargeTemplate({ id })

    const { diplomatistCharge, diplomatistMct } = this.prisonChargeConfigs

    this.onInitData(cloneDeep(this.prisonChargeConfigs))

    const {
      itemConfigs,
      dissMissConfigs,
      fields
    } = this.diplomatistChargeObject[diplomatistCharge]

    this.$set(this.diplomaticConsulOfficialFormItems['diplomatistCharge']['configs'][diplomatistCharge], 'itemConfigs', itemConfigs)

    this.$set(this.diplomaticConsulOfficialFormItems, ['dissMissConfigs'], dissMissConfigs)

    fields.forEach(field => {
      this.$set(this.diplomaticConsulOfficialFormData, field, diplomatistMct[field])
    })
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
      margin-bottom: 10px !important;
    }
  }
}
</style>