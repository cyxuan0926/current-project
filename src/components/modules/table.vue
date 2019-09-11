<template>
  <el-table
    :data="data"
    class="com-table"
    @selection-change="handleSelectionChange"
    border>
    <template v-for="(col, i) in cols">
      <el-table-column
        v-if="col.slotName"
        :align="col.align"
        :key="i"
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
        :align="col.align"
        :index="col.index"
        :key="i"
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
    }
  },
  methods: {
    handleSelectionChange(selectionData) {
      this.$emit('onSelectChange', selectionData)
    }
  }
}
</script>