<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-excel-download
      v-if="hasOnlyAllPrisonQueryAuth"
      path=""
      :params="filter"
    />

    <m-search
      ref="search"
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    />

    <el-col :span="24">
      <el-tabs
        v-model="tabs"
        type="card">
        <el-tab-pane 
          v-for="tab in tabOptions"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        />
      </el-tabs>

      <m-table
        ref="m-table"
        :cols=tableCols
        :data="pageData.content"
      >
        <template #idCards="{ row }">
          <template v-for="item in row.diplomaticConsulOfficialUrls">
            <m-img-viewer 
              v-if="item.url"
              :key="item.url"
              :url="item.url"
              :toolbar="{ prev: 1, next: 1 }"
              :title="item.title"
              :class="[
                { 'img-viewer__hidden': item.type === 3 },
                'img-viewer__overflow-unset'
              ]"
            />
          </template>
        </template>

        <template #status="{ row }">{{ row.status | diplomaticConsulOfficialStatus }}</template>

        <template #operation="{ row }">
          <el-button v-if="true" size="mini" @click="onAuthorization(row)">授权</el-button>

          <el-button v-if="true" size="mini" @click="onCallback(row)">撤回</el-button>
        </template>
      </m-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="pageData.totalElements"
      @onPageChange="getDatas"
    />
  </el-row>
</template>

<script>

import prisonFilterCreator from '@/mixins/prison-filter-creator'

import { mapState, mapActions } from 'vuex'

export default {
  mixins: [prisonFilterCreator],

  data() {
    const tabOptions = [
      {
        label: '外交领事官员注册',
        name: 'diplomaticConsulOfficial'
      },
      {
        label: '未授权',
        name: 'PENDING'
      }
    ]

    const searchItems = {
      name: {
        type: 'input',
        label: '姓名'
      },

      employer: {
        type: 'select',
        label: '所在机构',
        filterable: true
      },

      auditName: {
        type: 'input',
        label: '审核人',
        miss: true
      },

      status: {
        type: 'select',
        label: '审核状态',
        miss: true
      },

      auditAt: {
        type: 'date',
        label: '审核时间',
        miss: true
      }
    }
    return {
      tabOptions,

      tabs: 'PENDING',

      searchItems
    }
  },

  watch: {
    tabs(tab) {
      this.$refs.search.onSearch('tabs')

      if (tab === 'PENDING') {
        this.$set(this.searchItems['auditName'], 'miss', true)

        this.$set(this.searchItems['status'], 'miss', true)

        this.$set(this.searchItems['auditAt'], 'miss', true)

        delete this.filter.auditName

        delete this.filter.status

        delete this.filter.auditAt

        this.$set(this.searchItems['auditName'], 'value', '')

        this.$set(this.searchItems['status'], 'value', '')

        this.$set(this.searchItems['auditAt'], 'value', '')
      } else {
        delete this.filter.status

        this.$set(this.searchItems['auditName'], 'miss', false)

        this.$set(this.searchItems['status'], 'miss', false)

        this.$set(this.searchItems['auditAt'], 'miss', false)
      }

      if (this.hasOnlyAllPrisonQueryAuth || this.hasProvinceQueryAuth) {
          this.$set(this.searchItems['employer'], 'miss', true)

          delete this.filter.employer

          this.$set(this.searchItems['employer'], 'value', '')
      } else {
        this.$set(this.searchItems['employer'], 'miss', false)
      }

      this.onSearch()
    }
  },

  computed: {
    ...mapState('diplomaticConsulOfficial', ['pageData']),

    tableCols() {
      const allCols = [
        {
          label: '省份',
          prop: ''
        },
        {
          label: '监狱名称',
          prop: ''
        },
        {
          label: '姓名',
          prop: ''
        },
        {
          label: '身份证件信息',
          slotName: 'idCards',
          minWidth: 148
        },
        {
          label: '身份证件有效期至',
          prop: '',
          minWidth: 100
        },
        {
          label: '申请时间',
          prop: ''
        },
        {
          label: '所在机构/馆名',
          prop: ''
        },
        {
          label: '职位',
          prop: ''
        },
        {
          label: '申请状态',
          slotName: 'status'
        },
        {
          label: '审核信息',
          prop: ''
        },
        {
          label: '操作',
          slotName: 'operation'
        }
      ]

      if (this.hasOnlyAllPrisonQueryAuth || this.hasProvinceQueryAuth) {
        allCols.splice(-1, 1)
        allCols.splice(3, 1)
      } else {
        allCols.splice(0, 2)
      }
      return allCols
    }
  },

  methods: {
    ...mapActions('diplomaticConsulOfficial', ['getPageData']),

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    getDatas() {
      console.log(this.filter, this.pagination)
    }
  },

  mounted() {
    if (this.hasOnlyAllPrisonQueryAuth || this.hasProvinceQueryAuth) {
      this.$set(this.searchItems['employer'], 'miss', true)
    } else {
      this.$set(this.searchItems['employer'], 'miss', false)
    }
  }
}
</script>
