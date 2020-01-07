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
  }
};
</script>
