<template>
  <el-table
    :data="data"
    @selection-change="selectionChange"
    class="com-table"
    stripe
  >
    <template v-for="(col, i) in cols">
      <el-table-column
        v-if="col.slotName"
        :align="col.align"
        :key="i + '1'"
        :type="col.type"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :show-overflow-tooltip="col.showOverflowTooltip"
      >
        <template slot-scope="scope">
          <slot
            :name="col.slotName"
            :row="scope.row"
            :$index="scope.$index"/>
        </template>
      </el-table-column>
      <el-table-column
        v-else
        :key="i + '2'"
        :align="col.align"
        :index="col.index"
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