<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-tabs
      v-model="tabs"
      type="border-card" >
      <el-tab-pane label="用户管理" name="first">
        <el-form>
        <el-form-item label="活动名称" prop="type">
          <el-switch
          v-model="value"
          active-color="#13ce66"
          inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
          <el-form-item label="活动名称" ></el-form-item>
          <el-form-item label="活动名称" ></el-form-item>
          <el-form-item label="活动名称" ></el-form-item>
          <el-form-item label="活动名称" ></el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
 </el-row>
</template>

<script>
  import http from '@/service'
  export default {
    data() {
      // 标签元素
      const tabsItems = [
        {
          label: '配置信息',
          name: 'first' }
      ]
      return {
        tabs:"first",
        value: true
      }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
    }
  }
</script>
