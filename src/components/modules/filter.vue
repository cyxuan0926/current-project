<template>
  <el-form :model="filterParams" inline>
    <template v-for="item in filterItems">
      <el-form-item
        :key="item.name"
        :label="item.label"
        :prop="item.name"
      >
        <template v-if="item.type === 'input'">
          <el-input v-model="filterParams[item.name]" v-bind="item.attrs" />
        </template>

        <template v-if="item.type === 'select'">
          <el-select v-model="filterParams[item.name]" v-bind="item.attrs">
            <template v-for="(option, i) in item.options">
              <el-option
                :key="i"
                :label="option[item.labelKey || 'label']"
                :value="option[item.valueKey || 'value']"
              />
            </template>
          </el-select>
        </template>

        <template v-if="isDatePicker(item.type)">
          <el-date-picker
            v-model="filterParams[item.name]"
            align="right"
            unlink-panels
            v-bind="item.attrs"
            :clearable="false"
          />
        </template>
      </el-form-item>
    </template>

    <el-form-item class="operate">
      <slot />

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="onFilter(normalizedFilterParams)"
      />

      <template v-if="clearable">
        <el-button type="warning" @click="onClear" >
          清空
        </el-button>
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
import { filterObject, hasValue } from '@/utils/helper'

export default {
  props: {
    clearable: Boolean,

    value: {
      type: Object,
      default: () => ({})
    },

    filterItems: {
      type: Array,
      default: () => []
    },

    onFilter: {
      type: Function,
      default: function() {}
    }
  },

  data() {
    return {
      filterParams: {}
    }
  },

  computed: {
    normalizedFilterParams() {
      return filterObject(this.filterParams, val => hasValue(val))
    }
  },

  watch: {
    filterParams: {
      deep: true,
      handler(val) {
        this.$emit('input', this.normalizedFilterParams)
      }
    }
  },

  created() {
    this.initFilterParams()
  },

  methods: {
    initFilterParams() {
      const result = {}

      this.filterItems.forEach(item => {
        result[item.name] = item.defaultValue
      })

      this.filterParams = result
    },

    onClear() {
      Object.keys(this.filterParams).forEach(k => {
        this.filterParams[k] = undefined
      })
    },

    isDatePicker(type) {
      const types = [
        'year',
        'month',
        'date',
        'dates',
        'week',
        'datetime',
        'datetimerange',
        'daterange',
        'monthrange'
      ]

      return types.includes(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  margin-bottom: 10px;
}

.el-form-item {
  margin-bottom: 10px;

  /deep/ &__content {
    line-height: 34px;
  }
}

.el-date-editor--month, .el-date-editor--daterange {
  width: 210px;
}

/deep/ .el-input {
  width: 13em;
}

.el-date-editor--datetimerange {
  width: 318px;
}

.operate {
  .el-button {
    margin-left: 10px;
  }
}
</style>