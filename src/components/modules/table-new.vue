<template>
  <el-table v-bind="$attrs" v-on="$listeners" :data="data">
    <template v-for="(col, i) in cols">
      <el-table-column
        v-if="col.slotName"
        v-bind="col"
        :key="`id1-${i + Math.random()}`"
      >
        <template slot-scope="scope">
          <slot :name="col.slotName" v-bind="scope" />
        </template>
      </el-table-column>

      <el-table-column v-else v-bind="col" :key="`id2-${i + Math.random()}`" />
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
};
</script>
