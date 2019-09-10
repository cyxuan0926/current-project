<template>
  <el-table :data="data" class="com-table" border>
    <template v-for="(col, i) in cols">
      <el-table-column
        v-if="col.slotName"
        :key="i"
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
  }
}
</script>