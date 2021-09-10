<template>
  <el-table ref="elTable" v-bind="$data.$_attrs" v-on="$data.$_listeners">
    <template v-for="col in cols">
      <el-table-column
        v-if="col.slotName"
        v-bind="col"
        :key="`${col.label}-${col.prop}-${col.slotName}`"
      >
        <template slot-scope="scope">
          <slot :name="col.slotName" v-bind="scope" />
        </template>
      </el-table-column>

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
        <template
          v-for="constElSlot in constElSlots"
          :slot="constElSlot" >
          <template v-if="col.belong === constElSlot">
            <slot
              v-for="elSlot in col.elSlots"
              :name="elSlot.name" />
          </template>
        </template>     
      </template>

      <el-table-column
        v-else
        v-bind="col"
        :key="`${col.label}-${col.prop}`"
      />

    </template>

  </el-table>
</template>

<script>
import attrsListenersHack from "@/mixins/attrs-listeners-hack";

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

  methods: {
    elTableClearSort() {
      this.$refs.elTable.clearSort()
    }
  }
};
</script>

<style lang="scss" scoped>
.el-table {
  /deep/ .el-form-item--ellipsis {
    .cell {
      white-space: nowrap;
    }
  }
}
</style>
