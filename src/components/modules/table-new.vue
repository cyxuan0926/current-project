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
        :key="`${col.label}-${col.prop}-${col.slotName}`"
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
