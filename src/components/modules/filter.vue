<template>
  <el-form :model="filterParams" inline>
    <el-form-item
      v-for="item in filterItems"
      :key="item.name"
      :prop="item.name"
      :label="item.label"
    >
      <el-input
        v-if="item.type === 'input'"
        v-model="filterParams[item.name]"
        v-bind="item"
      />

      <el-select
        v-if="item.type === 'select'"
        v-model="filterParams[item.name]"
        v-bind="item"
      >
        <el-option
          v-for="(option, i) in item.options"
          :key="i"
          :label="option[item.labelKey || 'label']"
          :value="option[item.valueKey || 'value']"
        />
      </el-select>

      <el-date-picker
        v-if="isDatePicker(item.type)"
        v-model="filterParams[item.name]"
        value-format="timestamp"
        align="right"
        unlink-panels
        v-bind="item"
      />
    </el-form-item>

    <el-form-item class="operate">
      <slot />

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="onFilter(normalizedFilterParams)"
      />

      <el-button v-if="clearable" type="warning" @click="onClear" >
        清空
      </el-button>
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

.el-date-editor--month,
.el-date-editor--daterange {
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