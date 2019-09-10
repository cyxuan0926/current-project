<template>
  <el-table
    :data="data"
    @selection-change="selectionChange"
    class="com-table"
    border
  >
    <template v-for="(col, i) in cols">
      <el-table-column
        v-if="col.slotName"
        :key="i + '1'"
        :type="col.type"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :show-overflow-tooltip="col.showOverflowTooltip"
      >
        <template slot-scope="scope">
          <slot :name="col.slotName" :row="scope.row" />
        </template>
      </el-table-column>
      <el-table-column
        v-else
        :key="i + '2'"
        :type="col.type"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :show-overflow-tooltip="col.showOverflowTooltip"
      />
    </template>
  </el-table>
</template>

<script>
export default {
  props: {
    data: {
      type: Array
    },
    cols: {
      type: Array
    },
    'selection-change': {
      type: Function,
      default: () => () => {}
    }
  }
}
</script>