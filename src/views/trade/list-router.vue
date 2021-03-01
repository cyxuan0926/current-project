<template>
  <el-row class="row-container" :gutter="0">
    <m-excel-download 
      v-if="excelDownloadPath" 
      :path="excelDownloadPath" 
      :params="filter"
    />

    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
    />

    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
    >
      <template v-for="item in tabMapOptions">
        <el-tab-pane
          :label="item.label"
          :key='item.key'
          :name="item.key"
        />
      </template>
    </el-tabs>

    <router-view />

    <m-pagination
      ref="pagination"
      :total="list.total"
      @onPageChange="getDatas"
    />
  </el-row>
</template>

<script>
import { mapActions } from 'vuex'
import switches from '@/filters/modules/switches'
export default {
  data() {
    const endTime = this.$_dateNow

    const startTime = this.$_dateOneWeekAgo

    const range = {
      range: [startTime, endTime]
    }
    return {
      activeName: this.$route.path.slice(this.$route.path.lastIndexOf('/') + 1),
      tabMapOptions: [
        {
          label: '账户明细',
          key: 'account',
          excelDownloadPath: '/download/exportLedger'
        },
        {
          label: '充值明细',
          key: 'recharge',
          excelDownloadPath: '/download/exportChargeRecords'
        },
        {
          label: '消费明细',
          key: 'consumption',
          excelDownloadPath: '/download/exportConsumeRecords'
        },
        {
          label: '退款明细',
          key: 'refund',
          excelDownloadPath: '/download/exportRefundRecords'
        }
      ],
      list: { total: 0, contents: [] },
      searchItems: {
        accountStatus: {
          miss: false,
          type: 'select',
          label: '账户状态',
          options: [
            { label: '账户余额正常', value: 1 },
            { label: '账户余额异常', value: 0 }
          ]
        },
        paymentType: {
          miss: true,
          type: 'select',
          label: '支付方式',
          options: [
            { label: '支付宝', value: 'alipay' },
            { label: '微信', value: 'weixin' }
          ]
        },
        refundType: {
          miss: true,
          type: 'select',
          label: '退款方式',
          options: [
            { label: '支付宝', value: 'alipay' },
            { label: '微信', value: 'weixin' }
          ]
        },
        refundNo: {
          miss: true,
          type: 'input',
          label: '退款编号'
        },
        tradeNo: {
          miss: true,
          type: 'input',
          label: '订单编号'
        },
        phone: {
          miss: false,
          type: 'input',
          label: '手机号码'
        },
        range: {
          miss: true,
          type: 'dateRange',
          start: 'startDate',
          end: 'endDate'
        },
        chargeType: {
          miss: true,
          type: 'select',
          label: '收费方式',
          options: switches.chargeWays
        }
      },
      showSearch: {
        account: ['accountStatus', 'phone'],
        recharge: ['paymentType', 'tradeNo', 'phone', 'range'],
        consumption: ['phone', 'range', 'chargeType'],
        refund: ['refundType', 'tradeNo', 'phone', 'range']
      },
      filter: {},

      initSearch: {
        account: {
          accountStatus: 1
        },

        recharge: { ...range },

        consumption: { ...range },

        refund: { ...range }
      }
    }
  },

  computed: {
    excelDownloadPath() {
      const activeTab = this.tabMapOptions.find(tab => tab.key === this.activeName)

      return activeTab && activeTab.excelDownloadPath
    }
  },

  watch: {
    '$route': {
      handler: function(val) {
        this.activeName = val.path.slice(val.path.lastIndexOf('/') + 1)

        this.getSearchItems('clearFilter')
      },
      deep: true
    }
  },

  async mounted() {
    await this.getSearchItems()
  },

  methods: {
    ...mapActions([
      'getAccountList',
      'getRechargeList',
      'getConsumptionList',
      'getRefundList'
    ]),

    handleClick() {
      this.$router.push(`/trade/${ this.activeName }`)
    },

    getSearchItems(e) {
      const show = this.showSearch[this.activeName],
        init = this.initSearch[this.activeName]

      Object.keys(this.searchItems).forEach(key => {
        for(let [initKey, value] of Object.entries(init)) {
          if (initKey === key) !this.searchItems[key].value && this.$set(this.searchItems[key], 'value', value)

          else delete this.searchItems[key].value
        }

        if (show.indexOf(key) < 0) this.searchItems[key].miss = true

        else this.searchItems[key].miss = false
      })

      this.$refs.search.onGetFilter()

      if (e === 'clearFilter') this.$refs.pagination.handleCurrentChange(1)

      else this.getDatas()
    },

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    getDatas(e) {
      let api = this.activeName.toLowerCase().replace(/^\S/, function(s) { return s.toUpperCase() })

      this[`get${ api }List`]({ ...this.filter, ...this.pagination }).then(res => {
        if (!res) return

        this.list = this.$store.state.trade[this.activeName]
      })
    }
  }
}
</script>