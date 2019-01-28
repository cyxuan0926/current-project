<template>
  <el-col :span="24"
          class="filter-box">
    <el-col :span="8">
      <!--页数选择框-->
      <el-select v-model="pageSize"
                 placeholder="请选择"
                 @change="sizeChange">
        <el-option
          v-for="item in selectItem"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      条记录
    </el-col>
    <!--搜索框-->
    <el-col :span="16"
            class="search-box">
      <el-col>
        <el-button v-if="buttonText"
                   @click="onSearch">{{ buttonText }}</el-button>
        <el-button v-else
                   icon="el-icon-search"
                   @click="onSearch"></el-button>
      </el-col>
      <template v-for="(item, index) in items">
        <el-col :key="index"
                v-if="item.type !== 'datetimerange'">
          <el-input
            v-if="item.type === 'input'"
            v-model="item.value"
            :placeholder="'请输入' + item.label" />

          <el-select
            v-if="item.type === 'select'"
            v-model="item.value"
            :placeholder="'请选择' + item.label"
            :loading="item.getting || false"
            :filterable="item.filterable"
            clearable>
            <el-option
              v-for="option in item.options"
              :key="item.belong ? option[item.belong.value] : option.value"
              :label="item.belong ? option[item.belong.label] : option.label"
              :value="item.belong ? option[item.belong.value] : option.value" />
          </el-select>
          <el-date-picker
            v-if="item.type === 'datetime'"
            v-model="item.value"
            type="datetime"
            :placeholder="item.label"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
        <el-col :span="8" :key="index" v-if="item.type === 'datetimerange'">
          <el-date-picker
            v-if="item.type === 'datetimerange'"
            v-model="item.value"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-col>
      </template>
    </el-col>
  </el-col>
</template>

<script>
export default {
  props: {
    items: {
      type: Object
    },
    buttonText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectItem: [1, 10, 20, 30, 40, 50], // 每页可以提供的显示页数的数组
      pageSize: 10,
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  mounted() {
    this.$parent.$parent.filter = {}
  },
  methods: {
    sizeChange(e) {
      this.$emit('sizeChange', this.pageSize)
    },
    onSearch() {
      if (this.items) {
        let params = {}
        Object.keys(this.items).forEach(key => {
          if (!this.items[key].value && parseInt(this.items[key].value) !== 0) return
          if (this.items[key].type === 'datetimerange') {
            params[this.items[key].start] = this.items[key].value[0]
            params[this.items[key].end] = this.items[key].value[1]
          }
          else {
            params[key] = this.items[key].value
          }
        })
        this.$parent.$parent.filter = params
      }
      this.$emit('search')
    }
  }
}
</script>

<style type="text/stylus" lang="stylus">
.filter-box
  margin-bottom: 25px;
  .search-box
    .el-col:not(.el-col-8)
      &:first-child
        width: 8%
      float: right
      width: 22%
      margin-left: 3%
      .el-date-editor.el-input
        width: 100%;
    .el-col-8
      float: right;
      min-width: 274px;
    .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner{
      width: 100%;
    }
</style>
