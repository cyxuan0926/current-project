<template>
  <el-table
    ref="elTable"
    v-bind="$data.$_attrs"
    v-on="$data.$_listeners"
  >
    <template v-for="col in elTableCols">
      <template v-if="col.slotName">
        <el-table-column :key="`${col.label}-${col.prop}-${col.slotName}`" v-bind="col">
          <template #default="scope">
            <slot :name="col.slotName" v-bind="scope" />
          </template>
        </el-table-column>
      </template>

      <!-- 脱敏的特殊列 -->
      <template v-else-if="col.isDesensitizationCol">
        <el-table-column :key="`${col.label}-${col.prop}`" v-bind="col">
          <template #default="scope">
            <template v-if="Array.isArray(scope.row[col['prop']])">
              <el-popover
                v-for="item of scope.row[col['prop']]"
                :key="item[col['desensitizationColsConfigs'['keyWord']]]"
                popper-class="is-asterisk_display"
                placement="top-start"
                trigger="hover"
                :content="item[col['desensitizationColsConfigs']['prop']]"
              >
                <span slot="reference">
                  <slot :name="col['desensitizationColsConfigs']['desensitizationColSlotName'] || 'defalut'" v-bind="{ item, scope }">{{ item[col['desensitizationColsConfigs']['prop']] | asteriskDisplay(col.asteriskProp) }}</slot>
                </span>
              </el-popover>
            </template>

            <template v-else>
              <!-- 这个是很特殊的情况 -->
              <template v-if="scope.row['$isSpecialTotalCol']">{{ scope.row[col['prop']] }}</template>

              <template v-else>
                <el-popover
                  popper-class="is-asterisk_display"
                  placement="top-start"
                  trigger="hover"
                  :content="scope.row[col['prop']]"
                >
                  <span slot="reference">
                    <slot :name="col.desensitizationColSlotName || 'defalut'" v-bind="scope">{{ scope.row[col['prop']] | asteriskDisplay(col.asteriskProp) }}</slot>
                  </span>
                </el-popover>
              </template>
            </template>
          </template>
        </el-table-column>
      </template>

      <!--el-table 自定义的插槽-->  
      <template v-else-if="col.isElSlots">
        <template v-for="constElSlot in constElSlots" :slot="constElSlot" >
          <template v-if="col.belong === constElSlot">
            <slot v-for="elSlot in col.elSlots" :name="elSlot.name" />
          </template>
        </template>     
      </template>

      <template v-else>
        <el-table-column v-bind="col" :key="`${col.label}-${col.prop}`" />
      </template>
    </template>
  </el-table>
</template>

<script>
import attrsListenersHack from "@/mixins/attrs-listeners-hack";

import {
  $likeName,
  $likePrisonerNumber,
  $likePhone,
  $likeIdCard
} from '@/common/constants/const'

export default {
  mixins: [attrsListenersHack],

  props: {
    cols: {
      type: Array
    }
  },

  data() {
    return {
      // el-table table solt 常量
      constElSlots: ['append']
    }
  },

  computed: {
    elTableCols() {
      // 服刑人员编号之类似的规则
      const regPrisonerNumber = /^(?!phone|terminal|room).*number$/i
      // 姓名之类的规则 这些因为有交集 所以需要主动添加
      const regName = /^(?!province|jail|diplomats|org|account|real|position|sourceJail|targetJail|prisonConfig|prisonArea|user|full|city|county|terminal|adservices|type|device).*name$/i // 这些因为有冲突 重复 不能统一处理
      // uuid
      const regIdCard = /.*uuid$/i
      // 电话号码
      const rePhone = /.*phone.*/i

      return this.cols.reduce((accumulator, col) => {
        const _type = col['prop'] || col['slotName']

        if (_type) {
          if (regPrisonerNumber.test(_type)) {
            col = Object.assign({}, $likePrisonerNumber, col)
          }

          if (regName.test(_type)) {
            col = Object.assign({}, $likeName, col)
          }

          if (regIdCard.test(_type)) {
            col = Object.assign({}, $likeIdCard, col)
          }

          if (rePhone.test(_type)) {
            col = Object.assign({}, $likePhone, col)
          }
        }
        accumulator.push(col)

        return accumulator
      }, [])
    }
  },

  methods: {
    elTableClearSort() {
      this.$refs.elTable.clearSort()
    }
  }
};
</script>
